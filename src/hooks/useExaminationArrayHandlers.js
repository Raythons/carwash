"use client"
import { useState } from "react"

export const useExaminationArrayHandlers = (formData, updateNestedValue) => {
  const [arrayErrors, setArrayErrors] = useState({})

  // Validation functions
  const validateVaccine = (vaccine) => {
    const errors = {}
    if (!vaccine.name?.trim()) errors.name = "اسم اللقاح مطلوب"
    if (!vaccine.date?.trim()) errors.date = "تاريخ اللقاح مطلوب"
    return { isValid: Object.keys(errors).length === 0, errors }
  }

  const validateWormPill = (wormPill) => {
    const errors = {}
    if (!wormPill.name?.trim()) errors.name = "اسم مضاد الديدان مطلوب"
    if (!wormPill.date?.trim()) errors.date = "تاريخ الإعطاء مطلوب"
    return { isValid: Object.keys(errors).length === 0, errors }
  }

  const validateInsecticide = (insecticide) => {
    const errors = {}
    if (!insecticide.name?.trim()) errors.name = "اسم مضاد الحشرات مطلوب"
    if (!insecticide.type?.trim()) errors.type = "نوع مضاد الحشرات مطلوب"
    return { isValid: Object.keys(errors).length === 0, errors }
  }

  const validateAnimal = (animal) => {
    const errors = {}
    if (!animal.type?.trim()) errors.type = "نوع الحيوان مطلوب"
    if (!animal) errors.count = "عدد الحيوانات مطلوب"
    return { isValid: Object.keys(errors).length === 0, errors }
  }

  const validateTreatment = (treatment) => {
    const errors = {}
    if (!treatment.medicine?.trim()) errors.medicine = "اسم الدواء مطلوب"
    if (!treatment.dosage?.trim()) errors.dosage = "الجرعة مطلوبة"
    if (!treatment.administrationMethod?.trim()) errors.administrationMethod = "طريقة الإعطاء مطلوبة"
    return { isValid: Object.keys(errors).length === 0, errors }
  }

  const validatePreviousCondition = (condition) => {
    const errors = {}
    if (!condition.condition?.trim()) errors.condition = "الحالة مطلوبة"
    if (!condition.date?.trim()) errors.date = "التاريخ مطلوب"
    return { isValid: Object.keys(errors).length === 0, errors }
  }

  // Helper function to get nested values
  const getNestedValue = (path) => {
    const pathParts = path.split(".")
    let current = formData
    for (const part of pathParts) {
      if (current && current[part] !== undefined) {
        current = current[part]
      } else {
        return undefined
      }
    }
    return current
  }

  // Add handlers
  const handleAddVaccine = () => {
    const newVaccine = getNestedValue("protectiveAgents.newVaccine")
    const validation = validateVaccine(newVaccine)
    if (validation.isValid) {
      const currentVaccines = getNestedValue("protectiveAgents.vaccines") || []
      updateNestedValue("protectiveAgents.vaccines", [...currentVaccines, newVaccine])
      updateNestedValue("protectiveAgents.newVaccine", { name: "", vaccinationTypeId: "", date: "", notes: "" })
      setArrayErrors((prev) => ({ ...prev, vaccines: {} }))
    } else {
      setArrayErrors((prev) => ({ ...prev, vaccines: validation.errors }))
    }
  }

  const handleAddWormPill = () => {
    const newWormPill = getNestedValue("protectiveAgents.newWormPill")
    const validation = validateWormPill(newWormPill)
    if (validation.isValid) {
      const currentWormPills = getNestedValue("protectiveAgents.wormPills") || []
      updateNestedValue("protectiveAgents.wormPills", [...currentWormPills, newWormPill])
      updateNestedValue("protectiveAgents.newWormPill", { name: "", date: "", notes: "" })
      setArrayErrors((prev) => ({ ...prev, wormPills: {} }))
    } else {
      setArrayErrors((prev) => ({ ...prev, wormPills: validation.errors }))
    }
  }

  const handleAddInsecticide = () => {
    const newInsecticide = getNestedValue("protectiveAgents.newInsecticide")
    const validation = validateInsecticide(newInsecticide)
    if (validation.isValid) {
      const currentInsecticides = getNestedValue("protectiveAgents.insecticides") || []
      updateNestedValue("protectiveAgents.insecticides", [...currentInsecticides, newInsecticide])
      updateNestedValue("protectiveAgents.newInsecticide", { name: "", type: "", date: "", notes: "" })
      setArrayErrors((prev) => ({ ...prev, insecticides: {} }))
    } else {
      setArrayErrors((prev) => ({ ...prev, insecticides: validation.errors }))
    }
  }

  const handleAddAnimal = () => {
    const newAnimal = getNestedValue("environment.newAnimal")
    const validation = validateAnimal(newAnimal)
    if (validation.isValid) {
      const currentAnimals = getNestedValue("environment.otherAnimals") || []
      updateNestedValue("environment.otherAnimals", [...currentAnimals, newAnimal])
      updateNestedValue("environment.newAnimal", { type: "", count: "" })
      setArrayErrors((prev) => ({ ...prev, animals: {} }))
    } else {
      setArrayErrors((prev) => ({ ...prev, animals: validation.errors }))
    }
  }

  const handleAddTreatment = () => {
    const newTreatment = getNestedValue("newTreatment")
    const validation = validateTreatment(newTreatment)
    if (validation.isValid) {
      const currentTreatments = getNestedValue("treatments") || []
      updateNestedValue("treatments", [...currentTreatments, newTreatment])
      updateNestedValue("newTreatment", { medicine: "", dosage: "", administrationMethod: "", recommendations: "" })
      setArrayErrors((prev) => ({ ...prev, treatments: {} }))
    } else {
      setArrayErrors((prev) => ({ ...prev, treatments: validation.errors }))
    }
  }

  const handleAddPreviousCondition = () => {
    const newCondition = getNestedValue("previousConditions.newCondition")
    const validation = validatePreviousCondition(newCondition)
    if (validation.isValid) {
      const currentConditions = getNestedValue("previousConditions.conditions") || []
      updateNestedValue("previousConditions.conditions", [...currentConditions, newCondition])
      updateNestedValue("previousConditions.newCondition", { condition: "", date: "" })
      setArrayErrors((prev) => ({ ...prev, previousConditions: {} }))
    } else {
      setArrayErrors((prev) => ({ ...prev, previousConditions: validation.errors }))
    }
  }

  // Remove handlers
  const handleRemoveVaccine = (index) => {
    const currentVaccines = getNestedValue("protectiveAgents.vaccines") || []
    updateNestedValue(
      "protectiveAgents.vaccines",
      currentVaccines.filter((_, i) => i !== index),
    )
  }

  const handleRemoveWormPill = (index) => {
    const currentWormPills = getNestedValue("protectiveAgents.wormPills") || []
    updateNestedValue(
      "protectiveAgents.wormPills",
      currentWormPills.filter((_, i) => i !== index),
    )
  }

  const handleRemoveInsecticide = (index) => {
    const currentInsecticides = getNestedValue("protectiveAgents.insecticides") || []
    updateNestedValue(
      "protectiveAgents.insecticides",
      currentInsecticides.filter((_, i) => i !== index),
    )
  }

  const handleRemoveAnimal = (index) => {
    const currentAnimals = getNestedValue("environment.otherAnimals") || []
    updateNestedValue(
      "environment.otherAnimals",
      currentAnimals.filter((_, i) => i !== index),
    )
  }

  const handleRemoveTreatment = (index) => {
    const currentTreatments = getNestedValue("treatments") || []
    updateNestedValue(
      "treatments",
      currentTreatments.filter((_, i) => i !== index),
    )
  }

  const handleRemovePreviousCondition = (index) => {
    const currentConditions = getNestedValue("previousConditions.conditions") || []
    updateNestedValue(
      "previousConditions.conditions",
      currentConditions.filter((_, i) => i !== index),
    )
  }

  return {
    // Add handlers
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
    // Array errors
    arrayErrors,
    setArrayErrors,
  }
}
