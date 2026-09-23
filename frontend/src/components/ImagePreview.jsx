import React from 'react';
import { X, RefreshCw, Sparkles, FileText } from 'lucide-react';

const ImagePreview = ({ previewUrl, file, onRemove, onAnalyze, isAnalyzing, uploadProgress }) => {
  if (!previewUrl) return null;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-agro-50 text-agro-700">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 max-w-[200px] sm:max-w-xs truncate">
              {file?.name || 'Selected Leaf Image'}
            </h4>
            <p className="text-xs text-slate-400">
              {file?.size ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : ''} • {file?.type?.split('/')[1]?.toUpperCase()}
            </p>
          </div>
        </div>

        {!isAnalyzing && (
          <button
            onClick={onRemove}
            className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Remove</span>
          </button>
        )}
      </div>

      {/* Image Display Frame with scanning animation when analyzing */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video sm:aspect-[4/3] max-h-[380px] flex items-center justify-center group shadow-inner">
        <img
          src={previewUrl}
          alt="Leaf preview"
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
        />

        {/* AI Scanning Visual Overlay */}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 space-y-4">
            {/* Laser Line */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-agro-400 to-transparent shadow-[0_0_15px_#4ade80] scan-pulse top-1/4" />

            <div className="w-14 h-14 rounded-2xl bg-agro-500/20 border border-agro-400/40 flex items-center justify-center text-agro-300 animate-spin">
              <RefreshCw className="w-7 h-7" />
            </div>

            <div className="text-center space-y-2 max-w-xs">
              <p className="text-white font-display font-semibold text-base">
                Analyzing Leaf Morphology...
              </p>
              <p className="text-xs text-slate-300">
                Detecting lesion contours, color spectrums, and pathogen patterns
              </p>
              
              {/* Progress bar */}
              <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden mt-3">
                <div
                  className="bg-agro-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress || 60}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          onClick={onRemove}
          disabled={isAnalyzing}
          className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          Choose Different Image
        </button>

        <button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className="w-full sm:flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-agro-600 to-agro-500 hover:from-agro-700 hover:to-agro-600 text-white font-bold text-sm shadow-md shadow-agro-600/20 hover:shadow-lg transition-all duration-200 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 text-agro-200" />
          <span>{isAnalyzing ? 'Diagnosing...' : 'Start AI Disease Analysis'}</span>
        </button>
      </div>
    </div>
  );
};

export default ImagePreview;
