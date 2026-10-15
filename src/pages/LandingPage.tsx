import React from 'react';
import { Link } from 'react-router-dom';
import {
  ScanEye,
  Activity,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  FileText,
  BarChart2,
  ExternalLink,
  Target
} from 'lucide-react';
import { ResearchDisclaimer } from '../components/ResearchDisclaimer';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary-light selection:text-primary-dark">
      {/* Navigation Header */}
      <nav className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white shadow-sm ring-2 ring-primary/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-base tracking-tight">PathMyo</span>
              <span className="ml-2 text-[10px] font-mono uppercase bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                Research AI
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/dashboard"
              className="text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Workspace Dashboard
            </Link>
            <Link
              to="/models"
              className="hidden sm:inline-block text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Methodology
            </Link>
            <Link
              to="/analyze"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-xs sm:text-sm font-semibold hover:bg-primary-hover shadow-subtle transition-all"
            >
              <ScanEye className="w-4 h-4" />
              <span>Start Analysis</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 lg:py-20 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Title & Research Motivation */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
                <Cpu className="w-3.5 h-3.5" />
                <span>Ophthalmic Foundation Model • RETFound Backbone</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Explainable Multi-Task Deep Learning for{' '}
                <span className="text-primary">Pathological Myopia</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
                Quantitative Structural Phenotyping and Severity Assessment from Colour Fundus Images
              </p>

              <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">
                Conventional image classification indicates only <em>whether</em> pathological myopia is present.
                PathMyo bridges image-level screening with structure-level quantification—jointly predicting
                five-level myopic maculopathy severity, delineating optic disc and pathognomonic lesion contours
                (lacquer cracks, Fuchs spots), localizing the anatomical fovea, and exposing latent token attributions through Grad-CAM.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/analyze"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary-hover shadow-card transition-all"
                >
                  <ScanEye className="w-4 h-4" />
                  <span>Launch Image Analysis</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 text-sm font-semibold transition-all"
                >
                  <BarChart2 className="w-4 h-4" />
                  <span>Explore Research Results</span>
                </Link>
              </div>

              {/* Research Protocol Specs */}
              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-100 text-slate-600 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-sans">Backbone</span>
                  <span className="font-semibold text-slate-800">RETFound (ViT-L)</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-sans">Input Space</span>
                  <span className="font-semibold text-slate-800">448×448 (CLAHE)</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-sans">Test AUROC</span>
                  <span className="font-semibold text-primary">0.9927 (Multi-Task)</span>
                </div>
              </div>
            </div>

            {/* Right Column: Retinal Visual Stage */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none bg-slate-950 p-3 rounded-2xl shadow-xl border border-slate-800">
                <div className="relative rounded-xl overflow-hidden aspect-square bg-black">
                  <img
                    src="/samples/hero_fundus.png"
                    alt="Colour fundus photograph showing high-grade pathological myopia"
                    className="w-full h-full object-cover"
                  />
                  {/* Subtle simulated crosshair & annotations */}
                  <div className="absolute inset-0 pointer-events-none border border-primary/30 rounded-xl" />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-1 rounded border border-white/10 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>PALM Benchmark Sample</span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-1 rounded border border-white/10">
                    P(PM) = 0.984 • Category 4
                  </div>
                </div>

                {/* Subtitle tag */}
                <div className="mt-2.5 px-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Preprocessed: Circular crop + LAB CLAHE</span>
                  <span className="text-primary">448 × 448 px</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-xs font-semibold text-primary uppercase tracking-widest">
              Architectural Highlights
            </h2>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
              Three Pillars of the Multi-Task Retinal Framework
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Harmonized across PALM, MMAC 2023, HRF-Seg+, and MCTN cohorts without label leakage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-card p-6 rounded-xl border border-slate-200 shadow-card space-y-3">
              <div className="w-10 h-10 rounded-lg bg-teal-50 text-primary flex items-center justify-center border border-teal-100">
                <Activity className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">1. Multi-Task Joint Learning</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Shares a unified retinal foundation backbone across binary PM detection, five-category myopic maculopathy severity assessment, and anatomical fovea (x, y) localization.
              </p>
              <ul className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  <span>Test AUROC: 0.9927 (Precision 94.8%)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  <span>Severity Quadratic Weighted Kappa: 0.9128</span>
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-card p-6 rounded-xl border border-slate-200 shadow-card space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-secondary flex items-center justify-center border border-blue-100">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">2. Structural Quantification</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Predicts spatial contours for the optic disc, lacquer cracks, and Fuchs spots. Measures fundus percentage area, macular density, and quadrant distributions.
              </p>
              <ul className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-secondary" />
                  <span>Optic disc segmentation head: Dice 1.000</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-secondary" />
                  <span>Fovea median coordinate error: 11.1 px</span>
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-card p-6 rounded-xl border border-slate-200 shadow-card space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">3. Explainable AI Attribution</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Extracts gradient-weighted class activation maps (Grad-CAM) from the terminal token representation. Supports Vision Transformer attention rollout visualization.
              </p>
              <ul className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Transparent visual audit for clinicians</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Strict non-diagnostic scientific disclosure</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Analysis Workflow Section */}
      <section className="py-16 bg-white border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-xs font-semibold text-primary uppercase tracking-widest">
              Standardized Pipeline
            </h2>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
              From Fundus Image to Structured Phenotype
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Fundus Upload',
                desc: 'Upload high-resolution colour retinal fundus photographs (JPG/PNG). Preserves patient privacy through client-side processing.',
              },
              {
                step: '02',
                title: 'Standard Preprocessing',
                desc: 'Black margin circular masking, aspect-ratio preserved scaling to 448x448, and CLAHE enhancement on the lightness channel.',
              },
              {
                step: '03',
                title: 'Multi-Head Inference',
                desc: 'Joint execution across classification, 5-level severity, optic disc, lesion masks, and foveal coordinate regression heads.',
              },
              {
                step: '04',
                title: 'Visualization & Audit',
                desc: 'Interactive pan/zoom overlay viewer, opacity blending, Grad-CAM attribution inspection, and structured JSON report export.',
              },
            ].map((st) => (
              <div key={st.step} className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <span className="text-2xl font-black font-mono text-primary/40">{st.step}</span>
                <h4 className="text-sm font-bold text-slate-900">{st.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary-hover shadow-subtle transition-all"
            >
              <ScanEye className="w-4 h-4" />
              <span>Begin With Sample Image</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Research Disclaimer & Footer */}
      <footer className="mt-auto py-10 bg-sidebar text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <ResearchDisclaimer />

          <div className="pt-6 border-t border-sidebar-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-slate-300 font-semibold">
                Explainable Multi-Task Deep Learning for Pathological Myopia
              </p>
              <p className="text-[11px] text-slate-400">
                Academic Retinal Research • Datasets: PALM, MMAC 2023, HRF-Seg+, MCTN
              </p>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <Link to="/models" className="hover:text-white transition-colors">
                Model Architectures
              </Link>
              <Link to="/insights" className="hover:text-white transition-colors">
                Saved Metrics
              </Link>
              <Link to="/settings" className="hover:text-white transition-colors">
                Settings & API
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
