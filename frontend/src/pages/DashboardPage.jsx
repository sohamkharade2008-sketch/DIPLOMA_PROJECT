import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { predictionService } from '../services/predictionService';
import PredictionCard from '../components/PredictionCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { 
  Scan, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  UploadCloud, 
  History, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await predictionService.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load dashboard statistics:', err);
        setError('Could not retrieve recent scan statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner message="Calculating crop diagnostics summary..." />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Foliage Scans',
      value: stats?.totalScans || 0,
      icon: Scan,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
    },
    {
      title: 'Healthy Plant Scans',
      value: stats?.healthyCount || 0,
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
    {
      title: 'Diseased Plant Scans',
      value: stats?.diseasedCount || 0,
      icon: AlertTriangle,
      color: 'bg-rose-50 text-rose-600 border-rose-200',
    },
    {
      title: 'Average AI Confidence',
      value: `${stats?.averageConfidence || 0}%`,
      icon: Activity,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-8 sm:p-10 shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="text-xs uppercase font-bold tracking-widest text-agro-400">
            Agronomist Workspace
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-display">
            Welcome, {user?.name || 'Researcher'}!
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
            Monitor plant diagnostics, track crop disease trends over time, and inspect high-confidence morphological reports.
          </p>
        </div>

        <Link
          to="/upload"
          className="relative z-10 inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-agro-600 to-agro-500 hover:from-agro-700 hover:to-agro-600 text-white font-bold text-sm shadow-md hover:scale-105 transition-all duration-200 shrink-0"
        >
          <UploadCloud className="w-5 h-5" />
          <span>Upload New Leaf</span>
        </Link>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-card-hover transition-all duration-300 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`p-2.5 rounded-xl border ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 font-display">
                {card.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Scans Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900 font-display">
              Recent Leaf Diagnoses
            </h2>
            <p className="text-xs text-slate-500">
              The latest foliage images scanned by your account
            </p>
          </div>

          <Link
            to="/history"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-agro-700 hover:text-agro-800"
          >
            <span>View All History</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {stats?.recentPredictions && stats.recentPredictions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.recentPredictions.map((pred) => (
              <PredictionCard key={pred.id} prediction={pred} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <History className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-800 font-display">
                No Scan History Yet
              </h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                Upload your first plant leaf photo to generate diagnostic records and unlock dashboard statistics.
              </p>
            </div>
            <div>
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-agro-600 text-white font-bold text-sm hover:bg-agro-700 transition-colors shadow-sm"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Scan Your First Leaf</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
