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
  Compass
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
      className={`bg-white/80 rounded-xs border border-[#DADBD3] overflow-hidden flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-50 p-6 bg-[#101815] text-[#DADBD3] border-0' : className
      }`}
    >
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 border-b border-[#DADBD3] bg-[#F5F3ED]/80">
        <div className="flex items-center gap-2.5">
          <span className="font-serif text-sm text-[#171A19] flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-[#254E43]" />
            Retinal Specimen Inspection
          </span>
          <span className="text-[10px] font-mono text-[#777B76] bg-white px-1.5 py-0.2 rounded-xs border border-[#DADBD3]">
            {Math.round(zoom * 100)}%
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 text-[#171A19]">
          {/* Zoom controls */}
          <div className="flex items-center bg-white border border-[#DADBD3] rounded-xs p-0.5">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 0.75}
              className="p-1 text-[#777B76] hover:text-[#171A19] hover:bg-[#EAE8E0] rounded-xs disabled:opacity-30"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1 text-[#777B76] hover:text-[#171A19] hover:bg-[#EAE8E0] rounded-xs"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 4}
              className="p-1 text-[#777B76] hover:text-[#171A19] hover:bg-[#EAE8E0] rounded-xs disabled:opacity-30"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Side-by-side mode */}
          <button
            onClick={() => setIsSideBySide(!isSideBySide)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xs text-[11px] font-mono border transition-colors ${
              isSideBySide
                ? 'bg-[#254E43] text-white border-[#254E43]'
                : 'bg-white text-[#777B76] border-[#DADBD3] hover:text-[#171A19]'
            }`}
            title="Toggle Side-by-Side (Original vs Segmented Overlay)"
          >
            <SplitSquareVertical className="w-3 h-3" />
            <span className="hidden sm:inline">Split View</span>
          </button>

          {/* Master Overlay Toggle */}
          <button
            onClick={() => setShowOverlays(!showOverlays)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xs text-[11px] font-mono border transition-colors ${
              showOverlays
                ? 'bg-[#254E43] text-white border-[#254E43]'
                : 'bg-white text-[#777B76] border-[#DADBD3] hover:text-[#171A19]'
            }`}
            title="Toggle All Annotation Overlays"
          >
            {showOverlays ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            <span className="hidden sm:inline">Overlays</span>
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-1 bg-white border border-[#DADBD3] hover:bg-[#EAE8E0] text-[#777B76] hover:text-[#171A19] rounded-xs"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Canvas View Area — Dark Research Specimen Panel */}
      <div
        className={`relative flex-1 bg-[#101815] flex items-center justify-center overflow-hidden min-h-[380px] max-h-[560px] select-none ${
          zoom > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#2A3632_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

        <div
          className={`grid ${
            isSideBySide ? 'grid-cols-1 md:grid-cols-2 gap-4' : 'grid-cols-1'
          } w-full h-full p-4 items-center justify-center z-10`}
        >
          {/* Panel 1: Original Fundus */}
          {isSideBySide && (
            <div className="relative flex flex-col items-center justify-center h-full">
              <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-xs bg-[#17231F]/90 backdrop-blur-xs text-[10px] font-mono text-[#DADBD3] border border-[#2A3632]">
                Original Fundus Photo
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
                  className="max-h-[460px] max-w-full object-contain rounded-xs border border-[#2A3632]"
                  draggable={false}
                />
              </div>
            </div>
          )}

          {/* Panel 2 (or Full): Overlay Display */}
          <div className="relative flex flex-col items-center justify-center h-full">
            {isSideBySide && (
              <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-xs bg-[#17231F]/90 backdrop-blur-xs text-[10px] font-mono text-[#86A89B] border border-[#2A3632] flex items-center gap-1.5">
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
                className="max-h-[460px] max-w-full object-contain rounded-xs border border-[#2A3632]"
                draggable={false}
              />

              {/* Overlays Container (mapped proportionally over the fundus photo) */}
              {showOverlays && (
                <div
                  className="absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-150"
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
                    {/* Optic Disc Contour (Mineral Teal) */}
                    {showDisc && segmentation?.hasDisc && (
                      <g id="mask-disc">
                        <ellipse
                          cx="95"
                          cy="225"
                          rx="42"
                          ry="48"
                          fill="#86A89B"
                          fillOpacity="0.25"
                          stroke="#86A89B"
                          strokeWidth="2"
                          strokeDasharray="4 2"
                        />
                        <text x="82" y="230" fill="#86A89B" fontSize="10" fontFamily="monospace">
                          Disc
                        </text>
                      </g>
                    )}

                    {/* Lacquer Cracks Contours (Copper) */}
                    {showLacquerCracks && segmentation?.hasLacquerCracks && (
                      <g id="mask-lacquer-cracks">
                        <path
                          d="M 170 190 Q 210 215 250 205 T 310 230"
                          fill="none"
                          stroke="#B97854"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeOpacity="0.9"
                        />
                        <path
                          d="M 185 240 Q 220 235 270 255"
                          fill="none"
                          stroke="#B97854"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeOpacity="0.9"
                        />
                      </g>
                    )}

                    {/* Fuchs Spots Contour (Warm Rust/Coral) */}
                    {showFuchsSpots && segmentation?.hasFuchsSpots && (
                      <g id="mask-fuchs-spots">
                        <ellipse
                          cx="220"
                          cy="232"
                          rx="24"
                          ry="22"
                          fill="#D97757"
                          fillOpacity="0.35"
                          stroke="#D97757"
                          strokeWidth="2"
                        />
                        <text x="202" y="236" fill="#FFFFFF" fontSize="9" fontFamily="monospace">
                          Fuchs
                        </text>
                      </g>
                    )}

                    {/* Fovea Point Crosshair (White Reticle with Coordinates) */}
                    {showFovea && fovea && fovea.status === 'detected' && (
                      <g id="fovea-target" transform={`translate(${fovea.x}, ${fovea.y})`}>
                        <circle r="7" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="2 1" />
                        <line x1="-12" y1="0" x2="12" y2="0" stroke="#FFFFFF" strokeWidth="1.5" />
                        <line x1="0" y1="-12" x2="0" y2="12" stroke="#FFFFFF" strokeWidth="1.5" />
                        <circle r="2" fill="#86A89B" />
                        <text
                          x="10"
                          y="-8"
                          fill="#FFFFFF"
                          fontSize="9"
                          fontFamily="monospace"
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
      <div className="p-3 bg-[#F5F3ED] border-t border-[#DADBD3] text-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Layer Checkboxes */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono uppercase tracking-wider text-[10px] text-[#777B76] flex items-center gap-1">
            <Layers className="w-3 h-3 text-[#777B76]" /> Layers:
          </span>

          {/* Optic Disc */}
          <label className="flex items-center gap-1.5 cursor-pointer text-[#171A19] select-none text-[11px] font-mono">
            <input
              type="checkbox"
              checked={showDisc}
              onChange={(e) => setShowDisc(e.target.checked)}
              className="rounded-xs text-[#254E43] focus:ring-[#254E43] w-3 h-3"
            />
            <span className="w-2 h-2 rounded-full bg-[#86A89B] shrink-0" />
            <span>Optic Disc</span>
          </label>

          {/* Lacquer Cracks */}
          <label className="flex items-center gap-1.5 cursor-pointer text-[#171A19] select-none text-[11px] font-mono">
            <input
              type="checkbox"
              checked={showLacquerCracks}
              onChange={(e) => setShowLacquerCracks(e.target.checked)}
              className="rounded-xs text-[#254E43] focus:ring-[#254E43] w-3 h-3"
            />
            <span className="w-2 h-2 rounded-full bg-[#B97854] shrink-0" />
            <span>Lacquer Cracks</span>
          </label>

          {/* Fuchs Spots */}
          <label className="flex items-center gap-1.5 cursor-pointer text-[#171A19] select-none text-[11px] font-mono">
            <input
              type="checkbox"
              checked={showFuchsSpots}
              onChange={(e) => setShowFuchsSpots(e.target.checked)}
              className="rounded-xs text-[#254E43] focus:ring-[#254E43] w-3 h-3"
            />
            <span className="w-2 h-2 rounded-full bg-[#D97757] shrink-0" />
            <span>Fuchs Spots</span>
          </label>

          {/* Fovea Target */}
          {fovea && (
            <label className="flex items-center gap-1.5 cursor-pointer text-[#171A19] select-none text-[11px] font-mono">
              <input
                type="checkbox"
                checked={showFovea}
                onChange={(e) => setShowFovea(e.target.checked)}
                className="rounded-xs text-[#254E43] focus:ring-[#254E43] w-3 h-3"
              />
              <Crosshair className="w-3 h-3 text-[#254E43] shrink-0" />
              <span>Fovea Reticle</span>
            </label>
          )}

          {/* Grad-CAM Heatmap */}
          {explainability && (
            <label className="flex items-center gap-1.5 cursor-pointer text-[#171A19] select-none text-[11px] font-mono">
              <input
                type="checkbox"
                checked={showHeatmap}
                onChange={(e) => setShowHeatmap(e.target.checked)}
                className="rounded-xs text-[#254E43] focus:ring-[#254E43] w-3 h-3"
              />
              <span className="w-2 h-2 rounded-full bg-[#86A89B] shrink-0" />
              <span>Grad-CAM Activation</span>
            </label>
          )}
        </div>

        {/* Opacity Slider */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Sliders className="w-3 h-3 text-[#777B76]" />
          <span className="text-[10px] font-mono text-[#777B76] uppercase">Opacity:</span>
          <input
            type="range"
            min="10"
            max="100"
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            className="w-20 sm:w-24 accent-[#254E43] h-1 bg-[#DADBD3] rounded-xs cursor-pointer"
          />
          <span className="font-mono text-[10px] text-[#171A19] w-7">{opacity}%</span>
        </div>
      </div>
    </div>
  );
};
