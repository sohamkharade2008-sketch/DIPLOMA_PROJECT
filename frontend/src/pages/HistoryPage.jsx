import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { predictionService } from '../services/predictionService';
import PredictionCard from '../components/PredictionCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { 
  Search, 
  Filter, 
  UploadCloud, 
  History as HistoryIcon, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

const HistoryPage = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlant, setSelectedPlant] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        limit: 9,
        plant: selectedPlant !== 'all' ? selectedPlant : undefined,
        status_filter: selectedStatus !== 'all' ? selectedStatus : undefined,
        search: searchTerm.trim() ? searchTerm.trim() : undefined,
        sort_order: sortOrder,
      };

      const res = await predictionService.getPredictions(params);
      setPredictions(res.items || []);
      setTotalPages(res.pages || 1);
      setTotalCount(res.total || 0);
    } catch (err) {
      console.error('Failed to load history:', err);
      setError('Could not retrieve prediction records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page, selectedPlant, selectedStatus, sortOrder]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchHistory();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this scan record?')) {
      return;
    }

    try {
      await predictionService.deletePrediction(id);
      // Remove from list or refresh
      setPredictions((prev) => prev.filter((p) => p.id !== id));
      setTotalCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to delete record.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-display">
            Diagnostic Scan Archive
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Browse, filter, and inspect previous crop foliage evaluations ({totalCount} total scans)
          </p>
        </div>

        <Link
          to="/upload"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-agro-600 hover:bg-agro-700 text-white font-bold text-sm shadow-sm transition-colors self-start sm:self-auto"
        >
          <UploadCloud className="w-4 h-4" />
          <span>New Leaf Scan</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by crop, disease name, or keyword..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-agro-500 focus:bg-white transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Plant Dropdown */}
            <select
              value={selectedPlant}
              onChange={(e) => {
                setSelectedPlant(e.target.value);
                setPage(1);
              }}
              className="px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-agro-500"
            >
              <option value="all">All Crops</option>
              <option value="Onion">Onion</option>
              <option value="Cauliflower">Cauliflower</option>
              <option value="Chrysanthemum">Chrysanthemum</option>
              <option value="Cucumber">Cucumber</option>
              <option value="Tomato">Tomato</option>
            </select>

            {/* Status Dropdown */}
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(1);
              }}
              className="px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-agro-500"
            >
              <option value="all">All Conditions</option>
              <option value="Healthy">Healthy Only</option>
              <option value="Diseased">Diseased Only</option>
            </select>

            {/* Sort Toggle */}
            <button
              type="button"
              onClick={() => {
                setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
                setPage(1);
              }}
              className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-sm font-semibold text-slate-700 transition-colors"
            >
              <ArrowUpDown className="w-4 h-4 text-slate-500" />
              <span>{sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
            </button>

            <button
              type="submit"
              className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

      {/* Grid or Empty */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner message="Fetching archived scans..." />
        </div>
      ) : predictions.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {predictions.map((pred) => (
              <PredictionCard
                key={pred.id}
                prediction={pred}
                showDelete={true}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-6">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-semibold text-slate-700">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <HistoryIcon className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800 font-display">
              No matching records found
            </h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Try adjusting your filter or search criteria, or upload a new leaf image to evaluate.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
