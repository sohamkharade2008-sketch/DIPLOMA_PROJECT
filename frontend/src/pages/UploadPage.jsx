import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { predictionService } from '../services/predictionService';
import ImageUploader from '../components/ImageUploader';
import ImagePreview from '../components/ImagePreview';
import ErrorMessage from '../components/ErrorMessage';
import { Leaf, Info, Sparkles, CheckCircle2 } from 'lucide-react';

const UploadPage = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleImageSelected = (file, url) => {
    setSelectedFile(file);
    setPreviewUrl(url);
    setErrorMessage(null);
  };

  const handleRemoveImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadProgress(0);
    setErrorMessage(null);
  };

  const handleStartAnalysis = async () => {
    if (!selectedFile) {
      setErrorMessage('Please select a leaf photo first.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);
    setUploadProgress(10);

    try {
      const result = await predictionService.predictImage(selectedFile, (progress) => {
        setUploadProgress(Math.min(90, progress));
      });

      setUploadProgress(100);
      // Short delay for visual completion
      setTimeout(() => {
        navigate(`/prediction/${result.id}`, { state: { predictionData: result } });
      }, 500);
    } catch (err) {
      console.error('Diagnosis failed:', err);
      const msg =
        err.response?.data?.detail ||
        'Failed to process leaf image. Please ensure the backend server is active and try again.';
      setErrorMessage(msg);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-agro-50 border border-agro-200 text-agro-800 text-xs font-bold uppercase tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-agro-600" />
          <span>Diagnostic Scanner</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
          Scan & Diagnose Plant Leaf
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto">
          Upload a clear photograph of a crop leaf showing disease symptoms or healthy growth.
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <ErrorMessage message={errorMessage} onClose={() => setErrorMessage(null)} />
      )}

      {/* Upload Box / Preview Box */}
      {!previewUrl ? (
        <ImageUploader
          onImageSelected={handleImageSelected}
          onError={(err) => setErrorMessage(err)}
        />
      ) : (
        <ImagePreview
          file={selectedFile}
          previewUrl={previewUrl}
          onRemove={handleRemoveImage}
          onAnalyze={handleStartAnalysis}
          isAnalyzing={isAnalyzing}
          uploadProgress={uploadProgress}
        />
      )}

      {/* Photography Tips Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-agro-800 font-bold font-display text-base">
          <Info className="w-5 h-5 text-agro-600" />
          <span>Tips for Accurate AI Leaf Diagnosis</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-600">
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <CheckCircle2 className="w-4 h-4 text-agro-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-slate-800 mb-0.5">Focus On Single Leaf</strong>
              Ensure the leaf fills at least 70% of the camera frame.
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <CheckCircle2 className="w-4 h-4 text-agro-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-slate-800 mb-0.5">Good Lighting</strong>
              Avoid heavy shadows or extreme overexposure from direct flash.
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <CheckCircle2 className="w-4 h-4 text-agro-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-slate-800 mb-0.5">Show Active Lesions</strong>
              Include both infected spots and adjacent green tissue if present.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
