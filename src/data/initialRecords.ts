import researchDataJson from './researchData.json';
import { AnalysisRecord, ModelMetadata, SeverityAssessment } from '../types';

export const RESEARCH_DATA = researchDataJson;

export const SEVERITY_DEFINITIONS: Record<number, { name: string; label: string; description: string; clinicalSignificance: string }> = {
  0: {
    name: 'Category 0: No Retinal Lesions',
    label: 'Category 0',
    description: 'No myopic retinal lesions observed. Normal fundus appearance without tessellation.',
    clinicalSignificance: 'Normal control baseline or low-risk emmetropic appearance.'
  },
  1: {
    name: 'Category 1: Tessellated Fundus',
    label: 'Category 1',
    description: 'Tessellation (tigroid appearance) caused by retinal pigment epithelium thinning exposing choroidal vessels.',
    clinicalSignificance: 'Early structural sign of axial elongation without visual acuity loss.'
  },
  2: {
    name: 'Category 2: Diffuse Chorioretinal Atrophy',
    label: 'Category 2',
    description: 'Yellow-white ill-defined chorioretinal atrophy typically around the optic disc and posterior pole.',
    clinicalSignificance: 'Intermediate myopic maculopathy indicating progressive choroidal thinning.'
  },
  3: {
    name: 'Category 3: Patchy Chorioretinal Atrophy',
    label: 'Category 3',
    description: 'Well-demarcated grayish-white atrophy patches with marked thinning of the retina and choroid.',
    clinicalSignificance: 'Advanced myopic maculopathy with heightened risk of macular hole or CNV formation.'
  },
  4: {
    name: 'Category 4: Macular Atrophy',
    label: 'Category 4',
    description: 'Well-defined round or geographic chorioretinal atrophy involving the central foveal avascular zone.',
    clinicalSignificance: 'End-stage pathological myopia often resulting in irreversible central vision loss.'
  }
};

export const MODEL_METADATA: ModelMetadata = {
  modelName: 'RETFound Multi-Task (ViT-Large backbone)',
  architecture: 'Vision Transformer (303.3M parameters) with Task-Specific Decoders',
  parametersM: 303.3,
  checkpointStatus: 'Available',
  checkpointPath: 'pm_results/pm_research/multitask/best.pth (1.22 GB)',
  inputDimensions: '448 × 448 × 3 (RGB)',
  bestEpoch: 3,
  totalEpochs: 15,
  learningRate: 0.0001,
  weightDecay: 0.01,
  activeSegHeads: ['Optic Disc (HRF-Seg+)', 'Lacquer Cracks (MMAC)', 'Fuchs Spots (MMAC)'],
  useSeverityHead: true,
  useFoveaHead: true,
  datasets: [
    {
      name: 'PALM (Pathologic Myopia Challenge)',
      role: 'PM classification and fovea localization training & evaluation',
      annotations: 'Binary PM Label, Fovea Coordinates (x, y)',
      unavailable: '5-level severity classification not provided by PALM'
    },
    {
      name: 'MMAC 2023 (Myopic Maculopathy Analysis Challenge)',
      role: 'Maculopathy severity grading (5 levels) & lesion segmentations',
      annotations: 'Category 0-4 severity labels, Lacquer crack masks, CNV & Fuchs spot masks',
      unavailable: 'Native binary PM labels, Fovea coordinates'
    },
    {
      name: 'HRF-Seg+ (High-Resolution Fundus Segmentation)',
      role: 'Optic disc segmentation head pretraining and fine-tuning',
      annotations: 'Optic Disc pixel-level segmentation masks',
      unavailable: 'PM classification, severity grading, fovea coordinates'
    },
    {
      name: 'MCTN Fundus (Multi-Center Retinal Images)',
      role: 'External domain generalization testing',
      annotations: 'Unlabelled fundus photographs (imaging cohort)',
      unavailable: 'All supervised annotation masks and categorical labels'
    }
  ]
};

export const INITIAL_ANALYSES: AnalysisRecord[] = [
  {
    id: 'rec_palm_001',
    title: 'PALM-H0001 (High-Risk Pathological Myopia)',
    imageName: 'PALM_H0001.jpg',
    imageUrl: '/samples/fundus_pm_severe.png',
    thumbnailUrl: '/samples/fundus_pm_severe.png',
    timestamp: '2026-10-15 14:30:22',
    status: 'completed',
    isDemo: true,
    datasetOrigin: 'PALM Benchmark Split',
    imageIdentifier: 'PALM-H0001-OD',
    researcherNotes: 'High-grade PM presentation with marked posterior staphyloma and peripapillary atrophy.',
    preprocessing: {
      circularCropApplied: true,
      targetResolution: '448x448',
      claheChannel: 'Lightness (L* in CIELAB)',
      aspectRatioPreserved: true
    },
    pmClassification: {
      predictedClass: 'Pathological Myopia',
      probability: 0.9842,
      threshold: 0.5000,
      modelName: 'RETFound Multi-Task',
      confidenceBand: 'High',
      rawLogit: 4.12
    },
    severity: {
      level: 4,
      label: 'Category 4',
      name: SEVERITY_DEFINITIONS[4].name,
      probabilities: [0.01, 0.03, 0.08, 0.18, 0.70],
      description: SEVERITY_DEFINITIONS[4].description,
      clinicalSignificance: SEVERITY_DEFINITIONS[4].clinicalSignificance
    },
    segmentation: {
      hasDisc: true,
      hasLacquerCracks: true,
      hasFuchsSpots: true,
      phenotyping: {
        lacquerCracksAreaPx: 1240,
        lacquerCracksPctFundus: 3.15,
        lacquerCracksMacularDensity: 0.42,
        fuchsSpotsAreaPx: 3820,
        fuchsSpotsPctFundus: 9.68,
        fuchsSpotsMacularDensity: 0.78,
        meanDistDiscDd: 2.15,
        meanDistFoveaDd: 1.08,
        quadrants: {
          q0: 0.48, // Superior-Temporal
          q1: 0.22, // Superior-Nasal
          q2: 0.12, // Inferior-Nasal
          q3: 0.18  // Inferior-Temporal
        }
      },
      diceScores: {
        disc: 0.984,
        lacquerCracks: 0.721,
        fuchsSpots: 0.684
      }
    },
    fovea: {
      x: 218.4,
      y: 226.8,
      standardSize: 448,
      errorPx: 3.24,
      status: 'detected'
    },
    explainability: {
      gradCamUrl: '/samples/gradcam_pm_severe.png',
      attentionRolloutUrl: '/samples/rollout_pm_severe.png',
      targetLayer: 'Transformer Token Features (Block 24)',
      backboneType: 'vit',
      targetClass: 'Pathological Myopia (Positive)',
      scientificNotice: 'Gradient-weighted class activation mapping highlights discriminative spatial regions in the latent feature space. Heatmaps indicate correlation with PM prediction, not independent diagnostic verification.'
    }
  },
  {
    id: 'rec_palm_002',
    title: 'PALM-N0042 (Normal Control Eye)',
    imageName: 'PALM_N0042.jpg',
    imageUrl: '/samples/fundus_normal.png',
    thumbnailUrl: '/samples/fundus_normal.png',
    timestamp: '2026-10-15 15:10:04',
    status: 'completed',
    isDemo: true,
    datasetOrigin: 'PALM Benchmark Split',
    imageIdentifier: 'PALM-N0042-OS',
    researcherNotes: 'Control cohort eye with well-preserved neuroretinal rim and uniform macular pigment.',
    preprocessing: {
      circularCropApplied: true,
      targetResolution: '448x448',
      claheChannel: 'Lightness (L* in CIELAB)',
      aspectRatioPreserved: true
    },
    pmClassification: {
      predictedClass: 'Non-PM',
      probability: 0.0034,
      threshold: 0.5000,
      modelName: 'RETFound Multi-Task',
      confidenceBand: 'High',
      rawLogit: -5.68
    },
    severity: {
      level: 0,
      label: 'Category 0',
      name: SEVERITY_DEFINITIONS[0].name,
      probabilities: [0.94, 0.04, 0.01, 0.005, 0.005],
      description: SEVERITY_DEFINITIONS[0].description,
      clinicalSignificance: SEVERITY_DEFINITIONS[0].clinicalSignificance
    },
    segmentation: {
      hasDisc: true,
      hasLacquerCracks: false,
      hasFuchsSpots: false,
      phenotyping: {
        lacquerCracksAreaPx: 0,
        lacquerCracksPctFundus: 0.0,
        lacquerCracksMacularDensity: 0.0,
        fuchsSpotsAreaPx: 0,
        fuchsSpotsPctFundus: 0.0,
        fuchsSpotsMacularDensity: 0.0,
        quadrants: { q0: 0, q1: 0, q2: 0, q3: 0 }
      },
      diceScores: {
        disc: 0.991
      }
    },
    fovea: {
      x: 212.0,
      y: 224.5,
      standardSize: 448,
      errorPx: 1.82,
      status: 'detected'
    },
    explainability: {
      gradCamUrl: '/samples/gradcam_normal.png',
      targetLayer: 'Transformer Token Features (Block 24)',
      backboneType: 'vit',
      targetClass: 'Non-PM Control',
      scientificNotice: 'Heatmap activation is dispersed without focal pathologic concentration.'
    }
  },
  {
    id: 'rec_mmac_003',
    title: 'MMAC-2023-0184 (Diffuse Chorioretinal Atrophy)',
    imageName: 'MMAC_0184.png',
    imageUrl: '/samples/fundus_pm_moderate.png',
    thumbnailUrl: '/samples/fundus_pm_moderate.png',
    timestamp: '2026-10-15 16:05:18',
    status: 'completed',
    isDemo: true,
    datasetOrigin: 'MMAC 2023 Task 1 & 2',
    imageIdentifier: 'MMAC-2023-0184',
    researcherNotes: 'Diffuse atrophy extending along temporal vascular arcades.',
    preprocessing: {
      circularCropApplied: true,
      targetResolution: '448x448',
      claheChannel: 'Lightness (L* in CIELAB)',
      aspectRatioPreserved: true
    },
    pmClassification: {
      predictedClass: 'Pathological Myopia',
      probability: 0.8924,
      threshold: 0.5000,
      modelName: 'RETFound Multi-Task',
      confidenceBand: 'High',
      rawLogit: 2.11
    },
    severity: {
      level: 2,
      label: 'Category 2',
      name: SEVERITY_DEFINITIONS[2].name,
      probabilities: [0.03, 0.12, 0.73, 0.09, 0.03],
      description: SEVERITY_DEFINITIONS[2].description,
      clinicalSignificance: SEVERITY_DEFINITIONS[2].clinicalSignificance
    },
    segmentation: {
      hasDisc: true,
      hasLacquerCracks: true,
      hasFuchsSpots: false,
      phenotyping: {
        lacquerCracksAreaPx: 640,
        lacquerCracksPctFundus: 1.62,
        lacquerCracksMacularDensity: 0.28,
        fuchsSpotsAreaPx: 0,
        fuchsSpotsPctFundus: 0.0,
        fuchsSpotsMacularDensity: 0.0,
        meanDistDiscDd: 1.45,
        meanDistFoveaDd: 1.95,
        quadrants: {
          q0: 0.65,
          q1: 0.15,
          q2: 0.10,
          q3: 0.10
        }
      },
      diceScores: {
        disc: 0.978,
        lacquerCracks: 0.695
      }
    },
    fovea: {
      x: 230.1,
      y: 218.4,
      standardSize: 448,
      errorPx: 4.10,
      status: 'detected'
    },
    explainability: {
      gradCamUrl: '/samples/gradcam_pm_moderate.png',
      targetLayer: 'Transformer Token Features (Block 24)',
      backboneType: 'vit',
      targetClass: 'Pathological Myopia',
      scientificNotice: 'Gradient activations concentrate along the peripapillary and temporal atrophy regions.'
    }
  }
];
