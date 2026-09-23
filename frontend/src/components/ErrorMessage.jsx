import React from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

const ErrorMessage = ({ message, type = 'error', onClose }) => {
  if (!message) return null;

  const isError = type === 'error';

  return (
    <div
      className={`p-4 rounded-xl flex items-start gap-3 transition-all duration-200 border ${
        isError
          ? 'bg-rose-50 border-rose-200 text-rose-800'
          : 'bg-emerald-50 border-emerald-200 text-emerald-800'
      }`}
    >
      {isError ? (
        <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
      ) : (
        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
      )}
      <div className="flex-1 text-sm font-medium leading-relaxed">{message}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          aria-label="Dismiss message"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
