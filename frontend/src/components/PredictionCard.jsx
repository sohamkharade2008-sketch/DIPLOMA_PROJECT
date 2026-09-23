import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  ArrowRight, 
  Trash2, 
  ShieldCheck, 
  Layers 
} from 'lucide-react';

const PredictionCard = ({ prediction, onDelete, showDelete = false }) => {
  if (!prediction) return null;

  const isHealthy = prediction.status?.toLowerCase() === 'healthy';
  const formattedDate = prediction.createdAt
    ? new Date(prediction.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Recent';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-card-hover transition-all duration-300 overflow-hidden flex flex-col group">
      {/* Thumbnail Header */}
      <div className="relative aspect-video sm:aspect-[16/10] bg-slate-900 overflow-hidden">
        <img
          src={prediction.imageUrl || '/placeholder-leaf.jpg'}
          alt={`${prediction.plant} ${prediction.disease}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Demo Mode Badge */}
        {prediction.isDemoPrediction && (
          <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/90 text-white backdrop-blur-sm border border-amber-400/40 shadow-sm">
            Demo Prediction
          </div>
        )}

        {/* Status Pill */}
        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-md backdrop-blur-md ${
              isHealthy
                ? 'bg-emerald-600/90 text-white border border-emerald-400/30'
                : 'bg-rose-600/90 text-white border border-rose-400/30'
            }`}
          >
            {isHealthy ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5" />
            )}
            <span>{prediction.status}</span>
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-medium">
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              {prediction.plant}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {formattedDate}
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 group-hover:text-agro-700 transition-colors">
            {prediction.disease}
          </h3>

          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {prediction.description || 'Diagnosis and morphological analysis report.'}
          </p>
        </div>

        {/* Confidence & Actions Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block">
              Confidence
            </span>
            <span className="text-sm font-bold text-slate-800">
              {prediction.confidence}%
            </span>
          </div>

          <div className="flex items-center gap-2">
            {showDelete && onDelete && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(prediction.id);
                }}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                title="Delete scan"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <Link
              to={`/prediction/${prediction.id}`}
              className="flex items-center gap-1 text-xs font-bold text-agro-700 hover:text-agro-800 bg-agro-50 hover:bg-agro-100 px-3 py-2 rounded-xl transition-colors"
            >
              <span>View Report</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionCard;
