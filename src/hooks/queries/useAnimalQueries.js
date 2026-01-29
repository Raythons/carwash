// React Query hooks for animals
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import animalsApi from '../../api/animals';
import { useClinic } from '../../contexts/ClinicContext';
import { useAuth } from '../../contexts/AuthContext';
import { PERMISSIONS } from '../usePermissions';

// Query keys
export const ANIMAL_QUERY_KEYS = {
  all: ['animals'],
  lists: () => [...ANIMAL_QUERY_KEYS.all, 'list'],
  list: (filters) => [...ANIMAL_QUERY_KEYS.lists(), { filters }],
  details: () => [...ANIMAL_QUERY_KEYS.all, 'detail'],
  detail: (id) => [...ANIMAL_QUERY_KEYS.details(), id],
};

// Get animals list
export const useAnimals = (params = {}) => {
  const { selectedClinicId } = useClinic();
  const { hasPermission, isAuthenticated, loading, canAccessClinic } = useAuth();
  
  // Check if user can access the selected clinic
  const canAccessSelectedClinic = selectedClinicId ? canAccessClinic(selectedClinicId) : true;
  
  return useQuery({
    queryKey: ['animals', 'list', selectedClinicId, { filters: params }],
    queryFn: async () => {
      const res = await animalsApi.getAnimals(params);
      const ok = res?.isSuccess ?? res?.IsSuccess ?? true;
      const data = ok ? (res?.data ?? res?.Data ?? res) : null;
      if (!data) {
        throw new Error(res?.errors?.[0] ?? res?.Errors?.[0] ?? 'Failed to load animals');
      }
      const items = (data.items ?? []).map((item) => ({
        id: item.id,
        name: item.name,
        breed: item.breed,
        animalTypeName: item.animalTypeName,
        dateOfBirth: item.dateOfBirth,
        ownerName: item.ownerName,
        ownerPhone: item.ownerPhone,
        ownerId: item.ownerId,
      }));
      return {
        Items: items,
        Page: data.page ?? data.Page ?? params?.page ?? 1,
        PageSize: data.pageSize ?? data.PageSize ?? params?.pageSize ?? 15,
        TotalAccount: data.totalCount ?? data.TotalCount ?? data.TotalAccount ?? 0,
        LastPage: data.lastPage ?? data.LastPage ?? undefined,
        HasNextPage: data.hasNextPage ?? data.HasNextPage ?? false,
        HasPreviousPage: data.hasPreviousPage ?? data.HasPreviousPage ?? false,
      };
    },
    // Only enable query if user is authenticated, has permission, AND can access selected clinic
    enabled: !loading && isAuthenticated && hasPermission(PERMISSIONS.ANIMALS_VIEW) && canAccessSelectedClinic,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });
};

// Get animal by ID
export const useAnimal = (id) => {
  const { selectedClinicId } = useClinic();
  const { hasPermission, isAuthenticated, loading } = useAuth();
  
  return useQuery({
    queryKey: ['animals', 'detail', selectedClinicId, id],
    queryFn: () => animalsApi.getAnimalById(id),
    enabled: !!id && !loading && isAuthenticated && hasPermission(PERMISSIONS.ANIMALS_VIEW),
    staleTime: 5 * 60 * 1000,
  });
};

// Note: Use useOwnerAnimals from useOwnerQueries.js instead for getting animals by owner

// Create animal
export const useCreateAnimal = () => {
  const qc = useQueryClient();
  const { selectedClinicId } = useClinic();
  return useMutation({
    mutationFn: animalsApi.createAnimal,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['animals', 'list', selectedClinicId] });
      if (data?.id) qc.invalidateQueries({ queryKey: ['animals', 'detail', selectedClinicId, data.id] });
    },
  });
};

// Update animal
export const useUpdateAnimal = () => {
  const qc = useQueryClient();
  const { selectedClinicId } = useClinic();
  return useMutation({
    mutationFn: ({ id, data }) => animalsApi.updateAnimal(id, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['animals', 'list', selectedClinicId] });
      qc.invalidateQueries({ queryKey: ['animals', 'detail', selectedClinicId, vars.id] });
    },
  });
};

// Delete animal
export const useDeleteAnimal = () => {
  const qc = useQueryClient();
  const { selectedClinicId } = useClinic();
  return useMutation({
    mutationFn: (id) => animalsApi.deleteAnimal(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ['animals', 'list', selectedClinicId] });
      qc.removeQueries({ queryKey: ['animals', 'detail', selectedClinicId, id] });
    },
  });
};

// Get brief historical record for an animal (used by examinations form)
export const useAnimalBriefHistory = (animalId, options = {}) => {
  const { selectedClinicId } = useClinic();
  return useQuery({
    queryKey: ['animals', 'brief-history', selectedClinicId, animalId],
    queryFn: () => animalsApi.getBriefHistoricalRecord(animalId),
    enabled: !!animalId && (options.enabled ?? true),
    staleTime: 5 * 60 * 1000,
  });
};

// Get examinations for an animal
export const useAnimalExaminations = (animalId, params = {}) => {
  const { selectedClinicId } = useClinic();
  const { hasPermission, isAuthenticated, loading } = useAuth();
  
  return useQuery({
    queryKey: ['animals', 'examinations', selectedClinicId, animalId, params],
    queryFn: () => animalsApi.getExaminationsByAnimalId(animalId, params),
    enabled: !!animalId && !loading && isAuthenticated && hasPermission(PERMISSIONS.EXAMINATIONS_VIEW),
    staleTime: 5 * 60 * 1000,
  });
};

// Get animal details with all related data
export const useAnimalDetails = (animalId) => {
  const { selectedClinicId } = useClinic();
  const { hasPermission, isAuthenticated, loading } = useAuth();
  
  return useQuery({
    queryKey: ['animals', 'details', selectedClinicId, animalId],
    queryFn: () => animalsApi.getAnimalDetails(animalId),
    enabled: !!animalId && !loading && isAuthenticated && hasPermission(PERMISSIONS.ANIMALS_VIEW),
    staleTime: 5 * 60 * 1000,
  });
};

// Delete previous condition
export const useDeletePreviousCondition = () => {
  const qc = useQueryClient();
  const { selectedClinicId } = useClinic();
  
  return useMutation({
    mutationFn: (id) => animalsApi.deletePreviousCondition(id),
    onSuccess: (_, id) => {
      // Invalidate animal details to refresh the previous conditions list
      qc.invalidateQueries({ queryKey: ['animals', 'details', selectedClinicId] });
    },
  });
};
