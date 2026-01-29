// Validation schemas for examination forms
import * as yup from 'yup';

// Arabic error messages
const ARABIC_MESSAGES = {
  required: 'هذا الحقل مطلوب',
  email: 'يرجى إدخال بريد إلكتروني صحيح',
  min: (min) => `يجب أن يكون الحد الأدنى ${min}`,
  max: (max) => `يجب أن يكون الحد الأقصى ${max}`,
  positive: 'يجب أن يكون الرقم موجباً',
  date: 'يرجى إدخال تاريخ صحيح',
  dateRequired: 'التاريخ مطلوب لإضافة هذا العنصر',
  nameRequired: 'الاسم مطلوب لإضافة هذا العنصر',
  typeRequired: 'النوع مطلوب لإضافة هذا العنصر',
  countRequired: 'العدد مطلوب لإضافة هذا العنصر',
  medicineRequired: 'اسم الدواء مطلوب',
  dosageRequired: 'الجرعة مطلوبة',
  administrationRequired: 'طريقة الإعطاء مطلوبة',
};

// Basic Information Schema
const basicInformationSchema = yup.object({
  date: yup.string().required(ARABIC_MESSAGES.required),
  doctor: yup.string().required(ARABIC_MESSAGES.required),
  examinationFee: yup.number()
    .positive(ARABIC_MESSAGES.positive)
    .required(ARABIC_MESSAGES.required),
  age: yup.string().required(ARABIC_MESSAGES.required),
  weight: yup.number()
    .positive(ARABIC_MESSAGES.positive)
    .required(ARABIC_MESSAGES.required),
});

// Visit Information Schema
const visitInformationSchema = yup.object({
  mainReason: yup.string().required(ARABIC_MESSAGES.required),
  symptomsStarted: yup.string().required(ARABIC_MESSAGES.required),
  diseaseProgress: yup.string().required(ARABIC_MESSAGES.required),
});

// Vaccine Schema (for dynamic arrays)
const vaccineSchema = yup.object({
  name: yup.string().required(ARABIC_MESSAGES.nameRequired),
  date: yup.string().required(ARABIC_MESSAGES.dateRequired),
});

// Worm Pill Schema (for dynamic arrays)
const wormPillSchema = yup.object({
  name: yup.string().required(ARABIC_MESSAGES.nameRequired),
  date: yup.string().required(ARABIC_MESSAGES.dateRequired),
});

// Insecticide Schema (for dynamic arrays)
const insecticideSchema = yup.object({
  name: yup.string().required(ARABIC_MESSAGES.nameRequired),
  type: yup.string().required(ARABIC_MESSAGES.typeRequired),
});

// Animal Schema (for environment section)
const animalSchema = yup.object({
  type: yup.string().required(ARABIC_MESSAGES.typeRequired),
  count: yup.string().required(ARABIC_MESSAGES.countRequired),
});

// Treatment Schema (for new treatment entity)
const treatmentSchema = yup.object({
  medicine: yup.string().required(ARABIC_MESSAGES.medicineRequired),
  dosage: yup.string().required(ARABIC_MESSAGES.dosageRequired),
  administrationMethod: yup.string().required(ARABIC_MESSAGES.administrationRequired),
});

// Previous Condition Schema
const previousConditionSchema = yup.object({
  condition: yup.string().required(ARABIC_MESSAGES.required),
  date: yup.string().required(ARABIC_MESSAGES.dateRequired),
});

// Main Examination Schema
export const examinationSchema = yup.object({
  animalId: yup.number().required(ARABIC_MESSAGES.required),
  basicInformation: basicInformationSchema,
  visitInformation: visitInformationSchema,
  // Other sections are optional but validated when filled
  reproductiveNotes: yup.object().optional(),
  environment: yup.object().optional(),
  diet: yup.object().optional(),
  vomiting: yup.object().optional(),
  convulsions: yup.object().optional(),
  cough: yup.object().optional(),
  sneezing: yup.object().optional(),
  urination: yup.object().optional(),
  discharges: yup.object().optional(),
  otherConditions: yup.object().optional(),
  previousConditions: yup.object().optional(),
  treatment: yup.object().optional(),
  payment: yup.object().optional(),
  diagnosis: yup.string().optional(),
});

// Validation functions for dynamic arrays
export const validateVaccine = (vaccine) => {
  try {
    vaccineSchema.validateSync(vaccine);
    return { isValid: true, errors: {} };
  } catch (error) {
    return { 
      isValid: false, 
      errors: { [error.path]: error.message } 
    };
  }
};

export const validateWormPill = (wormPill) => {
  try {
    wormPillSchema.validateSync(wormPill);
    return { isValid: true, errors: {} };
  } catch (error) {
    return { 
      isValid: false, 
      errors: { [error.path]: error.message } 
    };
  }
};

export const validateInsecticide = (insecticide) => {
  try {
    insecticideSchema.validateSync(insecticide);
    return { isValid: true, errors: {} };
  } catch (error) {
    return { 
      isValid: false, 
      errors: { [error.path]: error.message } 
    };
  }
};

export const validateAnimal = (animal) => {
  try {
    animalSchema.validateSync(animal);
    return { isValid: true, errors: {} };
  } catch (error) {
    return { 
      isValid: false, 
      errors: { [error.path]: error.message } 
    };
  }
};

export const validateTreatment = (treatment) => {
  try {
    treatmentSchema.validateSync(treatment);
    return { isValid: true, errors: {} };
  } catch (error) {
    return { 
      isValid: false, 
      errors: { [error.path]: error.message } 
    };
  }
};

export const validatePreviousCondition = (condition) => {
  try {
    previousConditionSchema.validateSync(condition);
    return { isValid: true, errors: {} };
  } catch (error) {
    return { 
      isValid: false, 
      errors: { [error.path]: error.message } 
    };
  }
};

export { ARABIC_MESSAGES };
