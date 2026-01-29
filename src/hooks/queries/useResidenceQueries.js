// React Query hooks for residences
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { residencesApi } from '../../api/residences';
import { useAuth } from '../../contexts/AuthContext';
import { PERMISSIONS } from '../usePermissions';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export const RESIDENCE_QUERY_KEYS = {
  all: ['residences'],
  lists: () => ['residences', 'list'],
  list: (page, pageSize, search) => ['residences', 'list', { page, pageSize, search }],
  details: () => ['residences', 'detail'],
  detail: (id) => ['residences', 'detail', id],
  active: () => ['residences', 'active'],
  byAnimal: (animalId) => ['residences', 'byAnimal', animalId],
};

// Get residences with pagination and search
export const useResidences = (params = {}) => {
  const { isAuthenticated, loading: authLoading, hasPermission } = useAuth();
  
  // Normalize params to prevent duplicate queries
  const normalizedParams = {
    page: params.page || 1,
    pageSize: params.pageSize || 15,
    search: params.search || null
  };
  
  return useQuery({
    queryKey: RESIDENCE_QUERY_KEYS.list(normalizedParams.page, normalizedParams.pageSize, normalizedParams.search),
    queryFn: async () => {
      const response = await residencesApi.getResidences(normalizedParams);
      if (response?.isSuccess) return response.data;
      throw new Error(response?.errors?.[0] || 'Failed to load residences');
    },
    enabled: !authLoading && isAuthenticated && hasPermission(PERMISSIONS.RESIDENCES_VIEW),
    staleTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true,
  });
};

// Get residence by ID
export const useResidenceById = (id) => {
  const { isAuthenticated, loading: authLoading, hasPermission } = useAuth();
  
  // Don't run query if id is not a valid number
  const isValidId = id && !isNaN(parseInt(id)) && parseInt(id) > 0;
  
  return useQuery({
    queryKey: RESIDENCE_QUERY_KEYS.detail(id),
    queryFn: async () => {
      const response = await residencesApi.getResidenceById(id);
      if (response?.isSuccess) return response.data;
      throw new Error(response?.errors?.[0] || 'Failed to load residence');
    },
    enabled: isValidId && !authLoading && isAuthenticated && hasPermission(PERMISSIONS.RESIDENCES_VIEW),
  });
};

// Get active residences
export const useActiveResidences = () => {
  const { isAuthenticated, loading: authLoading, hasPermission } = useAuth();
  
  return useQuery({
    queryKey: RESIDENCE_QUERY_KEYS.active(),
    queryFn: async () => {
      const response = await residencesApi.getActiveResidences();
      if (response?.isSuccess) return response.data;
      throw new Error(response?.errors?.[0] || 'Failed to load active residences');
    },
    enabled: !authLoading && isAuthenticated && hasPermission(PERMISSIONS.RESIDENCES_VIEW),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
};

// Get residences by animal
export const useResidencesByAnimal = (animalId) => {
  const { isAuthenticated, loading: authLoading, hasPermission } = useAuth();
  
  return useQuery({
    queryKey: RESIDENCE_QUERY_KEYS.byAnimal(animalId),
    queryFn: async () => {
      const response = await residencesApi.getResidencesByAnimal(animalId);
      if (response?.isSuccess) return response.data;
      throw new Error(response?.errors?.[0] || 'Failed to load animal residences');
    },
    enabled: !!animalId && !authLoading && isAuthenticated && hasPermission(PERMISSIONS.RESIDENCES_VIEW),
    staleTime: 5 * 60 * 1000,
  });
};

// Create residence mutation
export const useCreateResidence = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  
  return useMutation({
    mutationFn: async (data) => {
      const response = await residencesApi.createResidence(data);
      if (response?.isSuccess) return response.data;
      throw new Error(response?.errors?.[0] || 'Failed to create residence');
    },
    onSuccess: () => {
      // Invalidate and refetch residence lists
      queryClient.invalidateQueries({ queryKey: RESIDENCE_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: RESIDENCE_QUERY_KEYS.active() });
      toast.success(t('residences.add_success'));
    },
    onError: (error) => {
      // Error toast is handled by global API interceptor
      console.error('Create residence error:', error);
    },
  });
};

// Update residence mutation
export const useUpdateResidence = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await residencesApi.updateResidence(id, data);
      if (response?.isSuccess) return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate specific residence and lists
      queryClient.invalidateQueries({ queryKey: RESIDENCE_QUERY_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: RESIDENCE_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: RESIDENCE_QUERY_KEYS.active() });
      toast.success(t('residences.update_success'));
    },
    onError: (error) => {
      // Error toast is handled by global API interceptor
      console.error('Update residence error:', error);
    },
  });
};

// Delete residence mutation
export const useDeleteResidence = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  
  return useMutation({
    mutationFn: async (id) => {
      const response = await residencesApi.deleteResidence(id);
      if (response?.isSuccess) return response.data;
      throw new Error(response?.errors?.[0] || 'Failed to delete residence');
    },
    onSuccess: (_, id) => {
      // Remove from cache and invalidate lists
      queryClient.removeQueries({ queryKey: RESIDENCE_QUERY_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: RESIDENCE_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: RESIDENCE_QUERY_KEYS.active() });
      // Invalidate statistics since payments were deleted
      queryClient.invalidateQueries({ queryKey: ['statistics'] });
      toast.success(t('residences.delete_success'));
    },
    onError: (error) => {
      // Error toast is handled by global API interceptor
      console.error('Delete residence error:', error);
    },
  });
};

// End residence mutation
export const useEndResidence = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  
  return useMutation({
    mutationFn: async ({ id, endDate }) => {
      const response = await residencesApi.endResidence(id, endDate);
      if (response?.isSuccess) return response.data;
      throw new Error(response?.errors?.[0] || 'Failed to end residence');
    },
    onSuccess: (_, variables) => {
      // Invalidate residence data
      queryClient.invalidateQueries({ queryKey: RESIDENCE_QUERY_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: RESIDENCE_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: RESIDENCE_QUERY_KEYS.active() });
      toast.success(t('residences.end_success'));
    },
    onError: (error) => {
      // Error toast is handled by global API interceptor
      console.error('End residence error:', error);
    },
  });
};

// Residence Day Mutations
export const useAddResidenceDay = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  
  return useMutation({
    mutationFn: async (data) => {
      const response = await residencesApi.addResidenceDay(data);
      if (response?.isSuccess) return response.data;
      throw new Error(response?.errors?.[0] || 'Failed to add residence day');
    },
    onSuccess: (_, variables) => {
      // Invalidate residence details to refresh days
      queryClient.invalidateQueries({ queryKey: RESIDENCE_QUERY_KEYS.detail(variables.residenceId) });
      queryClient.invalidateQueries({ queryKey: RESIDENCE_QUERY_KEYS.lists() });
      // Invalidate statistics since new payment was created
      queryClient.invalidateQueries({ queryKey: ['statistics'] });
      toast.success(t('residences.add_day.success'));
    },
    onError: (error) => {
      // Error toast is handled by global API interceptor
      console.error('Add residence day error:', error);
    },
  });
};

export const usePayResidenceDay = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  
  return useMutation({
    mutationFn: async (data) => {
      const response = await residencesApi.payResidenceDay(data);
      if (response?.isSuccess) return response.data;
      throw new Error(response?.errors?.[0] || 'Failed to pay residence day');
    },
    onSuccess: (data) => {
      // Invalidate residence details to refresh payment status
      queryClient.invalidateQueries({ queryKey: RESIDENCE_QUERY_KEYS.detail(data.animalResidenceId) });
      queryClient.invalidateQueries({ queryKey: RESIDENCE_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: RESIDENCE_QUERY_KEYS.active() });
      // Also invalidate all residence details to ensure fresh data
      queryClient.invalidateQueries({ queryKey: RESIDENCE_QUERY_KEYS.details() });
      // Invalidate statistics since payment data changed
      queryClient.invalidateQueries({ queryKey: ['statistics'] });
      toast.success(t('residences.pay_day_success'));
    },
    onError: (error) => {
      // Error toast is handled by global API interceptor
      console.error('Pay residence day error:', error);
    },
  });
};

export const usePayAllResidenceDays = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  
  return useMutation({
    mutationFn: async (data) => {
      const response = await residencesApi.payAllResidenceDays(data);
      if (response?.isSuccess) return response.data;
      throw new Error(response?.errors?.[0] || 'Failed to pay all residence days');
    },
    onSuccess: (_, variables) => {
      // Invalidate residence details to refresh payment status
      queryClient.invalidateQueries({ queryKey: RESIDENCE_QUERY_KEYS.detail(variables.residenceId) });
      queryClient.invalidateQueries({ queryKey: RESIDENCE_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: RESIDENCE_QUERY_KEYS.active() });
      // Also invalidate all residence details to ensure fresh data
      queryClient.invalidateQueries({ queryKey: RESIDENCE_QUERY_KEYS.details() });
      // Invalidate statistics since payment data changed
      queryClient.invalidateQueries({ queryKey: ['statistics'] });
      toast.success(t('residences.pay_all_success'));
    },
    onError: (error) => {
      // Error toast is handled by global API interceptor
      console.error('Pay all residence days error:', error);
    },
  });
};

export const useUpdateResidenceDay = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  
  return useMutation({
    mutationFn: async ({ dayId, data }) => {
      const response = await residencesApi.updateResidenceDay(dayId, data);
      if (response?.isSuccess) return response.data;
      throw new Error(response?.errors?.[0] || 'Failed to update residence day');
    },
    onSuccess: (data, variables) => {
      // Invalidate residence details to refresh the updated day
      queryClient.invalidateQueries({ queryKey: RESIDENCE_QUERY_KEYS.detail(data.animalResidenceId) });
      queryClient.invalidateQueries({ queryKey: RESIDENCE_QUERY_KEYS.lists() });
      // Also invalidate all residence details to be safe
      queryClient.invalidateQueries({ queryKey: RESIDENCE_QUERY_KEYS.details() });
      toast.success(t('residences.update_day_success'));
    },
    onError: (error) => {
      // Error toast is handled by global API interceptor
      console.error('Update residence day error:', error);
    },
  });
};

export const useDeleteResidenceDay = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  
  return useMutation({
    mutationFn: async (dayId) => {
      const response = await residencesApi.deleteResidenceDay(dayId);
      if (response?.isSuccess) return response.data;
      throw new Error(response?.errors?.[0] || 'Failed to delete residence day');
    },
    onSuccess: () => {
      // Invalidate all residence data since we don't know which residence the day belonged to
      queryClient.invalidateQueries({ queryKey: RESIDENCE_QUERY_KEYS.all });
      toast.success(t('residences.delete_day_success'));
    },
    onError: (error) => {
      // Error toast is handled by global API interceptor
      console.error('Delete residence day error:', error);
    },
  });
};
