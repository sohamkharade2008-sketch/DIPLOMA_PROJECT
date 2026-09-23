import api from './api';

export const diseaseService = {
  async getDiseases(plant) {
    const params = plant ? { plant } : {};
    const response = await api.get('/diseases', { params });
    return response.data;
  },

  async getDiseaseById(id) {
    const response = await api.get(`/diseases/${id}`);
    return response.data;
  },

  async getHealthStatus() {
    const response = await api.get('/health');
    return response.data;
  }
};
