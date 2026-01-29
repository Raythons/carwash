import { PERMISSIONS, ROLES } from "../../../hooks/usePermissions";
import { useTranslation } from "react-i18next";
import {
  formatNumberWithThousands,
  parseFormattedNumber,
} from "../../../utilities/number";
import { useState,useCallback  } from "react";
// Shared form logic for both AddEmployee and EditEmployee
export const useEmployeeForm = (initialData = {}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    userType: "",
    hireDate: "",
    salary: "",
    address: "",
    notes: "",
    password: "",
    confirmPassword: "",
    permissions: [],
    clinicAccess: "all",
    selectedClinics: [],
    storageAccess: "all",
    selectedStorages: [],
    ...initialData,
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [hireDateOpen, setHireDateOpen] = useState(false);
  const [salaryInput, setSalaryInput] = useState(
    initialData.salary ? formatNumberWithThousands(initialData.salary) : ""
  );

  // Role-based permission presets
  const rolePermissions = {
    [ROLES.OWNER]: [
      PERMISSIONS.SURGERIES_VIEW,
      PERMISSIONS.SURGERIES_ADD,
      PERMISSIONS.SURGERIES_EDIT,
      PERMISSIONS.SURGERIES_DELETE,
      PERMISSIONS.EXAMINATIONS_VIEW,
      PERMISSIONS.EXAMINATIONS_ADD,
      PERMISSIONS.EXAMINATIONS_EDIT,
      PERMISSIONS.EXAMINATIONS_DELETE,
      PERMISSIONS.APPOINTMENTS_VIEW,
      PERMISSIONS.APPOINTMENTS_ADD,
      PERMISSIONS.APPOINTMENTS_EDIT,
      PERMISSIONS.APPOINTMENTS_DELETE,
      PERMISSIONS.OWNERS_VIEW,
      PERMISSIONS.OWNERS_ADD,
      PERMISSIONS.OWNERS_EDIT,
      PERMISSIONS.OWNERS_DELETE,
      PERMISSIONS.ANIMALS_VIEW,
      PERMISSIONS.ANIMALS_ADD,
      PERMISSIONS.ANIMALS_EDIT,
      PERMISSIONS.ANIMALS_DELETE,
      PERMISSIONS.RESIDENCES_VIEW,
      PERMISSIONS.RESIDENCES_ADD,
      PERMISSIONS.RESIDENCES_EDIT,
      PERMISSIONS.RESIDENCES_DELETE,
      PERMISSIONS.RESIDENCES_MANAGE,
      PERMISSIONS.STATISTICS_VIEW,
      PERMISSIONS.CLINICS_VIEW,
      PERMISSIONS.CLINICS_ADD,
      PERMISSIONS.CLINICS_EDIT,
      PERMISSIONS.CLINICS_DELETE,
      PERMISSIONS.USERS_MANAGE,
      PERMISSIONS.ROLES_MANAGE,
      PERMISSIONS.ALL_CLINICS_ACCESS,
      PERMISSIONS.EMPLOYEES_VIEW,
      PERMISSIONS.EMPLOYEES_ADD,
      PERMISSIONS.EMPLOYEES_EDIT,
      PERMISSIONS.EMPLOYEES_DELETE,
      PERMISSIONS.EMPLOYEES_MANAGE,
      PERMISSIONS.STORAGE_VIEW,
      PERMISSIONS.STORAGE_ADD,
      PERMISSIONS.STORAGE_EDIT,
      PERMISSIONS.STORAGE_DELETE,
      PERMISSIONS.STORAGE_MANAGE,
      PERMISSIONS.ALL_STORAGES_ACCESS,
      PERMISSIONS.STORAGE_STATISTICS,
      PERMISSIONS.GOALS_VIEW,
      PERMISSIONS.GOALS_ADD,
      PERMISSIONS.GOALS_EDIT,
      PERMISSIONS.GOALS_DELETE,
    ],
    [ROLES.DOCTOR]: [
      PERMISSIONS.SURGERIES_VIEW,
      PERMISSIONS.SURGERIES_ADD,
      PERMISSIONS.SURGERIES_EDIT,
      PERMISSIONS.SURGERIES_DELETE,
      PERMISSIONS.EXAMINATIONS_VIEW,
      PERMISSIONS.EXAMINATIONS_ADD,
      PERMISSIONS.EXAMINATIONS_EDIT,
      PERMISSIONS.EXAMINATIONS_DELETE,
      PERMISSIONS.APPOINTMENTS_VIEW,
      PERMISSIONS.APPOINTMENTS_ADD,
      PERMISSIONS.APPOINTMENTS_EDIT,
      PERMISSIONS.APPOINTMENTS_DELETE,
      PERMISSIONS.OWNERS_VIEW,
      PERMISSIONS.OWNERS_ADD,
      PERMISSIONS.OWNERS_EDIT,
      PERMISSIONS.ANIMALS_VIEW,
      PERMISSIONS.ANIMALS_ADD,
      PERMISSIONS.ANIMALS_EDIT,
      PERMISSIONS.RESIDENCES_VIEW,
      PERMISSIONS.RESIDENCES_ADD,
      PERMISSIONS.RESIDENCES_EDIT,
      PERMISSIONS.RESIDENCES_DELETE,
      PERMISSIONS.EMPLOYEES_VIEW,
      PERMISSIONS.EMPLOYEES_ADD,
      PERMISSIONS.EMPLOYEES_EDIT,
    ],
    [ROLES.RECEPTION]: [
      PERMISSIONS.SURGERIES_VIEW,
      PERMISSIONS.SURGERIES_ADD,
      PERMISSIONS.SURGERIES_EDIT,
      PERMISSIONS.EXAMINATIONS_VIEW,
      PERMISSIONS.EXAMINATIONS_ADD,
      PERMISSIONS.EXAMINATIONS_EDIT,
      PERMISSIONS.APPOINTMENTS_VIEW,
      PERMISSIONS.APPOINTMENTS_ADD,
      PERMISSIONS.APPOINTMENTS_EDIT,
      PERMISSIONS.OWNERS_VIEW,
      PERMISSIONS.OWNERS_ADD,
      PERMISSIONS.OWNERS_EDIT,
      PERMISSIONS.ANIMALS_VIEW,
      PERMISSIONS.ANIMALS_ADD,
      PERMISSIONS.ANIMALS_EDIT,
      PERMISSIONS.RESIDENCES_VIEW,
      PERMISSIONS.RESIDENCES_ADD,
      PERMISSIONS.RESIDENCES_EDIT,
      PERMISSIONS.EMPLOYEES_VIEW,
      PERMISSIONS.EMPLOYEES_EDIT,
    ],
    [ROLES.EMPLOYEES]: [],
  };

  // All permissions grouped by category
  const allPermissions = [
    {
      group: t("employees.permission_groups.Surgeries"),
      permissions: [
        { key: PERMISSIONS.SURGERIES_VIEW, label: t("employees.permission_labels.can_view_surgeries") },
        { key: PERMISSIONS.SURGERIES_ADD, label: t("employees.permission_labels.can_add_surgery") },
        { key: PERMISSIONS.SURGERIES_EDIT, label: t("employees.permission_labels.can_edit_surgery") },
        { key: PERMISSIONS.SURGERIES_DELETE, label: t("employees.permission_labels.can_delete_surgery") },
      ],
    },
    {
      group: t("employees.permission_groups.Examinations"),
      permissions: [
        { key: PERMISSIONS.EXAMINATIONS_VIEW, label: t("employees.permission_labels.can_view_examinations") },
        { key: PERMISSIONS.EXAMINATIONS_ADD, label: t("employees.permission_labels.can_add_examination") },
        { key: PERMISSIONS.EXAMINATIONS_EDIT, label: t("employees.permission_labels.can_edit_examination") },
        { key: PERMISSIONS.EXAMINATIONS_DELETE, label: t("employees.permission_labels.can_delete_examination") },
      ],
    },
    {
      group: t("employees.permission_groups.Appointments"),
      permissions: [
        { key: PERMISSIONS.APPOINTMENTS_VIEW, label: t("employees.permission_labels.can_view_appointments") },
        { key: PERMISSIONS.APPOINTMENTS_ADD, label: t("employees.permission_labels.can_add_appointment") },
        { key: PERMISSIONS.APPOINTMENTS_EDIT, label: t("employees.permission_labels.can_edit_appointment") },
        { key: PERMISSIONS.APPOINTMENTS_DELETE, label: t("employees.permission_labels.can_delete_appointment") },
      ],
    },
    {
      group: t("employees.permission_groups.Owners"),
      permissions: [
        { key: PERMISSIONS.OWNERS_VIEW, label: t("employees.permission_labels.can_view_owners") },
        { key: PERMISSIONS.OWNERS_ADD, label: t("employees.permission_labels.can_add_owner") },
        { key: PERMISSIONS.OWNERS_EDIT, label: t("employees.permission_labels.can_edit_owner") },
        { key: PERMISSIONS.OWNERS_DELETE, label: t("employees.permission_labels.can_delete_owner") },
      ],
    },
    {
      group: t("employees.permission_groups.Animals"),
      permissions: [
        { key: PERMISSIONS.ANIMALS_VIEW, label: t("employees.permission_labels.can_view_animals") },
        { key: PERMISSIONS.ANIMALS_DELETE, label: t("employees.permission_labels.can_delete_animal") },
      ],
    },
    {
      group: t("employees.permission_groups.Residencies"),
      permissions: [
        { key: PERMISSIONS.RESIDENCES_VIEW, label: t("employees.permission_labels.can_view_residencies") },
        { key: PERMISSIONS.RESIDENCES_ADD, label: t("employees.permission_labels.can_add_residency") },
        { key: PERMISSIONS.RESIDENCES_EDIT, label: t("employees.permission_labels.can_edit_residency") },
        { key: PERMISSIONS.RESIDENCES_DELETE, label: t("employees.permission_labels.can_delete_residency") },
        { key: PERMISSIONS.RESIDENCES_MANAGE, label: t("employees.permission_labels.can_manage_residencies") },
      ],
    },
    {
      group: t("employees.permission_groups.Employees"),
      permissions: [
        { key: PERMISSIONS.EMPLOYEES_VIEW, label: t("employees.permission_labels.can_view_employees") },
        { key: PERMISSIONS.EMPLOYEES_ADD, label: t("employees.permission_labels.can_add_employee") },
        { key: PERMISSIONS.EMPLOYEES_EDIT, label: t("employees.permission_labels.can_edit_employee") },
        { key: PERMISSIONS.EMPLOYEES_DELETE, label: t("employees.permission_labels.can_delete_employee") },
        { key: PERMISSIONS.EMPLOYEES_MANAGE, label: t("employees.permission_labels.can_manage_employees") },
      ],
    },
    {
      group: t("employees.permission_groups.Storage"),
      permissions: [
        { key: PERMISSIONS.STORAGE_VIEW, label: t("employees.permission_labels.can_view_storage") },
        { key: PERMISSIONS.STORAGE_ADD, label: t("employees.permission_labels.can_add_storage_item") },
        { key: PERMISSIONS.STORAGE_EDIT, label: t("employees.permission_labels.can_edit_storage_item") },
        { key: PERMISSIONS.STORAGE_DELETE, label: t("employees.permission_labels.can_delete_storage_item") },
        { key: PERMISSIONS.STORAGE_MANAGE, label: t("employees.permission_labels.can_manage_storage") },
        { key: PERMISSIONS.STORAGE_STATISTICS, label: t("employees.permission_labels.can_view_storage_statistics") },
      ],
    },
    {
      group: t("employees.permission_groups.Clinics"),
      permissions: [
        { key: PERMISSIONS.CLINICS_VIEW, label: t("employees.permission_labels.can_view_clinics") },
        { key: PERMISSIONS.CLINICS_ADD, label: t("employees.permission_labels.can_add_clinic") },
        { key: PERMISSIONS.CLINICS_EDIT, label: t("employees.permission_labels.can_edit_clinic") },
        { key: PERMISSIONS.CLINICS_DELETE, label: t("employees.permission_labels.can_delete_clinic") },
      ],
    },
    {
      group: t("employees.permission_groups.Admin"),
      permissions: [
        { key: PERMISSIONS.STATISTICS_VIEW, label: t("employees.permission_labels.can_view_statistics") },
      ],
    },
  ];

  // Handlers
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    setErrors((prev) => {
      if (prev[name]) {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      }
      return prev;
    });
  }, []);

  const handleSalaryChange = useCallback((value) => {
    // Parse the value first
    const plainValue = parseFormattedNumber(value);

    // Format it with commas for display
    const formattedValue = formatNumberWithThousands(plainValue);
    setSalaryInput(formattedValue);

    // Update form data with the plain number
    setFormData((prev) => ({
      ...prev,
      salary: plainValue,
    }));
  }, []);

  const handleUserTypeChange = useCallback(
    (value) => {
      setFormData((prev) => ({
        ...prev,
        userType: value,
        permissions: rolePermissions[value] || [],
        clinicAccess: value === ROLES.OWNER ? "all" : "specific",
        storageAccess: value === ROLES.OWNER ? "all" : "specific",
      }));

      // Clear error
      setErrors((prev) => {
        if (prev.userType) {
          const newErrors = { ...prev };
          delete newErrors.userType;
          return newErrors;
        }
        return prev;
      });
    },
    [rolePermissions]
  );

  const handlePermissionChange = useCallback((permission, checked) => {
    setFormData((prev) => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permission]
        : prev.permissions.filter((p) => p !== permission),
    }));
  }, []);

  const handleClinicSelection = useCallback((clinicId, checked) => {
    if (clinicId === "clinicAccess") {
      // Handle clinic access type change
      setFormData((prev) => ({
        ...prev,
        clinicAccess: checked,
        selectedClinics: checked === "all" ? [] : prev.selectedClinics,
      }));
    } else {
      // Handle individual clinic selection
      setFormData((prev) => ({
        ...prev,
        selectedClinics: checked
          ? [...prev.selectedClinics, clinicId]
          : prev.selectedClinics.filter((id) => id !== clinicId),
      }));
    }
  }, []);

  const handleStorageSelection = useCallback((storageId, checked) => {
    if (storageId === "storageAccess") {
      // Handle storage access type change
      setFormData((prev) => ({
        ...prev,
        storageAccess: checked,
        selectedStorages: checked === "all" ? [] : prev.selectedStorages,
      }));
    } else {
      // Handle individual storage selection
      setFormData((prev) => ({
        ...prev,
        selectedStorages: checked
          ? [...prev.selectedStorages, storageId]
          : prev.selectedStorages.filter((id) => id !== storageId),
      }));
    }
  }, []);

  const handleSelectAllPermissionsInGroup = useCallback(
    (groupPermissions, checked) => {
      const permissionKeys = groupPermissions.map((p) => p.key);
      setFormData((prev) => ({
        ...prev,
        permissions: checked
          ? [...new Set([...prev.permissions, ...permissionKeys])]
          : prev.permissions.filter((p) => !permissionKeys.includes(p)),
      }));
    },
    []
  );

  const nextStep = useCallback((isEdit = false) => {
    if (currentStep === 1) {
      const basicErrors = {};
      
      // Basic fields validation
      if (!formData.name.trim()) basicErrors.name = t("employees.validation.name_required");
      if (!formData.email.trim()) basicErrors.email = t("employees.validation.email_required");
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        basicErrors.email = t("employees.validation.email_invalid");
      if (!formData.phone.trim()) basicErrors.phone = t("employees.validation.phone_required");
      if (!formData.userType.trim()) basicErrors.userType = t("employees.validation.user_type_required");
      if (!formData.hireDate) basicErrors.hireDate = t("employees.validation.hire_date_required");

      // Password validation for Add mode
      if (!isEdit) {
        if (!formData.password.trim()) {
          basicErrors.password = t("employees.validation.password_required");
        }

        if (!formData.confirmPassword.trim()) {
          basicErrors.confirmPassword = t("employees.validation.confirm_password_required");
        } else if (formData.password !== formData.confirmPassword) {
          basicErrors.confirmPassword = t("employees.validation.password_mismatch");
        }
      }

      if (Object.keys(basicErrors).length > 0) {
        setErrors(basicErrors);
        return;
      }
      setCurrentStep(2);
    }
  }, [
    currentStep,
    formData.name,
    formData.email,
    formData.phone,
    formData.userType,
    formData.hireDate,
    formData.password,
    formData.confirmPassword,
    t
  ]);

  const prevStep = useCallback(() => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  }, [currentStep]);

  const validateForm = useCallback(
    (isEdit = false) => {
      const newErrors = {};

      if (!formData.name.trim()) {
        newErrors.name = t("employees.validation.name_required");
      }

      if (!formData.email.trim()) {
        newErrors.email = t("employees.validation.email_required");
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = t("employees.validation.email_invalid");
      }

      if (!formData.phone.trim()) {
        newErrors.phone = t("employees.validation.phone_required");
      }

      if (!formData.userType.trim()) {
        newErrors.userType = t("employees.validation.user_type_required");
      }

      if (!formData.hireDate) {
        newErrors.hireDate = t("employees.validation.hire_date_required");
      }

      // Password validation only for add (not edit)
      if (!isEdit) {
        if (!formData.password.trim()) {
          newErrors.password = t("employees.validation.password_required");
        }

        if (!formData.confirmPassword.trim()) {
          newErrors.confirmPassword = t("employees.validation.confirm_password_required");
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = t("employees.validation.password_mismatch");
        }
      }

      if (
        formData.clinicAccess === "specific" &&
        formData.selectedClinics.length === 0
      ) {
        newErrors.selectedClinics = t("employees.validation.select_clinic_required");
      }

      if (
        formData.storageAccess === "specific" &&
        formData.selectedStorages.length === 0
      ) {
        newErrors.selectedStorages = t("employees.validation.select_storage_required");
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [
      formData.name,
      formData.email,
      formData.phone,
      formData.userType,
      formData.hireDate,
      formData.password,
      formData.confirmPassword,
      formData.clinicAccess,
      formData.selectedClinics,
      formData.storageAccess,
      formData.selectedStorages,
    ]
  );

  const updateFormData = useCallback((newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
    if (newData.salary) {
      setSalaryInput(formatNumberWithThousands(newData.salary));
    }
  }, []);

  return {
    formData,
    setFormData,
    updateFormData,
    errors,
    setErrors,
    currentStep,
    setCurrentStep,
    hireDateOpen,
    setHireDateOpen,
    salaryInput,
    setSalaryInput,
    rolePermissions,
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
    validateForm,
  };
};
