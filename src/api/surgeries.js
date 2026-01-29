// Surgeries and Surgery Appointments API endpoints
import api from './index';

const surgeryAppointmentsRoute = "/surgery-appointments"; // server maps to /api/surgery-appointments
const surgeriesRoute = "/surgeries"; // server maps to /api/surgeries
const surgeryFollowUpsRoute = "/surgery-followups"; // server maps to /api/surgery-followups

export const surgeryAppointmentsApi = {
  // List surgery appointments with pagination and filters
  get: async (params = {}) => {
    const response = await api.get(surgeryAppointmentsRoute, { params });
    return response.data;
  },

  // Get surgery appointment by ID
  getById: async (id) => {
    const response = await api.get(`${surgeryAppointmentsRoute}/${id}`);
    return response.data;
  },

  // Create surgery appointment
  create: async (data) => {
    const response = await api.post(surgeryAppointmentsRoute, data);
    return response.data;
  },

  // Update surgery appointment
  update: async (id, data) => {
    const response = await api.put(`${surgeryAppointmentsRoute}/${id}`, { ...data, id });
    return response.data;
  },

  // Delete (cancel) surgery appointment
  delete: async (id) => {
    const response = await api.delete(`${surgeryAppointmentsRoute}/${id}`);
    return response.data;
  },
};

export const surgeriesApi = {
  // List surgeries with pagination and filters
  get: async (params = {}) => {
    const response = await api.get(surgeriesRoute, { params });
    return response.data;
  },

  // Get surgery by ID (includes follow-ups)
  getById: async (id) => {
    const response = await api.get(`${surgeriesRoute}/${id}`);
    return response.data;
  },

  // Create a surgery (linked to a surgery appointment)
  create: async (data) => {
    const response = await api.post(surgeriesRoute, data);
    return response.data;
  },

  // Update a surgery
  update: async (id, data) => {
    const response = await api.put(`${surgeriesRoute}/${id}`, { ...data, id });
    return response.data;
  },

  // Delete a surgery
  delete: async (id) => {
    const response = await api.delete(`${surgeriesRoute}/${id}`);
    return response.data;
  },

  // Add a follow-up to a surgery
  addFollowUp: async (surgeryId, data) => {
    const response = await api.post(`${surgeriesRoute}/${surgeryId}/followups`, { ...data, surgeryId });
    return response.data;
  },

  // Mark surgery payment as fully paid
  markFullyPaid: async (surgeryId) => {
    const response = await api.post(`${surgeriesRoute}/${surgeryId}/mark-fully-paid`);
    return response.data;
  },
};

export const surgeryFollowUpsApi = {
  // List surgery follow-ups with pagination and filters
  get: async (params = {}) => {
    const response = await api.get(surgeryFollowUpsRoute, { params });
    return response.data;
  },

  // Get surgery follow-up by ID
  getById: async (id) => {
    const response = await api.get(`${surgeryFollowUpsRoute}/${id}`);
    return response.data;
  },

  // Create surgery follow-up
  create: async (data) => {
    const response = await api.post(surgeryFollowUpsRoute, data);
    return response.data;
  },

  // Update surgery follow-up
  update: async (id, data) => {
    const response = await api.put(`${surgeryFollowUpsRoute}/${id}`, { ...data, id });
    return response.data;
  },

  // Delete surgery follow-up
  delete: async (id) => {
    const response = await api.delete(`${surgeryFollowUpsRoute}/${id}`);
    return response.data;
  },

  // Get total count of surgery follow-ups
  getCount: async (params = {}) => {
    const response = await api.get(`${surgeryFollowUpsRoute}/count`, { params });
    return response.data;
  },
};

export default {
  surgeryAppointmentsApi,
  surgeriesApi,
  surgeryFollowUpsApi,
};
