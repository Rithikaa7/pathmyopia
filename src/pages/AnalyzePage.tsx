import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileImage,
  X,
  RefreshCw,
  ScanEye,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sliders,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { PageContainer } from '../components/PageContainer';
import { ErrorState, LoadingState } from '../components/FeedbackStates';
import { analyzeImage, getAppMode, checkBackendHealth } from '../services/api';

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

  // Presets from actual research samples
  const presets = [
    {
      key: 'severe',
      title: 'High-Grade PM (Category 4)',
      cohort: 'PALM Benchmark Split',
      url: '/samples/fundus_pm_severe.png',
      desc: 'Extensive chorioretinal atrophy, posterior staphyloma, lacquer cracks.',
      defaultId: 'PALM-H0001',
    },
    {
      key: 'normal',
      title: 'Non-PM Control Fundus',
      cohort: 'PALM Control Split',
      url: '/samples/fundus_normal.png',
      desc: 'Healthy optic disc, physiological cupping, uniform retinal pigment.',
      defaultId: 'PALM-N0042',
    },
    {
      key: 'moderate',
      title: 'Diffuse Atrophy (Category 2)',
      cohort: 'MMAC 2023 Cohort',
      url: '/samples/fundus_pm_moderate.png',
      desc: 'Peripapillary atrophy with diffuse temporal choroidal thinning.',
      defaultId: 'MMAC-0184',
    },
  ];

  const handleFileSelection = (selectedFile: File) => {
    setValidationError(null);
    setApiError(null);
    setSelectedPreset(null);

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(selectedFile.type)) {
      setValidationError('Invalid file format. Please upload a standard colour fundus image in JPG, JPEG, or PNG format.');
      return;
    }

    // Validate size (max 20MB)
    const maxSize = 20 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setValidationError('File size exceeds 20MB. Please upload a compressed or standard fundus photograph.');
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

  const handleChoosePreset = (preset: typeof presets[0]) => {
    setValidationError(null);
    setApiError(null);
    setFile(null);
    setPreviewUrl(preset.url);
    setSelectedPreset(preset.key);
    setImageIdentifier(preset.defaultId);
    setResearcherNotes(`Pre-loaded benchmark evaluation sample: ${preset.title} (${preset.cohort}).`);
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
      await new Promise((r) => setTimeout(r, 400));

      setLoadingStage('Resizing to 448 × 448 px & computing CIELAB lightness CLAHE...');
      await new Promise((r) => setTimeout(r, 500));

      setLoadingStage('Passing through RETFound backbone & multi-task decoders...');
      await new Promise((r) => setTimeout(r, 600));

      const res = await analyzeImage(file, previewUrl, {
        title: imageIdentifier || file?.name || 'Retinal Fundus Image',
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
      title="Retinal Image Upload & Multi-Task Analysis"
      subtitle="Input high-resolution colour fundus photographs to extract PM classification, 5-level severity grading, structural segmentation, fovea coordinates, and Grad-CAM explainability."
      badge={appMode === 'connected' ? 'Connected Mode' : 'Demo Mode'}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Upload / Image Stage (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Preset Benchmark Samples Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                Benchmark Sample Presets
              </span>
              <span className="text-[11px] text-slate-400">1-Click Loading</span>
            </div>
            <p className="text-xs text-slate-500">
              Select an authentic research sample from the notebook evaluation splits to test the workflow:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              {presets.map((p) => {
                const isSelected = selectedPreset === p.key;
                return (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => handleChoosePreset(p)}
                    className={`flex items-start gap-2.5 p-2 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'border-primary bg-primary-light/60 ring-2 ring-primary/30'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
                    }`}
                  >
                    <img
                      src={p.url}
                      alt={p.title}
                      className="w-10 h-10 rounded object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">{p.title}</div>
                      <div className="text-[10px] text-slate-500 truncate">{p.cohort}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upload Area or Preview Card */}
          {!previewUrl ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`p-10 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? 'border-primary bg-primary-light/40 scale-[0.99]'
                  : 'border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50/50 shadow-subtle'
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

              <div className="w-14 h-14 rounded-2xl bg-teal-50 text-primary flex items-center justify-center mb-4 border border-teal-100 shadow-xs">
                <UploadCloud className="w-7 h-7" />
              </div>

              <h3 className="text-base font-bold text-slate-900">
                Drag and drop your colour fundus image
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Supported formats: <strong className="text-slate-700">JPG, JPEG, PNG</strong> (up to 20MB). Client-side processing ensures patient privacy.
              </p>

              <button
                type="button"
                className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 rounded-lg text-xs font-semibold shadow-subtle transition-colors"
              >
                <FileImage className="w-3.5 h-3.5 text-primary" />
                <span>Browse Local Files</span>
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
              {/* Preview Header */}
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Image Preview
                  </span>
                  {selectedPreset ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                      Benchmark Sample
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                      User Uploaded
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Replace</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>

              {/* Centered Image Display */}
              <div className="bg-slate-950 p-4 flex items-center justify-center min-h-[340px]">
                <img
                  src={previewUrl}
                  alt="Fundus preview"
                  className="max-h-[380px] max-w-full object-contain rounded-md shadow-lg"
                />
              </div>

              <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Aspect Ratio Preserved</span>
                <span className="text-primary font-semibold">Target Size: 448 × 448</span>
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
              title="Inference Connection Error"
              message={apiError}
              onRetry={handleStartAnalysis}
            />
          )}
        </div>

        {/* Right Column: Preprocessing & Metadata Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Metadata Inputs */}
          <div className="bg-card rounded-xl p-5 border border-slate-200 shadow-card space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-primary" />
              Analysis Parameters & Metadata
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Image Identifier (Optional)
                </label>
                <input
                  type="text"
                  value={imageIdentifier}
                  onChange={(e) => setImageIdentifier(e.target.value)}
                  placeholder="e.g. PALM-H0042, MMAC-0184"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Researcher Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={researcherNotes}
                  onChange={(e) => setResearcherNotes(e.target.value)}
                  placeholder="Clinical observations, suspected maculopathy grade, pupil dilation quality..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs"
                />
              </div>
            </div>

            {/* Preprocessing Pipeline Summary */}
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Standardized Preprocessing Pipeline
              </span>
              <ul className="text-[11px] text-slate-600 space-y-1.5">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Crop dark background border & apply circular mask</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Scale to standard 448 × 448 px (RETFound input window)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>CLAHE enhancement on Lightness (L*) channel in CIELAB</span>
                </li>
              </ul>
            </div>

            {/* Mode Banner */}
            <div className={`p-3 rounded-lg border text-xs ${
              appMode === 'connected'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              <div className="flex items-center gap-1.5 font-bold mb-0.5">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>Execution Mode: {appMode === 'connected' ? 'Connected Backend' : 'Demo & Offline Exploration'}</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {appMode === 'connected'
                  ? 'Inference requests will be sent to the configured PyTorch API endpoint.'
                  : 'Inference backend is currently disconnected. Previews and multi-task workflow evaluation will operate in Demo Mode.'}
              </p>
            </div>

            {/* Main Action Button */}
            <button
              type="button"
              disabled={!previewUrl || isLoading}
              onClick={handleStartAnalysis}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed shadow-card transition-all"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing Fundus Photograph...</span>
                </>
              ) : (
                <>
                  <ScanEye className="w-4 h-4" />
                  <span>Run Multi-Task Inference</span>
                  <ArrowRight className="w-4 h-4" />
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
