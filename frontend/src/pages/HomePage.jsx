import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Leaf, 
  UploadCloud, 
  ShieldCheck, 
  Zap, 
  Database, 
  ArrowRight, 
  CheckCircle2, 
  Scan, 
  Search, 
  Award,
  Sparkles
} from 'lucide-react';

const HomePage = () => {
  const supportedCrops = [
    { name: 'Tomato', diseases: 'Early Blight, Late Blight, Healthy', image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=400&q=80' },
    { name: 'Potato', diseases: 'Early Blight, Late Blight, Healthy', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80' },
    { name: 'Corn (Maize)', diseases: 'Common Rust, Healthy Foliage', image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=400&q=80' },
    { name: 'Apple', diseases: 'Apple Scab, Black Rot, Healthy', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=80' },
    { name: 'Grape', diseases: 'Black Rot, Leaf Spot, Healthy', image: 'https://images.unsplash.com/photo-1596363505729-4190a9506133?auto=format&fit=crop&w=400&q=80' },
  ];

  const features = [
    {
      icon: Scan,
      title: 'Instant Deep Learning Analysis',
      description: 'Upload a leaf photo and receive immediate morphological disease classification powered by convolutional neural networks.',
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      icon: ShieldCheck,
      title: 'Confidence-Aware Diagnostics',
      description: 'Our system validates prediction certainty using calibrated confidence thresholds to prevent false diagnostic assertions.',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: Database,
      title: 'Persistent Scan History',
      description: 'Securely archive past diagnoses with MongoDB, track crop health over seasonal cycles, and export or delete scans anytime.',
      color: 'bg-amber-50 text-amber-600',
    },
    {
      icon: Zap,
      title: 'Actionable Prevention Advice',
      description: 'Review symptoms, disease progression vectors, and agronomic management guidelines tailored to each detected condition.',
      color: 'bg-purple-50 text-purple-600',
    }
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="hero-mesh relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-agro-100 border border-agro-200 text-agro-800 text-xs font-bold tracking-wide uppercase shadow-sm">
                <Sparkles className="w-4 h-4 text-agro-600" />
                <span>AI-Powered Agriculture Diagnostic Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Protect Your Crops With <span className="text-transparent bg-clip-text bg-gradient-to-r from-agro-600 to-emerald-500">AgroScan AI</span>
              </h1>

              <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                Empower your farming and agronomy research with fast, reliable plant leaf disease diagnosis. Snap a picture of any diseased or healthy foliage to get instant AI analysis, confidence metrics, and actionable prevention steps.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  to="/upload"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-agro-600 to-agro-500 hover:from-agro-700 hover:to-agro-600 text-white font-bold text-base shadow-lg shadow-agro-600/25 hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
                >
                  <UploadCloud className="w-5 h-5" />
                  <span>Upload Leaf Image</span>
                </Link>

                <Link
                  to="/diseases"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-base shadow-sm transition-all"
                >
                  <Search className="w-4 h-4 text-slate-400" />
                  <span>Browse Disease Library</span>
                </Link>
              </div>

              {/* Trust Metrics */}
              <div className="pt-8 border-t border-slate-200/80 flex items-center justify-center lg:justify-start gap-8 text-slate-600 text-xs sm:text-sm font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-agro-600" />
                  <span>10+ Disease Classes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-agro-600" />
                  <span>Instant Results</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-agro-600" />
                  <span>MongoDB History</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Preview Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200/80 rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="absolute -top-3 -right-3 px-3 py-1 rounded-full bg-agro-600 text-white text-xs font-bold shadow-md">
                  Live Scanner
                </div>

                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 relative mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80"
                    alt="Tomato leaf analysis demonstration"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-agro-400">
                      Sample Analysis
                    </span>
                    <h4 className="text-lg font-bold">Tomato: Early Blight</h4>
                  </div>
                </div>

                {/* Score and Bar */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-slate-700">Diagnosis Confidence</span>
                    <span className="font-mono font-bold text-agro-700 text-base">94.2%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200">
                    <div className="bg-gradient-to-r from-amber-500 to-rose-600 h-full rounded-full w-[94.2%]" />
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed pt-1">
                    Concentric ring spots identified on foliage. Immediate isolation and basal watering recommended.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-agro-700 bg-agro-50 px-3 py-1 rounded-full border border-agro-200">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
            How AgroScan AI Operates
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            From field photo to comprehensive agronomic diagnosis in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {[
            {
              step: '01',
              title: 'Upload Foliage Photo',
              desc: 'Capture or drag-and-drop a close-up photo of the suspected plant leaf in JPG, PNG, or WEBP format.',
            },
            {
              step: '02',
              title: 'CNN Model Processing',
              desc: 'Deep learning vision networks inspect texture patterns, chlorosis contours, and fungal lesion morphology.',
            },
            {
              step: '03',
              title: 'Instant Diagnosis & Guidance',
              desc: 'Get calibrated confidence scores, health status, symptom breakdowns, and recommended preventive actions.',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm relative group hover:shadow-card-hover transition-all duration-300"
            >
              <div className="text-4xl font-extrabold text-agro-100 group-hover:text-agro-200 transition-colors font-mono mb-4">
                {item.step}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 font-display">
                {item.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 sm:p-14 text-white relative overflow-hidden shadow-xl">
          <div className="max-w-2xl mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-agro-400 bg-agro-950/80 px-3 py-1 rounded-full border border-agro-500/30">
              Built for Practical Agriculture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display">
              Advanced Capabilities Designed For Reliability
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 border border-slate-700/60 hover:border-slate-600 transition-colors space-y-3"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${feat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white font-display">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Supported Plants Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-agro-700 bg-agro-50 px-3 py-1 rounded-full border border-agro-200">
              Coverage
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 font-display mt-2">
              Supported Crops & Pathology Catalog
            </h2>
          </div>

          <Link
            to="/diseases"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-agro-700 hover:text-agro-800"
          >
            <span>View Full Disease Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {supportedCrops.map((crop, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-card-hover transition-all duration-300 group"
            >
              <div className="h-44 bg-slate-900 overflow-hidden">
                <img
                  src={crop.image}
                  alt={crop.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 space-y-2">
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  {crop.name}
                </h3>
                <p className="text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Conditions:</span> {crop.diseases}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-agro-700 via-agro-600 to-emerald-600 rounded-3xl p-8 sm:p-12 text-center text-white shadow-xl shadow-agro-700/20 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display max-w-2xl mx-auto">
            Ready to Analyze Your Crop Leaf Health?
          </h2>
          <p className="text-agro-100 text-sm sm:text-base max-w-xl mx-auto">
            Upload your first photo today and explore instant diagnostics with full symptoms and preventative management guides.
          </p>
          <div>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-agro-800 hover:bg-agro-50 font-bold text-base shadow-lg hover:scale-105 transition-all duration-200"
            >
              <UploadCloud className="w-5 h-5 text-agro-700" />
              <span>Scan Your Plant Now</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
