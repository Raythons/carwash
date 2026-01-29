// Appointments API endpoints
import api from "./index";

const appointmentsRoute = "/appointments";

export const appointmentsApi = {
  // List appointments with pagination and filters
  getAppointments: async (params = {}) => {
    const response = await api.get(appointmentsRoute, { params });
    return response.data;
  },

  // Get appointment by ID
  getAppointmentById: async (id) => {
    const response = await api.get(`${appointmentsRoute}/${id}`);
    if (response.data.isSuccess) return response.data.data;
  },

  // Create appointment
  createAppointment: async (data) => {
    const response = await api.post(appointmentsRoute, data);
    if (response.data.isSuccess) return response.data.data;
  },

  // Update appointment
  updateAppointment: async (id, data) => {
    const response = await api.put(`${appointmentsRoute}/${id}`, data);
    return response.data;
  },

  // Delete appointment
  deleteAppointment: async (id) => {
    const response = await api.delete(`${appointmentsRoute}/${id}`);
    return response.data;
  },

  // Soft-cancel appointment (alias to DELETE)
  cancelAppointment: async (id) => {
    const response = await api.delete(`${appointmentsRoute}/${id}`);
    return response.data;
  },

  // Get expected visits by date (appointments + surgeries + examinations with follow-up)
  getExpectedVisits: async (params = {}) => {
    const response = await api.get(`${appointmentsRoute}/expected-visits`, { params });
    return response.data;
  },
};

export default appointmentsApi;
