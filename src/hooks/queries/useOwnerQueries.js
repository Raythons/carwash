// React Query hooks for owners and their animals
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ownerApi from "@/api/ownerApi";
import { useClinic } from "../../contexts/ClinicContext";
import { useAuth } from "../../contexts/AuthContext";
import { PERMISSIONS } from "../usePermissions";

export const OWNER_QUERY_KEYS = {
  all: ["owners"],
  lists: () => ["owners", "list"],
  list: (filters) => ["owners", "list", { filters }],
  details: () => ["owners", "detail"],
  detail: (id) => ["owners", "detail", id],
  animals: (ownerId) => ["owners", ownerId, "animals"],
};

export const useOwners = (params = {}, options = {}) => {
  const { selectedClinicId } = useClinic();
  const { hasPermission, isAuthenticated, loading, canAccessClinic } =
    useAuth();
  const { enabled = true } = options;

  // Check if user can access the selected clinic
  const canAccessSelectedClinic = selectedClinicId
    ? canAccessClinic(selectedClinicId)
    : true;

  return useQuery({
    queryKey: ["owners", "list", selectedClinicId, { filters: params }],
    queryFn: () => ownerApi.getOwners(params),
    enabled:
      enabled &&
      !loading &&
      isAuthenticated &&
      hasPermission(PERMISSIONS.OWNERS_VIEW) &&
      canAccessSelectedClinic,
    keepPreviousData: true,
    staleTime: 60 * 1000,
  });
};

export const useOwner = (id) => {
  const { selectedClinicId } = useClinic();
  const { hasPermission, isAuthenticated, loading } = useAuth();

  return useQuery({
    queryKey: ["owners", "detail", selectedClinicId, id],
    queryFn: () => ownerApi.getOwnerById(id),
    enabled:
      !!id &&
      !loading &&
      isAuthenticated &&
      hasPermission(PERMISSIONS.OWNERS_VIEW),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateOwner = () => {
  const qc = useQueryClient();
  const { selectedClinicId } = useClinic();
  return useMutation({
    mutationFn: ownerApi.createOwner,
    // If owner creation includes animals, we must ensure the global animals list is refreshed
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["owners", "list", selectedClinicId] });
      // if the request included animals, invalidate the animals list so AnimalsTable reflects them
      if (
        vars &&
        vars.animals &&
        Array.isArray(vars.animals) &&
        vars.animals.length > 0
      ) {
        qc.invalidateQueries({
          queryKey: ["animals", "list", selectedClinicId],
        });
      }
    },
  });
};

export const useUpdateOwner = () => {
  const qc = useQueryClient();
  const { selectedClinicId } = useClinic();
  return useMutation({
    mutationFn: ({ id, data }) => ownerApi.updateOwner(id, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["owners", "list", selectedClinicId] });
      qc.invalidateQueries({
        queryKey: ["owners", "detail", selectedClinicId, vars.id],
      });
    },
  });
};

export const useDeleteOwner = () => {
  const qc = useQueryClient();
  const { selectedClinicId } = useClinic();
  return useMutation({
    mutationFn: (id) => ownerApi.deleteOwner(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ["owners", "list", selectedClinicId] });
      qc.removeQueries({
        queryKey: ["owners", "detail", selectedClinicId, id],
      });
    },
  });
};

// Owner animals
export const useOwnerAnimals = (ownerId) => {
  const { selectedClinicId } = useClinic();
  return useQuery({
    queryKey: ["owners", ownerId, "animals", selectedClinicId],
    queryFn: () => ownerApi.getOwnerAnimals(ownerId),
    enabled: !!ownerId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAddAnimalToOwner = () => {
  const qc = useQueryClient();
  const { selectedClinicId } = useClinic();
  return useMutation({
    mutationFn: ({ ownerId, animalData }) =>
      ownerApi.addAnimalToOwner(ownerId, animalData),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({
        queryKey: ["owners", vars.ownerId, "animals", selectedClinicId],
      });
      qc.invalidateQueries({ queryKey: ["owners", "list", selectedClinicId] });
    },
  });
};

export const useUpdateOwnerAnimal = () => {
  const qc = useQueryClient();
  const { selectedClinicId } = useClinic();
  return useMutation({
    mutationFn: ({ ownerId, animalId, animalData }) =>
      ownerApi.updateOwnerAnimal(ownerId, animalId, animalData),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({
        queryKey: ["owners", vars.ownerId, "animals", selectedClinicId],
      });
    },
  });
};

export const useRemoveAnimalFromOwner = () => {
  const qc = useQueryClient();
  const { selectedClinicId } = useClinic();
  return useMutation({
    mutationFn: ({ ownerId, animalId }) =>
      ownerApi.removeAnimalFromOwner(ownerId, animalId),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({
        queryKey: ["owners", vars.ownerId, "animals", selectedClinicId],
      });
    },
  });
};
