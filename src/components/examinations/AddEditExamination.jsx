"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useTranslation } from "react-i18next"
import { Button } from "../ui/Button"
import { WithLoading } from "../ui/WithLoading"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Import enhanced form hook with validation
import { useExaminationFormWithValidation } from "../../hooks/useExaminationFormWithValidation"
import { useExamination, useCreateExamination, useUpdateExamination } from "../../hooks/queries/useExaminationQueries"
import { useAnimalBriefHistory } from "@/hooks/queries/useAnimalQueries"
import { useQueryClient } from "@tanstack/react-query"
import { useClinic } from "../../contexts/ClinicContext"
import { cn } from "@/lib/utils"

// Import all section components
import { BasicInformationSection } from "./AddEditExaminationSections/BasicInformationSection"
import { VisitInformationSection } from "./AddEditExaminationSections/VisitInformationSection"
import { ReproductiveCycleSection } from "./AddEditExaminationSections/ReproductiveCycleSection"
import { EnvironmentSection } from "./AddEditExaminationSections/EnvironmentSection"
import { DietSection } from "./AddEditExaminationSections/DietSection"
import { VomitingSection } from "./AddEditExaminationSections/VomitingSection"
import { ConvulsionsSection } from "./AddEditExaminationSections/ConvulsionsSection"
import { CoughSection } from "./AddEditExaminationSections/CoughSection"
import { SneezingSection } from "./AddEditExaminationSections/SneezingSection"
import { UrinationSection } from "./AddEditExaminationSections/UrinationSection"
import { DischargesSection } from "./AddEditExaminationSections/DischargesSection"
import { OtherConditionsSection } from "./AddEditExaminationSections/OtherConditionsSection"
import { ClinicalExaminationSection } from "./AddEditExaminationSections/ClinicalExaminationSection"
import { PreviousConditionsSection } from "./AddEditExaminationSections/PreviousConditionsSection"
import { VaccinesSection } from "./AddEditExaminationSections/VaccinesSection"
import { DiagnosisSection } from "./AddEditExaminationSections/DiagnosisSection"
import { TreatmentSection } from "./AddEditExaminationSections/TreatmentSection"
import AddEditExaminationSkeleton from "../Skeletons/animals/Examinations/AddEditExaminationSkeleton"

// Icons for sections
import {
  User,
  FileText,
  Heart,
  Home,
  Utensils,
  Droplets,
  Zap,
  Wind,
  Flower,
  Droplet,
  Eye,
  AlertTriangle,
  History,
  Shield,
  Stethoscope,
  Pill,
} from "lucide-react"

// Constants
export const MODES = {
  ADD: "add",
  EDIT: "edit",
  VIEW: "view",
}

export function AddEditExamination({ mode }) {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.language === "ar"
  const { examinationId, animalId: routeAnimalId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { selectedClinicId } = useClinic()
  const [activeSection, setActiveSection] = useState("basic")
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [historicalData, setHistoricalData] = useState(null)
  const fetchedForAnimalIdRef = useRef(null)
  const readOnly = mode === MODES.VIEW

  const FORM_SECTIONS = useMemo(
    () => [
      {
        id: "basic",
        title: t("examinations.basic.title"),
        icon: User,
        color: "bg-blue-500",
        errorPaths: ["basicInformation"],
      },
      {
        id: "visit",
        title: t("examinations.visit.title"),
        icon: FileText,
        color: "bg-green-500",
        errorPaths: ["visitInformation"],
      },
      {
        id: "reproductive",
        title: t("examinations.reproductive.title"),
        icon: Heart,
        color: "bg-pink-500",
        errorPaths: ["reproductiveCycle"],
      },
      {
        id: "environment",
        title: t("examinations.environment.title"),
        icon: Home,
        color: "bg-purple-500",
        errorPaths: ["environment"],
      },
      {
        id: "diet",
        title: t("examinations.diet.title"),
        icon: Utensils,
        color: "bg-orange-500",
        errorPaths: ["diet"],
      },
      {
        id: "vomiting",
        title: t("examinations.vomiting.title"),
        icon: Droplets,
        color: "bg-red-500",
        errorPaths: ["vomiting"],
      },
      {
        id: "convulsions",
        title: t("examinations.convulsions.title"),
        icon: Zap,
        color: "bg-yellow-500",
        errorPaths: ["convulsions"],
      },
      {
        id: "cough",
        title: t("examinations.cough.title"),
        icon: Wind,
        color: "bg-teal-500",
        errorPaths: ["cough"],
      },
      {
        id: "sneezing",
        title: t("examinations.sneezing.title"),
        icon: Flower,
        color: "bg-indigo-500",
        errorPaths: ["sneezing"],
      },
      {
        id: "urination",
        title: t("examinations.urination.title"),
        icon: Droplet,
        color: "bg-cyan-500",
        errorPaths: ["urination"],
      },
      {
        id: "discharges",
        title: t("examinations.discharges.title"),
        icon: Eye,
        color: "bg-amber-500",
        errorPaths: ["discharges"],
      },
      {
        id: "other",
        title: t("examinations.other.title"),
        icon: AlertTriangle,
        color: "bg-rose-500",
        errorPaths: ["otherConditions"],
      },
      {
        id: "clinical",
        title: t("examinations.clinical.title"),
        icon: Stethoscope,
        color: "bg-teal-600",
        errorPaths: ["clinicalExamination"],
      },
      {
        id: "previous",
        title: t("examinations.previous.title"),
        icon: History,
        color: "bg-slate-500",
        errorPaths: ["previousConditions"],
      },
      {
        id: "protectiveAgents",
        title: t("examinations.protective_agents.title"),
        icon: Shield,
        color: "bg-emerald-500",
        errorPaths: ["protectiveAgents"],
      },
      {
        id: "diagnosis",
        title: t("examinations.diagnosis.title"),
        icon: Stethoscope,
        color: "bg-violet-500",
        errorPaths: ["diagnosis"],
      },
      {
        id: "treatment",
        title: t("examinations.treatment.title"),
        icon: Pill,
        color: "bg-lime-500",
        errorPaths: ["treatments", "newTreatment"],
      },
    ],
    [t],
  )

  // React Query hooks for API calls
  const { data: examinationResponse, isLoading: isExaminationLoading } = useExamination(examinationId, {
    enabled: (mode === MODES.EDIT || mode === MODES.VIEW) && !!examinationId,
  })
  const createExaminationMutation = useCreateExamination()
  const updateExaminationMutation = useUpdateExamination()

  // Extract the actual examination data from the response
  const examinationData = examinationResponse?.data
  const isFailure =
    (mode === MODES.EDIT || mode === MODES.VIEW) &&
    !isExaminationLoading &&
    (examinationResponse?.isFailure || !examinationData)
  // Enhanced form hook with validation
  const {
    register,
    handleSubmit,
    formData,
    errors,
    isSubmitting,
    getFieldError,
    isFieldTouched,
    handleAddVaccine,
    handleAddWormPill,
    handleAddInsecticide,
    handleAddAnimal,
    handleAddTreatment,
    handleAddPreviousCondition,
    handleRemoveVaccine,
    handleRemoveWormPill,
    handleRemoveInsecticide,
    handleRemoveAnimal,
    handleRemoveTreatment,
    handleRemovePreviousCondition,
    arrayErrors,
    updateNestedValue,
    reset,
    trigger,
    setValue,
  } = useExaminationFormWithValidation(examinationData, mode)

  // Function to recursively check for errors in nested objects
  const hasNestedErrors = (obj) => {
    if (!obj || typeof obj !== "object") return false
    if (obj.message) return true
    return Object.values(obj).some((value) => {
      if (value && typeof value === "object") {
        return hasNestedErrors(value)
      }
      return false
    })
  }

  // Function to check if a section has errors
  const sectionHasErrors = (section) => {
    // Special case: reproductive section should not show errors if animal is neutered or male
    if (section.id === "reproductive") {
      const basicInfo = formData?.basicInformation
      if (basicInfo?.gender !== "أنثى" || basicInfo?.neutered !== false) {
        return false // No errors for neutered animals or males
      }
    }

    // Special case: diet section - no validation errors since all fields are optional
    if (section.id === "diet") {
      return false // Diet section never shows errors
    }

    let hasFormErrors = false
    for (const path of section.errorPaths) {
      const pathParts = path.split(".")
      let errorObj = errors
      for (const part of pathParts) {
        if (errorObj && errorObj[part]) {
          errorObj = errorObj[part]
        } else {
          errorObj = null
          break
        }
      }
      if (hasNestedErrors(errorObj)) {
        hasFormErrors = true
        break
      }
    }

    const hasArrayErrors =
      (section.id === "treatment" && Object.keys(arrayErrors.treatments || {}).length > 0) ||
      (section.id === "protectiveAgents" &&
        (Object.keys(arrayErrors.vaccines || {}).length > 0 ||
          Object.keys(arrayErrors.wormPills || {}).length > 0 ||
          Object.keys(arrayErrors.insecticides || {}).length > 0)) ||
      (section.id === "environment" && Object.keys(arrayErrors.animals || {}).length > 0) ||
      (section.id === "previous" && Object.keys(arrayErrors.previousConditions || {}).length > 0)

    return hasFormErrors || hasArrayErrors
  }

  // Form submission handler
  const onSubmit = async (data) => {
    setHasSubmitted(true)

    try {
      // Transform data for submission
      const submitData = { ...data }

      // Convert vomit content array to string
      if (submitData.vomiting?.vomitContent && Array.isArray(submitData.vomiting.vomitContent)) {
        const vomitContentArray = [...submitData.vomiting.vomitContent]
        if (submitData.vomiting.showCustomVomitContent && submitData.vomiting.customVomitContent?.trim()) {
          vomitContentArray.push(submitData.vomiting.customVomitContent.trim())
        }
        submitData.vomiting.vomitContent = vomitContentArray.join(", ")
      }

      // Convert diet food type array to string
      if (submitData.diet?.foodType && Array.isArray(submitData.diet.foodType)) {
        const foodTypeArray = [...submitData.diet.foodType]
        if (submitData.diet.showCustomFoodType && submitData.diet.customFoodType?.trim()) {
          foodTypeArray.push(submitData.diet.customFoodType.trim())
        }
        submitData.diet.foodType = foodTypeArray.join(", ")
      }

      // Process payment data in basicInformation
      if (submitData.basicInformation) {
        // Convert amount to final value
        if (submitData.basicInformation.amount === "غير ذلك") {
          submitData.basicInformation.amount = submitData.basicInformation.customAmount || ""
        }

        // Convert received amount to final value
        if (submitData.basicInformation.receivedAmount === "غير ذلك") {
          submitData.basicInformation.receivedAmount = submitData.basicInformation.customReceivedAmount || ""
        }

        // Remove temporary fields
        delete submitData.basicInformation.customAmount
        delete submitData.basicInformation.customReceivedAmount
      }

      // Clean up clinical examination data
      if (submitData.clinicalExamination) {
        // If hasDehydration is false, ensure dehydrationPercentage is null
        if (!submitData.clinicalExamination.hasDehydration) {
          submitData.clinicalExamination.dehydrationPercentage = null
        }
      }

      // Remove temporary UI fields
      if (submitData.vomiting) {
        delete submitData.vomiting.customVomitContent
        delete submitData.vomiting.showCustomVomitContent
      }

      if (submitData.diet) {
        delete submitData.diet.customFoodType
        delete submitData.diet.showCustomFoodType
      }

      if (mode === MODES.EDIT) {
        await updateExaminationMutation.mutateAsync({ id: examinationId, data: submitData })

        // Manually invalidate the examination cache to ensure fresh data
        await queryClient.invalidateQueries({
          queryKey: ["examinations", "detail", selectedClinicId, examinationId],
        })

        toast.success(t("examinations.main.update_success"))
        navigate(`/clinic/animals/${submitData.animalId}/examinations/${examinationId}`)
      } else {
        const result = await createExaminationMutation.mutateAsync(submitData)
        toast.success(t("examinations.main.add_success"))
        // result is just the examination ID, use submitData.animalId for animal ID
        navigate(`/clinic/animals/${submitData.animalId}/examinations/${result}`)
      }
    } catch (error) {
      console.error("Form submission error:", error)
      // Global API interceptor already shows an error toast
    }
  }

  const pageTitle =
    mode === MODES.EDIT
      ? t("examinations.main.edit_title")
      : mode === MODES.VIEW
        ? t("examinations.main.view_title")
        : t("examinations.main.add_title")
  const breadcrumbPage =
    mode === MODES.VIEW
      ? t("examinations.main.view_breadcrumb")
      : mode === MODES.EDIT
        ? t("examinations.main.edit_breadcrumb")
        : t("examinations.main.add_breadcrumb")

  const renderSection = () => {
    switch (activeSection) {
      case "basic":
        return (
          <BasicInformationSection
            formData={formData.basicInformation}
            animalData={historicalData}
            mode={mode}
            register={register}
            errors={errors}
            getFieldError={getFieldError}
            isFieldTouched={isFieldTouched}
            onChange={(field, value) => updateNestedValue(`basicInformation.${field}`, value)}
            isSubmitted={hasSubmitted}
          />
        )
      case "visit":
        return (
          <VisitInformationSection
            formData={formData.visitInformation}
            register={register}
            errors={errors}
            getFieldError={getFieldError}
            isFieldTouched={isFieldTouched}
            onChange={(field, value) => updateNestedValue(`visitInformation.${field}`, value)}
            isSubmitted={hasSubmitted}
          />
        )
      case "reproductive":
        return (
          <ReproductiveCycleSection
            formData={formData.reproductiveCycle}
            register={register}
            basicInfo={formData.basicInformation}
            errors={errors}
            getFieldError={getFieldError}
            isFieldTouched={isFieldTouched}
            onChange={(field, value) => updateNestedValue(`reproductiveCycle.${field}`, value)}
            isSubmitted={hasSubmitted}
          />
        )
      case "environment":
        return (
          <EnvironmentSection
            formData={formData.environment}
            register={register}
            errors={errors}
            getFieldError={getFieldError}
            isFieldTouched={isFieldTouched}
            arrayErrors={arrayErrors.animals}
            onChange={(field, value) => updateNestedValue(`environment.${field}`, value)}
            onNestedChange={(field, value) => updateNestedValue(`environment.newAnimal.${field}`, value)}
            onAddItem={handleAddAnimal}
            onRemoveItem={handleRemoveAnimal}
            isSubmitted={hasSubmitted}
          />
        )
      case "diet":
        return (
          <DietSection
            formData={formData.diet}
            register={register}
            errors={errors}
            getFieldError={getFieldError}
            isFieldTouched={isFieldTouched}
            onChange={(field, value) => updateNestedValue(`diet.${field}`, value)}
            onCheckboxChange={(field, value, checked) => {
              const currentArray = formData.diet[field] || []
              const newArray = checked ? [...currentArray, value] : currentArray.filter((item) => item !== value)
              updateNestedValue(`diet.${field}`, newArray)
            }}
            isSubmitted={hasSubmitted}
          />
        )
      case "vomiting":
        return (
          <VomitingSection
            formData={formData.vomiting}
            mode={mode}
            register={register}
            errors={errors}
            getFieldError={getFieldError}
            isFieldTouched={isFieldTouched}
            onChange={(field, value) => updateNestedValue(`vomiting.${field}`, value)}
            onCheckboxChange={(field, value, checked) => {
              const currentArray = formData.vomiting[field] || []
              const newArray = checked ? [...currentArray, value] : currentArray.filter((item) => item !== value)
              updateNestedValue(`vomiting.${field}`, newArray)
            }}
            isSubmitted={hasSubmitted}
          />
        )
      case "convulsions":
        return (
          <ConvulsionsSection
            formData={formData.convulsions}
            register={register}
            errors={errors}
            getFieldError={getFieldError}
            isFieldTouched={isFieldTouched}
            onChange={(field, value) => updateNestedValue(`convulsions.${field}`, value)}
            isSubmitted={hasSubmitted}
          />
        )
      case "cough":
        return (
          <CoughSection
            formData={formData.cough}
            register={register}
            errors={errors}
            getFieldError={getFieldError}
            isFieldTouched={isFieldTouched}
            onChange={(field, value) => updateNestedValue(`cough.${field}`, value)}
            isSubmitted={hasSubmitted}
          />
        )
      case "sneezing":
        return (
          <SneezingSection
            formData={formData.sneezing}
            register={register}
            errors={errors}
            getFieldError={getFieldError}
            isFieldTouched={isFieldTouched}
            onChange={(field, value) => updateNestedValue(`sneezing.${field}`, value)}
            isSubmitted={hasSubmitted}
          />
        )
      case "urination":
        return (
          <UrinationSection
            formData={formData.urination}
            register={register}
            errors={errors}
            getFieldError={getFieldError}
            isFieldTouched={isFieldTouched}
            onChange={(field, value) => updateNestedValue(`urination.${field}`, value)}
            isSubmitted={hasSubmitted}
          />
        )
      case "discharges":
        return (
          <DischargesSection
            formData={formData.discharges}
            register={register}
            errors={errors}
            getFieldError={getFieldError}
            isFieldTouched={isFieldTouched}
            onChange={(field, value) => updateNestedValue(`discharges.${field}`, value)}
            isSubmitted={hasSubmitted}
          />
        )
      case "other":
        return (
          <OtherConditionsSection
            formData={formData.otherConditions}
            register={register}
            errors={errors}
            onChange={(field, value) => updateNestedValue(`otherConditions.${field}`, value)}
            getFieldError={getFieldError}
            isFieldTouched={isFieldTouched}
          />
        )
      case "clinical":
        return (
          <ClinicalExaminationSection
            formData={formData.clinicalExamination}
            register={register}
            errors={errors}
            onChange={(field, value) => updateNestedValue(field, value)}
            getFieldError={getFieldError}
            isFieldTouched={isFieldTouched}
          />
        )
      case "previous":
        return (
          <PreviousConditionsSection
            historicalConditions={historicalData?.previousConditions}
            formData={formData.previousConditions}
            register={register}
            errors={errors}
            getFieldError={getFieldError}
            isFieldTouched={isFieldTouched}
            arrayErrors={arrayErrors.previousConditions}
            onChange={(field, value) => updateNestedValue(`previousConditions.${field}`, value)}
            onNestedChange={(field, value) => updateNestedValue(`previousConditions.newCondition.${field}`, value)}
            onAddItem={handleAddPreviousCondition}
            onRemoveItem={handleRemovePreviousCondition}
            isSubmitted={hasSubmitted}
          />
        )
      case "protectiveAgents":
        return (
          <VaccinesSection
            formData={formData.protectiveAgents} // Pass the correct data slice
            updateNestedValue={updateNestedValue}
            handleAddVaccine={handleAddVaccine}
            handleRemoveVaccine={handleRemoveVaccine}
            handleAddWormPill={handleAddWormPill}
            handleRemoveWormPill={handleRemoveWormPill}
            handleAddInsecticide={handleAddInsecticide}
            handleRemoveInsecticide={handleRemoveInsecticide}
            arrayErrors={arrayErrors} // Pass the whole arrayErrors object
            readOnly={readOnly}
            mode={mode}
            historicalProtectiveAgents={
              historicalData
                ? [
                    ...(historicalData.vaccines || []).map((item) => ({ ...item, type: "vaccine" })),
                    ...(historicalData.wormPills || []).map((item) => ({ ...item, type: "wormPill" })),
                    ...(historicalData.insecticides || []).map((item) => ({ ...item, type: "insecticide" })),
                  ]
                : []
            } // Combine all protective agents with type labels
          />
        )
      case "diagnosis":
        return (
          <DiagnosisSection
            formData={formData}
            register={register}
            errors={errors}
            getFieldError={getFieldError}
            isFieldTouched={isFieldTouched}
            onChange={updateNestedValue}
            isSubmitted={hasSubmitted}
          />
        )
      case "treatment":
        return (
          <TreatmentSection
            formData={formData}
            newTreatment={formData.newTreatment}
            register={register}
            errors={errors}
            getFieldError={getFieldError}
            isFieldTouched={isFieldTouched}
            arrayErrors={arrayErrors.treatments}
            onAddTreatment={handleAddTreatment}
            onRemoveTreatment={handleRemoveTreatment}
            onTreatmentInputChange={(field, value) => {
              // Special handling for follow-up fields at root level
              if (field === "followUpDays" || field === "followUpDate") {
                updateNestedValue(field, value)
              } else {
                // For other fields, they're under newTreatment
                updateNestedValue(`newTreatment.${field}`, value)
              }
            }}
            isSubmitted={hasSubmitted}
          />
        )
      default:
        return null
    }
  }

  // Determine current animalId for brief history
  const editAnimalId =
    examinationData?.animalId ?? examinationData?.animal?.id ?? examinationData?.basicInformation?.animalId
  const currentAnimalId =
    mode === MODES.ADD
      ? routeAnimalId
        ? Number(routeAnimalId)
        : undefined
      : editAnimalId
        ? Number(editAnimalId)
        : undefined

  // Fetch brief historical record via clinic-scoped hook
  const { data: briefHistory } = useAnimalBriefHistory(currentAnimalId, { enabled: !!currentAnimalId })

  // Reset form when examination data loads in EDIT mode
  useEffect(() => {
    if (mode === MODES.EDIT && examinationData) {
      reset(examinationData)
    }
  }, [mode, examinationData, reset])

  // Set root-level animalId and inject brief history into form when available
  useEffect(() => {
    if (!currentAnimalId) return
    setValue("animalId", Number(currentAnimalId))
  }, [currentAnimalId, setValue])

  useEffect(() => {
    if (!briefHistory) return
    setHistoricalData(briefHistory)
    setValue("basicInformation.gender", briefHistory.gender || "")
    setValue("basicInformation.neutered", briefHistory.neutered || false)
    // Only set BCS if it's a valid number, don't override existing examination data
    if (briefHistory.bcs !== null && briefHistory.bcs !== undefined && briefHistory.bcs !== 0) {
      setValue("basicInformation.bcs", briefHistory.bcs)
    }
    if (briefHistory.dateOfBirth) {
      setValue("basicInformation.birthDate", briefHistory.dateOfBirth.split("T")[0])
    }
  }, [briefHistory, setValue])

  if (!isExaminationLoading && isFailure) {
    return (
      <div className="p-6 dark:bg-zinc-900">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm p-8 text-center">
            <div className="text-red-500 dark:text-red-400 mb-4">
              <Stethoscope className="w-16 h-16 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              {t("examinations.main.not_found")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{t("examinations.main.not_found_desc")}</p>
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="dark:bg-zinc-700 dark:text-white dark:border-zinc-600"
              >
                {t("common.back")}
              </Button>
              <Button
                onClick={() => navigate("/clinic/animals/examinations")}
                className="dark:bg-primary-600 dark:hover:bg-primary-700"
              >
                {t("examinations.main.back_to_list")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <WithLoading isLoading={isExaminationLoading} skeleton={<AddEditExaminationSkeleton />}>
      <div className="p-6 space-y-6 dark:bg-zinc-900" dir={isRTL ? "rtl" : "ltr"}>
        {/* Breadcrumb */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-primary-800 dark:text-primary-400">{pageTitle}</h1>
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="#"
                  className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  {t("sidebar.clinic_mode")}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="#"
                  className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  {t("examinations.list.title")}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <span className="text-gray-500 dark:text-zinc-400">{breadcrumbPage}</span>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Navigation Circles */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md dark:shadow-zinc-950/50 p-4 sm:p-2 dark:border dark:border-zinc-800">
          <div className="flex flex-wrap justify-start gap-3 sm:gap-4">
            {FORM_SECTIONS.map((section) => {
              const IconComponent = section.icon
              const isActive = activeSection === section.id
              const hasErrors = sectionHasErrors(section)

              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "relative flex flex-col items-center justify-center p-2 sm:p-2 md:p-3 rounded-lg transition-all duration-200 hover:scale-105 w-[70px] h-[70px] sm:w-[85px] sm:h-[85px] md:w-[100px] md:h-[100px]",
                    isActive
                      ? `${section.color} text-white shadow-lg dark:shadow-lg`
                      : "bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700",
                  )}
                  title={section.title}
                >
                  {/* Error Indicator Circle */}
                  {hasErrors && (
                    <div
                      className={cn(
                        "absolute -top-2 w-5 h-5 bg-red-500 dark:bg-red-600 rounded-full border-2 border-white dark:border-zinc-900 shadow-lg z-30 flex items-center justify-center",
                        isRTL ? "-right-2" : "-left-2",
                      )}
                    >
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                  )}

                  <div
                    className={cn(
                      "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-2 flex-shrink-0",
                      isActive ? "bg-white/20" : "bg-white/50 dark:bg-zinc-700/50",
                    )}
                  >
                    <IconComponent
                      className={cn(
                        "w-4 h-4 sm:w-5 sm:h-5",
                        isActive ? "text-white" : "text-gray-600 dark:text-zinc-300",
                      )}
                    />
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-center leading-tight break-words hyphens-auto px-1">
                    {section.title}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white dark:bg-zinc-900 p-4 gap-2 rounded-lg shadow-md dark:shadow-zinc-950/50 dark:border dark:border-zinc-800">
          {readOnly && (
            <div className="px-6 pt-6">
              <div className="rounded-md border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-950/30 text-primary-800 dark:text-primary-300 p-4 mb-2">
                {t("examinations.main.read_only_mode")}
              </div>
            </div>
          )}
          <form
            id="examination-form"
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white dark:bg-zinc-900 rounded-lg shadow-md dark:shadow-zinc-950/50 p-6 min-h-[300px] dark:border dark:border-zinc-800"
          >
            {/* Current Section */}
            <fieldset disabled={readOnly} className="min-h-[400px]">
              {renderSection()}
            </fieldset>
          </form>

          {/* Action buttons */}
          <div className={cn("flex gap-2 mt-4", isRTL ? "flex-row-reverse justify-end" : "justify-end")}>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="dark:bg-zinc-800 dark:text-white dark:border-zinc-700"
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              form="examination-form"
              disabled={isSubmitting}
              className="dark:bg-primary-600 dark:hover:bg-primary-700"
            >
              {isSubmitting || createExaminationMutation.isPending || updateExaminationMutation.isPending
                ? t("examinations.main.saving")
                : mode === MODES.EDIT
                  ? t("common.save_changes")
                  : t("examinations.main.add_new")}
            </Button>
          </div>
        </div>
      </div>
    </WithLoading>
  )
}

export default AddEditExamination
