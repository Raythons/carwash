// Products API endpoints
import api from './index';

const productsRoute = "/products";

export const productsApi = {
  // Get all products with pagination and search
  getProducts: async (params = {}) => {
    const response = await api.get(productsRoute, { params });
    return response.data;
  },

  // Get product by ID
  getProductById: async (id) => {
    const response = await api.get(`${productsRoute}/${id}`);
    return response.data.data; // Extract data from Result wrapper
  },

  // Create new product
  createProduct: async (data) => {
    const response = await api.post(productsRoute, data);
    return response.data;
  },

  // Update product
  updateProduct: async (id, data) => {
    const response = await api.put(`${productsRoute}/${id}`, data);
    return response.data;
  },

  // Delete product
  deleteProduct: async (id) => {
    const response = await api.delete(`${productsRoute}/${id}`);
    return response.data;
  },

  // ===== Product Variants =====
  
  // Get variants by product ID
  getVariantsByProductId: async (productId) => {
    const response = await api.get(`${productsRoute}/${productId}/variants`);
    return response.data;
  },

  // Get variant by ID
  getVariantById: async (id) => {
    const response = await api.get(`${productsRoute}/variants/${id}`);
    return response.data.data; // Extract data from Result wrapper
  },

  // Get variant by QR code
  getVariantByQRCode: async (qrCode) => {
    const response = await api.get(`${productsRoute}/variants/qr/${qrCode}`);
    return response.data;
  },

  // Create new variant
  createVariant: async (data) => {
    const response = await api.post(`${productsRoute}/variants`, data);
    return response.data;
  },

  // Update variant
  updateVariant: async (id, data) => {
    const response = await api.put(`${productsRoute}/variants/${id}`, data);
    return response.data;
  },

  // Delete variant
  deleteVariant: async (id) => {
    const response = await api.delete(`${productsRoute}/variants/${id}`);
    return response.data;
  },
};

export default productsApi;
