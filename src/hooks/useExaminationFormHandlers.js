// "use client"
// import { useState } from "react"

// export const useExaminationFormHandlers = (formData, updateNestedValue) => {
//   const [validationErrors, setValidationErrors] = useState({})

//   // Basic field change handler
//   const handleFieldChange = (path, value) => {
//     updateNestedValue(path, value)
//     // Clear validation error for this field
//     if (validationErrors[path]) {
//       setValidationErrors((prev) => {
//         const newErrors = { ...prev }
//         delete newErrors[path]
//         return newErrors
//       })
//     }
//   }

//   // Checkbox change handler
//   const handleCheckboxChange = (path, value, checked) => {
//     const currentArray = getNestedValue(formData, path) || []
//     const newArray = checked ? [...currentArray, value] : currentArray.filter((item) => item !== value)
//     updateNestedValue(path, newArray)
//   }

//   // Radio button change handler
//   const handleRadioChange = (path, value) => {
//     updateNestedValue(path, value)
//   }

//   // Select change handler
//   const handleSelectChange = (path, value) => {
//     updateNestedValue(path, value)
//   }

//   // File upload handler
//   const handleFileUpload = (path, file) => {
//     updateNestedValue(path, file)
//   }

//   // Date change handler
//   const handleDateChange = (path, date) => {
//     updateNestedValue(path, date)
//   }

//   // Number input handler
//   const handleNumberChange = (path, value) => {
//     const numericValue = value === "" ? "" : Number(value)
//     updateNestedValue(path, numericValue)
//   }

//   // Boolean toggle handler
//   const handleBooleanToggle = (path) => {
//     const currentValue = getNestedValue(formData, path)
//     updateNestedValue(path, !currentValue)
//   }

//   // Helper function to get nested values
//   const getNestedValue = (obj, path) => {
//     const pathParts = path.split(".")
//     let current = obj
//     for (const part of pathParts) {
//       if (current && current[part] !== undefined) {
//         current = current[part]
//       } else {
//         return undefined
//       }
//     }
//     return current
//   }

//   // Validation helper
//   const validateField = (path, value, rules = {}) => {
//     const errors = []
//     if (rules.required && (!value || value.toString().trim() === "")) {
//       errors.push("هذا الحقل مطلوب")
//     }
//     if (rules.minLength && value && value.toString().length < rules.minLength) {
//       errors.push(`يجب أن يكون الحد الأدنى ${rules.minLength} أحرف`)
//     }
//     if (rules.maxLength && value && value.toString().length > rules.maxLength) {
//       errors.push(`يجب أن يكون الحد الأقصى ${rules.maxLength} أحرف`)
//     }
//     if (rules.pattern && value && !rules.pattern.test(value.toString())) {
//       errors.push("تنسيق غير صحيح")
//     }

//     if (errors.length > 0) {
//       setValidationErrors((prev) => ({ ...prev, [path]: errors[0] }))
//       return false
//     } else {
//       setValidationErrors((prev) => {
//         const newErrors = { ...prev }
//         delete newErrors[path]
//         return newErrors
//       })
//       return true
//     }
//   }

//   // Form validation
//   const validateForm = (validationRules = {}) => {
//     let isValid = true
//     const errors = {}
//     Object.keys(validationRules).forEach((path) => {
//       const value = getNestedValue(formData, path)
//       const rules = validationRules[path]
//       if (!validateField(path, value, rules)) {
//         isValid = false
//       }
//     })
//     return isValid
//   }

//   return {
//     // Field handlers
//     handleFieldChange,
//     handleCheckboxChange,
//     handleRadioChange,
//     handleSelectChange,
//     handleFileUpload,
//     handleDateChange,
//     handleNumberChange,
//     handleBooleanToggle,
//     // Validation
//     validateField,
//     validateForm,
//     validationErrors,
//     setValidationErrors,
//     // Utilities
//     getNestedValue,
//   }
// }
