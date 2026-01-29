import api from './index';

const clinicsApi = {
  // Get list of clinics
  getClinics: async () => {
    const response = await api.get('/clinics');
    // Expecting { isSuccess: true, data: [...] }
    if (response.data?.isSuccess) return response.data.data;
    throw new Error(response.data?.errors?.[0] || 'Failed to load clinics');
  },

  // Get single clinic by id
  getClinicById: async (id) => {
    const response = await api.get(`/clinics/${id}`);
    // Many endpoints return ToActionResult format: { isSuccess, data }
    if (response.data?.isSuccess) return response.data.data;
    throw new Error(response.data?.errors?.[0] || 'Failed to load clinic');
  },

  // Create clinic
  createClinic: async (payload) => {
    const response = await api.post('/clinics', payload);
    if (response.data?.isSuccess) return response.data.data;
    throw new Error(response.data?.errors?.[0] || 'Failed to create clinic');
  },

  // Update clinic
  updateClinic: async (id, payload) => {
    const response = await api.put(`/clinics/${id}`, { ...payload, id });
    if (response.data?.isSuccess) return response.data.data;
    throw new Error(response.data?.errors?.[0] || 'Failed to update clinic');
  },

  // Delete clinic
  deleteClinic: async (id) => {
    const response = await api.delete(`/clinics/${id}`);
    if (response.data?.isSuccess) return true;
    throw new Error(response.data?.errors?.[0] || 'Failed to delete clinic');
  },
};

export default clinicsApi;
