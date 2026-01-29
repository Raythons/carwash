// React Query hooks for animal types
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { animalTypeApi } from '../../api/animalTypes';
import { useClinic } from '../../contexts/ClinicContext';

export const ANIMAL_TYPE_QUERY_KEYS = {
  all: ['animal-types'],
  lists: () => ['animal-types', 'list'],
  list: () => ['animal-types', 'list'],
};

// Include selectedClinicId in key so switching clinics triggers refetch if needed
export const useAnimalTypes = () => {
  const { selectedClinicId } = useClinic();
  return useQuery({
    queryKey: ['animal-types', 'list', selectedClinicId],
    queryFn: animalTypeApi.getAnimalTypes,
    staleTime: 10 * 60 * 1000,
  });
};

export const useCreateAnimalType = () => {
  const qc = useQueryClient();
  const { selectedClinicId } = useClinic();
  return useMutation({
    mutationFn: animalTypeApi.createAnimalType,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['animal-types', 'list', selectedClinicId] });
    },
  });
};
