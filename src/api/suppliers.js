// Suppliers API endpoints
import api from './index';

const suppliersRoute = "/suppliers";

export const suppliersApi = {
  // Get all suppliers with pagination and search
  getSuppliers: async (params = {}) => {
    const response = await api.get(suppliersRoute, { params });
    return response.data;
  },

  // Get supplier by ID
  getSupplierById: async (id) => {
    const response = await api.get(`${suppliersRoute}/${id}`);
    return response.data.data; // Extract data from Result wrapper
  },

  // Create new supplier
  createSupplier: async (data) => {
    const response = await api.post(suppliersRoute, data);
    return response.data;
  },

  // Update supplier
  updateSupplier: async (id, data) => {
    const response = await api.put(`${suppliersRoute}/${id}`, data);
    return response.data;
  },

  // Delete supplier
  deleteSupplier: async (id) => {
    const response = await api.delete(`${suppliersRoute}/${id}`);
    return response.data;
  },
};

export default suppliersApi;
