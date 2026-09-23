import React from 'react';
import { ShieldCheck, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

const DiseaseCard = ({ disease }) => {
  if (!disease) return null;

  const isHealthy = disease.status?.toLowerCase() === 'healthy';

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200 inline-block mb-2">
              {disease.plant}
            </span>
            <h3 className="text-xl font-bold text-slate-900 font-display">
              {disease.disease}
            </h3>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${
              isHealthy
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {isHealthy ? 'Healthy Class' : `${disease.severity || 'Moderate'} Severity`}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 leading-relaxed">
          {disease.description}
        </p>

        {/* Symptoms Section */}
        {disease.symptoms && disease.symptoms.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Key Diagnostic Symptoms
            </h4>
            <ul className="space-y-1.5">
              {disease.symptoms.slice(0, 3).map((sym, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-agro-500 mt-1.5 shrink-0" />
                  <span>{sym}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Prevention Section */}
        {disease.prevention && disease.prevention.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Management & Prevention
            </h4>
            <ul className="space-y-1.5">
              {disease.prevention.slice(0, 2).map((prev, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-agro-600 shrink-0 mt-0.5" />
                  <span>{prev}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400 italic">
        {disease.generalInformation || 'Standard agronomic classification reference.'}
      </div>
    </div>
  );
};

export default DiseaseCard;
