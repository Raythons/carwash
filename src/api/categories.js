// Categories API endpoints
import api from './index';

const categoriesRoute = "/categories";

export const categoriesApi = {
  // Get all categories
  getCategories: async () => {
    const response = await api.get(categoriesRoute);
    return response.data;
  },

  // Get category by ID
  getCategoryById: async (id) => {
    const response = await api.get(`${categoriesRoute}/${id}`);
    return response.data.data; // Extract data from Result wrapper
  },

  // Create new category
  createCategory: async (data) => {
    const response = await api.post(categoriesRoute, data);
    return response.data;
  },

  // Update category
  updateCategory: async (id, data) => {
    const response = await api.put(`${categoriesRoute}/${id}`, data);
    return response.data;
  },

  // Delete category
  deleteCategory: async (id) => {
    const response = await api.delete(`${categoriesRoute}/${id}`);
    return response.data;
  },
};

export default categoriesApi;
