// Deals API endpoints
import api from './index';

const dealsRoute = "/deals";

export const dealsApi = {
  // Get all deals with pagination and filters
  getDeals: async (params = {}) => {
    const response = await api.get(dealsRoute, { params });
    return response.data;
  },

  // Get deal by ID
  getDealById: async (id) => {
    const response = await api.get(`${dealsRoute}/${id}`);
    return response.data.data; // Extract data from Result wrapper
  },

  // Create new deal
  createDeal: async (data) => {
    const response = await api.post(dealsRoute, data);
    return response.data;
  },

  // Update deal
  updateDeal: async (id, data) => {
    const response = await api.put(`${dealsRoute}/${id}`, data);
    return response.data;
  },

  // Delete deal
  deleteDeal: async (id) => {
    const response = await api.delete(`${dealsRoute}/${id}`);
    return response.data;
  },
};

export default dealsApi;
