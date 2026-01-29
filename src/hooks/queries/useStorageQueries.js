// // React Query hooks for storage system (categories, suppliers, products, deals, sales)
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import storageApi from "../../api/storage";
// import productsApi from "../../api/products";
// import dealsApi from "../../api/deals";
// // storageApi already imported above
// import salesApi from "../../api/sales";
// import categoriesApi from "../../api/categories";
// import suppliersApi from "../../api/suppliers";
// import { useClinic } from "../../contexts/ClinicContext";
// import { useAuth } from "../../contexts/AuthContext";
// import { PERMISSIONS } from "../usePermissions";

// // ===== CATEGORIES =====

// export const useCategories = () => {
//   const { hasPermission, isAuthenticated, loading } = useAuth();
//   // Storage-based filtering is applied by the global Axios interceptor via X-Storage-Id
//   return useQuery({
//     queryKey: ["categories", "list", "storage-context"],
//     queryFn: async () => {
//       const res = await storageApi.getCategories({ page: 1, pageSize: 1000 });
//       return res?.data ?? res;
//     },
//     enabled:
//       !loading && isAuthenticated && hasPermission(PERMISSIONS.STORAGE_VIEW),
//     staleTime: 5 * 60 * 1000,
//   });
// };

// export const useCategory = (id) => {
//   const { selectedClinicId } = useClinic();
//   const { hasPermission, isAuthenticated, loading } = useAuth();

//   return useQuery({
//     queryKey: ["categories", "detail", selectedClinicId, id],
//     queryFn: () => categoriesApi.getCategoryById(id),
//     enabled:
//       !!id &&
//       !loading &&
//       isAuthenticated &&
//       hasPermission(PERMISSIONS.STORAGE_VIEW),
//     staleTime: 5 * 60 * 1000,
//   });
// };

// export const useCreateCategory = () => {
//   const qc = useQueryClient();
//   const { selectedClinicId } = useClinic();

//   return useMutation({
//     mutationFn: categoriesApi.createCategory,
//     onSuccess: () => {
//       qc.invalidateQueries(["categories", "list", selectedClinicId]);
//     },
//   });
// };

// export const useUpdateCategory = () => {
//   const qc = useQueryClient();
//   const { selectedClinicId } = useClinic();

//   return useMutation({
//     mutationFn: ({ id, data }) => categoriesApi.updateCategory(id, data),
//     onSuccess: (_, variables) => {
//       qc.invalidateQueries(["categories", "list", selectedClinicId]);
//       qc.invalidateQueries([
//         "categories",
//         "detail",
//         selectedClinicId,
//         variables.id,
//       ]);
//     },
//   });
// };

// export const useDeleteCategory = () => {
//   const qc = useQueryClient();
//   const { selectedClinicId } = useClinic();

//   return useMutation({
//     mutationFn: categoriesApi.deleteCategory,
//     onSuccess: () => {
//       qc.invalidateQueries(["categories", "list", selectedClinicId]);
//     },
//   });
// };

// // ===== SUPPLIERS =====

// export const useSuppliers = (params = {}) => {
//   const { hasPermission, isAuthenticated, loading } = useAuth();
//   return useQuery({
//     queryKey: ["suppliers", "list", "storage-context", { filters: params }],
//     queryFn: async () => {
//       const res = await storageApi.getSuppliers(params);
//       const data = res?.data ?? res;
//       const items =
//         data.items ??
//         data.Items ??
//         data?.data?.items ??
//         data?.data?.Items ??
//         [];
//       return {
//         Items: Array.isArray(items) ? items : [],
//         Page: data.page ?? data.Page ?? params?.page ?? 1,
//         PageSize: data.pageSize ?? data.PageSize ?? params?.pageSize ?? 15,
//         TotalAccount:
//           data.totalCount ?? data.TotalCount ?? data.TotalAccount ?? 0,
//         LastPage: data.lastPage ?? data.LastPage ?? undefined,
//         HasNextPage: data.hasNextPage ?? data.HasNextPage ?? false,
//         HasPreviousPage: data.hasPreviousPage ?? data.HasPreviousPage ?? false,
//       };
//     },
//     enabled:
//       !loading && isAuthenticated && hasPermission(PERMISSIONS.STORAGE_VIEW),
//     keepPreviousData: true,
//     staleTime: 5 * 60 * 1000,
//   });
// };

// export const useSupplier = (id) => {
//   const { selectedClinicId } = useClinic();
//   const { hasPermission, isAuthenticated, loading } = useAuth();

//   return useQuery({
//     queryKey: ["suppliers", "detail", selectedClinicId, id],
//     queryFn: () => suppliersApi.getSupplierById(id),
//     enabled:
//       !!id &&
//       !loading &&
//       isAuthenticated &&
//       hasPermission(PERMISSIONS.STORAGE_VIEW),
//     staleTime: 5 * 60 * 1000,
//   });
// };

// export const useCreateSupplier = () => {
//   const qc = useQueryClient();
//   const { selectedClinicId } = useClinic();

//   return useMutation({
//     mutationFn: suppliersApi.createSupplier,
//     onSuccess: () => {
//       qc.invalidateQueries(["suppliers", "list", selectedClinicId]);
//     },
//   });
// };

// export const useUpdateSupplier = () => {
//   const qc = useQueryClient();
//   const { selectedClinicId } = useClinic();

//   return useMutation({
//     mutationFn: ({ id, data }) => suppliersApi.updateSupplier(id, data),
//     onSuccess: (_, variables) => {
//       qc.invalidateQueries(["suppliers", "list", selectedClinicId]);
//       qc.invalidateQueries([
//         "suppliers",
//         "detail",
//         selectedClinicId,
//         variables.id,
//       ]);
//     },
//   });
// };

// export const useDeleteSupplier = () => {
//   const qc = useQueryClient();
//   const { selectedClinicId } = useClinic();

//   return useMutation({
//     mutationFn: suppliersApi.deleteSupplier,
//     onSuccess: () => {
//       qc.invalidateQueries(["suppliers", "list", selectedClinicId]);
//     },
//   });
// };

// // ===== PRODUCT VARIANTS =====

// export const useProductVariants = (params = {}) => {
//   const { selectedClinicId } = useClinic();
//   const { hasPermission, isAuthenticated, loading, canAccessClinic } =
//     useAuth();

//   const canAccessSelectedClinic = selectedClinicId
//     ? canAccessClinic(selectedClinicId)
//     : true;

//   return useQuery({
//     queryKey: [
//       "productVariants",
//       "list",
//       selectedClinicId,
//       { filters: params },
//     ],
//     queryFn: () => storageApi.getProductVariants(params),
//     enabled:
//       !loading &&
//       isAuthenticated &&
//       hasPermission(PERMISSIONS.STORAGE_VIEW) &&
//       canAccessSelectedClinic,
//     keepPreviousData: true,
//     staleTime: 5 * 60 * 1000,
//   });
// };

// // ===== PRODUCTS =====

// export const useProducts = (params = {}) => {
//   const { selectedClinicId } = useClinic();
//   const { hasPermission, isAuthenticated, loading, canAccessClinic } =
//     useAuth();

//   const canAccessSelectedClinic = selectedClinicId
//     ? canAccessClinic(selectedClinicId)
//     : true;

//   return useQuery({
//     queryKey: ["products", "list", selectedClinicId, { filters: params }],
//     queryFn: async () => {
//       const res = await productsApi.getProducts(params);
//       const data = res?.data ?? res;
//       const items = data.items ?? data.Items ?? [];
//       return {
//         Items: items,
//         Page: data.page ?? data.Page ?? params?.page ?? 1,
//         PageSize: data.pageSize ?? data.PageSize ?? params?.pageSize ?? 15,
//         TotalAccount:
//           data.totalCount ?? data.TotalCount ?? data.TotalAccount ?? 0,
//         LastPage: data.lastPage ?? data.LastPage ?? undefined,
//         HasNextPage: data.hasNextPage ?? data.HasNextPage ?? false,
//         HasPreviousPage: data.hasPreviousPage ?? data.HasPreviousPage ?? false,
//       };
//     },
//     enabled:
//       !loading &&
//       isAuthenticated &&
//       hasPermission(PERMISSIONS.STORAGE_VIEW) &&
//       canAccessSelectedClinic,
//     keepPreviousData: true,
//     staleTime: 5 * 60 * 1000,
//   });
// };

// export const useProduct = (id) => {
//   const { selectedClinicId } = useClinic();
//   const { hasPermission, isAuthenticated, loading } = useAuth();

//   return useQuery({
//     queryKey: ["products", "detail", selectedClinicId, id],
//     queryFn: () => productsApi.getProductById(id),
//     enabled:
//       !!id &&
//       !loading &&
//       isAuthenticated &&
//       hasPermission(PERMISSIONS.STORAGE_VIEW),
//     staleTime: 5 * 60 * 1000,
//   });
// };

// export const useCreateProduct = () => {
//   const qc = useQueryClient();
//   const { selectedClinicId } = useClinic();

//   return useMutation({
//     mutationFn: productsApi.createProduct,
//     onSuccess: () => {
//       qc.invalidateQueries(["products", "list", selectedClinicId]);
//     },
//   });
// };

// export const useUpdateProduct = () => {
//   const qc = useQueryClient();
//   const { selectedClinicId } = useClinic();

//   return useMutation({
//     mutationFn: ({ id, data }) => productsApi.updateProduct(id, data),
//     onSuccess: (_, variables) => {
//       qc.invalidateQueries(["products", "list", selectedClinicId]);
//       qc.invalidateQueries([
//         "products",
//         "detail",
//         selectedClinicId,
//         variables.id,
//       ]);
//     },
//   });
// };

// export const useDeleteProduct = () => {
//   const qc = useQueryClient();
//   const { selectedClinicId } = useClinic();

//   return useMutation({
//     mutationFn: productsApi.deleteProduct,
//     onSuccess: () => {
//       qc.invalidateQueries(["products", "list", selectedClinicId]);
//     },
//   });
// };

// // ===== DEALS =====

// export const useDeals = (params = {}) => {
//   const { selectedClinicId } = useClinic();
//   const { hasPermission, isAuthenticated, loading, canAccessClinic } =
//     useAuth();

//   const canAccessSelectedClinic = selectedClinicId
//     ? canAccessClinic(selectedClinicId)
//     : true;

//   return useQuery({
//     queryKey: ["deals", "list", selectedClinicId, { filters: params }],
//     queryFn: async () => {
//       const res = await dealsApi.getDeals(params);
//       const data = res?.data ?? res;
//       const items = data.items ?? data.Items ?? [];
//       return {
//         Items: items,
//         Page: data.page ?? data.Page ?? params?.page ?? 1,
//         PageSize: data.pageSize ?? data.PageSize ?? params?.pageSize ?? 15,
//         TotalAccount:
//           data.totalCount ?? data.TotalCount ?? data.TotalAccount ?? 0,
//         LastPage: data.lastPage ?? data.LastPage ?? undefined,
//         HasNextPage: data.hasNextPage ?? data.HasNextPage ?? false,
//         HasPreviousPage: data.hasPreviousPage ?? data.HasPreviousPage ?? false,
//       };
//     },
//     enabled:
//       !loading &&
//       isAuthenticated &&
//       hasPermission(PERMISSIONS.STORAGE_VIEW) &&
//       canAccessSelectedClinic,
//     keepPreviousData: true,
//     staleTime: 5 * 60 * 1000,
//   });
// };

// export const useDeal = (id) => {
//   const { selectedClinicId } = useClinic();
//   const { hasPermission, isAuthenticated, loading } = useAuth();

//   return useQuery({
//     queryKey: ["deals", "detail", selectedClinicId, id],
//     queryFn: () => dealsApi.getDealById(id),
//     enabled:
//       !!id &&
//       !loading &&
//       isAuthenticated &&
//       hasPermission(PERMISSIONS.STORAGE_VIEW),
//     staleTime: 5 * 60 * 1000,
//   });
// };

// export const useCreateDeal = () => {
//   const qc = useQueryClient();
//   const { selectedClinicId } = useClinic();

//   return useMutation({
//     mutationFn: dealsApi.createDeal,
//     onSuccess: () => {
//       qc.invalidateQueries(["deals", "list", selectedClinicId]);
//       qc.invalidateQueries(["products", "list", selectedClinicId]); // Refresh products for stock updates
//     },
//   });
// };

// export const useUpdateDeal = () => {
//   const qc = useQueryClient();
//   const { selectedClinicId } = useClinic();

//   return useMutation({
//     mutationFn: ({ id, data }) => dealsApi.updateDeal(id, data),
//     onSuccess: (_, variables) => {
//       qc.invalidateQueries(["deals", "list", selectedClinicId]);
//       qc.invalidateQueries(["deals", "detail", selectedClinicId, variables.id]);
//     },
//   });
// };

// export const useDeleteDeal = () => {
//   const qc = useQueryClient();
//   const { selectedClinicId } = useClinic();

//   return useMutation({
//     mutationFn: dealsApi.deleteDeal,
//     onSuccess: () => {
//       qc.invalidateQueries(["deals", "list", selectedClinicId]);
//       qc.invalidateQueries(["products", "list", selectedClinicId]); // Refresh products for stock updates
//     },
//   });
// };

// // ===== SALES =====

// export const useSales = (params = {}) => {
//   const { selectedClinicId } = useClinic();
//   const { hasPermission, isAuthenticated, loading, canAccessClinic } =
//     useAuth();

//   const canAccessSelectedClinic = selectedClinicId
//     ? canAccessClinic(selectedClinicId)
//     : true;

//   return useQuery({
//     queryKey: ["sales", "list", selectedClinicId, { filters: params }],
//     queryFn: async () => {
//       const res = await salesApi.getSales(params);
//       const data = res?.data ?? res;
//       const items = data.items ?? data.Items ?? [];
//       return {
//         Items: items,
//         Page: data.page ?? data.Page ?? params?.page ?? 1,
//         PageSize: data.pageSize ?? data.PageSize ?? params?.pageSize ?? 15,
//         TotalAccount:
//           data.totalCount ?? data.TotalCount ?? data.TotalAccount ?? 0,
//         LastPage: data.lastPage ?? data.LastPage ?? undefined,
//         HasNextPage: data.hasNextPage ?? data.HasNextPage ?? false,
//         HasPreviousPage: data.hasPreviousPage ?? data.HasPreviousPage ?? false,
//       };
//     },
//     enabled:
//       !loading &&
//       isAuthenticated &&
//       hasPermission(PERMISSIONS.STORAGE_VIEW) &&
//       canAccessSelectedClinic,
//     keepPreviousData: true,
//     staleTime: 5 * 60 * 1000,
//   });
// };

// export const useSale = (id) => {
//   const { selectedClinicId } = useClinic();
//   const { hasPermission, isAuthenticated, loading } = useAuth();

//   return useQuery({
//     queryKey: ["sales", "detail", selectedClinicId, id],
//     queryFn: () => salesApi.getSaleById(id),
//     enabled:
//       !!id &&
//       !loading &&
//       isAuthenticated &&
//       hasPermission(PERMISSIONS.STORAGE_VIEW),
//     staleTime: 5 * 60 * 1000,
//   });
// };

// export const useCreateSale = () => {
//   const qc = useQueryClient();
//   const { selectedClinicId } = useClinic();

//   return useMutation({
//     mutationFn: salesApi.createSale,
//     onSuccess: () => {
//       // Invalidate all related queries
//       qc.invalidateQueries(["sales", "list", selectedClinicId]);
//       qc.invalidateQueries(["products", "list", selectedClinicId]);
//       qc.invalidateQueries(["productVariants", "list", selectedClinicId]);
//       qc.invalidateQueries(["storage-statistics"]);
//       qc.invalidateQueries(["sales-history"]);
//       qc.invalidateQueries(["purchase-history"]);
//     },
//   });
// };

// export const useUpdateSale = () => {
//   const qc = useQueryClient();
//   const { selectedClinicId } = useClinic();

//   return useMutation({
//     mutationFn: ({ id, data }) => salesApi.updateSale(id, data),
//     onSuccess: (_, variables) => {
//       qc.invalidateQueries(["sales", "list", selectedClinicId]);
//       qc.invalidateQueries(["sales", "detail", selectedClinicId, variables.id]);
//       qc.invalidateQueries(["products", "list", selectedClinicId]);
//       qc.invalidateQueries(["productVariants", "list", selectedClinicId]);
//       qc.invalidateQueries(["storage-statistics"]);
//     },
//   });
// };

// export const useDeleteSale = () => {
//   const qc = useQueryClient();
//   const { selectedClinicId } = useClinic();

//   return useMutation({
//     mutationFn: salesApi.deleteSale,
//     onSuccess: () => {
//       qc.invalidateQueries(["sales", "list", selectedClinicId]);
//       qc.invalidateQueries(["products", "list", selectedClinicId]);
//       qc.invalidateQueries(["productVariants", "list", selectedClinicId]);
//       qc.invalidateQueries(["storage-statistics"]);
//     },
//   });
// };

// // ===== STORAGE STATISTICS =====

// export const useStorageStatistics = (
//   timeRange = "all",
//   customStartDate = null,
//   customEndDate = null
// ) => {
//   const { selectedClinicId } = useClinic();
//   const { hasPermission, isAuthenticated, loading } = useAuth();

//   return useQuery({
//     queryKey: [
//       "storage-statistics",
//       selectedClinicId,
//       timeRange,
//       customStartDate,
//       customEndDate,
//     ],
//     queryFn: () =>
//       storageApi.getStorageStatistics(
//         timeRange,
//         customStartDate,
//         customEndDate
//       ),
//     enabled:
//       !loading && isAuthenticated && hasPermission(PERMISSIONS.STORAGE_VIEW),
//     staleTime: 2 * 60 * 1000, // 2 minutes
//   });
// };

// // ===== PRODUCT ANALYTICS =====

// export const useSalesHistory = (variantId, params = {}) => {
//   const { selectedClinicId } = useClinic();
//   const { hasPermission, isAuthenticated, loading } = useAuth();

//   return useQuery({
//     queryKey: ["sales-history", selectedClinicId, variantId, params],
//     queryFn: () => salesApi.getProductVariantSalesHistory(variantId, params),
//     enabled:
//       !!variantId &&
//       !loading &&
//       isAuthenticated &&
//       hasPermission(PERMISSIONS.STORAGE_VIEW),
//     staleTime: 5 * 60 * 1000,
//   });
// };

// export const usePurchaseHistory = (variantId, params = {}) => {
//   const { selectedClinicId } = useClinic();
//   const { hasPermission, isAuthenticated, loading } = useAuth();

//   return useQuery({
//     queryKey: ["purchase-history", selectedClinicId, variantId, params],
//     queryFn: () => salesApi.getProductVariantPurchaseHistory(variantId, params),
//     enabled:
//       !!variantId &&
//       !loading &&
//       isAuthenticated &&
//       hasPermission(PERMISSIONS.STORAGE_VIEW),
//     staleTime: 5 * 60 * 1000,
//   });
// };
// React Query hooks for storage system (categories, suppliers, products, deals, sales)
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import storageApi from "../../api/storage";
import productsApi from "../../api/products";
import dealsApi from "../../api/deals";
import { 
  getSales,
  getSaleById,
  createSale,
  updateSale,
  deleteSale,
  getSalesByDateRange,
  getProductVariantSalesHistory,
  getProductVariantPurchaseHistory,
  calculateProductEarnings,
  getProductVariantSalesAnalytics,
  getProductVariantSalesSummary,
  getStoragePerformanceMetrics,
  searchProductVariants,
  getProductVariantByBarcode
} from "../../api/sales";
import categoriesApi from "../../api/categories";
import suppliersApi from "../../api/suppliers";
import { useClinic } from "../../contexts/ClinicContext";
import { useAuth } from "../../contexts/AuthContext";
import { PERMISSIONS } from "../usePermissions";

// ===== CATEGORIES =====

// export const useCategories = () => {
//   const { hasPermission, isAuthenticated, loading } = useAuth();
//   // Storage-based filtering is applied by the global Axios interceptor via X-Storage-Id
//   return useQuery({
//     queryKey: ["categories", "list", "storage-context"],
//     queryFn: async () => {
//       const res = await storageApi.getCategories({ page: 1, pageSize: 1000 });
//       return res?.data ?? res;
//     },
//     enabled:
//       !loading && isAuthenticated && hasPermission(PERMISSIONS.STORAGE_VIEW),
//     staleTime: 5 * 60 * 1000,
//   });
// };
// ===== STORAGES =====

export const useStorages = (params = {}) => {
  const { hasPermission, isAuthenticated, loading } = useAuth();
  
  return useQuery({
    queryKey: ["storages", "list", { filters: params }],
    queryFn: () => storageApi.getStorages(params),
    enabled:
      !loading &&
      isAuthenticated &&
      hasPermission(PERMISSIONS.STORAGE_VIEW),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });
};

// ===== CATEGORIES =====

export const useCategories = (params = {}) => {
  const { hasPermission, isAuthenticated, loading } = useAuth();
  
  return useQuery({
    queryKey: ["categories", "list", "storage-context", { filters: params }],
    queryFn: async () => {
      const res = await storageApi.getCategories(params);
      const data = res?.data ?? res;
      const items = data.items ?? data.Items ?? [];
      return data;
    },
    enabled: !loading && isAuthenticated && hasPermission(PERMISSIONS.STORAGE_VIEW),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCategory = (id) => {
  const { selectedClinicId } = useClinic();
  const { hasPermission, isAuthenticated, loading } = useAuth();

  return useQuery({
    queryKey: ["categories", "detail", selectedClinicId, id],
    queryFn: () => categoriesApi.getCategoryById(id),
    enabled:
      !!id &&
      !loading &&
      isAuthenticated &&
      hasPermission(PERMISSIONS.STORAGE_VIEW),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateCategory = () => {
  const qc = useQueryClient();
  const { selectedClinicId } = useClinic();

  return useMutation({
    mutationFn: categoriesApi.createCategory,
    onSuccess: () => {
      qc.invalidateQueries(["categories", "list", selectedClinicId]);
    },
  });
};

export const useUpdateCategory = () => {
  const qc = useQueryClient();
  const { selectedClinicId } = useClinic();

  return useMutation({
    mutationFn: ({ id, data }) => categoriesApi.updateCategory(id, data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries(["categories", "list", selectedClinicId]);
      qc.invalidateQueries([
        "categories",
        "detail",
        selectedClinicId,
        variables.id,
      ]);
    },
  });
};

export const useDeleteCategory = () => {
  const qc = useQueryClient();
  const { selectedClinicId } = useClinic();

  return useMutation({
    mutationFn: categoriesApi.deleteCategory,
    onSuccess: () => {
      qc.invalidateQueries(["categories", "list", selectedClinicId]);
    },
  });
};

// ===== SUPPLIERS =====

export const useSuppliers = (params = {}) => {
  const { hasPermission, isAuthenticated, loading } = useAuth();
  return useQuery({
    queryKey: ["suppliers", "list", "storage-context", { filters: params }],
    queryFn: async () => {
      const res = await storageApi.getSuppliers(params);
      const data = res?.data ?? res;
      const items =
        data.items ??
        data.Items ??
        data?.data?.items ??
        data?.data?.Items ??
        [];
      return {
        Items: Array.isArray(items) ? items : [],
        Page: data.page ?? data.Page ?? params?.page ?? 1,
        PageSize: data.pageSize ?? data.PageSize ?? params?.pageSize ?? 15,
        TotalAccount:
          data.totalCount ?? data.TotalCount ?? data.TotalAccount ?? 0,
        LastPage: data.lastPage ?? data.LastPage ?? undefined,
        HasNextPage: data.hasNextPage ?? data.HasNextPage ?? false,
        HasPreviousPage: data.hasPreviousPage ?? data.HasPreviousPage ?? false,
      };
    },
    enabled:
      !loading && isAuthenticated && hasPermission(PERMISSIONS.STORAGE_VIEW),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSupplier = (id) => {
  const { selectedClinicId } = useClinic();
  const { hasPermission, isAuthenticated, loading } = useAuth();

  return useQuery({
    queryKey: ["suppliers", "detail", selectedClinicId, id],
    queryFn: () => suppliersApi.getSupplierById(id),
    enabled:
      !!id &&
      !loading &&
      isAuthenticated &&
      hasPermission(PERMISSIONS.STORAGE_VIEW),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateSupplier = () => {
  const qc = useQueryClient();
  const { selectedClinicId } = useClinic();

  return useMutation({
    mutationFn: suppliersApi.createSupplier,
    onSuccess: () => {
      qc.invalidateQueries(["suppliers", "list", selectedClinicId]);
    },
  });
};

export const useUpdateSupplier = () => {
  const qc = useQueryClient();
  const { selectedClinicId } = useClinic();

  return useMutation({
    mutationFn: ({ id, data }) => suppliersApi.updateSupplier(id, data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries(["suppliers", "list", selectedClinicId]);
      qc.invalidateQueries([
        "suppliers",
        "detail",
        selectedClinicId,
        variables.id,
      ]);
    },
  });
};

export const useDeleteSupplier = () => {
  const qc = useQueryClient();
  const { selectedClinicId } = useClinic();

  return useMutation({
    mutationFn: suppliersApi.deleteSupplier,
    onSuccess: () => {
      qc.invalidateQueries(["suppliers", "list", selectedClinicId]);
    },
  });
};

// ===== PRODUCT VARIANTS =====

export const useProductVariants = (params = {}) => {
  const { selectedClinicId } = useClinic();
  const { hasPermission, isAuthenticated, loading, canAccessClinic } =
    useAuth();

  const canAccessSelectedClinic = selectedClinicId
    ? canAccessClinic(selectedClinicId)
    : true;

  return useQuery({
    queryKey: [
      "productVariants",
      "list",
      selectedClinicId,
      { filters: params },
    ],
    queryFn: () => storageApi.getProductVariants(params),
    enabled:
      !loading &&
      isAuthenticated &&
      hasPermission(PERMISSIONS.STORAGE_VIEW) &&
      canAccessSelectedClinic,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });
};

// ===== PRODUCTS =====

export const useProducts = (params = {}) => {
  const { selectedClinicId } = useClinic();
  const { hasPermission, isAuthenticated, loading, canAccessClinic } =
    useAuth();

  const canAccessSelectedClinic = selectedClinicId
    ? canAccessClinic(selectedClinicId)
    : true;

  return useQuery({
    queryKey: ["products", "list", selectedClinicId, { filters: params }],
    queryFn: async () => {
      const res = await productsApi.getProducts(params);
      const data = res?.data ?? res;
      const items = data.items ?? data.Items ?? [];
      return {
        Items: items,
        Page: data.page ?? data.Page ?? params?.page ?? 1,
        PageSize: data.pageSize ?? data.PageSize ?? params?.pageSize ?? 15,
        TotalAccount:
          data.totalCount ?? data.TotalCount ?? data.TotalAccount ?? 0,
        LastPage: data.lastPage ?? data.LastPage ?? undefined,
        HasNextPage: data.hasNextPage ?? data.HasNextPage ?? false,
        HasPreviousPage: data.hasPreviousPage ?? data.HasPreviousPage ?? false,
      };
    },
    enabled:
      !loading &&
      isAuthenticated &&
      hasPermission(PERMISSIONS.STORAGE_VIEW) &&
      canAccessSelectedClinic,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });
};

export const useProduct = (id) => {
  const { selectedClinicId } = useClinic();
  const { hasPermission, isAuthenticated, loading } = useAuth();

  return useQuery({
    queryKey: ["products", "detail", selectedClinicId, id],
    queryFn: () => productsApi.getProductById(id),
    enabled:
      !!id &&
      !loading &&
      isAuthenticated &&
      hasPermission(PERMISSIONS.STORAGE_VIEW),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateProduct = () => {
  const qc = useQueryClient();
  const { selectedClinicId } = useClinic();

  return useMutation({
    mutationFn: productsApi.createProduct,
    onSuccess: () => {
      qc.invalidateQueries(["products", "list", selectedClinicId]);
    },
  });
};

export const useUpdateProduct = () => {
  const qc = useQueryClient();
  const { selectedClinicId } = useClinic();

  return useMutation({
    mutationFn: ({ id, data }) => productsApi.updateProduct(id, data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries(["products", "list", selectedClinicId]);
      qc.invalidateQueries([
        "products",
        "detail",
        selectedClinicId,
        variables.id,
      ]);
    },
  });
};

export const useDeleteProduct = () => {
  const qc = useQueryClient();
  const { selectedClinicId } = useClinic();

  return useMutation({
    mutationFn: productsApi.deleteProduct,
    onSuccess: () => {
      qc.invalidateQueries(["products", "list", selectedClinicId]);
    },
  });
};

// ===== DEALS =====

export const useDeals = (params = {}) => {
  const { selectedClinicId } = useClinic();
  const { hasPermission, isAuthenticated, loading, canAccessClinic } =
    useAuth();

  const canAccessSelectedClinic = selectedClinicId
    ? canAccessClinic(selectedClinicId)
    : true;

  return useQuery({
    queryKey: ["deals", "list", selectedClinicId, { filters: params }],
    queryFn: async () => {
      const res = await dealsApi.getDeals(params);
      const data = res?.data ?? res;
      const items = data.items ?? data.Items ?? [];
      return {
        Items: items,
        Page: data.page ?? data.Page ?? params?.page ?? 1,
        PageSize: data.pageSize ?? data.PageSize ?? params?.pageSize ?? 15,
        TotalAccount:
          data.totalCount ?? data.TotalCount ?? data.TotalAccount ?? 0,
        LastPage: data.lastPage ?? data.LastPage ?? undefined,
        HasNextPage: data.hasNextPage ?? data.HasNextPage ?? false,
        HasPreviousPage: data.hasPreviousPage ?? data.HasPreviousPage ?? false,
      };
    },
    enabled:
      !loading &&
      isAuthenticated &&
      hasPermission(PERMISSIONS.STORAGE_VIEW) &&
      canAccessSelectedClinic,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });
};

export const useDeal = (id) => {
  const { selectedClinicId } = useClinic();
  const { hasPermission, isAuthenticated, loading } = useAuth();

  return useQuery({
    queryKey: ["deals", "detail", selectedClinicId, id],
    queryFn: () => dealsApi.getDealById(id),
    enabled:
      !!id &&
      !loading &&
      isAuthenticated &&
      hasPermission(PERMISSIONS.STORAGE_VIEW),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateDeal = () => {
  const qc = useQueryClient();
  const { selectedClinicId } = useClinic();

  return useMutation({
    mutationFn: dealsApi.createDeal,
    onSuccess: () => {
      qc.invalidateQueries(["deals", "list", selectedClinicId]);
      qc.invalidateQueries(["products", "list", selectedClinicId]); // Refresh products for stock updates
    },
  });
};

export const useUpdateDeal = () => {
  const qc = useQueryClient();
  const { selectedClinicId } = useClinic();

  return useMutation({
    mutationFn: ({ id, data }) => dealsApi.updateDeal(id, data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries(["deals", "list", selectedClinicId]);
      qc.invalidateQueries(["deals", "detail", selectedClinicId, variables.id]);
    },
  });
};

export const useDeleteDeal = () => {
  const qc = useQueryClient();
  const { selectedClinicId } = useClinic();

  return useMutation({
    mutationFn: dealsApi.deleteDeal,
    onSuccess: () => {
      qc.invalidateQueries(["deals", "list", selectedClinicId]);
      qc.invalidateQueries(["products", "list", selectedClinicId]); // Refresh products for stock updates
    },
  });
};

// ===== SALES =====

export const useSales = (params = {}) => {
  const { selectedClinicId } = useClinic();
  const { hasPermission, isAuthenticated, loading, canAccessClinic } =
    useAuth();

  const canAccessSelectedClinic = selectedClinicId
    ? canAccessClinic(selectedClinicId)
    : true;

  return useQuery({
    queryKey: ["sales", "list", selectedClinicId, { filters: params }],
    queryFn: async () => {
      const res = await getSales(params);
      const data = res?.data ?? res;
      const items = data.items ?? data.Items ?? [];
      return {
        Items: items,
        Page: data.page ?? data.Page ?? params?.page ?? 1,
        PageSize: data.pageSize ?? data.PageSize ?? params?.pageSize ?? 15,
        TotalAccount:
          data.totalCount ?? data.TotalCount ?? data.TotalAccount ?? 0,
        LastPage: data.lastPage ?? data.LastPage ?? undefined,
        HasNextPage: data.hasNextPage ?? data.HasNextPage ?? false,
        HasPreviousPage: data.hasPreviousPage ?? data.HasPreviousPage ?? false,
      };
    },
    enabled:
      !loading &&
      isAuthenticated &&
      hasPermission(PERMISSIONS.STORAGE_VIEW) &&
      canAccessSelectedClinic,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSale = (id) => {
  const { selectedClinicId } = useClinic();
  const { hasPermission, isAuthenticated, loading } = useAuth();

  return useQuery({
    queryKey: ["sales", "detail", selectedClinicId, id],
    queryFn: () => getSaleById(id),
    enabled:
      !!id &&
      !loading &&
      isAuthenticated &&
      hasPermission(PERMISSIONS.STORAGE_VIEW),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateSale = () => {
  const qc = useQueryClient();
  const { selectedClinicId } = useClinic();

  return useMutation({
    mutationFn: createSale,
    onSuccess: () => {
      // Invalidate all related queries
      qc.invalidateQueries(["sales", "list", selectedClinicId]);
      qc.invalidateQueries(["products", "list", selectedClinicId]);
      qc.invalidateQueries(["productVariants", "list", selectedClinicId]);
      qc.invalidateQueries(["storage-statistics"]);
      qc.invalidateQueries(["sales-history"]);
      qc.invalidateQueries(["purchase-history"]);
    },
  });
};

export const useUpdateSale = () => {
  const qc = useQueryClient();
  const { selectedClinicId } = useClinic();

  return useMutation({
    mutationFn: ({ id, data }) => updateSale(id, data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries(["sales", "list", selectedClinicId]);
      qc.invalidateQueries(["sales", "detail", selectedClinicId, variables.id]);
      qc.invalidateQueries(["products", "list", selectedClinicId]);
      qc.invalidateQueries(["productVariants", "list", selectedClinicId]);
      qc.invalidateQueries(["storage-statistics"]);
    },
  });
};

export const useDeleteSale = () => {
  const qc = useQueryClient();
  const { selectedClinicId } = useClinic();

  return useMutation({
    mutationFn: deleteSale,
    onSuccess: () => {
      qc.invalidateQueries(["sales", "list", selectedClinicId]);
      qc.invalidateQueries(["products", "list", selectedClinicId]);
      qc.invalidateQueries(["productVariants", "list", selectedClinicId]);
      qc.invalidateQueries(["storage-statistics"]);
    },
  });
};

// ===== STORAGE STATISTICS =====

export const useStorageStatistics = (
  timeRange = "all",
  customStartDate = null,
  customEndDate = null
) => {
  const { selectedClinicId } = useClinic();
  const { hasPermission, isAuthenticated, loading } = useAuth();

  return useQuery({
    queryKey: [
      "storage-statistics",
      selectedClinicId,
      timeRange,
      customStartDate,
      customEndDate,
    ],
    queryFn: () =>
      storageApi.getStorageStatistics(
        timeRange,
        customStartDate,
        customEndDate
      ),
    enabled:
      !loading && isAuthenticated && hasPermission(PERMISSIONS.STORAGE_VIEW),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// ===== PRODUCT ANALYTICS =====

export const useSalesHistory = (variantId, params = {}) => {
  const { selectedClinicId } = useClinic();
  const { hasPermission, isAuthenticated, loading } = useAuth();

  return useQuery({
    queryKey: ["sales-history", selectedClinicId, variantId, params],
    queryFn: () => getProductVariantSalesHistory(variantId, params),
    enabled:
      !!variantId &&
      !loading &&
      isAuthenticated &&
      hasPermission(PERMISSIONS.STORAGE_VIEW),
    staleTime: 5 * 60 * 1000,
  });
};

export const usePurchaseHistory = (variantId, params = {}) => {
  const { selectedClinicId } = useClinic();
  const { hasPermission, isAuthenticated, loading } = useAuth();

  return useQuery({
    queryKey: ["purchase-history", selectedClinicId, variantId, params],
    queryFn: () => getProductVariantPurchaseHistory(variantId, params),
    enabled:
      !!variantId &&
      !loading &&
      isAuthenticated &&
      hasPermission(PERMISSIONS.STORAGE_VIEW),
    staleTime: 5 * 60 * 1000,
  });
};
