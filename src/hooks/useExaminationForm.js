// "use client"

// import { useState, useCallback } from "react"

// // Initial form data structure
// const initialFormData = {
//   animalId: 0,
//   basicInformation: {
//     date: "",
//     animalTypeName: "",
//     // doctor: "", // Removed as requested
//     gender: "",
//     neutered: null, // Default to false string
//     age: "",
//     weight: "",
//     birthDate: "",
//     amount: "", // Unified field for amount
//     receivedAmount: "", // Unified field for received amount
//     // paymentReceivedDate: "", // Removed as requested
//     // paymentTypeId: null, // Removed as requested
//   },
//   visitInformation: {
//     mainReason: "",
//     symptomsStarted: "",
//     diseaseProgress: "",
//     previousTreatments: "",
//     ownership: "",
//     travelHistory: "",
//     exercise: "",
//   },
//   reproductiveCycle: {
//     lastReproductiveCycle: "",
//   },
//   environment: {
//     breedingPlace: "",
//     customBreedingPlace: "",
//     otherAnimals: [], // Array of { type: string, count: number }
//     newAnimal: { type: "", count: "" }, // For adding new animal
//   },
//   diet: {
//     foodType: [],
//     customFoodType: "", // For "غير ذلك" input
//     showCustomFoodType: false, // To control visibility of custom input
//     mealsPerDay: "",
//     waterIntake: "",
//     suddenDietChange: "",
//     appetiteChanges: "",
//   },
//   vomiting: {
//     hasVomiting: false, // Boolean for optional section
//     vomitingFrequency: "",
//     vomitContent: [],
//     customVomitContent: "",
//     showCustomVomitContent: false,
//     waterVomiting: false,
//     vomitingFoodRelation: "",
//     vomitConsistency: "",
//     retching: false,
//     withDiarrhea: false,
//     diarrheaDetails: "",
//   },
//   convulsions: {
//     hasConvulsions: false, // "نعم" or false for optional section
//     convulsionDetails: "",
//     videoRecording: false,
//     seizureSymptoms: "",
//     suddenCollapse: false,
//     seizureAfterFood: false,
//     seizureAfterExercise: false,
//     convulsionTriggers: [],
//     customConvulsionTrigger: "",
//     showCustomConvulsionTrigger: false,
//   },
//   cough: {
//     hasCough: false, // "نعم" or false for optional section
//     coughStart: "",
//     coughFrequency: "",
//     coughType: "",
//     breathingDifficulty: false,
//     coughTiming: [],
//     customCoughTiming: "",
//     showCustomCoughTiming: false,
//   },
//   sneezing: {
//     hasSneezing: false, // "نعم" or false for optional section
//     sneezingDetails: "",
//   },
//   urination: {
//     hasUrinationIssues: false,
//     urinationFrequency: "",
//     urinationVolume: "",
//     urinationColor: "",
//     urinationPattern: "",
//     bloodInUrine: false,
//     bloodLocation: "",
//   },
//   discharges: {
//     hasDischarges: false, // "نعم" or false for optional section
//     reproductiveDischarge: "",
//     earDischarge: "",
//     eyeDischarge: "",
//     nasalDischarge: "",
//     woundDischarge: "",
//     otherDischarge: "",
//   },
//   otherConditions: {
//     paralysisLameness: "",
//     itchingHairLoss: "",
//   },
//   previousConditions: {
//     conditions: [], // Array of { condition: string, date: string }
//     newCondition: { condition: "", date: "" }, // For adding new condition
//     // dewormingHistory: "", // Removed as requested
//   },
//   treatment: {
//     vaccines: [],
//     newVaccine: { name: "", vaccinationTypeId: "", date: "", notes: "" }, // For adding new vaccine
//     wormPills: [],
//     newWormPill: { name: "", date: "", notes: "" }, // For adding new worm pill
//     insecticides: [],
//     newInsecticide: { nameAndType: "", date: "", notes: "" }, // For adding new insecticide
//   },
//   diagnosis: "", // Direct string field
//   treatments: {
//     list: [], // Array of { medicine: string, dosage: string, administrationMethod: string, recommendations: string }
//     newTreatment: { medicine: "", dosage: "", administrationMethod: "", recommendations: "" }, // For adding new treatment
//   },
//   // Follow-up fields are now at the root level as per schema
//   followUpDays: "",
//   followUpDate: "",
// }

// export const useExaminationForm = (initialData = null) => {
//   const [formData, setFormData] = useState(initialData || initialFormData)

//   // Generic function to update any nested field using a path string (e.g., "basicInformation.doctor")
//   const updateNestedValue = useCallback((path, value) => {
//     setFormData((prevData) => {
//       const newData = { ...prevData }
//       const pathParts = path.split(".")
//       let current = newData

//       for (let i = 0; i < pathParts.length - 1; i++) {
//         const part = pathParts[i]
//         if (!current[part] || typeof current[part] !== "object") {
//           current[part] = {} // Initialize if not exists
//         }
//         current = current[part]
//       }

//       current[pathParts[pathParts.length - 1]] = value
//       return newData
//     })
//   }, [])

//   // Helper to get nested values
//   const getNestedValue = useCallback(
//     (path) => {
//       const pathParts = path.split(".")
//       let current = formData
//       for (const part of pathParts) {
//         if (current && current[part] !== undefined) {
//           current = current[part]
//         } else {
//           return undefined
//         }
//       }
//       return current
//     },
//     [formData],
//   )

//   // Reset form data
//   const resetForm = useCallback(() => {
//     setFormData(initialFormData)
//   }, [])

//   return {
//     formData,
//     setFormData,
//     updateNestedValue,
//     getNestedValue,
//     resetForm,
//   }
// }
