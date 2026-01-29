import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import api from "../../api/index";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { PERMISSIONS } from "../usePermissions";

// API functions
const employeeApi = {
  getEmployees: async (params) => {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page);
    if (params.pageSize) searchParams.append("pageSize", params.pageSize);
    if (params.searchTerm) searchParams.append("searchTerm", params.searchTerm);
    if (params.searchBy) searchParams.append("searchBy", params.searchBy);
    if (params.orderBy) searchParams.append("orderBy", params.orderBy);
    if (params.orderDir) searchParams.append("orderDir", params.orderDir);

    const response = await api.get(`/employees?${searchParams.toString()}`);
    const pagedData = response.data.data;

    // Transform PagedList to expected format
    return {
      data: pagedData.items,
      totalPages: pagedData.totalPages,
      currentPage: pagedData.page,
      totalCount: pagedData.totalCount,
      hasNextPage: pagedData.hasNextPage,
      hasPreviousPage: pagedData.hasPreviousPage,
    };
  },

  getEmployeeById: async (id) => {
    const response = await api.get(`/employees/${id}`);
    return response.data.data;
  },

  createEmployee: async (data) => {
    const response = await api.post("/employees", data);
    return response.data.data;
  },

  updateEmployee: async ({ id, data }) => {
    const response = await api.put(`/employees/${id}`, data);
    return response.data.data;
  },

  deleteEmployee: async (id) => {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },

  getEmployeeVacations: async (id) => {
    const response = await api.get(`/employees/${id}/vacations`);
    return response.data.data;
  },

  addEmployeeVacation: async ({ id, data }) => {
    const response = await api.post(`/employees/${id}/vacations`, data);
    return response.data.data;
  },

  getVacationTypes: async () => {
    const response = await api.get("/employees/vacation-types");
    return response.data.data;
  },
};

// Query hooks
export const useEmployees = (params = {}) => {
  const { hasPermission, isAuthenticated, loading } = useAuth();

  return useQuery({
    queryKey: ["employees", params],
    queryFn: () => employeeApi.getEmployees(params),
    enabled:
      !loading && isAuthenticated && hasPermission(PERMISSIONS.EMPLOYEES_VIEW),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useEmployee = (id) => {
  const { hasPermission, isAuthenticated, loading } = useAuth();

  // Normalize id to string for consistent query keys
  const normalizedId = id ? String(id) : null;

  return useQuery({
    queryKey: ["employee", normalizedId],
    queryFn: () => employeeApi.getEmployeeById(id),
    enabled:
      !!id &&
      !loading &&
      isAuthenticated &&
      hasPermission(PERMISSIONS.EMPLOYEES_VIEW),
  });
};

export const useEmployeeById = (id) => {
  const { hasPermission, isAuthenticated, loading } = useAuth();

  // Normalize id to string for consistent query keys
  const normalizedId = id ? String(id) : null;

  return useQuery({
    queryKey: ["employee", normalizedId],
    queryFn: () => employeeApi.getEmployeeById(id),
    enabled:
      !!id &&
      !loading &&
      isAuthenticated &&
      hasPermission(PERMISSIONS.EMPLOYEES_VIEW),
  });
};

export const useEmployeeVacations = (id) => {
  const { hasPermission, isAuthenticated, loading } = useAuth();

  // Normalize id to string for consistent query keys
  const normalizedId = id ? String(id) : null;

  return useQuery({
    queryKey: ["employee-vacations", normalizedId],
    queryFn: () => employeeApi.getEmployeeVacations(id),
    enabled:
      !!id &&
      !loading &&
      isAuthenticated &&
      hasPermission(PERMISSIONS.EMPLOYEES_VIEW),
  });
};

export const useVacationTypes = () => {
  return useQuery({
    queryKey: ["vacation-types"],
    queryFn: employeeApi.getVacationTypes,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Mutation hooks
export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: employeeApi.createEmployee,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success(t("employees.create_success"));
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: employeeApi.updateEmployee,
    onSuccess: (data, variables) => {
      // Invalidate list query
      queryClient.invalidateQueries({ queryKey: ["employees"] });

      // Invalidate specific employee query - normalize id to string for consistent key matching
      const employeeId = variables.id ? String(variables.id) : variables.id;
      queryClient.invalidateQueries({ queryKey: ["employee", employeeId] });

      // Also invalidate all employee queries to catch any variations
      queryClient.invalidateQueries({ queryKey: ["employee"] });

      toast.success(t("employees.update_success"));
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: employeeApi.deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success(t("employees.delete_success"));
    },
  });
};

export const useAddEmployeeVacation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: employeeApi.addEmployeeVacation,
    onSuccess: (data, variables) => {
      // Normalize id to string for consistent query key matching
      const employeeId = variables.id ? String(variables.id) : variables.id;
      queryClient.invalidateQueries({
        queryKey: ["employee-vacations", employeeId],
      });
      queryClient.invalidateQueries({ queryKey: ["employee", employeeId] });
      toast.success(t("employees.add_vacation_success"));
    },
  });
};
