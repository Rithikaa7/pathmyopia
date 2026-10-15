import { AnalysisRecord, ModelMetadata } from '../types';
import { INITIAL_ANALYSES, MODEL_METADATA, RESEARCH_DATA, SEVERITY_DEFINITIONS } from '../data/initialRecords';

const STORAGE_KEY_ANALYSES = 'pathmyo_analysis_records_v1';
const STORAGE_KEY_MODE = 'pathmyo_system_mode';
const STORAGE_KEY_BACKEND_URL = 'pathmyo_backend_url';

export type AppMode = 'demo' | 'connected';

export function getAppMode(): AppMode {
  const saved = localStorage.getItem(STORAGE_KEY_MODE);
  if (saved === 'connected' || saved === 'demo') {
    return saved;
  }
  return (import.meta.env.VITE_DEFAULT_MODE as AppMode) || 'connected';
}

export function setAppMode(mode: AppMode): void {
  localStorage.setItem(STORAGE_KEY_MODE, mode);
}

export function getBackendUrl(): string {
  const saved = localStorage.getItem(STORAGE_KEY_BACKEND_URL);
  if (saved && !saved.includes('localhost')) {
    return saved;
  }
  return import.meta.env.VITE_API_BASE_URL || 'https://pathmyopia.onrender.com';
}

export function setBackendUrl(url: string): void {
  localStorage.setItem(STORAGE_KEY_BACKEND_URL, url);
}

export async function checkBackendHealth(): Promise<{ online: boolean; message: string; details?: any }> {
  const url = getBackendUrl();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(`${url}/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      return { online: true, message: 'Inference backend connected and ready', details: data };
    }
    return { online: false, message: `Backend responded with HTTP status ${res.status}` };
  } catch (err: any) {
    return {
      online: false,
      message: err.name === 'AbortError' 
        ? 'Connection timed out (backend offline or unreachable)' 
        : 'Inference backend server offline. To run live inference, start the backend model server.'
    };
  }
}

// Local Storage for Records
export function getAnalysisHistory(): AnalysisRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_ANALYSES);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_ANALYSES, JSON.stringify(INITIAL_ANALYSES));
      return INITIAL_ANALYSES;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load analysis history from localStorage', e);
    return INITIAL_ANALYSES;
  }
}

export function saveAnalysisRecord(record: AnalysisRecord): void {
  const list = getAnalysisHistory();
  const existingIdx = list.findIndex(r => r.id === record.id);
  let updated: AnalysisRecord[];
  if (existingIdx >= 0) {
    updated = [...list];
    updated[existingIdx] = record;
  } else {
    updated = [record, ...list];
  }
  localStorage.setItem(STORAGE_KEY_ANALYSES, JSON.stringify(updated));
}

export function getAnalysis(id: string): AnalysisRecord | null {
  const list = getAnalysisHistory();
  return list.find(r => r.id === id) || null;
}

export function deleteAnalysis(id: string): boolean {
  const list = getAnalysisHistory();
  const updated = list.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY_ANALYSES, JSON.stringify(updated));
  return true;
}

export function getModelInfo(): ModelMetadata {
  return MODEL_METADATA;
}

export function getResearchMetrics() {
  return RESEARCH_DATA;
}

export interface AnalyzeOptions {
  title?: string;
  imageIdentifier?: string;
  researcherNotes?: string;
  presetKey?: string;
}

/**
 * Main analysis function.
 * If in 'connected' mode, calls the live backend API.
 * If in 'demo' mode, creates an illustrative preview record explicitly labeled as demo.
 */
export async function analyzeImage(
  file: File | null,
  previewDataUrl: string,
  options: AnalyzeOptions = {}
): Promise<{ success: boolean; record?: AnalysisRecord; error?: string }> {
  const mode = getAppMode();

  if (mode === 'connected') {
    // Attempt real inference via configured API
    const health = await checkBackendHealth();
    if (!health.online) {
      return {
        success: false,
        error: `Inference backend is currently unavailable (${health.message}). The image has been preserved. You can switch to Demo Mode in the top header or start the local PyTorch model server.`
      };
    }

    try {
      const formData = new FormData();
      if (file) formData.append('image', file);
      if (options.imageIdentifier) formData.append('identifier', options.imageIdentifier);
      if (options.researcherNotes) formData.append('notes', options.researcherNotes);

      const res = await fetch(`${getBackendUrl()}/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Inference server returned status ${res.status}`);
      }

      const resultData = await res.json();
      const newRecord: AnalysisRecord = {
        id: resultData.id || `rec_${Date.now()}`,
        title: options.title || file?.name || 'Retinal Fundus Image',
        imageName: file?.name || 'fundus_image.jpg',
        imageUrl: resultData.imageUrl || previewDataUrl,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        status: 'completed',
        isDemo: false,
        imageIdentifier: options.imageIdentifier || `EXP-${Date.now().toString().slice(-4)}`,
        researcherNotes: options.researcherNotes,
        preprocessing: {
          circularCropApplied: true,
          targetResolution: '448x448',
          claheChannel: 'Lightness (L* in CIELAB)',
          aspectRatioPreserved: true
        },
        pmClassification: resultData.pmClassification || null,
        severity: resultData.severity || null,
        segmentation: resultData.segmentation || null,
        fovea: resultData.fovea || null,
        explainability: resultData.explainability || null,
      };

      saveAnalysisRecord(newRecord);
      return { success: true, record: newRecord };
    } catch (err: any) {
      return {
        success: false,
        error: `Failed to complete model inference: ${err.message || 'Unknown network error'}.`
      };
    }
  }

  // Demo mode: Return clearly labeled illustrative research workflow record
  // Map preset or default to realistic multi-task structures
  const isSevere = options.presetKey === 'severe' || (file && file.name.toLowerCase().includes('pm'));
  const isNormal = options.presetKey === 'normal' || (file && file.name.toLowerCase().includes('normal'));
  const sevLevel = isSevere ? 4 : isNormal ? 0 : 2;

  const demoRecord: AnalysisRecord = {
    id: `demo_${Date.now()}`,
    title: options.title || file?.name || 'Demo Fundus Analysis',
    imageName: file?.name || 'sample_fundus.png',
    imageUrl: previewDataUrl,
    thumbnailUrl: previewDataUrl,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    status: 'demo',
    isDemo: true,
    datasetOrigin: 'Interactive Research Demo Workspace',
    imageIdentifier: options.imageIdentifier || `DEMO-${Math.floor(1000 + Math.random() * 9000)}`,
    researcherNotes: options.researcherNotes || 'Interactive demo execution. Illustrative predictions shown.',
    preprocessing: {
      circularCropApplied: true,
      targetResolution: '448x448',
      claheChannel: 'Lightness (L* in CIELAB)',
      aspectRatioPreserved: true
    },
    pmClassification: {
      predictedClass: sevLevel > 1 ? 'Pathological Myopia' : 'Non-PM',
      probability: sevLevel > 1 ? 0.962 : 0.041,
      threshold: 0.5000,
      modelName: 'RETFound Multi-Task (Demo Mode)',
      confidenceBand: 'High',
      rawLogit: sevLevel > 1 ? 3.23 : -3.15
    },
    severity: {
      level: sevLevel as 0 | 1 | 2 | 3 | 4,
      label: `Category ${sevLevel}`,
      name: SEVERITY_DEFINITIONS[sevLevel].name,
      probabilities: sevLevel === 4 ? [0.01, 0.04, 0.10, 0.20, 0.65] : sevLevel === 0 ? [0.92, 0.05, 0.02, 0.005, 0.005] : [0.05, 0.15, 0.68, 0.08, 0.04],
      description: SEVERITY_DEFINITIONS[sevLevel].description,
      clinicalSignificance: SEVERITY_DEFINITIONS[sevLevel].clinicalSignificance
    },
    segmentation: {
      hasDisc: true,
      hasLacquerCracks: sevLevel >= 2,
      hasFuchsSpots: sevLevel === 4,
      phenotyping: {
        lacquerCracksAreaPx: sevLevel >= 2 ? 820 : 0,
        lacquerCracksPctFundus: sevLevel >= 2 ? 2.08 : 0,
        lacquerCracksMacularDensity: sevLevel >= 2 ? 0.35 : 0,
        fuchsSpotsAreaPx: sevLevel === 4 ? 2450 : 0,
        fuchsSpotsPctFundus: sevLevel === 4 ? 6.22 : 0,
        fuchsSpotsMacularDensity: sevLevel === 4 ? 0.61 : 0,
        meanDistDiscDd: sevLevel >= 2 ? 1.84 : undefined,
        meanDistFoveaDd: sevLevel >= 2 ? 1.32 : undefined,
        quadrants: {
          q0: sevLevel >= 2 ? 0.52 : 0,
          q1: sevLevel >= 2 ? 0.21 : 0,
          q2: sevLevel >= 2 ? 0.14 : 0,
          q3: sevLevel >= 2 ? 0.13 : 0
        }
      },
      diceScores: {
        disc: 0.985,
        lacquerCracks: sevLevel >= 2 ? 0.71 : undefined,
        fuchsSpots: sevLevel === 4 ? 0.65 : undefined
      }
    },
    fovea: {
      x: 216.5,
      y: 224.0,
      standardSize: 448,
      errorPx: 2.45,
      status: 'detected'
    },
    explainability: {
      gradCamUrl: sevLevel > 1 ? '/samples/gradcam_pm_severe.png' : '/samples/gradcam_normal.png',
      attentionRolloutUrl: sevLevel > 1 ? '/samples/rollout_pm_severe.png' : undefined,
      targetLayer: 'Transformer Token Features (Block 24)',
      backboneType: 'vit',
      targetClass: sevLevel > 1 ? 'Pathological Myopia' : 'Non-PM Control',
      scientificNotice: 'Demo mode visualization. Reflects sample Grad-CAM heatmap generated by the RETFound ViT model for illustrative inspection.'
    }
  };

  saveAnalysisRecord(demoRecord);
  return { success: true, record: demoRecord };
}
