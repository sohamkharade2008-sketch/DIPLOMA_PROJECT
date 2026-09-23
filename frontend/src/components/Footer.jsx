import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ShieldAlert, Cpu, HeartHandshake } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-agro-500 flex items-center justify-center text-slate-950 font-bold">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-extrabold text-xl text-white tracking-tight">
                AgroScan AI
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Empowering farmers, agronomists, and agricultural researchers with instant, high-precision plant leaf disease diagnostics through advanced computer vision.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-agro-400" /> Fast Deep Learning
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <HeartHandshake className="w-3.5 h-3.5 text-agro-400" /> Crop Health First
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3 font-display">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-agro-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/upload" className="hover:text-agro-400 transition-colors">Scan Leaf Image</Link>
              </li>
              <li>
                <Link to="/diseases" className="hover:text-agro-400 transition-colors">Disease Encyclopedia</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-agro-400 transition-colors">User Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Supported Crops */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3 font-display">Supported Crops</h3>
            <div className="flex flex-wrap gap-1.5">
              {['Tomato', 'Potato', 'Corn', 'Apple', 'Grape', 'Bell Pepper', 'Strawberry'].map((crop) => (
                <span
                  key={crop}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700/60"
                >
                  {crop}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Disclaimer Warning Card */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <div className="bg-slate-950/60 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong className="text-amber-300 font-semibold">Agricultural Disclaimer:</strong> This system provides an AI-based visual estimate and should not be considered a definitive agricultural diagnosis. Consult a qualified agricultural professional or extension officer for confirmation and chemical treatment advice.
            </p>
          </div>
          
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} AgroScan AI. Final Year Capstone Project.</p>
            <p>Built with React, Vite, FastAPI, and Deep Learning.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
