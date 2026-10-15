export type PMClass = 'Pathological Myopia' | 'Non-PM' | 'Undetermined';

export interface PMClassification {
  predictedClass: PMClass;
  probability: number;
  threshold: number;
  modelName: string;
  confidenceBand: 'High' | 'Moderate' | 'Borderline';
  rawLogit?: number;
}

export interface SeverityAssessment {
  level: 0 | 1 | 2 | 3 | 4;
  label: string;
  name: string;
  probabilities: number[];
  description: string;
  clinicalSignificance: string;
}

export interface StructuralPhenotyping {
  lacquerCracksAreaPx: number;
  lacquerCracksPctFundus: number;
  lacquerCracksMacularDensity: number;
  lacquerCracksPeripapillaryDensity?: number;
  fuchsSpotsAreaPx: number;
  fuchsSpotsPctFundus: number;
  fuchsSpotsMacularDensity: number;
  fuchsSpotsPeripapillaryDensity?: number;
  meanDistDiscDd?: number;
  meanDistFoveaDd?: number;
  quadrants: {
    q0: number; // Superior-Temporal
    q1: number; // Superior-Nasal
    q2: number; // Inferior-Nasal
    q3: number; // Inferior-Temporal
  };
}

export interface SegmentationMasks {
  hasDisc: boolean;
  hasLacquerCracks: boolean;
  hasFuchsSpots: boolean;
  discMaskUrl?: string;
  lacquerCracksMaskUrl?: string;
  fuchsSpotsMaskUrl?: string;
  overlayCompositeUrl?: string;
  phenotyping?: StructuralPhenotyping;
  diceScores?: {
    disc?: number;
    lacquerCracks?: number;
    fuchsSpots?: number;
  };
}

export interface FoveaLocalization {
  x: number;
  y: number;
  standardSize: number; // 448
  errorPx?: number;
  status: 'detected' | 'not_supported' | 'undetected';
}

export interface ExplainabilityData {
  gradCamUrl: string;
  attentionRolloutUrl?: string;
  targetLayer: string;
  backboneType: 'vit' | 'cnn' | 'swin';
  targetClass: string;
  scientificNotice: string;
}

export interface PreprocessingInfo {
  circularCropApplied: boolean;
  targetResolution: '448x448';
  claheChannel: 'Lightness (L* in CIELAB)';
  aspectRatioPreserved: boolean;
}

export interface AnalysisRecord {
  id: string;
  title: string;
  imageName: string;
  imageUrl: string;
  thumbnailUrl?: string;
  timestamp: string;
  status: 'completed' | 'processing' | 'failed' | 'demo';
  isDemo: boolean;
  datasetOrigin?: string;
  researcherNotes?: string;
  imageIdentifier?: string;
  preprocessing: PreprocessingInfo;
  pmClassification: PMClassification | null;
  severity: SeverityAssessment | null;
  segmentation: SegmentationMasks | null;
  fovea: FoveaLocalization | null;
  explainability: ExplainabilityData | null;
}

export interface ModelMetadata {
  modelName: string;
  architecture: string;
  parametersM: number;
  checkpointStatus: 'Available' | 'Mock' | 'Connected';
  checkpointPath: string;
  inputDimensions: string;
  bestEpoch: number;
  totalEpochs: number;
  learningRate: number;
  weightDecay: number;
  activeSegHeads: string[];
  useSeverityHead: boolean;
  useFoveaHead: boolean;
  datasets: {
    name: string;
    role: string;
    annotations: string;
    unavailable: string;
  }[];
}

export interface BenchmarkModelRow {
  model: string;
  params_M: string | number;
  best_epoch: string | number;
  minutes: string | number;
  val_auroc: number;
  val_auprc: number;
  test_auroc: number;
  test_auprc: number;
  test_f1: number;
  test_precision: number;
  test_sensitivity: number;
  test_specificity: number;
  test_ece: number;
}
