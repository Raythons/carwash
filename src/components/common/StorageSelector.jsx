import React from 'react';
import { useStorage } from '@/contexts/StorageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Package } from 'lucide-react';
import { cn } from '@/utilities/cn';

const StorageSelector = ({ className = "" }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { selectedStorageId, storages, isLoading, selectStorage, setDefaultStorage } = useStorage();
  const { hasPermission } = useAuth();

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Package className="w-4 h-4 text-gray-400 dark:text-zinc-500" />
        <div className="w-32 h-8 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded"></div>
      </div>
    );
  }

  if (storages.length <= 1) {
    return null; // Don't show selector if only one storage
  }

  return (
    <div className={cn("flex items-center gap-2", className)} dir={isRTL ? "rtl" : "ltr"}>
      <Package className="w-4 h-4 text-primary-600 dark:text-primary-400" />
      <Select
        value={selectedStorageId ? selectedStorageId.toString() : "ALL"}
        onValueChange={(value) => {
          if (value === "ALL") {
            // Clear both current selection and default to persist ALL across refresh
            setDefaultStorage(null);
            selectStorage(null);
          } else {
            selectStorage(parseInt(value, 10));
          }
        }}
      >
        <SelectTrigger className={cn("w-40 h-8 text-sm border-primary-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 dark:text-zinc-100", isRTL ? "text-right" : "text-left")}>
          <SelectValue placeholder={t("common.select_storage")} />
        </SelectTrigger>
        <SelectContent>
          {/* Only show "All" option if user has AllStorages.Access permission */}
          {hasPermission('AllStorages.Access') && (
            <SelectItem value="ALL" className={isRTL ? "text-right" : "text-left"}>
              {t("common.all")}
            </SelectItem>
          )}
          {storages.map((storage) => (
            <SelectItem
              key={storage.id}
              value={storage.id.toString()}
              className={isRTL ? "text-right" : "text-left"}
            >
              {storage.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default StorageSelector;
