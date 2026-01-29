import React, { useRef, useEffect } from "react";
import { Shield, Building2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/utilities/cn";

export default function EmployeePermissionsForm({
  formData,
  errors,
  allPermissions,
  clinicsData,
  storagesData,
  handlePermissionChange,
  handleSelectAllPermissionsInGroup,
  handleClinicSelection,
  handleStorageSelection
}) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const groupRefs = useRef({});

  // Update indeterminate state for group checkboxes
  useEffect(() => {
    allPermissions.forEach(group => {
      const groupPermissions = group.permissions.map(p => p.key);
      const selectedInGroup = formData.permissions.filter(p => groupPermissions.includes(p));
      const checkbox = groupRefs.current[group.group];

      if (checkbox) {
        if (selectedInGroup.length === 0) {
          checkbox.checked = false;
          checkbox.indeterminate = false;
        } else if (selectedInGroup.length === groupPermissions.length) {
          checkbox.checked = true;
          checkbox.indeterminate = false;
        } else {
          checkbox.checked = false;
          checkbox.indeterminate = true;
        }
      }
    });
  }, [formData.permissions, allPermissions]);

  return (
    <div className="space-y-8" dir={isRTL ? "rtl" : "ltr"}>
      {/* Permissions Section */}
      <div className="bg-gray-50 dark:bg-zinc-800/30 rounded-lg p-6 border dark:border-zinc-800">
        <div className={cn("flex items-center space-x-3 mb-6", isRTL && "space-x-reverse")}>
          <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-100">{t("employees.permissions")}</h3>
        </div>

        <div className="space-y-6">
          {allPermissions.map((group, index) => {
            const groupPermissions = group.permissions.map(p => p.key);
            const selectedInGroup = formData.permissions.filter(p => groupPermissions.includes(p));

            return (
              <div key={group.group || index} className="bg-white dark:bg-zinc-900/50 rounded-lg p-4 border border-gray-200 dark:border-zinc-700">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900 dark:text-zinc-100">{t(`employees.permission_groups.${group.group}`, { defaultValue: group.group })}</h4>
                  <label className={cn("flex items-center space-x-2 cursor-pointer", isRTL && "space-x-reverse")}>
                    <input
                      ref={el => groupRefs.current[group.group] = el}
                      type="checkbox"
                      onChange={(e) => handleSelectAllPermissionsInGroup(group.permissions, e.target.checked)}
                      className="rounded border-gray-300 dark:border-zinc-600 dark:bg-zinc-800 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-400"
                    />
                    <span className="text-sm text-gray-600 dark:text-zinc-400">{t("common.select_all")}</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {group.permissions.map((permission, pIndex) => (
                    <label key={permission.key || pIndex} className={cn("flex items-center space-x-2 cursor-pointer", isRTL && "space-x-reverse")}>
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(permission.key)}
                        onChange={(e) => handlePermissionChange(permission.key, e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-white">{t(`employees.permission_labels.${permission.key}`, { defaultValue: permission.label })}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Clinic Access Section */}
      <div className="bg-gray-50 dark:bg-zinc-800/30 rounded-lg p-6 border dark:border-zinc-800">
        <div className={cn("flex items-center space-x-3 mb-6", isRTL && "space-x-reverse")}>
          <Building2 className="w-6 h-6 text-green-600 dark:text-green-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-100">{t("employees.clinic_access")}</h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-3">
            <label className={cn("flex items-center space-x-3 cursor-pointer", isRTL && "space-x-reverse")}>
              <input
                type="radio"
                name="clinicAccess"
                value="all"
                checked={formData.clinicAccess === "all"}
                onChange={(e) => {
                  handleClinicSelection("clinicAccess", e.target.value);
                }}
                className="text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-zinc-100">{t("employees.all_clinics")}</span>
            </label>

            <label className={cn("flex items-center space-x-3 cursor-pointer", isRTL && "space-x-reverse")}>
              <input
                type="radio"
                name="clinicAccess"
                value="specific"
                checked={formData.clinicAccess === "specific"}
                onChange={(e) => {
                  handleClinicSelection("clinicAccess", e.target.value);
                }}
                className="text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-400"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-zinc-100">{t("employees.specific_clinics")}</span>
            </label>
          </div>

          {formData.clinicAccess === "specific" && (
            <div className="space-y-2">
              <label className={cn("text-sm font-medium text-gray-700 dark:text-zinc-100 block", isRTL ? "text-right" : "text-left")}>
                {t("employees.select_clinics")}
              </label>

              <div className="space-y-3 max-h-48 overflow-y-auto border border-gray-200 dark:border-zinc-700 rounded-lg p-4 bg-white dark:bg-zinc-900/50">
                {clinicsData && clinicsData.length > 0 ? (
                  clinicsData.map((clinic, index) => (
                    <label key={clinic.id || index} className={cn("flex items-center space-x-2 cursor-pointer", isRTL && "space-x-reverse")}>
                      <input
                        type="checkbox"
                        checked={formData.selectedClinics.includes(clinic.id)}
                        onChange={(e) => handleClinicSelection(clinic.id, e.target.checked)}
                        className="rounded border-gray-300 dark:border-zinc-600 dark:bg-zinc-800 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-400"
                      />
                      <span className="text-sm text-gray-700 dark:text-white">{clinic.name}</span>
                    </label>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-zinc-400 text-sm">{t("employees.no_clinics_available")}</p>
                )}
              </div>

              {errors.selectedClinics && (
                <p className="text-red-500 text-sm mt-1">{errors.selectedClinics}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Storage Access Section */}
      <div className="bg-gray-50 dark:bg-zinc-800/30 rounded-lg p-6 border dark:border-zinc-800">
        <div className={cn("flex items-center space-x-3 mb-6", isRTL && "space-x-reverse")}>
          <Building2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-100">{t("employees.storage_access")}</h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-3">
            <label className={cn("flex items-center space-x-3 cursor-pointer", isRTL && "space-x-reverse")}>
              <input
                type="radio"
                name="storageAccess"
                value="all"
                checked={formData.storageAccess === "all"}
                onChange={() => {
                  handleStorageSelection && handleStorageSelection("storageAccess", "all");
                }}
                className="text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-zinc-100">{t("employees.all_storages")}</span>
            </label>

            <label className={cn("flex items-center space-x-3 cursor-pointer", isRTL && "space-x-reverse")}>
              <input
                type="radio"
                name="storageAccess"
                value="specific"
                checked={formData.storageAccess === "specific"}
                onChange={() => {
                  handleStorageSelection && handleStorageSelection("storageAccess", "specific");
                }}
                className="text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-400"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-zinc-100">{t("employees.specific_storages")}</span>
            </label>
          </div>

          {formData.storageAccess === "specific" && (
            <div className="space-y-2">
              <label className={cn("text-sm font-medium text-gray-700 dark:text-zinc-100 block", isRTL ? "text-right" : "text-left")}>
                {t("employees.select_storages")}
              </label>

              <div className="space-y-3 max-h-48 overflow-y-auto border border-gray-200 dark:border-zinc-700 rounded-lg p-4 bg-white dark:bg-zinc-900/50">
                {storagesData && storagesData.length > 0 ? (
                  storagesData.map((storage, index) => (
                    <label key={storage.id || index} className={cn("flex items-center space-x-2 cursor-pointer", isRTL && "space-x-reverse")}>
                      <input
                        type="checkbox"
                        checked={formData.selectedStorages.includes(storage.id)}
                        onChange={(e) => handleStorageSelection(storage.id, e.target.checked)}
                        className="rounded border-gray-300 dark:border-zinc-600 dark:bg-zinc-800 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-400"
                      />
                      <span className="text-sm text-white dark:text-white">{storage.name}</span>
                    </label>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-zinc-400 text-sm">{t("employees.no_storages_available")}</p>
                )}
              </div>

              {errors.selectedStorages && (
                <p className="text-red-500 text-sm mt-1">{errors.selectedStorages}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
