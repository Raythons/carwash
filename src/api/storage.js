import api from "./index";

const storagesRoute = "/storages";
const suppliersRoute = "/suppliers";
const categoriesRoute = "/categories";

export const storageApi = {
  // ==================== STORAGES ====================
  getStorages: async (params = {}) => {
    const response = await api.get(storagesRoute, { params });
    return response.data.data || response.data;
  },

  getCategories: async (params = {}) => {
    const response = await api.get(categoriesRoute, { params });
    return response.data;
  },

  getSuppliers: async (params = {}) => {
    const response = await api.get(suppliersRoute, { params });
    return response.data;
  },

  getStorageById: async (id) => {
    const response = await api.get(`${storagesRoute}/${id}`);
    return response.data;
  },

  // ==================== PRODUCTS ====================
  getProducts: async (params = {}) => {
    const response = await api.get("/products", { params });
    return response.data;
  },

  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  createProduct: async (data) => {
    const response = await api.post("/products", data);
    return response.data;
  },

  updateProduct: async (id, data) => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // ==================== PRODUCT VARIANTS ====================
  getProductVariants: async (params = {}) => {
    const response = await api.get("/products/variants", { params });
    return response.data;
  },

  getVariantsByProductId: async (productId) => {
    const response = await api.get(`/products/${productId}/variants`);
    return response.data;
  },

  getVariantById: async (id) => {
    const response = await api.get(`/products/variants/${id}`);
    return response.data;
  },

  getVariantByQRCode: async (qrCode) => {
    const response = await api.get(`/products/variants/qr/${qrCode}`);
    return response.data;
  },

  createVariant: async (data) => {
    const response = await api.post("/products/variants", data);
    return response.data;
  },

  updateVariant: async (id, data) => {
    const response = await api.put(`/products/variants/${id}`, data);
    return response.data;
  },

  deleteVariant: async (id) => {
    const response = await api.delete(`/products/variants/${id}`);
    return response.data;
  },

  searchProductVariants: async (searchTerm) => {
    const response = await api.get("/products/variants", {
      params: { searchTerm, pageSize: 20 },
    });
    return response.data;
  },

  // ==================== STORAGES ====================
  createStorage: async (data) => {
    const response = await api.post(storagesRoute, data);
    return response.data;
  },

  updateStorage: async (id, data) => {
    const response = await api.put(`${storagesRoute}/${id}`, data);
    return response.data;
  },

  deleteStorage: async (id) => {
    const response = await api.delete(`${storagesRoute}/${id}`);
    return response.data;
  },

  // ==================== STOCK MOVEMENTS ====================
  getStockMovements: async (params = {}) => {
    const response = await api.get("/stock-movements", { params });
    return response.data;
  },

  createStockMovement: async (data) => {
    const response = await api.post("/stock-movements", data);
    return response.data;
  },

  // ==================== STATISTICS ====================
  getStorageStatistics: async (
    timeRange = "all",
    customStartDate = null,
    customEndDate = null
  ) => {
    const params = { timeRange };
    if (customStartDate) params.customStartDate = customStartDate;
    if (customEndDate) params.customEndDate = customEndDate;

    const response = await api.get("/storage/statistics", { params });
    return response.data.data || response.data;
  },

  getTopSellingProducts: async (
    page = 1,
    pageSize = 20,
    timeRange = "all",
    customStartDate = null,
    customEndDate = null
  ) => {
    const params = { page, pageSize, timeRange };
    if (customStartDate) params.customStartDate = customStartDate;
    if (customEndDate) params.customEndDate = customEndDate;

    const response = await api.get("/storage/statistics/top-selling", {
      params,
    });
    return response.data.data || response.data;
  },

  getTopProfitableProducts: async (
    page = 1,
    pageSize = 20,
    timeRange = "all",
    customStartDate = null,
    customEndDate = null
  ) => {
    const params = { page, pageSize, timeRange };
    if (customStartDate) params.customStartDate = customStartDate;
    if (customEndDate) params.customEndDate = customEndDate;

    const response = await api.get("/storage/statistics/top-profitable", {
      params,
    });
    return response.data.data || response.data;
  },

  // ==================== ANALYTICS ====================
  getProductVariantPurchaseHistory: async (variantId, params = {}) => {
    const response = await api.get(
      `/analytics/product-variants/${variantId}/purchases`,
      { params }
    );
    return response.data;
  },

  getProductVariantSalesHistory: async (variantId, params = {}) => {
    const response = await api.get(
      `/analytics/product-variants/${variantId}/sales`,
      { params }
    );
    return response.data;
  },

  getProductVariantSalesAnalytics: async (variantId, params = {}) => {
    const response = await api.get(
      `/analytics/product-variants/${variantId}/sales-analytics`,
      { params }
    );
    return response.data;
  },

  getProductVariantSalesSummary: async (variantId, params = {}) => {
    const response = await api.get(
      `/analytics/product-variants/${variantId}/sales-summary`,
      { params }
    );
    return response.data;
  },

  calculateProductEarnings: async (params = {}) => {
    const response = await api.get("/analytics/products/earnings", { params });
    return response.data;
  },

  getStoragePerformanceMetrics: async (storageId, periodDays = 30) => {
    const response = await api.get(`/analytics/storages/${storageId}/metrics`, {
      params: { periodDays },
    });
    return response.data;
  },
};

export default storageApi;
