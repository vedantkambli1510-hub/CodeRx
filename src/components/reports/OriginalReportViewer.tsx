"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  Minimize2,
  Download,
  Eye,
  EyeOff,
  Layers,
  FileText,
  AlertCircle,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { SourceDocumentFile, VisualAnnotation } from "@/lib/types/report-analysis";

interface OriginalReportViewerProps {
  sourceFiles: SourceDocumentFile[];
  visualAnnotations?: VisualAnnotation[];
  selectedAnnotationId?: string | null;
  onSelectAnnotation?: (id: string | null) => void;
  isDemoReport?: boolean;
}

export function OriginalReportViewer({
  sourceFiles,
  visualAnnotations = [],
  selectedAnnotationId,
  onSelectAnnotation,
  isDemoReport = false,
}: OriginalReportViewerProps) {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAnnotations, setShowAnnotations] = useState(true);

  const activeFile = sourceFiles[activeFileIndex] || sourceFiles[0];

  function handleZoomIn() {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  }

  function handleZoomOut() {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  }

  function handleResetZoom() {
    setZoomLevel(1);
    setRotation(0);
  }

  function handleRotate() {
    setRotation((prev) => (prev + 90) % 360);
  }

  function handleDownload() {
    if (!activeFile) return;
    const a = document.createElement("a");
    a.href = activeFile.url;
    a.download = activeFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <div
      className={`flex flex-col bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden text-slate-100 transition-all ${
        isFullscreen ? "fixed inset-4 z-50 shadow-2xl flex" : "h-full"
      }`}
    >
      {/* Top Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-950/80 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-sky-400" />
          <span className="font-semibold text-slate-200">Original Document</span>
          {isDemoReport && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Demo Report
            </span>
          )}
          <span className="text-slate-500">|</span>
          <span className="text-slate-400 truncate max-w-[180px] sm:max-w-xs">
            {activeFile?.name || "Medical Document"}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Annotation Layer Toggle */}
          {visualAnnotations.length > 0 && (
            <button
              onClick={() => setShowAnnotations(!showAnnotations)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                showAnnotations
                  ? "bg-sky-500/20 text-sky-300 border-sky-500/40"
                  : "bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200"
              }`}
              title="Toggle AI visual highlights on image"
            >
              {showAnnotations ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">AI Overlays</span>
            </button>
          )}

          {/* Zoom Controls */}
          <div className="flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700/80">
            <button
              onClick={handleZoomOut}
              className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span
              onClick={handleResetZoom}
              className="px-2 font-mono text-[11px] text-slate-300 cursor-pointer hover:text-white"
              title="Click to reset zoom"
            >
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Rotate */}
          <button
            onClick={handleRotate}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 text-slate-300 hover:text-white"
            title="Rotate 90 degrees"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          {/* Download Original */}
          <button
            onClick={handleDownload}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 text-slate-300 hover:text-white"
            title="Download original uploaded file"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 text-slate-300 hover:text-white"
            title={isFullscreen ? "Exit fullscreen" : "View fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Viewer Area */}
      <div className="flex-1 relative overflow-auto bg-slate-950 flex items-center justify-center p-4 min-h-[380px] max-h-[680px]">
        {activeFile?.isImage || activeFile?.type?.startsWith("image/") || activeFile?.url?.match(/\.(png|jpe?g|webp)$/i) ? (
          <div
            className="relative transition-transform duration-150 ease-out select-none"
            style={{
              transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
              transformOrigin: "center center",
            }}
          >
            {/* The Original Uploaded Image */}
            <img
              src={activeFile.url}
              alt={activeFile.name}
              className="max-w-full max-h-[580px] object-contain rounded-lg shadow-2xl border border-slate-800/80 pointer-events-none"
            />

            {/* AI Findings Interactive Overlay Layer (Section 15) */}
            {showAnnotations &&
              visualAnnotations.map((anno) => {
                const isSelected = selectedAnnotationId === anno.id;
                // Colors per Section 15: yellow = review, blue = informational, orange = important review (no red)
                const borderClass =
                  anno.priority === "Important Review"
                    ? "border-amber-500 bg-amber-500/20 text-amber-200 shadow-amber-500/30"
                    : anno.priority === "Review"
                    ? "border-yellow-400 bg-yellow-400/20 text-yellow-100 shadow-yellow-400/30"
                    : "border-sky-400 bg-sky-400/20 text-sky-100 shadow-sky-400/30";

                return (
                  <div
                    key={anno.id}
                    onClick={() => onSelectAnnotation?.(isSelected ? null : anno.id)}
                    className={`absolute cursor-pointer rounded-lg border-2 transition-all group ${borderClass} ${
                      isSelected ? "ring-4 ring-white shadow-xl scale-[1.02] z-30" : "hover:border-white z-10"
                    }`}
                    style={{
                      left: `${anno.coordinates.x}%`,
                      top: `${anno.coordinates.y}%`,
                      width: `${anno.coordinates.width}%`,
                      height: `${anno.coordinates.height}%`,
                    }}
                    title={`${anno.label} (Click to inspect evidence)`}
                  >
                    <div className="absolute -top-6 left-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-900/90 text-white border border-slate-700 whitespace-nowrap shadow-md flex items-center gap-1 group-hover:scale-105 transition-transform pointer-events-none">
                      <Sparkles className="w-2.5 h-2.5 text-sky-400" />
                      <span>{anno.label}</span>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          /* PDF / Document Fallback View */
          <div className="flex flex-col items-center justify-center text-center p-8 max-w-md space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">{activeFile?.name}</h4>
              <p className="text-xs text-slate-400 mt-1">
                Clinical document uploaded as PDF ({Math.round((activeFile?.size || 0) / 1024)} KB)
              </p>
            </div>
            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-300 text-left space-y-2 w-full">
              <div className="font-semibold text-sky-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Document Text Extracted by OCR:</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                Extracted biometric parameters, reference intervals, and clinical impressions are indexed in the
                adjacent AI Analysis panel.
              </p>
            </div>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-lg shadow-sky-600/30 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Original PDF</span>
            </button>
          </div>
        )}
      </div>

      {/* Multi-File Thumbnails Footer (Section 4) */}
      {sourceFiles.length > 1 && (
        <div className="flex items-center gap-2 p-2 bg-slate-950/90 border-t border-slate-800 overflow-x-auto">
          {sourceFiles.map((file, idx) => (
            <button
              key={file.id}
              onClick={() => {
                setActiveFileIndex(idx);
                setZoomLevel(1);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium whitespace-nowrap transition-colors ${
                activeFileIndex === idx
                  ? "bg-sky-500/20 text-sky-300 border-sky-500/40"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{file.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Preservation & Clinical Disclaimer Notice (Section 4 & 5) */}
      <div className="px-4 py-2 bg-slate-950 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
          <span>Original document integrity preserved. Never modified by AI.</span>
        </div>
        {visualAnnotations.length > 0 && (
          <span className="text-slate-500 hidden sm:inline">
            Click highlights on image to view supporting model findings
          </span>
        )}
      </div>
    </div>
  );
}
