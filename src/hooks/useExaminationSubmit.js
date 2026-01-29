"use client"
import { useState } from "react"

export const useExaminationSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Data transformation functions
  const transformFormDataForSubmission = (formData) => {
    const transformedData = { ...formData }

    // Convert vomit content array to string
    if (transformedData.vomiting?.vomitContent && Array.isArray(transformedData.vomiting.vomitContent)) {
      const vomitContentArray = [...transformedData.vomiting.vomitContent]

      // Add custom content if it exists and "غير ذلك" is selected
      if (transformedData.vomiting.showCustomVomitContent && transformedData.vomiting.customVomitContent?.trim()) {
        vomitContentArray.push(transformedData.vomiting.customVomitContent.trim())
      }

      transformedData.vomiting.vomitContent = vomitContentArray.join(", ")
    }

    // Convert diet food type array to string
    if (transformedData.diet?.foodType && Array.isArray(transformedData.diet.foodType)) {
      const foodTypeArray = [...transformedData.diet.foodType]

      // Add custom content if it exists and "غير ذلك" is selected
      if (transformedData.diet.showCustomFoodType && transformedData.diet.customFoodType?.trim()) {
        foodTypeArray.push(transformedData.diet.customFoodType.trim())
      }

      transformedData.diet.foodType = foodTypeArray.join(", ")
    }

    // Remove temporary UI fields
    if (transformedData.vomiting) {
      delete transformedData.vomiting.customVomitContent
      delete transformedData.vomiting.showCustomVomitContent
    }

    if (transformedData.diet) {
      delete transformedData.diet.customFoodType
      delete transformedData.diet.showCustomFoodType
    }

    // Remove other temporary fields
    if (transformedData.environment) {
      delete transformedData.environment.customBreedingPlace
      delete transformedData.environment.newAnimal
    }

    if (transformedData.basicInfo) {
      delete transformedData.basicInfo.customExaminationFee
    }

    // Remove new item templates
    if (transformedData.protectiveAgents) {
      delete transformedData.treatment.newVaccine
      delete transformedData.treatment.newWormPill
      delete transformedData.treatment.newInsecticide
    }

    if (transformedData.previousConditions) {
      delete transformedData.previousConditions.newCondition
    }

    if (transformedData.newTreatment) {
      delete transformedData.newTreatment
    }

    return transformedData
  }

  // Submit handler for creating new examination
  const handleCreateSubmit = async (formData, createMutation) => {
    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)

    try {
      const transformedData = transformFormDataForSubmission(formData)
      const result = await createMutation.mutateAsync(transformedData)
      setSubmitSuccess(true)
      return result
    } catch (error) {
      setSubmitError(error.message || "حدث خطأ أثناء إنشاء المعاينة")
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  // Submit handler for updating existing examination
  const handleUpdateSubmit = async (formData, updateMutation, examinationId) => {
    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)

    try {
      const transformedData = transformFormDataForSubmission(formData)
      const result = await updateMutation.mutateAsync({ id: examinationId, data: transformedData })
      setSubmitSuccess(true)
      return result
    } catch (error) {
      setSubmitError(error.message || "حدث خطأ أثناء تحديث المعاينة")
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  // Generic submit handler
  const handleSubmit = async (formData, mutation, options = {}) => {
    const { mode = "create", examinationId = null } = options

    if (mode === "edit" && examinationId) {
      return handleUpdateSubmit(formData, mutation, examinationId)
    } else {
      return handleCreateSubmit(formData, mutation)
    }
  }

  // Reset submission state
  const resetSubmitState = () => {
    setIsSubmitting(false)
    setSubmitError(null)
    setSubmitSuccess(false)
  }

  return {
    // State
    isSubmitting,
    submitError,
    submitSuccess,
    // Handlers
    handleCreateSubmit,
    handleUpdateSubmit,
    handleSubmit,
    resetSubmitState,
    // Utilities
    transformFormDataForSubmission,
  }
}
