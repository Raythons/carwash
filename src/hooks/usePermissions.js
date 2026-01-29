import { useAuth } from '../contexts/AuthContext';

// Permission constants - should match backend
export const PERMISSIONS = {
  // Surgeries
  SURGERIES_VIEW: 'Surgeries.View',
  SURGERIES_ADD: 'Surgeries.Add',
  SURGERIES_EDIT: 'Surgeries.Edit',
  SURGERIES_DELETE: 'Surgeries.Delete',

  // Examinations
  EXAMINATIONS_VIEW: 'Examinations.View',
  EXAMINATIONS_ADD: 'Examinations.Add',
  EXAMINATIONS_EDIT: 'Examinations.Edit',
  EXAMINATIONS_DELETE: 'Examinations.Delete',

  // Appointments
  APPOINTMENTS_VIEW: 'Appointments.View',
  APPOINTMENTS_ADD: 'Appointments.Add',
  APPOINTMENTS_EDIT: 'Appointments.Edit',
  APPOINTMENTS_DELETE: 'Appointments.Delete',

  // Owners
  OWNERS_VIEW: 'Owners.View',
  OWNERS_ADD: 'Owners.Add',
  OWNERS_EDIT: 'Owners.Edit',
  OWNERS_DELETE: 'Owners.Delete',

  // Animals
  ANIMALS_VIEW: 'Animals.View',
  ANIMALS_ADD: 'Animals.Add',
  ANIMALS_EDIT: 'Animals.Edit',
  ANIMALS_DELETE: 'Animals.Delete',

  // Residences
  RESIDENCES_VIEW: 'Residences.View',
  RESIDENCES_ADD: 'Residences.Add',
  RESIDENCES_EDIT: 'Residences.Edit',
  RESIDENCES_DELETE: 'Residences.Delete',
  RESIDENCES_MANAGE: 'Residences.Manage',

  // Statistics
  STATISTICS_VIEW: 'Statistics.View',

  // Goals
  GOALS_VIEW: 'Goals.View',
  GOALS_ADD: 'Goals.Add',
  GOALS_EDIT: 'Goals.Edit',
  GOALS_DELETE: 'Goals.Delete',

  // Admin
  USERS_MANAGE: 'Users.Manage',
  ROLES_MANAGE: 'Roles.Manage',

  // Clinics Management
  CLINICS_VIEW: 'Clinics.View',
  CLINICS_ADD: 'Clinics.Add',
  CLINICS_EDIT: 'Clinics.Edit',
  CLINICS_DELETE: 'Clinics.Delete',
  CLINICS_MANAGE: 'Clinics.Manage',

  // Clinic Access
  ALL_CLINICS_ACCESS: 'AllClinics.Access',

  // Employees
  EMPLOYEES_VIEW: 'Employees.View',
  EMPLOYEES_ADD: 'Employees.Add',
  EMPLOYEES_EDIT: 'Employees.Edit',
  EMPLOYEES_DELETE: 'Employees.Delete',
  EMPLOYEES_MANAGE: 'Employees.Manage',

  // Storage
  STORAGE_VIEW: 'Storage.View',
  STORAGE_ADD: 'Storage.Add',
  STORAGE_EDIT: 'Storage.Edit',
  STORAGE_DELETE: 'Storage.Delete',
  STORAGE_MANAGE: 'Storage.Manage',
  STORAGE_STATISTICS: 'Storage.Statistics',
  
  // Storage Access
  ALL_STORAGES_ACCESS: 'AllStorages.Access',

  // Reports
  REPORTS_VIEW: 'Reports.View',

  // Medications
  MEDICATIONS_VIEW: 'Medications.View',
  MEDICATIONS_ADD: 'Medications.Add',
  MEDICATIONS_EDIT: 'Medications.Edit',
  MEDICATIONS_DELETE: 'Medications.Delete',

  // Tests
  TESTS_VIEW: 'Tests.View',
  TESTS_ADD: 'Tests.Add',
  TESTS_EDIT: 'Tests.Edit',
  TESTS_DELETE: 'Tests.Delete',

  // Doctors
  DOCTORS_VIEW: 'Doctors.View',
  DOCTORS_ADD: 'Doctors.Add',
  DOCTORS_EDIT: 'Doctors.Edit',
  DOCTORS_DELETE: 'Doctors.Delete',

  // Settings
  SETTINGS_VIEW: 'Settings.View',
  SETTINGS_EDIT: 'Settings.Edit',

  // Warehouse
  WAREHOUSE_DASHBOARD: 'Warehouse.Dashboard',
  WAREHOUSE_PRODUCTS: 'Warehouse.Products',
  WAREHOUSE_INVENTORY: 'Warehouse.Inventory',
  WAREHOUSE_ORDERS: 'Warehouse.Orders',
  WAREHOUSE_SUPPLIERS: 'Warehouse.Suppliers',
  WAREHOUSE_REPORTS: 'Warehouse.Reports',
  WAREHOUSE_SETTINGS: 'Warehouse.Settings',
  SUPER_ADMIN: 'SuperAdmin',
};

// Role constants
export const ROLES = {
  DOCTOR: 'Doctor',
  RECEPTION: 'Reception',
  OWNER: 'Owner',
  EMPLOYEES: 'Employee',
};

export const usePermissions = () => {
  const { hasPermission, hasAnyPermission, canAccessClinic, user } = useAuth();

  // Helper functions for common permission checks
  const canViewSurgeries = () => hasPermission(PERMISSIONS.SURGERIES_VIEW);
  const canAddSurgeries = () => hasPermission(PERMISSIONS.SURGERIES_ADD);
  const canEditSurgeries = () => hasPermission(PERMISSIONS.SURGERIES_EDIT);
  const canDeleteSurgeries = () => hasPermission(PERMISSIONS.SURGERIES_DELETE);
  const canManageSurgeries = () => hasAnyPermission([
    PERMISSIONS.SURGERIES_ADD,
    PERMISSIONS.SURGERIES_EDIT,
    PERMISSIONS.SURGERIES_DELETE
  ]);

  const canViewExaminations = () => hasPermission(PERMISSIONS.EXAMINATIONS_VIEW);
  const canAddExaminations = () => hasPermission(PERMISSIONS.EXAMINATIONS_ADD);
  const canEditExaminations = () => hasPermission(PERMISSIONS.EXAMINATIONS_EDIT);
  const canDeleteExaminations = () => hasPermission(PERMISSIONS.EXAMINATIONS_DELETE);
  const canManageExaminations = () => hasAnyPermission([
    PERMISSIONS.EXAMINATIONS_ADD,
    PERMISSIONS.EXAMINATIONS_EDIT,
    PERMISSIONS.EXAMINATIONS_DELETE
  ]);

  const canViewAppointments = () => hasPermission(PERMISSIONS.APPOINTMENTS_VIEW);
  const canAddAppointments = () => hasPermission(PERMISSIONS.APPOINTMENTS_ADD);
  const canEditAppointments = () => hasPermission(PERMISSIONS.APPOINTMENTS_EDIT);
  const canDeleteAppointments = () => hasPermission(PERMISSIONS.APPOINTMENTS_DELETE);
  const canManageAppointments = () => hasAnyPermission([
    PERMISSIONS.APPOINTMENTS_ADD,
    PERMISSIONS.APPOINTMENTS_EDIT,
    PERMISSIONS.APPOINTMENTS_DELETE
  ]);

  const canViewOwners = () => hasPermission(PERMISSIONS.OWNERS_VIEW);
  const canAddOwners = () => hasPermission(PERMISSIONS.OWNERS_ADD);
  const canEditOwners = () => hasPermission(PERMISSIONS.OWNERS_EDIT);
  const canDeleteOwners = () => hasPermission(PERMISSIONS.OWNERS_DELETE);
  const canManageOwners = () => hasAnyPermission([
    PERMISSIONS.OWNERS_ADD,
    PERMISSIONS.OWNERS_EDIT,
    PERMISSIONS.OWNERS_DELETE
  ]);

  const canViewAnimals = () => hasPermission(PERMISSIONS.ANIMALS_VIEW);
  const canAddAnimals = () => hasPermission(PERMISSIONS.ANIMALS_ADD);
  const canEditAnimals = () => hasPermission(PERMISSIONS.ANIMALS_EDIT);
  const canDeleteAnimals = () => hasPermission(PERMISSIONS.ANIMALS_DELETE);
  const canManageAnimals = () => hasAnyPermission([
    PERMISSIONS.ANIMALS_ADD,
    PERMISSIONS.ANIMALS_EDIT,
    PERMISSIONS.ANIMALS_DELETE
  ]);

  const canViewResidences = () => hasPermission(PERMISSIONS.RESIDENCES_VIEW);
  const canAddResidences = () => hasPermission(PERMISSIONS.RESIDENCES_ADD);
  const canEditResidences = () => hasPermission(PERMISSIONS.RESIDENCES_EDIT);
  const canDeleteResidences = () => hasPermission(PERMISSIONS.RESIDENCES_DELETE);
  const canManageResidences = () => hasAnyPermission([
    PERMISSIONS.RESIDENCES_ADD,
    PERMISSIONS.RESIDENCES_EDIT,
    PERMISSIONS.RESIDENCES_DELETE,
    PERMISSIONS.RESIDENCES_MANAGE
  ]);

  const canViewStatistics = () => hasPermission(PERMISSIONS.STATISTICS_VIEW);
  const canManageUsers = () => hasPermission(PERMISSIONS.USERS_MANAGE);
  const canManageRoles = () => hasPermission(PERMISSIONS.ROLES_MANAGE);

  // Role checks
  const isOwner = () => user?.userType === ROLES.OWNER;
  const isDoctor = () => user?.userType === ROLES.DOCTOR;
  const isReception = () => user?.userType === ROLES.RECEPTION;

  // Clinic access checks
  const canAccessAllClinics = () => hasPermission(PERMISSIONS.ALL_CLINICS_ACCESS);
  const canAccessSpecificClinic = (clinicId) => canAccessClinic(clinicId);

  const isSuperAdmin = () => hasPermission(PERMISSIONS.SUPER_ADMIN);

  return {
    // Direct permission checks
    hasPermission,
    hasAnyPermission,
    canAccessClinic,

    // Surgery permissions
    canViewSurgeries,
    canAddSurgeries,
    canEditSurgeries,
    canDeleteSurgeries,
    canManageSurgeries,

    // Examination permissions
    canViewExaminations,
    canAddExaminations,
    canEditExaminations,
    canDeleteExaminations,
    canManageExaminations,

    // Appointment permissions
    canViewAppointments,
    canAddAppointments,
    canEditAppointments,
    canDeleteAppointments,
    canManageAppointments,

    // Owner permissions
    canViewOwners,
    canAddOwners,
    canEditOwners,
    canDeleteOwners,
    canManageOwners,

    // Animal permissions
    canViewAnimals,
    canAddAnimals,
    canEditAnimals,
    canDeleteAnimals,
    canManageAnimals,

    // Residence permissions
    canViewResidences,
    canAddResidences,
    canEditResidences,
    canDeleteResidences,
    canManageResidences,

    // Admin permissions
    canViewStatistics,
    canManageUsers,
    canManageRoles,

    // Role checks
    isOwner,
    isDoctor,
    isReception,

    // Clinic access
    canAccessAllClinics,
    canAccessSpecificClinic,

    isSuperAdmin,

    // Constants
    PERMISSIONS,
    ROLES,
  };
};

export default usePermissions;
