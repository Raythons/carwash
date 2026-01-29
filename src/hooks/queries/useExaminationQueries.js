// React Query hooks for examinations
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import examinationApi from '@/api/examinations';
import { useClinic } from '../../contexts/ClinicContext';
import { useAuth } from '../../contexts/AuthContext';
import { PERMISSIONS } from '../usePermissions';

// Query keys
export const EXAMINATION_QUERY_KEYS = {
  all: ['examinations'],
  list: (filters) => [...EXAMINATION_QUERY_KEYS.lists(), { filters }],
  details: () => [...EXAMINATION_QUERY_KEYS.all, 'detail'],
  detail: (id) => [...EXAMINATION_QUERY_KEYS.details(), id],
  byAnimal: (animalId) => [...EXAMINATION_QUERY_KEYS.all, 'animal', animalId],
};

// Get examinations list
export const useExaminations = (params = {}) => {
  const { selectedClinicId } = useClinic();
  const { hasPermission, isAuthenticated, loading, canAccessClinic } = useAuth();
  
  // Check if user can access the selected clinic
  const canAccessSelectedClinic = selectedClinicId ? canAccessClinic(selectedClinicId) : true;
  
  return useQuery({
    // scope cache by clinic to avoid cross-clinic pollution
    queryKey: ['examinations', 'list', selectedClinicId, { filters: params }],
    queryFn: () => examinationApi.getExaminations(params),
    // Only enable query if user is authenticated, has permission, AND can access selected clinic
    enabled: !loading && isAuthenticated && hasPermission(PERMISSIONS.EXAMINATIONS_VIEW) && canAccessSelectedClinic,
    staleTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true, // Useful for pagination
  });
};

// Get examination by ID
export const useExamination = (id) => {
  const { selectedClinicId } = useClinic();
  const { hasPermission, isAuthenticated, loading } = useAuth();
  
  return useQuery({
    queryKey: ['examinations', 'detail', selectedClinicId, id],
    queryFn: () => examinationApi.getExaminationById(id),
    enabled: !!id && !loading && isAuthenticated && hasPermission(PERMISSIONS.EXAMINATIONS_VIEW),
    staleTime: 0, // Always consider data stale, refetch on mount
    refetchOnMount: 'always', // Always refetch when component mounts
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });
};

// Get examinations by animal ID
export const useExaminationsByAnimal = (animalId) => {
  const { selectedClinicId } = useClinic();
  const { hasPermission, isAuthenticated, loading } = useAuth();
  
  return useQuery({
    queryKey: ['examinations', 'animal', selectedClinicId, animalId],
    queryFn: () => examinationApi.getExaminationsByAnimalId(animalId),
    enabled: !!animalId && !loading && isAuthenticated && hasPermission(PERMISSIONS.EXAMINATIONS_VIEW),
    staleTime: 5 * 60 * 1000,
  });
};

// Create examination mutation
export const useCreateExamination = () => {
  const queryClient = useQueryClient();
  const { selectedClinicId } = useClinic();

  return useMutation({
    mutationFn: examinationApi.createExamination,
    onSuccess: (data) => {
      // Invalidate and refetch examinations list
      queryClient.invalidateQueries({ queryKey: ['examinations', 'list', selectedClinicId] });
      
      // If animal ID is available, invalidate animal-specific examinations
      if (data.animalId) {
        queryClient.invalidateQueries({ 
          queryKey: ['examinations', 'animal', selectedClinicId, data.animalId]
        });
      }
    },
  });
};

// Update examination mutation
export const useUpdateExamination = () => {
  const queryClient = useQueryClient();
  const { selectedClinicId } = useClinic();

  return useMutation({
    mutationFn: ({ id, data }) => examinationApi.updateExamination(id, data),
    onSuccess: (data, variables) => {
      // Invalidate the specific examination cache
      queryClient.invalidateQueries({ 
        queryKey: ['examinations', 'detail', selectedClinicId, variables.id] 
      });
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: ['examinations', 'list', selectedClinicId] });
      
      if (data.animalId) {
        queryClient.invalidateQueries({ 
          queryKey: ['examinations', 'animal', selectedClinicId, data.animalId]
        });
      }
      
      // Also invalidate all examination queries to be safe
      queryClient.invalidateQueries({ queryKey: ['examinations'] });
    },
  });
};

// Delete examination mutation
export const useDeleteExamination = () => {
  const queryClient = useQueryClient();
  const { selectedClinicId } = useClinic();

  return useMutation({
    mutationFn: examinationApi.deleteExamination,
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ['examinations', 'detail', selectedClinicId, deletedId] });
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: ['examinations', 'list', selectedClinicId] });
    },
  });
};

// Create treatments for examination
export const useCreateTreatmentsForExamination = () => {
  const queryClient = useQueryClient();
  const { selectedClinicId } = useClinic();

  return useMutation({
    mutationFn: ({ examinationId, treatments }) => 
      treatmentApi.createTreatmentsForExamination(examinationId, treatments),
    onSuccess: (_, variables) => {
      // Invalidate examination details to refetch with new treatments
      queryClient.invalidateQueries({ 
        queryKey: ['examinations', 'detail', selectedClinicId, variables.examinationId]
      });
    },
  });
};

// Mark examination payment as fully paid
export const useMarkExaminationFullyPaid = () => {
  const queryClient = useQueryClient();
  const { selectedClinicId } = useClinic();

  return useMutation({
    mutationFn: (examinationId) => examinationApi.markFullyPaid(examinationId),
    onSuccess: (_, examinationId) => {
      // Invalidate examination details and lists to refetch with updated payment
      queryClient.invalidateQueries({ 
        queryKey: ['examinations', 'detail', selectedClinicId, examinationId]
      });
      queryClient.invalidateQueries({ 
        queryKey: ['examinations', 'list', selectedClinicId]
      });
    },
  });
};
