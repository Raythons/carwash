import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { ArrowLeft, Save, ChevronLeft, ChevronRight, Loader2, UserPlus, Check } from "lucide-react";
import { useCreateEmployee } from "../../hooks/queries/useEmployeeQueries";
import { useClinics } from "../../hooks/queries/useClinicQueries";
import { useStorages } from "../../hooks/queries/useStorageQueries"; // Import useStorages
import { useEmployeeForm } from "./shared/EmployeeFormLogic";
import EmployeeBasicInfoForm from "./shared/EmployeeBasicInfoForm";
import EmployeePermissionsForm from "./shared/EmployeePermissionsForm";
import { useTranslation } from "react-i18next";
import { cn } from "@/utilities/cn";
import { useState } from "react";
export default function AddEmployee() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();
  const createEmployeeMutation = useCreateEmployee();
  const { data: clinicsData } = useClinics();
  const { data: storagesData } = useStorages(); // Fetch storages
  
  // Use shared form logic
  const {
    formData,
    setFormData,
    errors,
    currentStep,
    hireDateOpen,
    setHireDateOpen,
    salaryInput,
    setSalaryInput,
    allPermissions,
    handleInputChange,
    handleSalaryChange,
    handleUserTypeChange,
    handlePermissionChange,
    handleClinicSelection,
    handleStorageSelection,
    handleSelectAllPermissionsInGroup,
    nextStep,
    prevStep,
    validateForm
  } = useEmployeeForm();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm(false)) { // false for Add mode
      return;
    }

    try {
      const submitData = {
        ...formData,
        phoneNumber: formData.phone, // Map phone to phoneNumber for backend
        address: formData.address, // Ensure address is included
        notes: formData.notes, // Ensure notes is included
        permissions: formData.permissions,
        clinicAccess: formData.clinicAccess,
        selectedClinics: formData.clinicAccess === "specific" ? formData.selectedClinics : [],
        storageAccess: formData.storageAccess,
        selectedStorages: formData.storageAccess === "specific" ? formData.selectedStorages : []
      };

      await createEmployeeMutation.mutateAsync(submitData);
      // Success message is handled by the hook
      navigate("/clinic/employees");
    } catch (error) {
      // Error message is handled by the hook
      console.error("Error creating employee:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6" dir={isRTL ? "rtl" : "ltr"}>
      <div className={cn("flex items-center gap-4 mb-6", isRTL && "space-x-reverse")}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/clinic/employees")}
          className={cn("flex items-center gap-2", isRTL && "space-x-reverse")}
        >
          <ArrowLeft className={cn("w-4 h-4", isRTL && "rotate-180")} />
          {t("common.back")}
        </Button>
        <h1 className="text-2xl font-bold">{t("employees.add_new")}</h1>
      </div>

      <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-200 dark:border-zinc-800 overflow-hidden transition-all duration-300">
        {/* Header with Step Indicator */}
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-zinc-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary-800 dark:text-zinc-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center shadow-inner">
                <UserPlus className="w-6 h-6 text-blue-600 dark:text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]" />
              </div>
              <span>{t("employees.add_new")}</span>
            </h1>
            <div className="mb-8 overflow-x-auto">
              <div className="flex items-center space-x-4 min-w-max pb-2" dir={isRTL ? "rtl" : "ltr"}>
                {[1, 2].map((s) => (
                  <div key={s} className="flex items-center">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all duration-300 shadow-sm",
                        currentStep === s
                          ? "bg-blue-600 text-white ring-4 ring-blue-500/20"
                          : currentStep > s
                          ? "bg-emerald-500 text-white"
                          : "bg-gray-200 dark:bg-zinc-800 text-gray-500 dark:text-zinc-500"
                      )}
                    >
                      {currentStep > s ? <Check className="w-6 h-6" /> : s}
                    </div>
                    <span
                      className={cn(
                        "mx-3 font-bold text-sm uppercase tracking-wider",
                        currentStep === s ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-zinc-500"
                      )}
                    >
                      {t(`employees.steps.step${s}`)}
                    </span>
                    {s < 2 && (
                      <div className="w-12 h-0.5 bg-gray-200 dark:bg-zinc-800 mx-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={(e) => {
            if (currentStep === 2) {
              handleSubmit(e);
            } else {
              e.preventDefault();
            }
          }} className="space-y-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <EmployeeBasicInfoForm
                formData={formData}
                errors={errors}
                hireDateOpen={hireDateOpen}
                setHireDateOpen={setHireDateOpen}
                salaryInput={salaryInput}
                setSalaryInput={setSalaryInput}
                handleInputChange={handleInputChange}
                handleSalaryChange={handleSalaryChange}
                handleUserTypeChange={handleUserTypeChange}
                setFormData={setFormData}
                isEdit={false}
              />
            )}

            {/* Step 2: Permissions & Access */}
            {currentStep === 2 && (
              <EmployeePermissionsForm
                formData={formData}
                errors={errors}
                allPermissions={allPermissions}
                clinicsData={clinicsData || []}
                storagesData={storagesData || []}
                handlePermissionChange={handlePermissionChange}
                handleSelectAllPermissionsInGroup={handleSelectAllPermissionsInGroup}
                handleClinicSelection={handleClinicSelection}
                handleStorageSelection={handleStorageSelection}
              />
            )}

            {/* Navigation Buttons */}
            <div className={cn("flex flex-col sm:flex-row justify-between gap-3 pt-6 border-t border-gray-200 dark:border-zinc-800", isRTL && "space-x-reverse")}>
              <div className="w-full sm:w-auto">
                {currentStep === 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className={cn("flex items-center justify-center gap-2 w-full sm:w-auto", isRTL && "space-x-reverse")}
                  >
                    <ChevronRight className={cn("w-4 h-4", isRTL && "rotate-180")} />
                    {t("common.previous")}
                  </Button>
                )}
              </div>

              <div className="w-full sm:w-auto">
                {currentStep === 1 ? (
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      nextStep(false);
                    }}
                    className={cn("flex items-center justify-center gap-2 w-full sm:w-auto", isRTL && "space-x-reverse")}
                  >
                    {t("common.next")}
                    <ChevronLeft className={cn("w-4 h-4", isRTL && "rotate-180")} />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={createEmployeeMutation.isPending}
                    className={cn("flex items-center justify-center gap-2 w-full sm:w-auto", isRTL && "space-x-reverse")}
                  >
                    {createEmployeeMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {t("common.saving")}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {t("employees.save_employee")}
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
