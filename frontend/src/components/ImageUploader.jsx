import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, AlertCircle } from 'lucide-react';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE_MB = 10;
const MAX_BYTES = MAX_SIZE_MB * 1024 * 1024;

const ImageUploader = ({ onImageSelected, onError }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateAndProcessFile = (file) => {
    if (!file) return;

    // Check MIME type
    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      const err = `Invalid file format (${file.type || 'unknown'}). Please upload a JPG, PNG, or WEBP image.`;
      if (onError) onError(err);
      return;
    }

    // Check File Size
    if (file.size > MAX_BYTES) {
      const err = `File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the maximum allowed ${MAX_SIZE_MB} MB limit.`;
      if (onError) onError(err);
      return;
    }

    // Create local object URL for preview
    const previewUrl = URL.createObjectURL(file);
    if (onImageSelected) {
      onImageSelected(file, previewUrl);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => fileInputRef.current && fileInputRef.current.click()}
      className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 group ${
        isDragging
          ? 'border-agro-500 bg-agro-50/70 scale-[1.01] shadow-soft-glow'
          : 'border-slate-300 hover:border-agro-400 bg-white/80 hover:bg-agro-50/30 shadow-sm'
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
      />

      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-agro-100 text-agro-700 flex items-center justify-center group-hover:scale-110 group-hover:bg-agro-200 transition-all duration-300 shadow-sm">
          <UploadCloud className="w-8 h-8" />
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-800 group-hover:text-agro-700 transition-colors">
            Drop your leaf image here, or <span className="text-agro-600 underline underline-offset-4">browse</span>
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            High-resolution close-up photo of infected or healthy foliage
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-medium text-slate-400">
          <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600">
            JPG, PNG, WEBP
          </span>
          <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600">
            Max 10 MB
          </span>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
