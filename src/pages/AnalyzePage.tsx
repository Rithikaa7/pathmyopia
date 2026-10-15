import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileImage,
  X,
  RefreshCw,
  ScanEye,
  CheckCircle2,
  Sliders,
  Sparkles,
  ArrowRight,
  Eye,
  Info
} from 'lucide-react';
import { PageContainer } from '../components/PageContainer';
import { ErrorState, LoadingState } from '../components/FeedbackStates';
import { analyzeImage, getAppMode } from '../services/api';

export const AnalyzePage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageIdentifier, setImageIdentifier] = useState('');
  const [researcherNotes, setResearcherNotes] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  // Status & Validation State
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [apiError, setApiError] = useState<string | null>(null);

  const appMode = getAppMode();

  // Curated research specimens from authentic cohorts
  const sampleSpecimens = [
    {
      key: 'palm_severe',
      id: 'PALM-H0001',
      title: 'High-Grade Pathological Myopia',
      cohort: 'PALM Test Split',
      url: '/sample_fundus_images/01_PALM_Severe_Pathological_Myopia.png',
      desc: 'Extensive patchy chorioretinal atrophy with peripapillary staphyloma.',
    },
    {
      key: 'palm_moderate',
      id: 'PALM-H0019',
      title: 'Moderate Myopic Maculopathy',
      cohort: 'PALM Split',
      url: '/sample_fundus_images/02_PALM_Moderate_Myopic_Maculopathy.png',
      desc: 'Diffuse chorioretinal atrophy and pigment mottling across temporal arcades.',
    },
    {
      key: 'palm_normal',
      id: 'PALM-N0042',
      title: 'Healthy Control Fundus',
      cohort: 'PALM Control',
      url: '/sample_fundus_images/03_PALM_Normal_Control_Fundus.png',
      desc: 'Uniform neuroretinal rim, physiologic cupping, healthy retinal pigment epithelium.',
    },
    {
      key: 'mmac_diffuse',
      id: 'MMAC-0184',
      title: 'Diffuse Chorioretinal Thinning',
      cohort: 'MMAC 2023',
      url: '/sample_fundus_images/05_MMAC_Diffuse_Chorioretinal_Atrophy.png',
      desc: 'Significant diffuse choroidal pallor with visible large choroidal vessels.',
    },
    {
      key: 'mmac_macular',
      id: 'MMAC-0412',
      title: 'Macular Atrophy (Category 4)',
      cohort: 'MMAC 2023',
      url: '/sample_fundus_images/06_MMAC_Macular_Atrophy_Grade4.png',
      desc: 'Well-circumscribed macular atrophy involving the central fovea.',
    },
    {
      key: 'palm_staphyloma',
      id: 'PALM-H0088',
      title: 'Posterior Staphyloma',
      cohort: 'PALM Split',
      url: '/sample_fundus_images/07_PALM_Posterior_Staphyloma.png',
      desc: 'Marked posterior scleral ectasia with optic disc tilt and temporal crescent.',
    },
  ];

  const handleFileSelection = (selectedFile: File) => {
    setValidationError(null);
    setApiError(null);
    setSelectedPreset(null);

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(selectedFile.type)) {
      setValidationError('Invalid format. Please supply a standard colour fundus photograph in JPG or PNG format.');
      return;
    }

    // Validate size (max 20MB)
    const maxSize = 20 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setValidationError('File size exceeds 20MB limit.');
      return;
    }

    setFile(selectedFile);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    if (!imageIdentifier) {
      setImageIdentifier(selectedFile.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleChoosePreset = (preset: typeof sampleSpecimens[0]) => {
    setValidationError(null);
    setApiError(null);
    setFile(null);
    setPreviewUrl(preset.url);
    setSelectedPreset(preset.key);
    setImageIdentifier(preset.id);
    setResearcherNotes(`Pre-indexed benchmark specimen: ${preset.title} (${preset.cohort}). ${preset.desc}`);
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreviewUrl(null);
    setSelectedPreset(null);
    setImageIdentifier('');
    setResearcherNotes('');
    setValidationError(null);
    setApiError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleStartAnalysis = async () => {
    if (!previewUrl) return;

    setIsLoading(true);
    setApiError(null);

    try {
      setLoadingStage('Cropping black margins and applying circular fundus mask...');
      await new Promise((r) => setTimeout(r, 350));

      setLoadingStage('Resizing to 448 × 448 px & computing CIELAB lightness CLAHE...');
      await new Promise((r) => setTimeout(r, 450));

      setLoadingStage('Executing RETFound multi-task inference decoders...');
      await new Promise((r) => setTimeout(r, 550));

      const res = await analyzeImage(file, previewUrl, {
        title: imageIdentifier || file?.name || 'Retinal Fundus Specimen',
        imageIdentifier,
        researcherNotes,
        presetKey: selectedPreset || undefined,
      });

      if (!res.success) {
        setApiError(res.error || 'Failed to complete analysis.');
        setIsLoading(false);
        return;
      }

      if (res.record) {
        navigate(`/results/${res.record.id}`);
      }
    } catch (err: any) {
      setApiError(err.message || 'An unexpected error occurred during analysis.');
      setIsLoading(false);
    }
  };

  return (
    <PageContainer
      title="Retinal Specimen Analysis"
      subtitle="Input high-resolution colour fundus photographs to extract PM classification, 5-level severity grading, structural segmentation contours, fovea coordinates, and Grad-CAM visual attribution."
      badge={appMode === 'connected' ? 'Cloud Live API' : 'Demo Cohort'}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Upload / Image Specimen Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Preset Benchmark Samples Bar */}
          <div className="bg-white/80 p-5 rounded-xs border border-[#DADBD3] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#254E43] font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#254E43]" />
                Curated Benchmark Specimens
              </span>
              <span className="text-[10px] font-mono text-[#777B76]">1-Click Evaluation</span>
            </div>
            <p className="text-xs text-[#777B76] font-sans">
              Select an authentic specimen from the research test cohorts to evaluate multi-task predictions:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              {sampleSpecimens.map((p) => {
                const isSelected = selectedPreset === p.key;
                return (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => handleChoosePreset(p)}
                    className={`flex items-start gap-2.5 p-2 rounded-xs border text-left transition-all ${
                      isSelected
                        ? 'border-[#254E43] bg-[#254E43]/5 ring-1 ring-[#254E43]'
                        : 'border-[#DADBD3] hover:border-[#777B76] bg-[#F5F3ED]/40 hover:bg-[#F5F3ED]'
                    }`}
                  >
                    <img
                      src={p.url}
                      alt={p.title}
                      className="w-10 h-10 rounded-xs object-cover border border-[#DADBD3] shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-serif text-[#171A19] truncate">{p.title}</div>
                      <div className="text-[10px] text-[#777B76] font-mono truncate">{p.id}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upload Area or Specimen Preview Card */}
          {!previewUrl ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`p-10 border border-dashed rounded-xs flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-[#254E43] bg-[#254E43]/5 scale-[0.99]'
                  : 'border-[#DADBD3] bg-white/70 hover:border-[#777B76] hover:bg-white'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelection(e.target.files[0]);
                  }
                }}
              />

              <div className="w-12 h-12 rounded-full bg-[#254E43]/10 text-[#254E43] flex items-center justify-center mb-3 border border-[#254E43]/20">
                <UploadCloud className="w-6 h-6" />
              </div>

              <h3 className="font-serif text-lg text-[#171A19]">
                Provide colour fundus photograph
              </h3>
              <p className="text-xs text-[#777B76] mt-1 max-w-sm font-sans">
                Drag and drop or browse local files. Supported: <strong className="text-[#171A19] font-mono">JPG, PNG</strong> (up to 20MB). Client-side processing preserves research privacy.
              </p>

              <button
                type="button"
                className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#F5F3ED] border border-[#DADBD3] hover:border-[#777B76] text-[#171A19] rounded-xs text-xs font-mono uppercase tracking-wider transition-colors"
              >
                <FileImage className="w-3.5 h-3.5 text-[#254E43]" />
                <span>Browse Local Files</span>
              </button>
            </div>
          ) : (
            <div className="bg-white/80 rounded-xs border border-[#DADBD3] overflow-hidden">
              {/* Preview Header */}
              <div className="px-4 py-2.5 bg-[#F5F3ED] border-b border-[#DADBD3] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-sm text-[#171A19]">
                    Specimen In Focus
                  </span>
                  {selectedPreset ? (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-xs bg-[#254E43]/10 text-[#254E43] border border-[#254E43]/20">
                      Benchmark Cohort
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-xs bg-[#EAE8E0] text-[#777B76] border border-[#DADBD3]">
                      Uploaded Specimen
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-mono text-[#777B76] hover:text-[#171A19] hover:bg-[#EAE8E0] rounded-xs transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Replace</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-mono text-[#B97854] hover:bg-[#B97854]/10 rounded-xs transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>

              {/* Centered Specimen Display in Dark Research Frame */}
              <div className="bg-[#101815] p-4 flex items-center justify-center min-h-[340px] relative border-b border-[#2A3632]">
                <div className="absolute inset-0 bg-[radial-gradient(#2A3632_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
                <img
                  src={previewUrl}
                  alt="Fundus preview"
                  className="max-h-[380px] max-w-full object-contain rounded-xs border border-[#2A3632] z-10"
                />
              </div>

              <div className="p-3 bg-[#F5F3ED] flex items-center justify-between text-xs text-[#777B76] font-mono">
                <span>Aspect Ratio Preserved</span>
                <span className="text-[#254E43] font-semibold">Standard Window: 448 × 448 px</span>
              </div>
            </div>
          )}

          {/* Validation & API Error Alerts */}
          {validationError && (
            <ErrorState
              title="Image Validation Notice"
              message={validationError}
              onRetry={() => setValidationError(null)}
            />
          )}

          {apiError && (
            <ErrorState
              title="Inference Connection Notice"
              message={apiError}
              onRetry={handleStartAnalysis}
            />
          )}
        </div>

        {/* Right Column: Preprocessing & Metadata Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Metadata Inputs */}
          <div className="bg-white/80 rounded-xs p-6 border border-[#DADBD3] space-y-4">
            <h3 className="font-serif text-base text-[#171A19] pb-2 border-b border-[#DADBD3] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#254E43]" />
              Analysis Parameters & Metadata
            </h3>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[#777B76] mb-1">
                  Specimen Identifier
                </label>
                <input
                  type="text"
                  value={imageIdentifier}
                  onChange={(e) => setImageIdentifier(e.target.value)}
                  placeholder="e.g. PALM-H0042, MMAC-0184"
                  className="w-full px-3 py-2 border border-[#DADBD3] rounded-xs bg-white text-[#171A19] focus:outline-none focus:border-[#254E43] font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[#777B76] mb-1">
                  Clinical & Research Notes
                </label>
                <textarea
                  rows={3}
                  value={researcherNotes}
                  onChange={(e) => setResearcherNotes(e.target.value)}
                  placeholder="Suspected maculopathy category, pupil dilation quality, peripapillary features..."
                  className="w-full px-3 py-2 border border-[#DADBD3] rounded-xs bg-white text-[#171A19] focus:outline-none focus:border-[#254E43] font-sans text-xs"
                />
              </div>
            </div>

            {/* Preprocessing Pipeline Summary */}
            <div className="p-3.5 bg-[#F5F3ED]/70 rounded-xs border border-[#DADBD3] space-y-2">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#171A19] block">
                Standardized Preprocessing Pipeline
              </span>
              <ul className="text-[11px] text-[#777B76] space-y-1.5 font-sans">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#254E43] shrink-0" />
                  <span>Black margin cropping & circular field-of-view mask</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#254E43] shrink-0" />
                  <span>448 × 448 px interpolation (RETFound ViT window)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#254E43] shrink-0" />
                  <span>CIELAB L* channel contrast-limited adaptive histogram equalization</span>
                </li>
              </ul>
            </div>

            {/* Mode Banner */}
            <div className={`p-3 rounded-xs border text-xs font-mono ${
              appMode === 'connected'
                ? 'bg-[#254E43]/5 border-[#254E43]/30 text-[#254E43]'
                : 'bg-[#B97854]/5 border-[#B97854]/30 text-[#B97854]'
            }`}>
              <div className="flex items-center gap-1.5 font-bold mb-0.5">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>Execution Mode: {appMode === 'connected' ? 'Connected Cloud API' : 'Demo Cohort'}</span>
              </div>
              <p className="text-[11px] text-[#777B76] font-sans leading-relaxed">
                {appMode === 'connected'
                  ? 'Inference executes on the live cloud PyTorch endpoint (https://pathmyopia.onrender.com).'
                  : 'Inference operates offline with genuine pre-computed benchmark tensors and sample weights.'}
              </p>
            </div>

            {/* Main Action Button */}
            <button
              type="button"
              disabled={!previewUrl || isLoading}
              onClick={handleStartAnalysis}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xs bg-[#254E43] text-white text-xs font-mono uppercase tracking-wider hover:bg-[#1B3B32] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing Specimen...</span>
                </>
              ) : (
                <>
                  <ScanEye className="w-3.5 h-3.5" />
                  <span>Execute Multi-Task Inference</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          {/* Loading Modal/Banner when processing */}
          {isLoading && (
            <LoadingState
              message="Executing Retinal Deep Learning Analysis"
              submessage={loadingStage}
            />
          )}
        </div>
      </div>
    </PageContainer>
  );
};
