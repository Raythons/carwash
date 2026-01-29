import api from './index';

export const examinationFollowUpApi = {
  // Get follow-ups by examination ID
  getByExaminationId: async (examinationId) => {
    const response = await api.get(`/examinations/followups/examination/${examinationId}`);
    return response.data;
  },

  // Get follow-up by ID
  getById: async (id) => {
    const response = await api.get(`/examinations/followups/${id}`);
    return response.data;
  },

  // Create follow-up
  create: async (data) => {
    const response = await api.post('/examinations/followups', data);
    return response.data;
  },

  // Update follow-up
  update: async (id, data) => {
    const response = await api.put(`/examinations/followups/${id}`, data);
    return response.data;
  },

  // Delete follow-up
  delete: async (id) => {
    const response = await api.delete(`/examinations/followups/${id}`);
    return response.data;
  },

  // Mark as fully paid
  markFullyPaid: async (id) => {
    const response = await api.patch(`/examinations/followups/${id}/mark-fully-paid`);
    return response.data;
  }
};
