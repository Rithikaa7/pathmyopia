import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Crosshair,
  Layers,
  Sparkles,
  Activity,
  Check,
  Eye,
  Sliders,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'original' | 'gradcam'>('original');

  return (
    <div className="min-h-screen bg-canvas text-ink font-sans selection:bg-forest selection:text-canvas">
      {/* 1. Restrained Editorial Navigation */}
      <header className="border-b border-border-fine bg-canvas/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          {/* Brand Wordmark & Retinal Symbol */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              {/* Retinal Lens Symbol */}
              <div className="w-7 h-7 rounded-full border border-forest flex items-center justify-center relative">
                <div className="w-3.5 h-3.5 rounded-full border border-forest/60" />
                <div className="w-1 h-1 rounded-full bg-forest" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-xl tracking-tight text-ink font-normal">
                  OcuLoom
                </span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-graphite">
                  Research
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wider text-graphite uppercase">
            <a href="#research" className="hover:text-forest transition-colors">
              Research
            </a>
            <a href="#capabilities" className="hover:text-forest transition-colors">
              Capabilities
            </a>
            <a href="#methodology" className="hover:text-forest transition-colors">
              Methodology
            </a>
            <Link to="/models" className="hover:text-forest transition-colors">
              Architecture
            </Link>
          </nav>

          {/* Primary Action */}
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 bg-forest text-canvas text-xs font-mono uppercase tracking-wider hover:bg-forest-hover transition-colors shadow-sm"
            >
              <span>Open Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section — Asymmetric Split Composition */}
      <section className="border-b border-border-fine py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left: Typography & Scientific Hypothesis */}
            <div className="lg:col-span-7 space-y-8">
              {/* Technical Eyebrow */}
              <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-graphite">
                <span className="w-1.5 h-1.5 rounded-full bg-copper" />
                <span>RETINAL COMPUTATIONAL RESEARCH / 01</span>
              </div>

              {/* Editorial Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl tracking-tight font-serif text-ink leading-[1.08]">
                Reading the retina.{' '}
                <span className="italic font-display font-normal text-forest block mt-1">
                  Beyond the image.
                </span>
              </h1>

              {/* Supporting Statement */}
              <p className="text-base sm:text-lg text-graphite leading-relaxed max-w-xl font-normal">
                OcuLoom explores pathological myopia through multi-task deep learning, structural phenotyping,
                and visual explanations of model predictions—quantifying chorioretinal lesions and foveal geography from standard colour fundus photography.
              </p>

              {/* Action Pair */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/analyze"
                  className="inline-flex items-center gap-3 px-6 py-3.5 bg-forest text-canvas text-xs font-mono uppercase tracking-widest hover:bg-forest-hover transition-all"
                >
                  <span>Explore the workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#methodology"
                  className="inline-flex items-center gap-2 px-5 py-3.5 border border-border-fine text-ink text-xs font-mono uppercase tracking-widest hover:bg-white transition-colors"
                >
                  <span>Our methodology</span>
                </a>
              </div>

              {/* Understated Research Label */}
              <div className="pt-6 border-t border-border-fine flex items-center gap-3 text-xs text-graphite font-mono">
                <span className="px-2 py-0.5 border border-border-fine bg-white text-[10px] uppercase">
                  Academic Prototype
                </span>
                <span>Not cleared for clinical diagnostic application</span>
              </div>
            </div>

            {/* Right: Scientific Specimen Display */}
            <div className="lg:col-span-5">
              <div className="bg-panel-dark text-canvas p-4 sm:p-5 border border-border-fine shadow-specimen relative">
                {/* Specimen Frame Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-border-dark font-mono text-[10px] uppercase tracking-wider text-mineral">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-copper" />
                    <span>PALM COHORT • SPECIMEN H0001</span>
                  </div>
                  <span>448 × 448 PX</span>
                </div>

                {/* Retinal Specimen Gallery Crop */}
                <div className="relative aspect-square bg-black overflow-hidden border border-border-dark">
                  <img
                    src={activeTab === 'original' ? '/sample_fundus_images/01_PALM_Severe_Pathological_Myopia.png' : '/sample_fundus_images/01_PALM_Severe_Pathological_Myopia.png'}
                    alt="Colour fundus photograph showing high-grade pathological myopia"
                    className="w-full h-full object-cover"
                  />

                  {/* Scientific Reticle Overlay */}
                  <svg
                    viewBox="0 0 448 448"
                    className="absolute inset-0 w-full h-full pointer-events-none"
                  >
                    {/* Foveal Target Crosshair */}
                    <g transform="translate(218, 227)">
                      <circle r="6" fill="none" stroke="#DADBD3" strokeWidth="1" strokeDasharray="2 1" />
                      <line x1="-12" y1="0" x2="12" y2="0" stroke="#DADBD3" strokeWidth="1" />
                      <line x1="0" y1="-12" x2="0" y2="12" stroke="#DADBD3" strokeWidth="1" />
                      <text x="14" y="4" fill="#F5F3ED" fontSize="9" fontFamily="IBM Plex Mono">
                        Fovea (218, 227)
                      </text>
                    </g>
                    {/* Simulated disc and atrophy annotation boundary */}
                    <ellipse
                      cx="95"
                      cy="225"
                      rx="42"
                      ry="48"
                      fill="none"
                      stroke="#86A89B"
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                    />
                    <text x="82" y="168" fill="#86A89B" fontSize="9" fontFamily="IBM Plex Mono">
                      Optic Disc
                    </text>
                  </svg>

                  {/* Corner Coordinates */}
                  <div className="absolute top-2 left-2 font-mono text-[9px] text-white/60 bg-black/60 px-1.5 py-0.5 border border-white/10">
                    LATENT LAYER: RETFOUND BLOCK 24
                  </div>

                  {/* Bottom Inset Tag */}
                  <div className="absolute bottom-2 right-2 font-mono text-[9px] text-canvas bg-forest-dark/90 px-2 py-1 border border-border-dark">
                    P(PM) = 0.984 • CAT 4 ATROPHY
                  </div>
                </div>

                {/* Minimal Gallery Caption */}
                <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-graphite">
                  <span>Fig. 1.0 — High-Grade Posterior Staphyloma</span>
                  <span className="text-copper">Grad-CAM Overlay</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Research Introduction — Editorial Two-Column */}
      <section id="research" className="border-b border-border-fine py-20 bg-canvas">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-graphite block mb-2">
              01 / SCIENTIFIC BACKGROUND
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-ink tracking-tight max-w-2xl">
              A more structured view of myopic change.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Column 1: Editorial Context */}
            <div className="lg:col-span-6 space-y-6 text-sm text-graphite leading-relaxed">
              <p className="text-ink text-base font-normal">
                High myopia induces mechanical axial elongation that stretches the posterior pole, causing progressive thinning of the retina, choroid, and sclera.
              </p>
              <p>
                Standard deep learning approaches treat retinal images as a binary classification problem: either pathological myopia is present or absent. However, this offers clinicians minimal quantitative utility. It cannot answer <em>where</em> lesions reside, <em>how rapidly</em> diffuse atrophy expands, or <em>how close</em> breaks in Bruch's membrane encroach upon the central fovea.
              </p>
              <p>
                OcuLoom decomposes pathological myopia assessment into a unified multi-task framework: joint classification, five-grade myopic maculopathy severity staging, structural lesion segmentation, and spatial foveal coordinate regression.
              </p>

              <div className="pt-4 grid grid-cols-2 gap-6 border-t border-border-fine font-mono text-xs">
                <div>
                  <span className="text-[10px] uppercase text-graphite block">Harmonized Cohort</span>
                  <span className="text-ink font-semibold text-sm">473 Test Eyes</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-graphite block">Foundation Backbone</span>
                  <span className="text-ink font-semibold text-sm">RETFound (303.3M)</span>
                </div>
              </div>
            </div>

            {/* Column 2: Specimen with Annotated Peripapillary Pathology */}
            <div className="lg:col-span-6">
              <div className="p-6 bg-white border border-border-fine space-y-4">
                <div className="aspect-4/3 overflow-hidden bg-black relative">
                  <img
                    src="/sample_fundus_images/05_MMAC_Diffuse_Chorioretinal_Atrophy.png"
                    alt="Diffuse chorioretinal atrophy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs font-mono text-[10px] px-2 py-0.5 border border-border-fine text-ink">
                    SPECIMEN: MMAC-0184 • CATEGORY 2
                  </div>
                </div>
                <div className="font-mono text-xs text-graphite flex justify-between items-center border-t border-border-fine pt-3">
                  <span>Diffuse choroidal pallor along temporal arcades</span>
                  <span className="text-forest font-semibold">QWK: 0.913</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Capabilities Section — Asymmetric Four-Part Sequence */}
      <section id="capabilities" className="border-b border-border-fine py-20 bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-fine pb-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-graphite block mb-1">
                02 / ARCHITECTURAL CAPABILITIES
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-ink tracking-tight">
                Four Specialized Analytical Heads
              </h2>
            </div>
            <p className="text-xs font-mono text-graphite max-w-sm">
              Supervised selectively across PALM, MMAC 2023, and HRF-Seg+ datasets.
            </p>
          </div>

          <div className="space-y-12">
            {/* Capability 01 — Classification */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-4 space-y-3">
                <span className="font-mono text-xs font-semibold text-copper">CAPABILITY 01</span>
                <h3 className="text-2xl font-serif text-ink">Binary PM Classification</h3>
                <p className="text-xs text-graphite leading-relaxed">
                  Predicts the likelihood of pathological myopia against non-myopic controls. Evaluated across external test splits without label leakage.
                </p>
                <div className="font-mono text-xs text-ink pt-2 space-y-1">
                  <div className="flex justify-between border-b border-border-fine py-1">
                    <span className="text-graphite">AUROC</span>
                    <span className="font-bold text-forest">0.9927</span>
                  </div>
                  <div className="flex justify-between border-b border-border-fine py-1">
                    <span className="text-graphite">Sensitivity</span>
                    <span>95.45%</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-graphite">Specificity</span>
                    <span>96.69%</span>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-8 bg-white p-4 border border-border-fine">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <img
                      src="/sample_fundus_images/01_PALM_Severe_Pathological_Myopia.png"
                      alt="PM positive fundus"
                      className="w-full aspect-square object-cover border border-border-fine"
                    />
                    <span className="font-mono text-[11px] text-ink block font-semibold">PM Positive (P = 0.984)</span>
                  </div>
                  <div className="space-y-1.5">
                    <img
                      src="/sample_fundus_images/03_PALM_Normal_Control_Fundus.png"
                      alt="Control fundus"
                      className="w-full aspect-square object-cover border border-border-fine"
                    />
                    <span className="font-mono text-[11px] text-graphite block">Control Eye (P = 0.003)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Capability 02 — Severity Grading */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8 border-t border-border-fine">
              <div className="lg:col-span-8 order-2 lg:order-1 bg-white p-6 border border-border-fine space-y-4">
                <div className="grid grid-cols-5 gap-2 font-mono text-center text-xs">
                  {[
                    { grade: 'C0', name: 'No Lesions', acc: '94%' },
                    { grade: 'C1', name: 'Tessellated', acc: '72%' },
                    { grade: 'C2', name: 'Diffuse', acc: '73%' },
                    { grade: 'C3', name: 'Patchy', acc: '68%' },
                    { grade: 'C4', name: 'Macular', acc: '70%' },
                  ].map((c) => (
                    <div key={c.grade} className="p-3 border border-border-fine bg-canvas">
                      <span className="font-bold text-forest block">{c.grade}</span>
                      <span className="text-[10px] text-graphite block truncate">{c.name}</span>
                    </div>
                  ))}
                </div>
                <div className="font-mono text-xs text-graphite flex justify-between pt-2">
                  <span>Evaluation Cohort: MMAC 2023 (n=209)</span>
                  <span className="text-ink font-semibold">Quadratic Weighted Kappa: 0.9128</span>
                </div>
              </div>
              <div className="lg:col-span-4 order-1 lg:order-2 space-y-3">
                <span className="font-mono text-xs font-semibold text-copper">CAPABILITY 02</span>
                <h3 className="text-2xl font-serif text-ink">5-Level Severity Grading</h3>
                <p className="text-xs text-graphite leading-relaxed">
                  Implements the international META-PM classification system. Outputs calibrated probability distributions across all 5 distinct maculopathy severity categories.
                </p>
              </div>
            </div>

            {/* Capability 03 — Structural Phenotyping */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8 border-t border-border-fine">
              <div className="lg:col-span-4 space-y-3">
                <span className="font-mono text-xs font-semibold text-copper">CAPABILITY 03</span>
                <h3 className="text-2xl font-serif text-ink">Quantitative Phenotyping</h3>
                <p className="text-xs text-graphite leading-relaxed">
                  Progressive upsampling decoders predict pixel contours for Optic Disc (HRF-Seg+), Lacquer Cracks, and Fuchs Spots. Computes fundus area percentage and quadrant density.
                </p>
                <div className="font-mono text-xs text-ink pt-2 space-y-1">
                  <div className="flex justify-between border-b border-border-fine py-1">
                    <span className="text-graphite">Optic Disc Dice</span>
                    <span className="font-bold text-forest">1.000</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-graphite">Fovea Error (Median)</span>
                    <span>11.1 px</span>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-8 bg-white p-4 border border-border-fine">
                <div className="aspect-16/9 bg-panel-dark p-3 relative overflow-hidden">
                  <img
                    src="/sample_fundus_images/08_PALM_Peripapillary_Atrophy.png"
                    alt="Structural contours"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 bg-black/80 font-mono text-[10px] text-canvas px-2.5 py-1 border border-white/10">
                    OPTIC DISC • FOVEAL ANCHOR • MACULAR QUADRANTS
                  </div>
                </div>
              </div>
            </div>

            {/* Capability 04 — Explainability */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8 border-t border-border-fine">
              <div className="lg:col-span-8 order-2 lg:order-1 bg-white p-4 border border-border-fine">
                <div className="aspect-16/9 bg-panel-dark p-3 relative overflow-hidden">
                  <img
                    src="/sample_fundus_images/01_PALM_Severe_Pathological_Myopia.png"
                    alt="Grad-CAM visualization"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 right-3 bg-panel-dark font-mono text-[10px] text-mineral px-2.5 py-1 border border-border-dark">
                    GRAD-CAM / TRANSFORMER TOKEN ATTRIBUTION
                  </div>
                </div>
              </div>
              <div className="lg:col-span-4 order-1 lg:order-2 space-y-3">
                <span className="font-mono text-xs font-semibold text-copper">CAPABILITY 04</span>
                <h3 className="text-2xl font-serif text-ink">Latent Explainability</h3>
                <p className="text-xs text-graphite leading-relaxed">
                  Extracts gradient-weighted class activation maps from the Vision Transformer token sequence. Uncovers spatial evidence driving prediction without hallucinating diagnostic certainty.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Methodology Section — Dark Immersive Research Panel */}
      <section id="methodology" className="py-20 bg-panel-dark text-canvas border-b border-border-dark">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="max-w-2xl space-y-2">
            <span className="font-mono text-xs uppercase tracking-widest text-mineral block">
              03 / COMPUTATIONAL WORKFLOW
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-canvas tracking-tight">
              From pixels to interpretable structure.
            </h2>
            <p className="text-xs sm:text-sm text-graphite font-mono">
              Two-stage optimization: single-task classification pretraining followed by multi-task fine-tuning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4">
            {[
              {
                step: '01',
                title: 'Fundus Ingestion',
                desc: 'Black margin cropping, aspect-ratio preserved scaling to 448x448, and CIELAB lightness (L*) CLAHE normalization.',
              },
              {
                step: '02',
                title: 'RETFound Backbone',
                desc: '303.3M-parameter Vision Transformer Large pretrained on 1.6M ophthalmology images with masked autoencoding.',
              },
              {
                step: '03',
                title: 'Multi-Task Decoders',
                desc: 'Joint heads for PM logit, 5-class severity softmax, progressive mask upsamplers, and foveal coordinate MLP.',
              },
              {
                step: '04',
                title: 'Visual Attribution',
                desc: 'Terminal token gradient backpropagation synthesizing spatial Grad-CAM activation maps for clinical audit.',
              },
            ].map((p) => (
              <div
                key={p.step}
                className="p-5 border border-border-dark bg-panel-darker/60 space-y-3 relative"
              >
                <span className="font-mono text-2xl text-mineral/40 font-bold block">{p.step}</span>
                <h4 className="text-sm font-serif text-canvas">{p.title}</h4>
                <p className="text-xs text-graphite leading-relaxed font-mono">{p.desc}</p>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-border-dark flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-graphite">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-mineral" />
              <span>Weights Checkpoint: best.pth (1.22 GB)</span>
            </div>
            <Link
              to="/models"
              className="text-mineral hover:text-canvas transition-colors inline-flex items-center gap-1.5"
            >
              <span>Examine full architecture specifications</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Research Workspace Preview CTA */}
      <section className="py-20 bg-canvas border-b border-border-fine">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-6">
          <span className="font-mono text-xs uppercase tracking-widest text-copper block">
            RESEARCH ENVIRONMENT READY
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-ink tracking-tight max-w-xl mx-auto">
            Ready to evaluate retinal fundus photography?
          </h2>
          <p className="text-sm text-graphite max-w-lg mx-auto leading-relaxed">
            Upload your colour fundus images to inspect automated classification, five-grade severity staging, and explainable Grad-CAM heatmaps.
          </p>

          <div className="pt-4 flex justify-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-3 px-8 py-4 bg-forest text-canvas text-xs font-mono uppercase tracking-widest hover:bg-forest-hover shadow-editorial transition-all"
            >
              <span>Open Research Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Quiet Editorial Footer */}
      <footer className="py-12 bg-canvas text-graphite text-xs font-mono">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-5 space-y-2">
              <div className="flex items-center gap-2 text-ink">
                <div className="w-4 h-4 rounded-full border border-forest flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-forest" />
                </div>
                <span className="font-serif text-base tracking-tight font-normal">OcuLoom</span>
              </div>
              <p className="text-[11px] leading-relaxed max-w-sm">
                Explainable Retinal Intelligence — Quantitative structural phenotyping and severity assessment for pathological myopia.
              </p>
            </div>

            <div className="md:col-span-7 flex flex-wrap gap-8 md:justify-end text-[11px]">
              <Link to="/dashboard" className="hover:text-ink transition-colors">
                Workspace
              </Link>
              <Link to="/analyze" className="hover:text-ink transition-colors">
                Analyze
              </Link>
              <Link to="/insights" className="hover:text-ink transition-colors">
                Research Insights
              </Link>
              <Link to="/models" className="hover:text-ink transition-colors">
                Model Architecture
              </Link>
              <a
                href="https://github.com/Rithikaa7/pathmyopia"
                target="_blank"
                rel="noreferrer"
                className="hover:text-ink transition-colors inline-flex items-center gap-1"
              >
                <span>GitHub Repository</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="pt-6 border-t border-border-fine flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-graphite">
            <span>© 2026 OcuLoom Retinal AI Research Group • Academic Investigation</span>
            <span>Non-clinical research prototype • Not for diagnostic decision making</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
