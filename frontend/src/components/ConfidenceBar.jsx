import React from 'react';

const ConfidenceBar = ({ confidence = 0, category = 'High Confidence', status = 'Diseased' }) => {
  const isHealthy = status.toLowerCase() === 'healthy';

  // Determine progress bar gradient and text color based on confidence level
  let barColor = 'from-agro-500 to-agro-600';
  let badgeColor = 'bg-agro-100 text-agro-800 border-agro-200';

  if (!isHealthy) {
    if (confidence >= 80) {
      barColor = 'from-amber-500 to-rose-600';
      badgeColor = 'bg-rose-100 text-rose-800 border-rose-200';
    } else if (confidence >= 50) {
      barColor = 'from-amber-400 to-amber-500';
      badgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
    } else {
      barColor = 'from-slate-400 to-slate-500';
      badgeColor = 'bg-slate-100 text-slate-700 border-slate-200';
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-slate-700">AI Confidence Score</span>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${badgeColor}`}>
            {category}
          </span>
          <span className="font-mono font-bold text-slate-900 text-base">
            {confidence}%
          </span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden p-0.5 border border-slate-200/80 shadow-inner">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-1000 ease-out shadow-sm`}
          style={{ width: `${Math.min(100, Math.max(5, confidence))}%` }}
        />
      </div>
    </div>
  );
};

export default ConfidenceBar;
