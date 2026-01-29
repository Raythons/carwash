// React Query hooks for appointments
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import appointmentsApi from '../../api/appointments';
import { useClinic } from '../../contexts/ClinicContext';
import { useAuth } from '../../contexts/AuthContext';
import { PERMISSIONS } from '../usePermissions';

export const APPOINTMENT_QUERY_KEYS = {
  all: ['appointments'],
  lists: () => ['appointments', 'list'],
  list: (filters) => ['appointments', 'list', { filters }],
  details: () => ['appointments', 'detail'],
  detail: (id) => ['appointments', 'detail', id],
};

export const useAppointments = (params = {}) => {
  const { selectedClinicId } = useClinic();
  const { hasPermission, isAuthenticated, loading, canAccessClinic } = useAuth();
  
  // Check if user can access the selected clinic
  const canAccessSelectedClinic = selectedClinicId ? canAccessClinic(selectedClinicId) : true;
  
  return useQuery({
    queryKey: ['appointments', 'list', selectedClinicId, { filters: params }],
    queryFn: async () => {
      const res = await appointmentsApi.getAppointments(params);
      const ok = res?.isSuccess ?? res?.IsSuccess;
      const data = ok ? (res?.data ?? res?.Data) : null;
      if (!ok || !data) {
        throw new Error(res?.errors?.[0] ?? res?.Errors?.[0] ?? 'Failed to load appointments');
      }
      const items = (data.items ?? data.Items ?? []).map((a) => ({
        id: a.id,
        appointmentDate: a.appointmentDate ?? a.AppointmentDate,
        appointmentTime: a.appointmentTime ?? a.AppointmentTime,
        firstTime: a.firstTime ?? a.FirstTime,
        ownerName: a.ownerName ?? a.OwnerName,
        ownerPhone: a.ownerPhone ?? a.OwnerPhone ?? '',
        ownerId: a.ownerId ?? a.OwnerId,
        animalName: a.animalName ?? a.AnimalName,
        animalBreed: a.animalBreed ?? a.AnimalBreed ?? '',
        animalType: a.animalTypeName ?? a.AnimalTypeName ?? a.animalType ?? a.AnimalType,
        animalId: a.animalId ?? a.AnimalId,
        status: a.status ?? a.Status,
        notes: a.notes ?? a.Notes ?? '',
        isCanceled: a.isCanceled ?? a.IsCanceled ?? false,
      }));
      return {
        Items: items,
        Page: data.page ?? data.Page ?? params?.page ?? 1,
        PageSize: data.pageSize ?? data.PageSize ?? params?.pageSize ?? 15,
        TotalAccount: data.totalCount ?? data.TotalCount ?? data.TotalAccount ?? 0,
        LastPage:
          data.lastPage ??
          data.LastPage ??
          Math.max(1, Math.ceil(((data.totalCount ?? 0)) / ((data.pageSize ?? 15) || 15))),
        HasNextPage: data.hasNextPage ?? data.HasNextPage ?? false,
        HasPreviousPage: data.hasPreviousPage ?? data.HasPreviousPage ?? false,
      };
    },
    // Only enable query if user is authenticated, has permission, AND can access selected clinic
    enabled: !loading && isAuthenticated && hasPermission(PERMISSIONS.APPOINTMENTS_VIEW) && canAccessSelectedClinic,
    keepPreviousData: true,
    staleTime: 60 * 1000,
  });
};

export const useAppointment = (id) => {
  const { selectedClinicId } = useClinic();
  const { hasPermission, isAuthenticated, loading } = useAuth();
  
  return useQuery({
    queryKey: ['appointments', 'detail', selectedClinicId, id],
    queryFn: () => appointmentsApi.getAppointmentById(id),
    enabled: !!id && !loading && isAuthenticated && hasPermission(PERMISSIONS.APPOINTMENTS_VIEW),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateAppointment = () => {
  const qc = useQueryClient();
  const { selectedClinicId } = useClinic();
  return useMutation({
    mutationFn: appointmentsApi.createAppointment,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['appointments', 'list', selectedClinicId] });
      if (data?.id) {
        qc.invalidateQueries({ queryKey: ['appointments', 'detail', selectedClinicId, data.id] });
      }
    },
  });
};

export const useUpdateAppointment = () => {
  const qc = useQueryClient();
  const { selectedClinicId } = useClinic();
  return useMutation({
    mutationFn: (data) => appointmentsApi.updateAppointment(data.id, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['appointments', 'list', selectedClinicId] });
      qc.invalidateQueries({ queryKey: ['appointments', 'detail', selectedClinicId, vars.id] });
    },
  });
};

export const useDeleteAppointment = () => {
  const qc = useQueryClient();
  const { selectedClinicId } = useClinic();
  return useMutation({
    mutationFn: (id) => appointmentsApi.deleteAppointment(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ['appointments', 'list', selectedClinicId] });
      qc.removeQueries({ queryKey: ['appointments', 'detail', selectedClinicId, id] });
    },
  });
};

export const useCancelAppointment = () => {
  const qc = useQueryClient();
  const { selectedClinicId } = useClinic();
  return useMutation({
    mutationFn: (id) => appointmentsApi.cancelAppointment(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['appointments', 'list', selectedClinicId] });
    },
  });
};

// Hook for expected visits (appointments + surgeries + examinations with follow-up)
export const useExpectedVisits = (params = {}) => {
  const { selectedClinicId } = useClinic();
  const { hasPermission, isAuthenticated, loading, canAccessClinic } = useAuth();
  
  // Check if user can access the selected clinic
  const canAccessSelectedClinic = selectedClinicId ? canAccessClinic(selectedClinicId) : true;
  
  return useQuery({
    queryKey: ['expectedVisits', selectedClinicId, { filters: params }],
    queryFn: async () => {
      const res = await appointmentsApi.getExpectedVisits(params);
      const ok = res?.isSuccess ?? res?.IsSuccess;
      const data = ok ? (res?.data ?? res?.Data) : null;
      if (!ok || !data) {
        throw new Error(res?.errors?.[0] ?? res?.Errors?.[0] ?? 'Failed to load expected visits');
      }
      const items = (data.items ?? data.Items ?? []).map((v) => ({
        id: v.id,
        type: v.type, // "appointment", "surgery", "examination"
        date: v.date ?? v.Date,
        time: v.time ?? v.Time,
        status: v.status ?? v.Status,
        notes: v.notes ?? v.Notes ?? '',
        animalId: v.animalId ?? v.AnimalId,
        animalName: v.animalName ?? v.AnimalName,
        animalType: v.animalType ?? v.AnimalType,
        animalBreed: v.animalBreed ?? v.AnimalBreed ?? '',
        ownerId: v.ownerId ?? v.OwnerId,
        ownerName: v.ownerName ?? v.OwnerName,
        ownerPhone: v.ownerPhone ?? v.OwnerPhone ?? '',
        // Surgery-specific
        durationMinutes: v.durationMinutes ?? v.DurationMinutes,
        surgeryName: v.surgeryName ?? v.SurgeryName,
        // Examination-specific
        diagnosis: v.diagnosis ?? v.Diagnosis,
        firstTime: v.firstTime ?? v.FirstTime,
      }));
      return {
        Items: items,
        Page: data.page ?? data.Page ?? params?.page ?? 1,
        PageSize: data.pageSize ?? data.PageSize ?? params?.pageSize ?? 15,
        TotalAccount: data.totalCount ?? data.TotalCount ?? data.TotalAccount ?? 0,
        LastPage:
          data.lastPage ??
          data.LastPage ??
          Math.max(1, Math.ceil(((data.totalCount ?? 0)) / ((data.pageSize ?? 15) || 15))),
        HasNextPage: data.hasNextPage ?? data.HasNextPage ?? false,
        HasPreviousPage: data.hasPreviousPage ?? data.HasPreviousPage ?? false,
      };
    },
    // Only enable query if user is authenticated, has permission, AND can access selected clinic
    enabled: !loading && isAuthenticated && hasPermission(PERMISSIONS.APPOINTMENTS_VIEW) && canAccessSelectedClinic,
    keepPreviousData: true,
    staleTime: 60 * 1000,
  });
};
