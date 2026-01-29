import api from './index';

const residencesRoute = "/residences";

export const residencesApi = {
  // Get list of residences with pagination and search
  getResidences: async (params = {}) => {
    const response = await api.get(residencesRoute, { params });
    return response.data;
  },

  // Get single residence by id
  getResidenceById: async (id) => {
    const response = await api.get(`${residencesRoute}/${id}`);
    return response.data;
  },

  // Create residence
  createResidence: async (data) => {
    const response = await api.post(residencesRoute, data);
    return response.data;
  },

  // Update residence
  updateResidence: async (id, data) => {
    const response = await api.put(`${residencesRoute}/${id}`, data);
    return response.data;
  },

  // Delete residence
  deleteResidence: async (id) => {
    const response = await api.delete(`${residencesRoute}/${id}`);
    return response.data;
  },

  // Get active residences
  getActiveResidences: async () => {
    const response = await api.get(`${residencesRoute}/active`);
    return response.data;
  },

  // Get residences by animal
  getResidencesByAnimal: async (animalId) => {
    const response = await api.get(`${residencesRoute}/animal/${animalId}`);
    return response.data;
  },

  // End residence
  endResidence: async (id, endDate) => {
    const response = await api.post(`${residencesRoute}/${id}/end`, { endDate });
    return response.data;
  },

  // Residence Day Management
  addResidenceDay: async (data) => {
    const response = await api.post(`${residencesRoute}/days`, data);
    return response.data;
  },

  // Pay residence day
  payResidenceDay: async (data) => {
    const response = await api.post(`${residencesRoute}/days/pay`, data);
    return response.data;
  },

  // Pay all residence days
  payAllResidenceDays: async (data) => {
    const response = await api.post(`${residencesRoute}/days/pay-all`, data);
    return response.data;
  },

  // Update residence day
  updateResidenceDay: async (dayId, data) => {
    const response = await api.put(`${residencesRoute}/days/${dayId}`, data);
    return response.data;
  },

  // Delete residence day
  deleteResidenceDay: async (dayId) => {
    const response = await api.delete(`${residencesRoute}/days/${dayId}`);
    return response.data;
  },

};

export default residencesApi;
