import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { predictionService } from '../services/predictionService';
import ConfidenceBar from '../components/ConfidenceBar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Leaf, 
  ShieldAlert, 
  ArrowLeft, 
  UploadCloud, 
  Sparkles, 
  Info,
  Check,
  Tag,
  Share2
} from 'lucide-react';

const PredictionDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [prediction, setPrediction] = useState(location.state?.predictionData || null);
  const [loading, setLoading] = useState(!location.state?.predictionData);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!prediction && id) {
      const fetchPrediction = async () => {
        try {
          setLoading(true);
          const data = await predictionService.getPredictionById(id);
          setPrediction(data);
        } catch (err) {
          setError(err.response?.data?.detail || 'Failed to retrieve prediction report.');
        } finally {
          setLoading(false);
        }
      };
      fetchPrediction();
    }
  }, [id, prediction]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner message="Loading diagnostic analysis report..." />
      </div>
    );
  }

  if (error || !prediction) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <ErrorMessage message={error || 'Diagnostic record not found.'} />
        <Link
          to="/upload"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-agro-600 text-white font-semibold text-sm hover:bg-agro-700 transition-colors"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Scan Another Leaf</span>
        </Link>
      </div>
    );
  }

  const isHealthy = prediction.status?.toLowerCase() === 'healthy';
  const formattedDate = prediction.createdAt
    ? new Date(prediction.createdAt).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'Recently Generated';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back navigation & Share */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Scans</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Link Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Share Diagnosis</span>
              </>
            )}
          </button>

          <Link
            to="/upload"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-agro-600 hover:bg-agro-700 text-white text-xs font-bold transition-colors shadow-sm"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>New Scan</span>
          </Link>
        </div>
      </div>

      {/* Main Report Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-950 shadow-inner">
              <img
                src={prediction.imageUrl}
                alt={`${prediction.plant} ${prediction.disease}`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80';
                }}
              />

              {prediction.isDemoPrediction && (
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-md">
                  Demo Simulation
                </div>
              )}
            </div>

            {/* Quick Metadata */}
            <div className="p-2 space-y-2 text-xs text-slate-500">
              <div className="flex items-center justify-between">
                <span>Model Engine</span>
                <span className="font-semibold text-slate-800">{prediction.modelVersion || 'AI Model'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Analysis Timestamp</span>
                <span className="font-semibold text-slate-800">{formattedDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Diagnosis & Recommendations */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Diagnosis Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-md border border-slate-200 inline-block mb-2">
                  Target Crop: {prediction.plant}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                  {prediction.disease}
                </h1>
              </div>

              <span
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border shadow-sm ${
                  isHealthy
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                {isHealthy ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                )}
                <span>{prediction.status}</span>
              </span>
            </div>

            {/* Confidence Bar */}
            <div className="pt-2">
              <ConfidenceBar
                confidence={prediction.confidence}
                category={prediction.confidenceCategory}
                status={prediction.status}
              />
              <p className="text-xs text-slate-500 mt-2 italic">
                {prediction.confidenceLabel}
              </p>
            </div>

            {/* Overview / Description */}
            {prediction.description && (
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Condition Overview
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {prediction.description}
                </p>
              </div>
            )}

            {/* Symptoms */}
            {prediction.symptoms && prediction.symptoms.length > 0 && (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Visible Symptoms Checklist
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {prediction.symptoms.map((symptom, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-700"
                    >
                      <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <span>{symptom}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prevention & Management */}
            {prediction.prevention && prediction.prevention.length > 0 && (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Recommended Agronomic Next Steps
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {prediction.prevention.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs sm:text-sm text-slate-800"
                    >
                      <CheckCircle2 className="w-4 h-4 text-agro-600 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mandatory Agricultural Disclaimer */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-3xl p-5 flex items-start gap-3 shadow-sm">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                Important Agronomic Disclaimer
              </h4>
              <p className="text-xs text-amber-800 leading-relaxed">
                {prediction.disclaimer ||
                  'This system provides an AI-based visual estimate and should not be considered a definitive agricultural diagnosis. Consult a qualified agricultural professional for confirmation and treatment advice.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionDetailPage;
