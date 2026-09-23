import api from './api';

export const predictionService = {
  async predictImage(file, onProgress) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/predictions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });
    return response.data;
  },

  async getPredictions(params = {}) {
    const response = await api.get('/predictions', { params });
    return response.data;
  },

  async getPredictionById(id) {
    const response = await api.get(`/predictions/${id}`);
    return response.data;
  },

  async deletePrediction(id) {
    const response = await api.delete(`/predictions/${id}`);
    return response.data;
  },

  async getDashboardStats() {
    const response = await api.get('/predictions/stats');
    return response.data;
  }
};
