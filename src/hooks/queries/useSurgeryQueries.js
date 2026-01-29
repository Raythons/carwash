// React Query hooks for surgeries and surgery appointments
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { surgeryAppointmentsApi, surgeriesApi, surgeryFollowUpsApi } from '@/api/surgeries';
import { useClinic } from '@/contexts/ClinicContext';
import { useAuth } from '@/contexts/AuthContext';
import { PERMISSIONS } from '@/hooks/usePermissions';

// Query keys
export const SURGERY_APPT_QUERY_KEYS = {
  all: ['surgery-appointments'],
  lists: () => [...SURGERY_APPT_QUERY_KEYS.all, 'list'],
  list: (filters) => [...SURGERY_APPT_QUERY_KEYS.lists(), { filters }],
  details: () => [...SURGERY_APPT_QUERY_KEYS.all, 'detail'],
  detail: (id) => [...SURGERY_APPT_QUERY_KEYS.details(), id],
};

export const SURGERIES_QUERY_KEYS = {
  all: ['surgeries'],
  lists: () => [...SURGERIES_QUERY_KEYS.all, 'list'],
  list: (filters) => [...SURGERIES_QUERY_KEYS.lists(), { filters }],
  details: () => [...SURGERIES_QUERY_KEYS.all, 'detail'],
  detail: (id) => [...SURGERIES_QUERY_KEYS.details(), id],
};

export const SURGERY_FOLLOWUPS_QUERY_KEYS = {
  all: ['surgery-followups'],
  lists: () => [...SURGERY_FOLLOWUPS_QUERY_KEYS.all, 'list'],
  list: (filters) => [...SURGERY_FOLLOWUPS_QUERY_KEYS.lists(), { filters }],
  details: () => [...SURGERY_FOLLOWUPS_QUERY_KEYS.all, 'detail'],
  detail: (id) => [...SURGERY_FOLLOWUPS_QUERY_KEYS.details(), id],
};

// Surgery Appointments
export const useSurgeryAppointments = (params = {}) => {
  const { selectedClinicId } = useClinic();
  const { hasPermission, isAuthenticated, loading } = useAuth();
  
  return useQuery({
    queryKey: ['surgery-appointments', 'list', selectedClinicId, { filters: params }],
    queryFn: () => surgeryAppointmentsApi.get(params),
    // Only enable query if user is authenticated and has permission
    enabled: !loading && isAuthenticated && hasPermission(PERMISSIONS.SURGERIES_VIEW),
    keepPreviousData: true,
    staleTime: 60 * 1000,
  });
};

export const useSurgeryAppointment = (id) => {
  const { selectedClinicId } = useClinic();
  const { hasPermission, isAuthenticated, loading } = useAuth();
  
  return useQuery({
    queryKey: ['surgery-appointments', 'detail', selectedClinicId, id],
    queryFn: () => surgeryAppointmentsApi.getById(id),
    enabled: !!id && !loading && isAuthenticated && hasPermission(PERMISSIONS.SURGERIES_VIEW),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateSurgeryAppointment = () => {
  const qc = useQueryClient();
  const { selectedClinicId } = useClinic();
  return useMutation({
    mutationFn: surgeryAppointmentsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['surgery-appointments', 'list', selectedClinicId] });
    },
  });
};

export const useUpdateSurgeryAppointment = () => {
  const qc = useQueryClient();
  const { selectedClinicId } = useClinic();
  return useMutation({
    mutationFn: ({ id, data }) => surgeryAppointmentsApi.update(id, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['surgery-appointments', 'list', selectedClinicId] });
      qc.invalidateQueries({ queryKey: ['surgery-appointments', 'detail', selectedClinicId, vars.id] });
    },
  });
};

export const useDeleteSurgeryAppointment = () => {
  const qc = useQueryClient();
  const { selectedClinicId } = useClinic();
  return useMutation({
    mutationFn: (id) => surgeryAppointmentsApi.delete(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ['surgery-appointments', 'list', selectedClinicId] });
      qc.removeQueries({ queryKey: ['surgery-appointments', 'detail', selectedClinicId, id] });
    },
  });
};

// Surgeries
export const useSurgeries = (params = {}) => {
  const { selectedClinicId } = useClinic();
  const { hasPermission, isAuthenticated, loading } = useAuth();
  
  return useQuery({
    queryKey: ['surgeries', 'list', selectedClinicId, { filters: params }],
    queryFn: () => surgeriesApi.get(params),
    enabled: !loading && isAuthenticated && hasPermission(PERMISSIONS.SURGERIES_VIEW),
    keepPreviousData: true,
    staleTime: 60 * 1000,
  });
};

export const useSurgery = (id) => {
  const { selectedClinicId } = useClinic();
  const { hasPermission, isAuthenticated, loading } = useAuth();
  
  return useQuery({
    queryKey: ['surgeries', 'detail', selectedClinicId, id],
    queryFn: () => surgeriesApi.getById(id),
    enabled: !!id && !loading && isAuthenticated && hasPermission(PERMISSIONS.SURGERIES_VIEW),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateSurgery = () => {
  const qc = useQueryClient();
  const { selectedClinicId } = useClinic();
  return useMutation({
    mutationFn: surgeriesApi.create,
    onSuccess: (data) => {
      // Often created from an appointment; refresh appointments list
      qc.invalidateQueries({ queryKey: ['surgery-appointments', 'list', selectedClinicId] });
      if (data?.id) {
        qc.invalidateQueries({ queryKey: ['surgeries', 'detail', selectedClinicId, data.id] });
      }
    },
    // Don't add onError here to prevent duplicate toasts - let components handle errors
  });
};

export const useUpdateSurgery = () => {
  const qc = useQueryClient();
  const { selectedClinicId } = useClinic();
  return useMutation({
    mutationFn: ({ id, data }) => surgeriesApi.update(id, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['surgeries', 'detail', selectedClinicId, vars.id] });
    },
  });
};

export const useDeleteSurgery = () => {
  const qc = useQueryClient();
  const { selectedClinicId } = useClinic();
  return useMutation({
    mutationFn: (id) => surgeriesApi.delete(id),
    onSuccess: (_, id) => {
      qc.removeQueries({ queryKey: ['surgeries', 'detail', selectedClinicId, id] });
      // Also refresh appointments list; deleting a surgery may affect appointment state
      qc.invalidateQueries({ queryKey: ['surgery-appointments', 'list', selectedClinicId] });
    },
  });
};

export const useAddSurgeryFollowUp = () => {
  const qc = useQueryClient();
  const { selectedClinicId } = useClinic();
  return useMutation({
    mutationFn: ({ surgeryId, data }) => surgeriesApi.addFollowUp(surgeryId, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['surgeries', 'detail', selectedClinicId, vars.surgeryId] });
    },
  });
};

export const useMarkSurgeryFullyPaid = () => {
  const qc = useQueryClient();
  const { selectedClinicId } = useClinic();
  return useMutation({
    mutationFn: (surgeryId) => surgeriesApi.markFullyPaid(surgeryId),
    onSuccess: (_, surgeryId) => {
      qc.invalidateQueries({ queryKey: ['surgeries', 'detail', selectedClinicId, surgeryId] });
      qc.invalidateQueries({ queryKey: ['surgeries', 'list', selectedClinicId] });
    },
  });
};

// Surgery Follow-ups
export const useSurgeryFollowUps = (params = {}) => {
  const { selectedClinicId } = useClinic();
  const { hasPermission, isAuthenticated, loading } = useAuth();
  
  return useQuery({
    queryKey: ['surgery-followups', 'list', selectedClinicId, { filters: params }],
    queryFn: () => surgeryFollowUpsApi.get(params),
    enabled: !loading && isAuthenticated && hasPermission(PERMISSIONS.SURGERIES_VIEW),
    keepPreviousData: true,
    staleTime: 60 * 1000,
  });
};

export const useSurgeryFollowUp = (id) => {
  const { selectedClinicId } = useClinic();
  const { hasPermission, isAuthenticated, loading } = useAuth();
  
  return useQuery({
    queryKey: ['surgery-followups', 'detail', selectedClinicId, id],
    queryFn: () => surgeryFollowUpsApi.getById(id),
    enabled: !!id && !loading && isAuthenticated && hasPermission(PERMISSIONS.SURGERIES_VIEW),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateSurgeryFollowUp = () => {
  const qc = useQueryClient();
  const { selectedClinicId } = useClinic();
  return useMutation({
    mutationFn: surgeryFollowUpsApi.create,
    onSuccess: (data) => {
      const surgeryId = data?.surgeryId;
      // Invalidate the list of all follow-ups
      qc.invalidateQueries({ queryKey: ['surgery-followups', 'list', selectedClinicId] });
      // Invalidate the specific surgery detail query to refresh the follow-up list on that page
      if (surgeryId) {
        qc.invalidateQueries({ queryKey: ['surgeries', 'detail', selectedClinicId, surgeryId.toString()] });
      }
      // Also invalidate all surgery detail queries to be safe
      qc.invalidateQueries({ queryKey: ['surgeries', 'detail'] });
    },
  });
};

export const useUpdateSurgeryFollowUp = () => {
  const qc = useQueryClient();
  const { selectedClinicId } = useClinic();
  return useMutation({
    mutationFn: ({ id, data }) => surgeryFollowUpsApi.update(id, data),
    onSuccess: (data, vars) => {
      const surgeryId = data?.surgeryId;
      // Invalidate the list of all follow-ups
      qc.invalidateQueries({ queryKey: ['surgery-followups', 'list', selectedClinicId] });
      // Invalidate the specific follow-up detail query
      qc.invalidateQueries({ queryKey: ['surgery-followups', 'detail', selectedClinicId, vars.id] });
      // Invalidate the specific surgery detail query to refresh the follow-up list on that page
      if (surgeryId) {
        qc.invalidateQueries({ queryKey: ['surgeries', 'detail', selectedClinicId, surgeryId.toString()] });
      }
      // Also invalidate all surgery detail queries to be safe
      qc.invalidateQueries({ queryKey: ['surgeries', 'detail'] });
    },
  });
};

export const useDeleteSurgeryFollowUp = () => {
  const qc = useQueryClient();
  const { selectedClinicId } = useClinic();
  return useMutation({
    mutationFn: (id) => surgeryFollowUpsApi.delete(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ['surgery-followups', 'list', selectedClinicId] });
      qc.removeQueries({ queryKey: ['surgery-followups', 'detail', selectedClinicId, id] });
    },
  });
};

export const useSurgeryFollowUpsCount = (params = {}) => {
  const { selectedClinicId } = useClinic();
  const { hasPermission, isAuthenticated, loading } = useAuth();
  
  return useQuery({
    queryKey: ['surgery-followups', 'count', selectedClinicId, { filters: params }],
    queryFn: () => surgeryFollowUpsApi.getCount(params),
    enabled: !loading && isAuthenticated && hasPermission(PERMISSIONS.SURGERIES_VIEW),
    staleTime: 60 * 1000,
  });
};
