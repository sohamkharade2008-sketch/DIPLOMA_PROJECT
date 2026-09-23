import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { User, Mail, Calendar, UploadCloud, History, LogOut, ShieldCheck } from 'lucide-react';

const ProfilePage = () => {
  const { user, logout } = useAuth();

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Active Agronomist Member';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 font-display">
          User Account Profile
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your account credentials, preferences, and quick navigation shortcuts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Profile Overview */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center space-y-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-agro-600 to-agro-400 text-white font-extrabold text-2xl flex items-center justify-center mx-auto shadow-md shadow-agro-500/20">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 font-display">
              {user?.name}
            </h2>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs font-semibold text-agro-700 bg-agro-50 py-2 rounded-xl">
            <ShieldCheck className="w-4 h-4" />
            <span>Verified User</span>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>

        {/* Right Details & Shortcuts */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-display">
              Personal Information
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  Full Name
                </span>
                <span className="font-semibold text-slate-900">{user?.name}</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  Email Address
                </span>
                <span className="font-semibold text-slate-900">{user?.email}</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Member Since
                </span>
                <span className="font-semibold text-slate-900">{formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Action shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/upload"
              className="p-5 rounded-3xl bg-agro-600 hover:bg-agro-700 text-white shadow-md transition-all duration-200 flex items-center gap-4"
            >
              <div className="p-3 bg-white/20 rounded-2xl">
                <UploadCloud className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Upload Leaf</h4>
                <p className="text-xs text-agro-100">Run immediate AI scan</p>
              </div>
            </Link>

            <Link
              to="/history"
              className="p-5 rounded-3xl bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all duration-200 flex items-center gap-4"
            >
              <div className="p-3 bg-white/10 rounded-2xl">
                <History className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Scan Records</h4>
                <p className="text-xs text-slate-300">Browse saved history</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
