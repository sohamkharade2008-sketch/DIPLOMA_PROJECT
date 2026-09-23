import React, { useEffect, useState } from 'react';
import { diseaseService } from '../services/diseaseService';
import DiseaseCard from '../components/DiseaseCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { BookOpen, Search, Filter, Sparkles } from 'lucide-react';

const DiseasesPage = () => {
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('all');

  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        setLoading(true);
        const data = await diseaseService.getDiseases(selectedCrop !== 'all' ? selectedCrop : undefined);
        setDiseases(data);
      } catch (err) {
        console.error('Failed to load diseases:', err);
        setError('Could not load disease encyclopedia.');
      } finally {
        setLoading(false);
      }
    };

    fetchDiseases();
  }, [selectedCrop]);

  const filteredDiseases = diseases.filter((d) => {
    const term = searchTerm.toLowerCase();
    return (
      d.plant?.toLowerCase().includes(term) ||
      d.disease?.toLowerCase().includes(term) ||
      d.description?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-agro-50 border border-agro-200 text-agro-800 text-xs font-bold uppercase tracking-wide">
          <BookOpen className="w-3.5 h-3.5 text-agro-600" />
          <span>Pathology Encyclopedia</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
          Crop Disease Knowledge Base
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Comprehensive reference guides on common plant leaf pathogens, distinguishing symptom morphology, and preventive agricultural practices.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search symptoms, pathogens, or crops..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-agro-500 focus:bg-white transition-all"
          />
        </div>

        <select
          value={selectedCrop}
          onChange={(e) => setSelectedCrop(e.target.value)}
          className="px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-agro-500"
        >
          <option value="all">All Crops</option>
          <option value="Tomato">Tomato</option>
          <option value="Potato">Potato</option>
          <option value="Corn">Corn (Maize)</option>
          <option value="Apple">Apple</option>
          <option value="Grape">Grape</option>
        </select>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

      {/* Disease Cards Grid */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner message="Loading disease catalog..." />
        </div>
      ) : filteredDiseases.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDiseases.map((d) => (
            <DiseaseCard key={d.id} disease={d} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-2">
          <h3 className="text-lg font-bold text-slate-800 font-display">
            No disease profiles matched your search
          </h3>
          <p className="text-sm text-slate-500">
            Try adjusting your query or resetting the crop filter.
          </p>
        </div>
      )}
    </div>
  );
};

export default DiseasesPage;
