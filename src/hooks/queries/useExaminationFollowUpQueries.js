import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { examinationFollowUpApi } from '@/api/examinationFollowUpApi';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export const useExaminationFollowUps = (examinationId, options = {}) => {
  return useQuery({
    queryKey: ['examination-followups', examinationId],
    queryFn: () => examinationFollowUpApi.getByExaminationId(examinationId),
    enabled: !!examinationId,
    ...options,
  });
};

export const useExaminationFollowUp = (id, options = {}) => {
  return useQuery({
    queryKey: ['examination-followup', id],
    queryFn: () => examinationFollowUpApi.getById(id),
    enabled: !!id,
    ...options,
  });
};

export const useCreateExaminationFollowUp = (onSuccess) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: examinationFollowUpApi.create,
    onSuccess: (data) => {
      // Invalidate and refetch follow-ups for this examination
      queryClient.invalidateQueries({ queryKey: ['examination-followups'] });
      queryClient.invalidateQueries({ queryKey: ['examination-followup'] });
      onSuccess?.();
    },
    onError: (error) => {
      console.error('Follow-up creation error:', error);
      // Don't show toast here since it's handled in the component
    },
  });
};

export const useUpdateExaminationFollowUp = (onSuccess) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => examinationFollowUpApi.update(id, data),
    onSuccess: (data) => {
      // Invalidate and refetch follow-ups for this examination
      queryClient.invalidateQueries({ queryKey: ['examination-followups'] });
      queryClient.invalidateQueries({ queryKey: ['examination-followup'] });
      onSuccess?.();
    },
    onError: (error) => {
      console.error('Follow-up update error:', error);
      // Don't show toast here since it's handled in the component
    },
  });
};

export const useDeleteExaminationFollowUp = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: examinationFollowUpApi.delete,
    onSuccess: () => {
      // Invalidate all follow-up queries
      queryClient.invalidateQueries({ queryKey: ['examination-followups'] });
      queryClient.invalidateQueries({ queryKey: ['examination-followup'] });
    },
  });
};

export const useMarkExaminationFollowUpFullyPaid = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  
  return useMutation({
    mutationFn: examinationFollowUpApi.markFullyPaid,
    onSuccess: () => {
      // Invalidate all follow-up queries to refresh payment status
      queryClient.invalidateQueries({ queryKey: ['examination-followups'] });
      queryClient.invalidateQueries({ queryKey: ['examination-followup'] });
      toast.success(t('examinations.followup.payment_status_updated'));
    },
    onError: (error) => {
      toast.error(error?.message || t('examinations.followup.payment_status_error'));
    },
  });
};
