// React Query hooks for clinics
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import clinicsApi from '../../api/clinics';
import { useClinic } from '../../contexts/ClinicContext';
import { useAuth } from '../../contexts/AuthContext';

export const CLINIC_QUERY_KEYS = {
  all: ['clinics'],
  lists: () => ['clinics', 'list'],
  list: () => ['clinics', 'list'],
  details: () => ['clinics', 'detail'],
  detail: (id) => ['clinics', 'detail', id],
};

// While clinics themselves are not scoped by selectedClinicId, we still
// include it in keys to ensure refetch when the active clinic changes
// (useful if privileges or visibility are clinic-dependent).
export const useClinics = () => {
  const { selectedClinicId } = useClinic();
  const { isAuthenticated, loading: authLoading } = useAuth();

  return useQuery({
    queryKey: ['clinics', 'list', selectedClinicId],
    queryFn: clinicsApi.getClinics,
    enabled: !authLoading && isAuthenticated, // Only run when authenticated
    staleTime: 5 * 60 * 1000,
  });
};

export const useClinicById = (id) => {
  const { selectedClinicId } = useClinic();
  const { isAuthenticated, loading: authLoading } = useAuth();

  return useQuery({
    queryKey: ['clinics', 'detail', selectedClinicId, id],
    queryFn: () => clinicsApi.getClinicById(id),
    enabled: !!id && !authLoading && isAuthenticated, // Only run when authenticated and ID exists
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateClinic = () => {
  const qc = useQueryClient();
  const { selectedClinicId } = useClinic();
  return useMutation({
    mutationFn: clinicsApi.createClinic,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['clinics', 'list', selectedClinicId] });
      if (data?.id) qc.invalidateQueries({ queryKey: ['clinics', 'detail', selectedClinicId, data.id] });
    },
  });
};

export const useUpdateClinic = () => {
  const qc = useQueryClient();
  const { selectedClinicId } = useClinic();
  return useMutation({
    mutationFn: ({ id, data }) => clinicsApi.updateClinic(id, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['clinics', 'list', selectedClinicId] });
      qc.invalidateQueries({ queryKey: ['clinics', 'detail', selectedClinicId, vars.id] });
    },
  });
};

export const useDeleteClinic = () => {
  const qc = useQueryClient();
  const { selectedClinicId } = useClinic();
  return useMutation({
    mutationFn: (id) => clinicsApi.deleteClinic(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ['clinics', 'list', selectedClinicId] });
      qc.removeQueries({ queryKey: ['clinics', 'detail', selectedClinicId, id] });
    },
  });
};
