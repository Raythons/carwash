# i18n Multi-Language Plan (Arabic-English)

This document tracks the progress of implementing multi-language support in the VCMS frontend.

## Status Legend
- `[ ]` Not Implemented Yet
- `[/]` In Progress
- `[x]` Successfully Implemented

---

## Phase 1: Core i18n Setup
- [x] Install dependencies (`i18next`, `react-i18next`, `i18next-browser-languagedetector`). [/] (Done by user)
- [x] Create `src/i18n.js` configuration file.
- [x] Initialize locales folder (`src/locales/en.json`, `src/locales/ar.json`).
- [x] Configure `main.jsx` to use the i18n instance.
- **Phase 1 Completed**: Core setup is verified and functional.

## Phase 2: Sidebar & Layout
- [x] **Sidebar**: `src/components/AppSidebar.jsx` (Add Language Switcher, Localize `MobileSheet`).
- [x] **Navbar**: `src/components/DashboardNavbar.jsx`.
- [x] **Layout**: `src/components/Layout.jsx` (Handle dynamic `dir="rtl/ltr"`).

## Phase 3: Clinics Module
- [x] **Pages**: `Clinics.jsx`, `AddClinic.jsx`, `EditClinic.jsx`.
- [x] **Components**:
    - [x] `ClinicsTable.jsx`
    - [x] `AddClinic.jsx` (Form)
    - [x] `EditClinic.jsx` (Form)

## Phase 4: Management (Owners & Employees)
- [/] **Owners**:
    - [x] Pages: `Owners.jsx` (Verified), `OwnerDetails.jsx`.
    - [x] Components: `OwnerTable.jsx`, `OwnerList.jsx`, `OwnerForm.jsx`, `AddOwner.jsx`, `EditOwner.jsx`, `OwnerDetails.jsx`.
- [ ] **Employees**:
    - Pages: `Employees.jsx`, `EmployeeDetails.jsx`.
    - Components: `EmployeesTable.jsx`, `AddEmployee.jsx`, `EditEmployee.jsx`, `ViewEmployee.jsx`.

## Phase 5: Animals Module
- [ ] **Pages**: `Animals.jsx`, `AnimalDetails.jsx`.
- [ ] **Components**:
    - `AnimalsTable.jsx`, `AnimalCard.jsx`, `AnimalsMobileCard.jsx`.
    - `AddAnimal.jsx`, `AnimalFormRow.jsx`.
    - `AnimalDetails.jsx`, `AnimalExaminations.jsx`.
    - **Modals**: `AddAnimalTypeModal.jsx`, `AnimalType.jsx`.

## Phase 6: Examinations Module
- [ ] **Main Components**:
    - `AddEditExamination.jsx` (Master form).
    - `AnimalsExaminationsTable.jsx`.
    - `ViewExamination.jsx` (Page).
    - `ViewExaminationDetails.jsx` (Main View Component).
- [ ] **Examination Sections (Add/Edit)**:
    - [ ] `BasicInformationSection.jsx`, `VisitInformationSection.jsx`.
    - [ ] `ClinicalExaminationSection.jsx`, `DiagnosisSection.jsx`, `TreatmentSection.jsx`.
    - [ ] `PaymentSection.jsx`, `VaccinesSection.jsx`, `DietSection.jsx`, etc.
- [ ] **Examination Sections (View Mode)**:
    - [ ] `ViewBasicInformationSection.jsx`, `ViewVisitInformationSection.jsx`, etc.
- [ ] **Follow-ups**: `AddEditExaminationFollowUp.jsx` (Modal/Dialog).

## Phase 7: Storage & Warehouse Module
- [ ] **Products**: `ProductsTable.jsx`, `AddEditProduct.jsx`, `AddEditProductVariant.jsx`, `ViewProduct.jsx`, `ProductView.jsx`.
- [ ] **Categories**: `CategoriesTable.jsx`, `AddEditCategory.jsx`.
- [ ] **Suppliers**: `SuppliersTable.jsx`, `AddEditSupplier.jsx`.
- [ ] **Deals**: `DealsTable.jsx`, `AddEditDeal.jsx`, `ViewDeal.jsx`.
- [ ] **Sales/POS**: `PointOfSale.jsx`, `Sales.jsx`, `EditSale.jsx`, `ViewSale.jsx`.

## Phase 8: Residencies & Appointments
- [ ] **Residencies**: `Residences.jsx`, `AddResidence.jsx`, `EditResidence.jsx`, `ViewResidence.jsx`.
- [ ] **Appointments**: `Appointments.jsx`, `ViewAppointment.jsx`.
- [ ] **Surgeries**:
    - `SurgeryAppointments.jsx`, `ViewSurgeryAppointment.jsx`, `ViewSurgeryFollowUp.jsx`, `SurgeryDetails.jsx`.
    - **Modals/Dialogs**: `SurgeryFollowUpsTable.jsx` (Add/Edit/View Dialogs).

## Phase 9: Goals Module
- [ ] **Modals**: `AddEditGoalModal.jsx`.

## Phase 10: Common & Shared Components
- [ ] **Dialogs**: `ConfirmDialog.jsx`.
- [ ] **UI Base**: `Dialog.jsx`, `Sheet.jsx`.
- [ ] **Skeletons**: `OwnerDetailsSkeleton.jsx`, etc.

## Phase 11: Final Polish
- [ ] Verify form validation messages across all modules.
- [ ] Comprehensive RTL layout verification.

---
*Created by Antigravity*
