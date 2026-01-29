import React, { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../ui/Button";
import { ArrowLeft, Save, ChevronLeft, ChevronRight, Loader2, User } from "lucide-react";
import { useEmployeeById, useUpdateEmployee } from "../../hooks/queries/useEmployeeQueries";
import { useClinics } from "../../hooks/queries/useClinicQueries";
import { useStorages } from "../../hooks/queries/useStorageQueries"; // Import useStorages
import { useEmployeeForm } from "./shared/EmployeeFormLogic";
import EmployeeBasicInfoForm from "./shared/EmployeeBasicInfoForm";
import EmployeePermissionsForm from "./shared/EmployeePermissionsForm";
import { useTranslation } from "react-i18next";
import { cn } from "@/utilities/cn";

export default function EditEmployee() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: employee, isLoading, isError } = useEmployeeById(id);
  const updateEmployeeMutation = useUpdateEmployee();
  const { data: clinicsData } = useClinics();
  const { data: storagesData } = useStorages(); // Fetch storages

  // Use shared form logic
  const {
    formData,
    setFormData,
    updateFormData,
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

  // Debug data after hooks are initialized
  console.log("Clinics data:", clinicsData);
  console.log("Employee data:", employee);
  console.log("Form data permissions:", formData.permissions);

  // Populate form when employee data loads
  useEffect(() => {
    if (employee && employee.id) {
      const employeeData = {
        name: employee.name || "",
        email: employee.email || "",
        phone: employee.phoneNumber || "",
        userType: employee.userType || "",
        hireDate: employee.joinDate ? employee.joinDate.split('T')[0] : "",
        salary: employee.salary || "",
        address: employee.address || "",
        notes: employee.notes || "",
        permissions: employee.permissions || [],
        clinicAccess: employee.clinicAccess || "all",
        selectedClinics: employee.selectedClinics || [],
        storageAccess: employee.storageAccess || "all",
        selectedStorages: employee.selectedStorages || []
      };

      // Use updateFormData to properly populate all fields including permissions
      updateFormData(employeeData);

      // Also update the salary input display
      if (employee.salary) {
        setSalaryInput(employee.formattedSalary || employee.salary.toString());
      }
    }
  }, [employee?.id, updateFormData, setSalaryInput]);

  // Cleanup effect to reset form when component unmounts
  useEffect(() => {
    return () => {
      // Reset form state when leaving the component - but don't cause re-renders
      console.log("EditEmployee component unmounting");
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit called, current step:", currentStep);

    if (!validateForm(true)) {
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

      await updateEmployeeMutation.mutateAsync({ id: parseInt(id), data: submitData });
      // Success message is handled by the hook
      navigate("/clinic/employees");
    } catch (error) {
      // Error message is handled by the hook
      console.error("Error updating employee:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className={cn("flex items-center justify-center h-64", isRTL && "space-x-reverse")}>
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className={isRTL ? "mr-2" : "ml-2"}>{t("common.loading")}</span>
        </div>
      </div>
    );
  }

  if (isError || !employee) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm p-8 text-center">
          <div className="text-red-500 mb-4">
            <User className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-zinc-100 mb-2">{t("employees.not_found")}</h2>
          <p className="text-gray-600 dark:text-zinc-400 mb-6">{t("employees.not_found_desc")}</p>
          <Button onClick={() => navigate("/clinic/employees")}>
            {t("employees.back_to_list")}
          </Button>
        </div>
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold text-gray-800 dark:text-zinc-100">{t("employees.edit_employee")}</h1>
      </div>

      <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-800 rounded-lg shadow-md">
        {/* Header with Step Indicator */}
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-zinc-700">
          <div className={cn("flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4", isRTL && "space-x-reverse")}>
            <h2 className={cn("text-base sm:text-xl font-semibold flex items-center gap-2 min-w-0 flex-1 text-gray-800 dark:text-zinc-100", isRTL && "space-x-reverse")}>
              <User className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="truncate">{t("employees.edit_employee_name", { name: employee?.name })}</span>
            </h2>
            <div className={cn("flex items-center space-x-2 flex-shrink-0", isRTL && "space-x-reverse")}>
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${currentStep >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-zinc-700 text-gray-600 dark:text-zinc-300'
                }`}>
                1
              </div>
              <div className={`w-8 sm:w-12 md:w-16 h-1 ${currentStep >= 2 ? 'bg-primary-600' : 'bg-gray-200 dark:bg-zinc-700'}`}></div>
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${currentStep >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-zinc-700 text-gray-600 dark:text-zinc-300'
                }`}>
                2
              </div>
            </div>
          </div>
          <div className={cn("flex justify-between text-[10px] sm:text-xs md:text-sm text-gray-600 dark:text-zinc-400 gap-1 sm:gap-2", isRTL && "flex-row-reverse")}>
            <span className={cn("truncate", currentStep === 1 ? 'font-medium text-primary-600' : '')}>
              {t("employees.personal_info")}
            </span>
            <span className={cn("truncate", currentStep === 2 ? 'font-medium text-primary-600' : '')}>
              {t("employees.permissions_access")}
            </span>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={(e) => {
            console.log("Form onSubmit triggered, current step:", currentStep);
            if (currentStep === 2) {
              handleSubmit(e);
            } else {
              e.preventDefault();
              console.log("Form submission prevented on step 1");
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
                isEdit={true}
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
            <div className={cn("flex flex-col sm:flex-row justify-between gap-3 pt-6 border-t border-gray-200 dark:border-zinc-700", isRTL && "space-x-reverse")}>
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
                      e.stopPropagation();
                      console.log("Next button clicked, current step:", currentStep);
                      nextStep(true);
                    }}
                    className={cn("flex items-center justify-center gap-2 w-full sm:w-auto", isRTL && "space-x-reverse")}
                  >
                    {t("common.next")}
                    <ChevronLeft className={cn("w-4 h-4", isRTL && "rotate-180")} />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={updateEmployeeMutation.isPending}
                    className={cn("flex items-center justify-center gap-2 w-full sm:w-auto", isRTL && "space-x-reverse")}
                  >
                    {updateEmployeeMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {t("common.saving")}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {t("common.save_changes")}
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
