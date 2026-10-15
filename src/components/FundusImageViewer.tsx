import React, { useState, useRef, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  Layers,
  Crosshair,
  Sliders,
  SplitSquareVertical,
  Info
} from 'lucide-react';
import { FoveaLocalization, SegmentationMasks, ExplainabilityData } from '../types';

interface FundusImageViewerProps {
  imageUrl: string;
  imageAlt?: string;
  segmentation?: SegmentationMasks | null;
  fovea?: FoveaLocalization | null;
  explainability?: ExplainabilityData | null;
  className?: string;
}

export const FundusImageViewer: React.FC<FundusImageViewerProps> = ({
  imageUrl,
  imageAlt = 'Colour fundus photograph',
  segmentation,
  fovea,
  explainability,
  className = '',
}) => {
  // Zoom & Pan
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSideBySide, setIsSideBySide] = useState(false);

  // Overlay Controls
  const [showOverlays, setShowOverlays] = useState(true);
  const [opacity, setOpacity] = useState(70); // percentage
  const [showDisc, setShowDisc] = useState(true);
  const [showLacquerCracks, setShowLacquerCracks] = useState(true);
  const [showFuchsSpots, setShowFuchsSpots] = useState(true);
  const [showFovea, setShowFovea] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Zoom handlers
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 4));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`bg-white rounded-xl border border-slate-200 overflow-hidden shadow-card flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-50 p-6 bg-slate-950 text-white border-0' : className
      }`}
    >
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-slate-200 bg-slate-50/80">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-primary" />
            Medical Retinal Viewer
          </span>
          <span className="text-[11px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
            {Math.round(zoom * 100)}%
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 text-slate-700">
          {/* Zoom controls */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-subtle">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 0.75}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded disabled:opacity-40"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 4}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded disabled:opacity-40"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Side-by-side mode */}
          <button
            onClick={() => setIsSideBySide(!isSideBySide)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isSideBySide
                ? 'bg-secondary-light text-secondary border-secondary/30 font-semibold'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
            title="Toggle Side-by-Side (Original vs Segmented Overlay)"
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Side-by-Side</span>
          </button>

          {/* Master Overlay Toggle */}
          <button
            onClick={() => setShowOverlays(!showOverlays)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              showOverlays
                ? 'bg-primary-light text-primary-dark border-primary/30 font-semibold'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
            title="Toggle All Annotation Overlays"
          >
            {showOverlays ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Overlays</span>
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-lg shadow-subtle"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Canvas View Area */}
      <div
        className={`relative flex-1 bg-slate-950 flex items-center justify-center overflow-hidden min-h-[380px] max-h-[560px] select-none ${
          zoom > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className={`grid ${
            isSideBySide ? 'grid-cols-1 md:grid-cols-2 gap-4' : 'grid-cols-1'
          } w-full h-full p-4 items-center justify-center`}
        >
          {/* Panel 1: Original Fundus */}
          {isSideBySide && (
            <div className="relative flex flex-col items-center justify-center h-full">
              <div className="absolute top-2 left-2 z-10 px-2 py-1 rounded bg-black/70 backdrop-blur-xs text-[11px] font-mono text-white border border-white/10">
                Original Fundus Image
              </div>
              <div
                className="relative transition-transform duration-75"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transformOrigin: 'center center',
                }}
              >
                <img
                  src={imageUrl}
                  alt={imageAlt}
                  className="max-h-[460px] max-w-full object-contain rounded-md shadow-lg"
                  draggable={false}
                />
              </div>
            </div>
          )}

          {/* Panel 2 (or Full): Overlay Display */}
          <div className="relative flex flex-col items-center justify-center h-full">
            {isSideBySide && (
              <div className="absolute top-2 left-2 z-10 px-2 py-1 rounded bg-black/70 backdrop-blur-xs text-[11px] font-mono text-white border border-white/10 flex items-center gap-1.5">
                <span>Multi-Task Annotations</span>
              </div>
            )}

            <div
              className="relative transition-transform duration-75"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: 'center center',
              }}
            >
              {/* Base Fundus Image */}
              <img
                src={imageUrl}
                alt={imageAlt}
                className="max-h-[460px] max-w-full object-contain rounded-md shadow-lg"
                draggable={false}
              />

              {/* Overlays Container (mapped proportionally over the fundus photo) */}
              {showOverlays && (
                <div
                  className="absolute inset-0 pointer-events-none rounded-md overflow-hidden transition-opacity duration-150"
                  style={{ opacity: opacity / 100 }}
                >
                  {/* Grad-CAM Heatmap overlay */}
                  {showHeatmap && explainability?.gradCamUrl && (
                    <img
                      src={explainability.gradCamUrl}
                      alt="Grad-CAM Activation"
                      className="absolute inset-0 w-full h-full object-contain mix-blend-screen filter contrast-125"
                    />
                  )}

                  {/* SVG Canvas for Structured Lesion & Disc Mask Contours & Fovea Marker */}
                  <svg
                    viewBox="0 0 448 448"
                    className="absolute inset-0 w-full h-full"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {/* Optic Disc Contour (Green) */}
                    {showDisc && segmentation?.hasDisc && (
                      <g id="mask-disc">
                        <ellipse
                          cx="95"
                          cy="225"
                          rx="42"
                          ry="48"
                          fill="#10B981"
                          fillOpacity="0.28"
                          stroke="#10B981"
                          strokeWidth="2.5"
                          strokeDasharray="4 2"
                        />
                        <text x="82" y="230" fill="#10B981" fontSize="10" fontWeight="bold">
                          Disc
                        </text>
                      </g>
                    )}

                    {/* Lacquer Cracks Contours (Amber) */}
                    {showLacquerCracks && segmentation?.hasLacquerCracks && (
                      <g id="mask-lacquer-cracks">
                        <path
                          d="M 170 190 Q 210 215 250 205 T 310 230"
                          fill="none"
                          stroke="#F59E0B"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeOpacity="0.85"
                        />
                        <path
                          d="M 185 240 Q 220 235 270 255"
                          fill="none"
                          stroke="#F59E0B"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeOpacity="0.85"
                        />
                      </g>
                    )}

                    {/* Fuchs Spots Contour (Magenta) */}
                    {showFuchsSpots && segmentation?.hasFuchsSpots && (
                      <g id="mask-fuchs-spots">
                        <ellipse
                          cx="220"
                          cy="232"
                          rx="24"
                          ry="22"
                          fill="#EC4899"
                          fillOpacity="0.45"
                          stroke="#EC4899"
                          strokeWidth="2.5"
                        />
                        <text x="202" y="236" fill="#FFFFFF" fontSize="9" fontWeight="bold">
                          Fuchs
                        </text>
                      </g>
                    )}

                    {/* Fovea Point Crosshair (White with Target Reticle) */}
                    {showFovea && fovea && fovea.status === 'detected' && (
                      <g id="fovea-target" transform={`translate(${fovea.x}, ${fovea.y})`}>
                        <circle r="7" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="2 1" />
                        <line x1="-12" y1="0" x2="12" y2="0" stroke="#FFFFFF" strokeWidth="2" />
                        <line x1="0" y1="-12" x2="0" y2="12" stroke="#FFFFFF" strokeWidth="2" />
                        <circle r="2" fill="#0F9F9A" />
                        <text
                          x="10"
                          y="-8"
                          fill="#FFFFFF"
                          fontSize="10"
                          fontWeight="bold"
                          className="drop-shadow"
                        >
                          Fovea ({Math.round(fovea.x)}, {Math.round(fovea.y)})
                        </text>
                      </g>
                    )}
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Layer Controls & Clinical Legend */}
      <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 text-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Layer Checkboxes */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-semibold text-slate-700 uppercase tracking-wider text-[11px] flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-slate-500" /> Layers:
          </span>

          {/* Optic Disc */}
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 hover:text-slate-900 select-none">
            <input
              type="checkbox"
              checked={showDisc}
              onChange={(e) => setShowDisc(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
            />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <span>Optic Disc</span>
          </label>

          {/* Lacquer Cracks */}
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 hover:text-slate-900 select-none">
            <input
              type="checkbox"
              checked={showLacquerCracks}
              onChange={(e) => setShowLacquerCracks(e.target.checked)}
              className="rounded text-amber-500 focus:ring-amber-400 w-3.5 h-3.5"
            />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
            <span>Lacquer Cracks</span>
          </label>

          {/* Fuchs Spots */}
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 hover:text-slate-900 select-none">
            <input
              type="checkbox"
              checked={showFuchsSpots}
              onChange={(e) => setShowFuchsSpots(e.target.checked)}
              className="rounded text-pink-600 focus:ring-pink-500 w-3.5 h-3.5"
            />
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500 shrink-0" />
            <span>Fuchs Spots</span>
          </label>

          {/* Fovea Target */}
          {fovea && (
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 hover:text-slate-900 select-none">
              <input
                type="checkbox"
                checked={showFovea}
                onChange={(e) => setShowFovea(e.target.checked)}
                className="rounded text-primary focus:ring-primary w-3.5 h-3.5"
              />
              <Crosshair className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>Fovea Crosshair</span>
            </label>
          )}

          {/* Grad-CAM Heatmap */}
          {explainability && (
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 hover:text-slate-900 select-none">
              <input
                type="checkbox"
                checked={showHeatmap}
                onChange={(e) => setShowHeatmap(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
              />
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0" />
              <span>Grad-CAM Heatmap</span>
            </label>
          )}
        </div>

        {/* Opacity Slider */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Sliders className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-[11px] font-medium text-slate-600">Opacity:</span>
          <input
            type="range"
            min="10"
            max="100"
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            className="w-24 sm:w-28 accent-primary h-1.5 bg-slate-200 rounded-lg cursor-pointer"
          />
          <span className="font-mono text-[11px] text-slate-600 w-8">{opacity}%</span>
        </div>
      </div>
    </div>
  );
};
