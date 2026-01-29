// Treatment API endpoints
import api from './index';

export const treatmentApi = {
  // Get treatments by examination ID
  getTreatmentsByExaminationId: async (examinationId) => {
    const response = await api.get(`/treatments/examination/${examinationId}`);
    return response.data;
  },

  // Create new treatment
  createTreatment: async (data) => {
    const response = await api.post('/treatments', data);
    return response.data;
  },

  // Update treatment
  updateTreatment: async (id, data) => {
    const response = await api.put(`/treatments/${id}`, data);
    return response.data;
  },

  // Delete treatment
  deleteTreatment: async (id) => {
    const response = await api.delete(`/treatments/${id}`);
    return response.data;
  },

  // Create multiple treatments for an examination
  createTreatmentsForExamination: async (examinationId, treatments) => {
    const response = await api.post(`/treatments/examination/${examinationId}/bulk`, treatments);
    return response.data;
  },
};

export default treatmentApi;
