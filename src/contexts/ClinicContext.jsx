// import React, { createContext, useContext, useState, useEffect } from 'react';
// import clinicsApi from '../api/clinics';
// import { useQueryClient } from '@tanstack/react-query';
// import { useAuth } from './AuthContext';

// const ClinicContext = createContext();

// export const useClinic = () => {
//   const context = useContext(ClinicContext);
//   if (!context) {
//     throw new Error('useClinic must be used within a ClinicProvider');
//   }
//   return context;
// };

// export const ClinicProvider = ({ children }) => {
//   const queryClient = useQueryClient();
//   const { isAuthenticated, loading: authLoading, user, hasPermission, canAccessClinic, permissions } = useAuth();
//   const [selectedClinicId, setSelectedClinicId] = useState(null);
//   const [clinics, setClinics] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [defaultClinicId, setDefaultClinicId] = useState(null);

//   // Load clinics from API and determine selected clinic respecting stored selection only
//   const loadClinics = async () => {
//     setIsLoading(true);
//     try {
//       // Load all clinics from API
//       const list = await clinicsApi.getClinics();

//       // Filter clinics to only show ones the user has access to
//       const accessibleClinics = list.filter(clinic => canAccessClinic(clinic.id));
//       setClinics(accessibleClinics);

//       // Determine current selection: stored -> user's assigned clinic -> first accessible clinic
//       const storedSelected = localStorage.getItem('selectedClinicId');
//       const toInt = (v) => (v ? parseInt(v, 10) : null);
//       const sel = toInt(storedSelected);

//       const hasAccessToStored = sel && canAccessClinic(sel) && accessibleClinics.some(c => c.id === sel);
//       const hasAccessToUserClinic = user?.clinicId && canAccessClinic(user.clinicId) && accessibleClinics.some(c => c.id === user.clinicId);

//       if (hasAccessToStored) {
//         // Use stored selection if user still has access to it
//         setSelectedClinicId(sel);
//       } else if (hasAccessToUserClinic) {
//         // Auto-select user's assigned clinic if they have access
//         setSelectedClinicId(user.clinicId);
//         localStorage.setItem('selectedClinicId', user.clinicId.toString());
//       } else if (accessibleClinics.length > 0) {
//         // Default to first accessible clinic
//         const firstClinic = accessibleClinics[0];
//         setSelectedClinicId(firstClinic.id);
//         localStorage.setItem('selectedClinicId', firstClinic.id.toString());
//       } else {
//         // No accessible clinics - this shouldn't happen for valid users
//         setSelectedClinicId(null);
//         localStorage.removeItem('selectedClinicId');
//       }
//     } catch (error) {
//       console.error('Failed to load clinics:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     // Only load clinics after authentication is ready and user is authenticated
//     if (!authLoading && isAuthenticated) {
//       loadClinics();
//     }
//   }, [authLoading, isAuthenticated]);

//   const selectClinic = (clinicId) => {
//     // Check if user can access this clinic
//     if (clinicId && !canAccessClinic(clinicId)) {
//       import('react-toastify').then(({ toast }) => {
//         toast.error('ليس لديك صلاحية للوصول إلى هذه العيادة');
//       });
//       return; // Don't change the selection - keep previous clinic
//     }

//     setSelectedClinicId(clinicId);
//     if (clinicId) {
//       localStorage.setItem('selectedClinicId', clinicId.toString());
//     } else {
//       localStorage.removeItem('selectedClinicId');
//     }
//     // Invalidate all queries so mounted views refetch using new clinic header
//     queryClient.invalidateQueries({ predicate: () => true });
//   };
//   const setDefaultClinic = (clinicId) => {
//     setDefaultClinicId(clinicId ?? null);
//     if (clinicId) {
//       localStorage.setItem('defaultClinicId', clinicId.toString());
//       // Also set as current selection immediately
//       setSelectedClinicId(clinicId);
//     } else {
//       localStorage.removeItem('defaultClinicId');
//     }
//     // Invalidate all queries so mounted views refetch using new clinic header
//     queryClient.invalidateQueries({ predicate: () => true });
//   };

//   // CRUD helpers
//   const addClinic = async (payload) => {
//     const created = await clinicsApi.createClinic(payload);
//     await loadClinics();
//     return created;
//   };

//   const editClinic = async (id, payload) => {
//     const updated = await clinicsApi.updateClinic(id, payload);
//     await loadClinics();
//     return updated;
//   };

//   const removeClinic = async (id) => {
//     await clinicsApi.deleteClinic(id);
//     // Clear persisted selections if they point to the deleted clinic
//     if (selectedClinicId === id) {
//       localStorage.removeItem('selectedClinicId');
//       setSelectedClinicId(null);
//     }
//     if (defaultClinicId === id) {
//       localStorage.removeItem('defaultClinicId');
//       setDefaultClinicId(null);
//     }
//     await loadClinics();
//   };

//   // Load default clinic from localStorage on mount (selected is derived)
//   useEffect(() => {
//     const storedDefault = localStorage.getItem('defaultClinicId');
//     if (storedDefault) {
//       setDefaultClinicId(parseInt(storedDefault, 10));
//     }
//   }, []);

//   const value = {
//     selectedClinicId,
//     clinics,
//     isLoading,
//     selectClinic,
//     defaultClinicId,
//     setDefaultClinic,
//     addClinic,
//     editClinic,
//     removeClinic,
//     refreshClinics: loadClinics,
//   };

//   return (
//     <ClinicContext.Provider value={value}>
//       {children}
//     </ClinicContext.Provider>
//   );
// };

// export default ClinicContext;
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useTranslation } from "react-i18next";
import clinicsApi from "../api/clinics";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./AuthContext";

const ClinicContext = createContext();

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error("useClinic must be used within a ClinicProvider");
  }
  return context;
};

export const ClinicProvider = ({ children }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const {
    isAuthenticated,
    loading: authLoading,
    user,
    canAccessClinic,
  } = useAuth();

  const [selectedClinicId, setSelectedClinicId] = useState(null);
  const [clinics, setClinics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [defaultClinicId, setDefaultClinicId] = useState(null);

  // 1. WRAP THIS IN useCallback TO PREVENT INFINITE LOOPS
  const loadClinics = useCallback(async () => {
    // If we are already loading, don't trigger again (simple debounce)
    setIsLoading((prev) => {
      if (prev) return prev;
      return true;
    });

    try {
      const list = await clinicsApi.getClinics();

      // Permission check
      // (Ensure canAccessClinic is stable or handle inside AuthContext)
      const accessibleClinics = list.filter((clinic) =>
        canAccessClinic ? canAccessClinic(clinic.id) : true
      );
      setClinics(accessibleClinics);

      // Selection Logic
      const storedSelected = localStorage.getItem("selectedClinicId");
      const userClinicId = user?.clinicId;

      if (storedSelected === "ALL" || !storedSelected) {
        setSelectedClinicId(null);
        if (!storedSelected) {
          localStorage.setItem("selectedClinicId", "ALL");
        }
      } else {
        const sel = parseInt(storedSelected, 10);
        const hasAccessToStored = accessibleClinics.some((c) => c.id === sel);
        const hasAccessToUserClinic = userClinicId && accessibleClinics.some((c) => c.id === userClinicId);

        if (hasAccessToStored) {
          setSelectedClinicId(sel);
        } else if (hasAccessToUserClinic) {
          setSelectedClinicId(userClinicId);
          localStorage.setItem("selectedClinicId", userClinicId.toString());
        } else if (accessibleClinics.length > 0) {
          const firstClinic = accessibleClinics[0];
          setSelectedClinicId(firstClinic.id);
          localStorage.setItem("selectedClinicId", firstClinic.id.toString());
        } else {
          setSelectedClinicId(null);
          localStorage.setItem("selectedClinicId", "ALL");
        }
      }
    } catch (error) {
      console.error("Failed to load clinics:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user, canAccessClinic]); // Only recreate if user/auth changes

  // Load on mount/auth change
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      loadClinics();
    }
  }, [authLoading, isAuthenticated, loadClinics]);

  // 2. Wrap helpers in useCallback
  const selectClinic = useCallback(
    (clinicId) => {
      if (clinicId && canAccessClinic && !canAccessClinic(clinicId)) {
        import("react-toastify").then(({ toast }) =>
          toast.error(t("clinics.access_denied"))
        );
        return;
      }
      setSelectedClinicId(clinicId);
      clinicId
        ? localStorage.setItem("selectedClinicId", clinicId)
        : localStorage.setItem("selectedClinicId", "ALL");
      queryClient.invalidateQueries();
    },
    [canAccessClinic, queryClient]
  );

  const setDefaultClinic = useCallback(
    (clinicId) => {
      setDefaultClinicId(clinicId ?? null);
      clinicId
        ? localStorage.setItem("defaultClinicId", clinicId)
        : localStorage.removeItem("defaultClinicId");
      queryClient.invalidateQueries();
    },
    [queryClient]
  );

  // --- CRUD ---
  const addClinic = useCallback(
    async (payload) => {
      const created = await clinicsApi.createClinic(payload);
      await queryClient.invalidateQueries();
      await loadClinics();
      return created;
    },
    [queryClient, loadClinics]
  );

  const editClinic = useCallback(
    async (id, payload) => {
      const updated = await clinicsApi.updateClinic(id, payload);
      await queryClient.invalidateQueries();
      await loadClinics();
      return updated;
    },
    [queryClient, loadClinics]
  );

  const removeClinic = useCallback(
    async (id) => {
      await clinicsApi.deleteClinic(id);
      // We need to access the current state values here,
      // but since we are inside useCallback, we must be careful.
      // Ideally, check state inside the setter or after loading.
      // For simplicity, we just clean storage if needed.

      const storedSel = localStorage.getItem("selectedClinicId");
      if (storedSel && parseInt(storedSel) === id) {
        localStorage.removeItem("selectedClinicId");
        setSelectedClinicId(null);
      }

      const storedDef = localStorage.getItem("defaultClinicId");
      if (storedDef && parseInt(storedDef) === id) {
        localStorage.removeItem("defaultClinicId");
        setDefaultClinicId(null);
      }

      await queryClient.invalidateQueries();
      await loadClinics();
    },
    [queryClient, loadClinics]
  );

  useEffect(() => {
    const storedDefault = localStorage.getItem("defaultClinicId");
    if (storedDefault) setDefaultClinicId(parseInt(storedDefault, 10));
  }, []);

  // 3. Wrap the value object in useMemo so the object reference stays stable
  const value = useMemo(
    () => ({
      selectedClinicId,
      clinics,
      isLoading,
      selectClinic,
      defaultClinicId,
      setDefaultClinic,
      addClinic,
      editClinic,
      removeClinic,
      refreshClinics: loadClinics,
    }),
    [
      selectedClinicId,
      clinics,
      isLoading,
      defaultClinicId,
      selectClinic,
      setDefaultClinic,
      addClinic,
      editClinic,
      removeClinic,
      loadClinics,
    ]
  );

  return (
    <ClinicContext.Provider value={value}>{children}</ClinicContext.Provider>
  );
};

export default ClinicContext;
