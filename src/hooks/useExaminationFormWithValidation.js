"use client"

// Enhanced examination form hook with React Hook Form and validation
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useState, useEffect, useMemo } from "react"
import { toDateOnly } from "@/utilities/date"
import { useTranslation } from "react-i18next"

// Small reusable delegate for boolean fields that may arrive as strings
const booleanField = (t) =>
  yup
    .boolean()
    .transform((val, orig) => {
      // Treat empty string / null / undefined as undefined to pass notRequired()
      if (orig === "" || orig === null || orig === undefined) return undefined
      // Normalize common string representations
      if (orig === "true") return true
      if (orig === "false") return false
      // Arabic yes/no
      if (orig === "نعم") return true
      if (orig === "لا") return false
      if (typeof orig === "boolean") return orig
      return val
    })

export const useExaminationFormWithValidation = (initialData = null, mode = "create") => {
  const { t } = useTranslation();

  // Comprehensive validation schema for all sections
  const examinationSchema = useMemo(() => yup.object({
    basicInformation: yup.object({
      date: yup.string().required(t("examinations.validation.date_required")),
      age: yup
        .number()
        .typeError(t("examinations.validation.age_number"))
        .nullable(),
      weight: yup
        .number()
        .typeError(t("examinations.validation.weight_number"))
        .nullable(),
      bcs: yup
        .number()
        .typeError(t("examinations.validation.bcs_number"))
        .nullable(),
      gender: yup.string().nullable(),
      amount: yup
        .number()
        .typeError(t("examinations.validation.amount_number"))
        .required(t("examinations.validation.amount_required")),
      receivedAmount: yup
        .number()
        .typeError(t("examinations.validation.received_amount_number"))
        .required(t("examinations.validation.received_amount_required")),
    }),
    visitInformation: yup.object({
      mainReason: yup.string().required(t("examinations.validation.main_reason_required")),
      symptomsStarted: yup.string().nullable(),
      diseaseProgress: yup.string().nullable(),
    }),
    reproductiveCycle: yup.object({
      lastReproductiveCycle: yup.string().notRequired().nullable(),
    }),
    environment: yup.object({
      breedingPlace: yup.string().nullable(),
    }),
    diet: yup.object({
      foodType: yup.mixed().notRequired(),
      mealsPerDay: yup.string().notRequired(),
      waterIntake: yup.string().notRequired(),
      appetiteChanges: yup.string().notRequired(),
      mealsPerDayAndHowToGive: yup.string().notRequired(),
      suddenDietChange: yup.string().notRequired(),
    }),
    vomiting: yup.object({
      hasVomiting: booleanField(t).nullable(),
      vomitingFrequency: yup.string().notRequired().nullable(),
      vomitContent: yup.mixed().notRequired().nullable(),
      waterVomiting: booleanField(t).notRequired().nullable(),
      vomitingFoodRelation: yup.string().notRequired().nullable(),
      vomitConsistency: yup.string().notRequired().nullable(),
      retching: booleanField(t).notRequired().nullable(),
      withDiarrhea: booleanField(t).notRequired().nullable(),
      diarrheaDetails: yup.string().notRequired().nullable(),
    }),
    convulsions: yup.object({
      hasConvulsions: booleanField(t).nullable(),
      convulsionDetails: yup.string().notRequired().nullable(),
      videoRecording: booleanField(t).notRequired().nullable(),
      seizureSymptoms: yup.string().notRequired().nullable(),
      suddenCollapse: booleanField(t).notRequired().nullable(),
      seizureAfterFood: booleanField(t).notRequired().nullable(),
      seizureAfterExercise: booleanField(t).notRequired().nullable(),
    }),
    cough: yup.object({
      hasCough: booleanField(t).nullable(),
      coughStart: yup.string().nullable(),
      coughFrequency: yup.string().nullable(),
      coughType: yup.string().nullable(),
      breathingDifficulty: booleanField(t).nullable(),
    }),
    sneezing: yup.object({
      hasSneezing: booleanField(t).nullable(),
    }),
    discharges: yup.object({
      hasDischarges: booleanField(t).nullable(),
    }),
    urination: yup.object({
      hasUrinationIssues: booleanField(t).nullable(),
      urinationFrequency: yup.string().notRequired().nullable(),
      urineVolume: yup.string().notRequired().nullable(),
      urineColor: yup.string().notRequired().nullable(),
      urinationPattern: yup.string().notRequired().nullable(),
      bloodInUrine: booleanField(t).notRequired().nullable(),
      bloodLocation: yup.string().notRequired().nullable(),
      problemDetails: yup.string().notRequired().nullable(),
    }),
    clinicalExamination: yup.object({
      hasDehydration: booleanField(t).nullable(),
      dehydrationPercentage: yup.number()
        .typeError(t("examinations.validation.dehydration_number"))
        .nullable(),
      temperature: yup.number()
        .typeError(t("examinations.validation.temperature_number"))
        .nullable(),
      heartRate: yup.number()
        .typeError(t("examinations.validation.heart_rate_number"))
        .nullable(),
      respiratoryRate: yup.number()
        .typeError(t("examinations.validation.respiratory_rate_number"))
        .nullable(),
      capillaryRefillTime: yup.number()
        .typeError(t("examinations.validation.crt_number"))
        .nullable(),
      mucousMembranes: yup.string().nullable(),
      petechialHemorrhage: booleanField(t).nullable(),
      lymphNodeEnlargement: booleanField(t).nullable(),
      clinicalExaminationNotes: yup.string().nullable(),
    }),
    diagnosticTools: yup.object({
      radiographyUsed: booleanField(t).nullable(),
      radiographyResult: yup.string().nullable(),
      ultrasoundUsed: booleanField(t).nullable(),
      ultrasoundResult: yup.string().nullable(),
      labTestsUsed: booleanField(t).nullable(),
      labTestsResult: yup.string().nullable(),
      bloodSmearUsed: booleanField(t).nullable(),
      bloodSmearResult: yup.string().nullable(),
      vaginalSmearUsed: booleanField(t).nullable(),
      vaginalSmearResult: yup.string().nullable(),
      biopsyUsed: booleanField(t).nullable(),
      biopsyResult: yup.string().nullable(),
      skinScrapingUsed: booleanField(t).nullable(),
      skinScrapingResult: yup.string().nullable(),
      urineTestUsed: booleanField(t).nullable(),
      urineTestResult: yup.string().nullable(),
      stoolSampleUsed: booleanField(t).nullable(),
      stoolSampleResult: yup.string().nullable(),
    }),
    diagnosis: yup.object({
      differentialDiagnosis: yup.string().nullable(),
      provisionalDiagnosis: yup.string().nullable(),
      finalDiagnosis: yup.string().nullable(),
    }),
    followUpDate: yup.string().nullable(),
  }), [t]);

  // Validation functions for array items
  const validateVaccine = (vaccine) => {
    const errors = {}
    if (!vaccine.name?.trim()) errors.name = t("examinations.validation.vaccine_name_required")
    if (!vaccine.date?.trim()) errors.date = t("examinations.validation.vaccine_date_required")
    return { isValid: Object.keys(errors).length === 0, errors }
  }

  const validateWormPill = (wormPill) => {
    const errors = {}
    if (!wormPill.name?.trim()) errors.name = t("examinations.validation.worm_pill_name_required")
    if (!wormPill.date?.trim()) errors.date = t("examinations.validation.worm_pill_date_required")
    return { isValid: Object.keys(errors).length === 0, errors }
  }

  const validateInsecticide = (insecticide) => {
    const errors = {}
    if (!insecticide.name?.trim()) errors.name = t("examinations.validation.insecticide_name_required")
    if (!insecticide.date?.trim()) errors.date = t("examinations.validation.insecticide_date_required")
    return { isValid: Object.keys(errors).length === 0, errors }
  }

  const validateAnimal = (animal) => {
    const errors = {}
    if (!animal.type?.trim()) errors.type = t("examinations.validation.animal_type_required")
    if (animal?.count === undefined || animal?.count === null || String(animal.count).trim() === "")
      errors.count = t("examinations.validation.animal_count_required")
    return { isValid: Object.keys(errors).length === 0, errors }
  }

  const validateTreatment = (treatment) => {
    const errors = {}
    if (!treatment.medicine?.trim()) errors.medicine = t("examinations.validation.medicine_name_required")
    if (!treatment.dosage?.trim()) errors.dosage = t("examinations.validation.dosage_required")
    if (!treatment.administrationMethod?.trim()) errors.administrationMethod = t("examinations.validation.administration_method_required")
    return { isValid: Object.keys(errors).length === 0, errors }
  }

  const validatePreviousCondition = (condition) => {
    const errors = {}
    if (!condition.condition?.trim()) errors.condition = t("examinations.validation.condition_required")
    if (!condition.date?.trim()) errors.date = t("examinations.validation.date_required_item")
    return { isValid: Object.keys(errors).length === 0, errors }
  }

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting, touchedFields },
    reset,
    trigger,
    clearErrors,
  } = useForm({
    resolver: yupResolver(examinationSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          followUpDate: initialData.followUpDate ? new Date(initialData.followUpDate).toISOString().split("T")[0] : null,
        }
      : {
          animalId: 0,
          basicInformation: {
            date: "",
            doctorId: null,
            neutered: false,
            gender: "",
            age: null,
            weight: null,
            bcs: null,
            birthDate: "",
            amount: null,
            receivedAmount: null,
            paymentReceivedDate: "",
            paymentTypeId: null,
          },
          visitInformation: {
            mainReason: "",
            symptomsStarted: "",
            diseaseProgress: "",
            previousTreatments: "",
            ownership: "",
            travelHistory: "",
            exercise: "",
          },
          reproductiveCycle: { lastReproductiveCycle: "" },
          environment: {
            breedingPlace: "",
            customBreedingPlace: "",
            otherAnimals: [],
            newAnimal: { type: "", count: "" },
          },
          diet: {
            foodType: [],
            customFoodType: "",
            showCustomFoodType: false,
            mealsPerDay: "",
            mealsPerDayAndHowToGive: "",
            suddenDietChange: "",
            waterIntake: "",
            appetiteChanges: "",
          },
          vomiting: {
            hasVomiting: null,
            vomitingFrequency: "",
            vomitContent: [],
            customVomitContent: "",
            showCustomVomitContent: false,
            waterVomiting: null,
            vomitingFoodRelation: "",
            vomitConsistency: "",
            retching: null,
            withDiarrhea: null,
            diarrheaDetails: "",
          },
          convulsions: { hasConvulsions: null, convulsionDetails: "", videoRecording: null, seizureSymptoms: "", suddenCollapse: null, seizureAfterFood: null, seizureAfterExercise: null },
          cough: { hasCough: null, coughStart: "", coughFrequency: "", coughType: "", breathingDifficulty: null },
          sneezing: { hasSneezing: null, sneezingDetails: "" },
          discharges: { hasDischarges: null, reproductiveDischarge: "", earDischarge: "", eyeDischarge: "", nasalDischarge: "", woundDischarge: "", otherDischarge: "" },
          urination: { hasUrinationIssues: null, urinationFrequency: "", urineVolume: "", urineColor: "", urinationPattern: "", bloodInUrine: null, bloodLocation: "", problemDetails: "" },
          otherConditions: { paralysisLameness: "", itchingHairLoss: "" },
          clinicalExamination: { 
            hasDehydration: null, 
            dehydrationPercentage: null, 
            temperature: null, 
            heartRate: null, 
            respiratoryRate: null, 
            capillaryRefillTime: null, 
            mucousMembranes: null,
            petechialHemorrhage: null,
            lymphNodeEnlargement: null, 
            clinicalExaminationNotes: "" 
          },
          diagnosticTools: {
            radiographyUsed: null,
            radiographyResult: "",
            ultrasoundUsed: null,
            ultrasoundResult: "",
            labTestsUsed: null,
            labTestsResult: "",
            bloodSmearUsed: null,
            bloodSmearResult: "",
            vaginalSmearUsed: null,
            vaginalSmearResult: "",
            biopsyUsed: null,
            biopsyResult: "",
            skinScrapingUsed: null,
            skinScrapingResult: "",
            urineTestUsed: null,
            urineTestResult: "",
            stoolSampleUsed: null,
            stoolSampleResult: ""
          },
          diagnosis: {
            differentialDiagnosis: "",
            provisionalDiagnosis: "",
            finalDiagnosis: ""
          },
          previousConditions: { conditions: [], newCondition: { condition: "", date: "" }, dewormingHistory: "" },
          protectiveAgents: {
            vaccines: [],
            wormPills: [],
            insecticides: [],
            newVaccine: { name: "", vaccinationTypeId: "", date: "", notes: "" },
            newWormPill: { name: "", date: "", notes: "" },
            newInsecticide: { name: "", type: "", date: "", notes: "" },
          },
          followUpDate: null,
          treatments: [],
          newTreatment: { medicine: "", dosage: "", administrationMethod: "", recommendations: "" },
        },
    mode: "onChange",
  });

  // Proactively clear Vomiting errors when section is inactive
  useEffect(() => {
    const hasVomiting = getValues("vomiting.hasVomiting")
    if (hasVomiting === false) {
      // Reset optional fields to safe defaults and clear their errors
      setValue("vomiting.vomitingFrequency", "")
      setValue("vomiting.vomitContent", [])
      setValue("vomiting.waterVomiting", false)
      setValue("vomiting.vomitingFoodRelation", "")
      setValue("vomiting.vomitConsistency", "")
      setValue("vomiting.retching", false)
      setValue("vomiting.withDiarrhea", false)
      setValue("vomiting.diarrheaDetails", "")
      clearErrors([
        "vomiting.vomitingFrequency",
        "vomiting.vomitContent",
        "vomiting.waterVomiting",
        "vomiting.vomitingFoodRelation",
        "vomiting.vomitConsistency",
        "vomiting.retching",
        "vomiting.withDiarrhea",
        "vomiting.diarrheaDetails",
      ])
    }
  }, [watch("vomiting.hasVomiting")])

  // Clear diarrhea details error when withDiarrhea is false
  useEffect(() => {
    const withDiarrhea = getValues("vomiting.withDiarrhea")
    if (withDiarrhea === false) {
      setValue("vomiting.diarrheaDetails", "")
      clearErrors(["vomiting.diarrheaDetails"])
    }
  }, [watch("vomiting.withDiarrhea")])

  // Proactively clear Convulsions errors when section is inactive
  useEffect(() => {
    const hasConvulsions = getValues("convulsions.hasConvulsions")
    if (hasConvulsions === false) {
      setValue("convulsions.convulsionDetails", "")
      setValue("convulsions.videoRecording", false)
      setValue("convulsions.seizureSymptoms", "")
      setValue("convulsions.suddenCollapse", false)
      setValue("convulsions.seizureAfterFood", false)
      setValue("convulsions.seizureAfterExercise", false)
      clearErrors([
        "convulsions.convulsionDetails",
        "convulsions.videoRecording",
        "convulsions.seizureSymptoms",
        "convulsions.suddenCollapse",
        "convulsions.seizureAfterFood",
        "convulsions.seizureAfterExercise",
      ])
    }
  }, [watch("convulsions.hasConvulsions")])

  // Proactively clear Cough errors when section is inactive
  useEffect(() => {
    const hasCough = getValues("cough.hasCough")
    if (hasCough === false) {
      setValue("cough.coughStart", "")
      setValue("cough.coughFrequency", "")
      setValue("cough.coughType", "")
      setValue("cough.breathingDifficulty", false)
      clearErrors([
        "cough.coughStart",
        "cough.coughFrequency",
        "cough.coughType",
        "cough.breathingDifficulty",
      ])
    }
  }, [watch("cough.hasCough")])

  // Proactively clear Urination errors when section is inactive
  useEffect(() => {
    const hasIssues = getValues("urination.hasUrinationIssues")
    if (hasIssues === false) {
      setValue("urination.urinationFrequency", "")
      setValue("urination.urineVolume", "")
      setValue("urination.urineColor", "")
      setValue("urination.urinationPattern", "")
      setValue("urination.bloodInUrine", false)
      setValue("urination.bloodLocation", "")
      setValue("urination.problemDetails", "")
      clearErrors([
        "urination.urinationFrequency",
        "urination.urineVolume",
        "urination.urineColor",
        "urination.urinationPattern",
        "urination.bloodInUrine",
        "urination.bloodLocation",
        "urination.problemDetails",
      ])
    }
  }, [watch("urination.hasUrinationIssues")])

  // State for dynamic array validation errors
  const [arrayErrors, setArrayErrors] = useState({
    vaccines: {},
    wormPills: {},
    insecticides: {},
    animals: {},
    treatments: {},
    previousConditions: {},
  })

  // Watch all form values
  const formData = watch()

  // Helper function to update nested values
  const updateNestedValue = (path, value) => {
    // Coerce numeric fields to numbers
    const numericPaths = new Set([
      "basicInformation.age",
      "basicInformation.weight",
      "basicInformation.bcs",
      "basicInformation.amount",
      "basicInformation.receivedAmount",
      "basicInformation.doctorId",
      "basicInformation.paymentTypeId",
      "environment.newAnimal.count",
    ])

    let newValue = value
    if (numericPaths.has(path)) {
      if (value === "" || value === null || value === undefined) {
        newValue = null
      } else if (path.endsWith("count") || path.endsWith("doctorId") || path.endsWith("paymentTypeId") || path.endsWith("age")) {
        const parsed = parseInt(value, 10)
        newValue = Number.isNaN(parsed) ? null : parsed
      } else {
        const parsed = parseFloat(value)
        newValue = Number.isNaN(parsed) ? null : parsed
      }
    }

    setValue(path, newValue)
    trigger(path) // Trigger validation for this field
  }

  // Enhanced array handlers with validation
  const handleAddVaccine = () => {
    const newVaccine = getValues("protectiveAgents.newVaccine")
    const validation = validateVaccine(newVaccine)
    if (validation.isValid) {
      const currentVaccines = getValues("protectiveAgents.vaccines") || []
      setValue("protectiveAgents.vaccines", [...currentVaccines, newVaccine])
      setValue("protectiveAgents.newVaccine", { name: "", vaccinationTypeId: "", date: "", notes: "" })
      setArrayErrors((prev) => ({ ...prev, vaccines: {} }))
    } else {
      setArrayErrors((prev) => ({ ...prev, vaccines: validation.errors }))
    }
  }

  const handleAddWormPill = () => {
    const newWormPill = getValues("protectiveAgents.newWormPill")
    const validation = validateWormPill(newWormPill)
    if (validation.isValid) {
      const currentWormPills = getValues("protectiveAgents.wormPills") || []
      setValue("protectiveAgents.wormPills", [...currentWormPills, newWormPill])
      setValue("protectiveAgents.newWormPill", { name: "", date: "", notes: "" })
      setArrayErrors((prev) => ({ ...prev, wormPills: {} }))
    } else {
      setArrayErrors((prev) => ({ ...prev, wormPills: validation.errors }))
    }
  }

  const handleAddInsecticide = () => {
    const newInsecticide = getValues("protectiveAgents.newInsecticide")
    console.log(`vlaues is${newInsecticide.name}`);
    console.log(`vlaues is${newInsecticide.date}`);

    console.log(newInsecticide);
    
    const validation = validateInsecticide(newInsecticide)
    console.log(` validaiton is${validation.errors.name}`);
    
    if (validation.isValid) {
      const currentInsecticides = getValues("protectiveAgents.insecticides") || []
      setValue("protectiveAgents.insecticides", [...currentInsecticides, newInsecticide])
      setValue("protectiveAgents.newInsecticide", { name: "", type: "", date: "", notes: "" })
      setArrayErrors((prev) => ({ ...prev, insecticides: {} }))
    } else {
      setArrayErrors((prev) => ({ ...prev, insecticides: validation.errors }))
    }
  }

  const handleAddAnimal = () => {
    const newAnimal = getValues("environment.newAnimal")
    const validation = validateAnimal(newAnimal)
    if (validation.isValid) {
      const currentAnimals = getValues("environment.otherAnimals") || []
      const coerced = {
        ...newAnimal,
        count:
          newAnimal?.count === undefined || newAnimal?.count === ""
            ? null
            : Number.isNaN(parseInt(newAnimal.count, 10))
              ? null
              : parseInt(newAnimal.count, 10),
      }
      setValue("environment.otherAnimals", [...currentAnimals, coerced])
      setValue("environment.newAnimal", { type: "", count: "" })
      setArrayErrors((prev) => ({ ...prev, animals: {} }))
    } else {
      setArrayErrors((prev) => ({ ...prev, animals: validation.errors }))
    }
  }

  const handleAddTreatment = () => {
    const newTreatment = getValues("newTreatment")
    const validation = validateTreatment(newTreatment)
    if (validation.isValid) {
      const currentTreatments = getValues("treatments") || []
      setValue("treatments", [...currentTreatments, newTreatment])
      setValue("newTreatment", { medicine: "", dosage: "", administrationMethod: "", recommendations: "" })
      setArrayErrors((prev) => ({ ...prev, treatments: {} }))
    } else {
      setArrayErrors((prev) => ({ ...prev, treatments: validation.errors }))
    }
  }

  const handleAddPreviousCondition = () => {
    const newCondition = getValues("previousConditions.newCondition")
    const validation = validatePreviousCondition(newCondition)
    if (validation.isValid) {
      const currentConditions = getValues("previousConditions.conditions") || []
      setValue("previousConditions.conditions", [...currentConditions, newCondition])
      setValue("previousConditions.newCondition", { condition: "", date: "" })
      setArrayErrors((prev) => ({ ...prev, previousConditions: {} }))
    } else {
      setArrayErrors((prev) => ({ ...prev, previousConditions: validation.errors }))
    }
  }

  // Remove handlers
  const handleRemoveVaccine = (index) => {
    const currentVaccines = getValues("protectiveAgents.vaccines") || []
    setValue(
      "protectiveAgents.vaccines",
      currentVaccines.filter((_, i) => i !== index),
    )
  }

  const handleRemoveWormPill = (index) => {
    const currentWormPills = getValues("protectiveAgents.wormPills") || []
    setValue(
      "protectiveAgents.wormPills",
      currentWormPills.filter((_, i) => i !== index),
    )
  }

  const handleRemoveInsecticide = (index) => {
    const currentInsecticides = getValues("protectiveAgents.insecticides") || []
    setValue(
      "protectiveAgents.insecticides",
      currentInsecticides.filter((_, i) => i !== index),
    )
  }

  const handleRemoveAnimal = (index) => {
    const currentAnimals = getValues("environment.otherAnimals") || []
    setValue(
      "environment.otherAnimals",
      currentAnimals.filter((_, i) => i !== index),
    )
  }

  const handleRemoveTreatment = (index) => {
    const currentTreatments = getValues("treatments") || []
    setValue(
      "treatments",
      currentTreatments.filter((_, i) => i !== index),
    )
  }

  const handleRemovePreviousCondition = (index) => {
    const currentConditions = getValues("previousConditions.conditions") || []
    setValue(
      "previousConditions.conditions",
      currentConditions.filter((_, i) => i !== index),
    )
  }

  // Helper function to get field error
  const getFieldError = (fieldPath) => {
    const pathParts = fieldPath.split(".")
    let error = errors
    for (const part of pathParts) {
      if (error && error[part]) {
        error = error[part]
      } else {
        return null
      }
    }
    return error?.message || null
  }

  // Helper function to check if field is touched
  const isFieldTouched = (fieldPath) => {
    const pathParts = fieldPath.split(".")
    let touched = touchedFields
    for (const part of pathParts) {
      if (touched && touched[part]) {
        touched = touched[part]
      } else {
        return false
      }
    }
    return !!touched
  }

  return {
    // React Hook Form methods
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    errors,
    isSubmitting,
    touchedFields,
    reset,
    trigger,
    // Form data
    formData,
    // Enhanced handlers
    updateNestedValue,
    // Array handlers with validation
    handleAddVaccine,
    handleAddWormPill,
    handleAddInsecticide,
    handleAddAnimal,
    handleAddTreatment,
    handleAddPreviousCondition,
    // Remove handlers
    handleRemoveVaccine,
    handleRemoveWormPill,
    handleRemoveInsecticide,
    handleRemoveAnimal,
    handleRemoveTreatment,
    handleRemovePreviousCondition,
    // Array validation errors
    arrayErrors,
    // Helper functions
    getFieldError,
    isFieldTouched,
  }
}
