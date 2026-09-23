import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = 'Processing...', size = 'default' }) => {
  const sizeClasses = {
    small: 'w-5 h-5 border-2',
    default: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-3">
      <div className="relative flex items-center justify-center">
        <Loader2 className={`animate-spin text-agro-600 ${sizeClasses[size] || sizeClasses.default}`} />
      </div>
      {message && (
        <p className="text-sm font-medium text-slate-600 animate-pulse text-center">
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
