import api from './index';

// ==================== SALES ====================
export const getSales = async (params = {}) => {
  const response = await api.get('/sales', { params });
  return response.data;
};

export const getSaleById = async (id) => {
  const response = await api.get(`/sales/${id}`);
  return response.data;
};

export const createSale = async (data) => {
  const response = await api.post('/sales', data);
  return response.data;
};

export const updateSale = async (id, data) => {
  const response = await api.put(`/sales/${id}`, data);
  return response.data;
};

export const deleteSale = async (id) => {
  const response = await api.delete(`/sales/${id}`);
  return response.data;
};

export const getSalesByDateRange = async (startDate, endDate) => {
  const response = await api.get('/sales/by-date', { 
    params: { startDate, endDate }
  });
  return response.data;
};

// ==================== ANALYTICS ====================
export const getProductVariantPurchaseHistory = async (variantId, params = {}) => {
  const response = await api.get(`/analytics/product-variants/${variantId}/purchases`, { params });
  return response.data;
};

export const getProductVariantSalesHistory = async (variantId, params = {}) => {
  const response = await api.get(`/analytics/product-variants/${variantId}/sales`, { params });
  return response.data;
};

export const calculateProductEarnings = async (params = {}) => {
  const response = await api.get('/analytics/earnings', { params });
  return response.data;
};

// NEW: Detailed sales analytics with profit calculations
export const getProductVariantSalesAnalytics = async (variantId, params = {}) => {
  const response = await api.get(`/analytics/product-variants/${variantId}/sales-analytics`, { params });
  return response.data;
};

// NEW: Sales summary statistics
export const getProductVariantSalesSummary = async (variantId, params = {}) => {
  const response = await api.get(`/analytics/product-variants/${variantId}/sales-summary`, { params });
  return response.data;
};

export const getStoragePerformanceMetrics = async (storageId, periodDays = 30) => {
  const response = await api.get(`/analytics/storage/${storageId}/metrics`, {
    params: { periodDays }
  });
  return response.data;
};

// ==================== PRODUCT SEARCH FOR POS ====================
export const searchProductVariants = async (searchTerm) => {
  const response = await api.get('/product-variants/search', { 
    params: { q: searchTerm }
  });
  return response.data;
};

export const getProductVariantByBarcode = async (barcode) => {
  const response = await api.get(`/product-variants/barcode/${barcode}`);
  return response.data;
};
