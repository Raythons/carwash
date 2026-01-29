// React Query hooks for statistics
import { useQuery } from "@tanstack/react-query";
import { useClinic } from "../../contexts/ClinicContext";
import { useAuth } from "../../contexts/AuthContext";
import { PERMISSIONS } from "../usePermissions";
import { statisticsApi } from "@/api/statisticsApi";

export const usePaymentStatistics = (params = {}) => {
  const { selectedClinicId } = useClinic();
  const { hasPermission, isAuthenticated, loading } = useAuth();

  return useQuery({
    queryKey: ["statistics", "payments", selectedClinicId, params],
    queryFn: async () => {
      const response = await statisticsApi.getPaymentStatistics({
        ...params,
        clinicId: selectedClinicId,
      });
      return response;
    },
    staleTime: 30 * 1000, // 30 seconds - financial data should be fresh
    enabled:
      !loading && isAuthenticated && hasPermission(PERMISSIONS.STATISTICS_VIEW),
    retry: 1,
    onError: (error) => {
      console.error("Error fetching payment statistics:", error);
    },
  });
};

export const useMonthlyRevenue = (year) => {
  const { selectedClinicId } = useClinic();
  const { hasPermission, isAuthenticated, loading } = useAuth();

  return useQuery({
    queryKey: ["statistics", "monthly-revenue", selectedClinicId, year],
    queryFn: async () => {
      const response = await statisticsApi.getMonthlyRevenue(
        year,
        selectedClinicId
      );
      return response;
    },
    staleTime: 30 * 1000, // 30 seconds - financial data should be fresh
    enabled:
      !!year &&
      !loading &&
      isAuthenticated &&
      hasPermission(PERMISSIONS.STATISTICS_VIEW),
    retry: 1,
    onError: (error) => {
      console.error("Error fetching monthly revenue:", error);
    },
  });
};

export const usePaymentTypeBreakdown = (params = {}) => {
  const { selectedClinicId } = useClinic();
  const { hasPermission, isAuthenticated, loading } = useAuth();

  return useQuery({
    queryKey: ["statistics", "payment-types", selectedClinicId, params],
    queryFn: async () => {
      const response = await statisticsApi.getPaymentTypeBreakdown({
        ...params,
        clinicId: selectedClinicId,
      });
      return response;
    },
    staleTime: 30 * 1000, // 30 seconds - financial data should be fresh
    enabled:
      !loading && isAuthenticated && hasPermission(PERMISSIONS.STATISTICS_VIEW),
    retry: 1,
    onError: (error) => {
      console.error("Error fetching payment type breakdown:", error);
    },
  });
};

export const useGoalComparison = (year) => {
  const { selectedClinicId } = useClinic();
  const { hasPermission, isAuthenticated, loading } = useAuth();

  return useQuery({
    queryKey: ["statistics", "goals-comparison", selectedClinicId, year],
    queryFn: async () => {
      const response = await statisticsApi.getGoalComparison(
        year,
        selectedClinicId
      );
      return response;
    },
    staleTime: 30 * 1000, // 30 seconds - financial data should be fresh
    enabled:
      !!year &&
      !loading &&
      isAuthenticated &&
      hasPermission(PERMISSIONS.STATISTICS_VIEW),
    retry: 1,
    onError: (error) => {
      console.error("Error fetching goal comparison:", error);
    },
  });
};

export const useAnimalTypeDistribution = (params = {}) => {
  const { selectedClinicId } = useClinic();
  const { hasPermission, isAuthenticated, loading } = useAuth();

  return useQuery({
    queryKey: ["statistics", "animal-types", selectedClinicId, params],
    queryFn: async () => {
      const response = await statisticsApi.getAnimalTypeDistribution({
        ...params,
        clinicId: selectedClinicId,
      });

      return response;
    },
    staleTime: 60 * 1000, // animal composition changes less frequently
    enabled:
      !loading && isAuthenticated && hasPermission(PERMISSIONS.STATISTICS_VIEW),
    retry: 1,
    onError: (error) => {
      console.error("Error fetching animal type distribution:", error);
    },
  });
};

export const useExaminationsMonthly = (year) => {
  const { selectedClinicId } = useClinic();
  const { hasPermission, isAuthenticated, loading } = useAuth();

  return useQuery({
    queryKey: ["statistics", "examinations-monthly", selectedClinicId, year],
    queryFn: async () => {
      const response = await statisticsApi.getExaminationsMonthly(year, {
        clinicId: selectedClinicId,
      });

      return response;
    },
    staleTime: 30 * 1000,
    enabled:
      !!year &&
      !loading &&
      isAuthenticated &&
      hasPermission(PERMISSIONS.STATISTICS_VIEW),
    retry: 1,
    onError: (error) => {
      console.error("Error fetching examinations monthly:", error);
    },
  });
};

export const useSurgeriesMonthly = (year) => {
  const { selectedClinicId } = useClinic();
  const { hasPermission, isAuthenticated, loading } = useAuth();

  return useQuery({
    queryKey: ["statistics", "surgeries-monthly", selectedClinicId, year],
    queryFn: async () => {
      const response = await statisticsApi.getSurgeriesMonthly(year, {
        clinicId: selectedClinicId,
      });

      return response;
    },
    staleTime: 30 * 1000,
    enabled:
      !!year &&
      !loading &&
      isAuthenticated &&
      hasPermission(PERMISSIONS.STATISTICS_VIEW),
    retry: 1,
    onError: (error) => {
      console.error("Error fetching surgeries monthly:", error);
    },
  });
};
