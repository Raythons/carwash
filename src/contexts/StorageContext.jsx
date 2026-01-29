import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import storageApi from '../api/storage';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from './AuthContext';

const StorageContext = createContext();

export const useStorage = () => {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error('useStorage must be used within a StorageProvider');
  }
  return context;
};

export const StorageProvider = ({ children }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { isAuthenticated, loading: authLoading, hasPermission } = useAuth();
  const [selectedStorageId, setSelectedStorageId] = useState(null);
  const [storages, setStorages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [defaultStorageId, setDefaultStorageId] = useState(null);

  // Check if user can access a specific storage
  const canAccessStorage = (storageId) => {
    // Owner has access to all storages
    if (hasPermission('AllStorages.Access')) {
      return true;
    }
    // Check if user has specific storage access
    return hasPermission(`Storage.Access.${storageId}`);
  };

  // Load storages from API and determine selected storage respecting stored selection only
  const loadStorages = async () => {
    setIsLoading(true);
    try {
      // Load all storages from API
      const list = await storageApi.getStorages();
      
      // Filter storages to only show ones the user has access to
      const accessibleStorages = list.filter(storage => canAccessStorage(storage.id));
      setStorages(accessibleStorages);

      // Determine current selection: stored -> first accessible storage
      const storedSelected = localStorage.getItem('selectedStorageId');
      const toInt = (v) => (v ? parseInt(v, 10) : null);
      const sel = toInt(storedSelected);

      const hasAccessToStored = sel && canAccessStorage(sel) && accessibleStorages.some(s => s.id === sel);

      if (hasAccessToStored) {
        // Use stored selection if user still has access to it
        setSelectedStorageId(sel);
      } else if (accessibleStorages.length > 0) {
        // Default to first accessible storage
        const firstStorage = accessibleStorages[0];
        setSelectedStorageId(firstStorage.id);
        localStorage.setItem('selectedStorageId', firstStorage.id.toString());
      } else {
        // No accessible storages - user might not have storage permissions
        setSelectedStorageId(null);
        localStorage.removeItem('selectedStorageId');
      }
    } catch (error) {
      console.error('Failed to load storages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only load storages after authentication is ready and user is authenticated
    if (!authLoading && isAuthenticated) {
      loadStorages();
    }
  }, [authLoading, isAuthenticated]);

  const selectStorage = (storageId) => {
    // Check if user can access this storage
    if (storageId && !canAccessStorage(storageId)) {
      import('react-toastify').then(({ toast }) => {
        toast.error(t('storages.access_denied'));
      });
      return; // Don't change the selection - keep previous storage
    }

    setSelectedStorageId(storageId);
    if (storageId) {
      localStorage.setItem('selectedStorageId', storageId.toString());
    } else {
      localStorage.removeItem('selectedStorageId');
    }
    // Invalidate all queries so mounted views refetch using new storage header
    queryClient.invalidateQueries({ predicate: () => true });
  };

  const setDefaultStorage = (storageId) => {
    setDefaultStorageId(storageId ?? null);
    if (storageId) {
      localStorage.setItem('defaultStorageId', storageId.toString());
      // Also set as current selection immediately
      setSelectedStorageId(storageId);
    } else {
      localStorage.removeItem('defaultStorageId');
    }
    // Invalidate all queries so mounted views refetch using new storage header
    queryClient.invalidateQueries({ predicate: () => true });
  };

  // CRUD helpers
  const addStorage = async (payload) => {
    const created = await import('../api/storage').then(m => m.createStorage(payload));
    await loadStorages();
    return created;
  };

  const editStorage = async (id, payload) => {
    const updated = await import('../api/storage').then(m => m.updateStorage(id, payload));
    await loadStorages();
    return updated;
  };

  const removeStorage = async (id) => {
    await import('../api/storage').then(m => m.deleteStorage(id));
    // Clear persisted selections if they point to the deleted storage
    if (selectedStorageId === id) {
      localStorage.removeItem('selectedStorageId');
      setSelectedStorageId(null);
    }
    if (defaultStorageId === id) {
      localStorage.removeItem('defaultStorageId');
      setDefaultStorageId(null);
    }
    await loadStorages();
  };

  // Load default storage from localStorage on mount (selected is derived)
  useEffect(() => {
    const storedDefault = localStorage.getItem('defaultStorageId');
    if (storedDefault) {
      setDefaultStorageId(parseInt(storedDefault, 10));
    }
  }, []);

  const value = {
    selectedStorageId,
    storages,
    isLoading,
    selectStorage,
    defaultStorageId,
    setDefaultStorage,
    addStorage,
    editStorage,
    removeStorage,
    refreshStorages: loadStorages,
    canAccessStorage,
  };

  return (
    <StorageContext.Provider value={value}>
      {children}
    </StorageContext.Provider>
  );
};

export default StorageContext;
