"use client"

import { Input } from "../../ui/Input"
import { DollarSign, CalendarIcon, User, Tag, Weight, Stethoscope, Cake, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState, useEffect, useRef } from "react"
import { calculateAgeFromDOB, toDateOnly } from "@/utilities/date"
import { handleDecimalChangeWithField, formatNumberWithThousands, parseFormattedNumber } from "@/utilities/number"
import { CURRENCY } from "@/constants/currency"
import { FormSection, FormGrid } from "./FormSection"
import { FormFieldWrapper, FormFieldHeader } from "./FormFieldWrapper"

import { useTranslation } from "react-i18next"

export function BasicInformationSection({
  formData,
  animalData,
  mode,
  onChange,
  register,
  errors,
  getFieldError,
  isFieldTouched,
  isSubmitted,
}) {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.language === "ar"

  const safeFormData = formData || {
    date: "",
    doctorId: "",
    animalId: "",
    animalTypeId: "",
    neutered: false,
    gender: "",
    weight: "",
    bcs: 0,
    age: "",
    birthDate: "",
    amount: "",
    receivedAmount: "",
    animalName: "",
    ownerName: "",
  }

  const [examDateOpen, setExamDateOpen] = useState(false)
  const [weightInput, setWeightInput] = useState(
    formData?.weight !== null && formData?.weight !== undefined ? String(formData.weight) : "",
  )
  const [bcsInput, setBcsInput] = useState(
    formData?.bcs !== null && formData?.bcs !== undefined ? String(formData.bcs) : "",
  )

  useEffect(() => {
    const external = formData?.weight
    const asStr = external !== null && external !== undefined ? String(external) : ""
    if (asStr !== weightInput) setWeightInput(asStr)
  }, [formData?.weight])

  // In edit mode, load BCS value from formData when it becomes available
  // But don't override if user is actively typing (has decimal point)
  useEffect(() => {
    if (
      mode === "edit" &&
      formData?.bcs !== null &&
      formData?.bcs !== undefined &&
      formData?.bcs !== "" &&
      formData?.bcs !== 0
    ) {
      const bcsValue = String(formData.bcs)
      // Don't override if user is typing a decimal (has dot at end)
      if (bcsValue !== bcsInput && !bcsInput.endsWith(".")) {
        setBcsInput(bcsValue)
      }
    }
  }, [mode, formData?.bcs, bcsInput])

  const weightReg = register("basicInformation.weight")
  const bcsReg = register("basicInformation.bcs")

  const examDate = safeFormData.date ? new Date(safeFormData.date) : undefined

  const predefinedAmounts = [20, 25, 30]
  const amountOptions = [...predefinedAmounts, "other"]

  // In edit mode, always use "other" for amounts
  const isEditMode = mode === "edit"
  const isCustomAmount =
    isEditMode ||
    safeFormData.amount === "other" ||
    (typeof safeFormData.amount === "number" && !predefinedAmounts.includes(safeFormData.amount))
  const isCustomReceivedAmount =
    isEditMode ||
    safeFormData.receivedAmount === "other" ||
    (typeof safeFormData.receivedAmount === "number" && !predefinedAmounts.includes(safeFormData.receivedAmount))

  const [customAmountActive, setCustomAmountActive] = useState(isCustomAmount)
  const [customReceivedAmountActive, setCustomReceivedAmountActive] = useState(isCustomReceivedAmount)

  useEffect(() => {
    if (mode === "add" && !safeFormData.date) {
      onChange("date", new Date().toISOString().split("T")[0])
    }
  }, [mode, safeFormData.date, onChange])

  const prefilledForAnimalIdRef = useRef(null)
  useEffect(() => {
    if (!animalData) return
    const currentId = animalData.id ?? animalData.animalId ?? animalData.animal?.id
    if (currentId == null || prefilledForAnimalIdRef.current === currentId) return

    const setIfChanged = (field, value) => {
      if (safeFormData && safeFormData[field] !== value) onChange(field, value)
    }

    setIfChanged("animalName", animalData.name || "")
    setIfChanged("ownerName", animalData.ownerName || t("common.not_specified"))
    setIfChanged("animalTypeId", animalData.animalTypeId || "")
    setIfChanged("gender", animalData.gender || "")
    setIfChanged("neutered", (animalData.isNeutered ?? animalData.neutered) || false)
    setIfChanged("weight", animalData.weight != null ? animalData.weight : null)
    const birthSrc = animalData.birthDate ?? animalData.dateOfBirth
    if (birthSrc) {
      const birthDateStr = new Date(birthSrc).toISOString().split("T")[0]
      setIfChanged("birthDate", birthDateStr)
      setIfChanged("age", calculateAgeFromDOB(birthDateStr) || "0")
    }
    prefilledForAnimalIdRef.current = currentId
  }, [animalData, onChange, safeFormData, t])

  const handleExamDateChange = (date) => {
    if (date) onChange("date", toDateOnly(date))
    setExamDateOpen(false)
  }

  const formatNumber = formatNumberWithThousands
  const parseNumber = parseFormattedNumber

  const handleAmountChange = (value) => {
    setCustomAmountActive(value === "other")
    onChange("amount", value === "other" ? "other" : Number(value))
    onChange("receivedAmount", value === "other" ? "other" : Number(value))
    setCustomReceivedAmountActive(value === "other")
  }

  const handleCustomAmountChange = (value) => {
    const plainValue = parseNumber(value)
    onChange("amount", plainValue)
    onChange("receivedAmount", plainValue)
  }

  const handleReceivedAmountChange = (value) => {
    setCustomReceivedAmountActive(value === "other")
    onChange("receivedAmount", value === "other" ? "other" : Number(value))
  }

  const handleCustomReceivedAmountChange = (value) => {
    onChange("receivedAmount", parseNumber(value))
  }

  return (
    <FormSection title={t("examinations.basic.title")} icon={User}>
      <FormGrid cols={2}>
        {/* Animal & Owner Info */}
        <FormFieldWrapper className="md:col-span-2">
          <FormGrid cols={2}>
            <div>
              <FormFieldHeader icon={User} label={t("examinations.basic.animal_name")} />
              <Input
                value={safeFormData.animalName || animalData?.name || ""}
                readOnly
                className={`${isEditMode ? "bg-gray-50 dark:bg-zinc-800 opacity-75 dark:text-white" : "bg-gray-100 dark:bg-zinc-800 dark:text-white"}`}
              />
            </div>
            <div>
              <FormFieldHeader icon={User} label={t("examinations.basic.owner_name")} />
              <Input
                value={safeFormData.ownerName || animalData?.ownerName || animalData?.owner?.name || ""}
                readOnly
                className={`${isEditMode ? "bg-gray-50 dark:bg-zinc-800 opacity-75 dark:text-white" : "bg-gray-100 dark:bg-zinc-800 dark:text-white"}`}
              />
            </div>
          </FormGrid>
        </FormFieldWrapper>

        {/* Examination Date */}
        <FormFieldWrapper>
          <FormFieldHeader icon={CalendarIcon} label={t("examinations.basic.date")} />
          <Popover open={examDateOpen} onOpenChange={setExamDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-between font-normal ${
                  getFieldError("basicInformation.date") && (isSubmitted || isFieldTouched("basicInformation.date"))
                    ? "border-red-500"
                    : ""
                }`}
              >
                {examDate
                  ? examDate.toLocaleDateString(i18n.language === "ar" ? "ar-EG" : "en-US")
                  : t("examinations.main.select_date")}
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={examDate} onSelect={handleExamDateChange} />
            </PopoverContent>
          </Popover>
          {errors?.basicInformation?.date?.message && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.basicInformation.date.message}</p>
          )}
        </FormFieldWrapper>

        {/* Animal Type */}
        <FormFieldWrapper>
          <FormFieldHeader icon={Tag} label={t("examinations.basic.animal_type")} />
          <Input
            value={animalData?.animalType || animalData?.animal?.animalTypeName || safeFormData.animalTypeName || ""}
            readOnly
            className={`${isEditMode ? "bg-gray-50 dark:bg-zinc-800 opacity-75 dark:text-white" : "bg-gray-100 dark:bg-zinc-800 dark:text-white"}`}
          />
          <input type="hidden" name="basicInformation.animalTypeId" value={safeFormData.animalTypeId || ""} />
        </FormFieldWrapper>

        {/* Gender */}
        <FormFieldWrapper>
          <FormFieldHeader icon={User} label={t("examinations.basic.gender")} />
          <Input
            value={safeFormData.gender || animalData?.gender || ""}
            readOnly
            className={`${isEditMode ? "bg-gray-50 dark:bg-zinc-800 opacity-75 dark:text-white" : "bg-gray-100 dark:bg-zinc-800 dark:text-white"}`}
          />
        </FormFieldWrapper>

        {/* Neutered */}
        <FormFieldWrapper>
          <FormFieldHeader icon={ShieldCheck} label={t("examinations.basic.neutered")} />
          <Input
            value={
              (safeFormData.neutered ?? animalData?.neutered ?? animalData?.isNeutered)
                ? t("common.yes")
                : t("common.no")
            }
            readOnly
            className={`${isEditMode ? "bg-gray-50 dark:bg-zinc-800 opacity-75 dark:text-white" : "bg-gray-100 dark:bg-zinc-800 dark:text-white"}`}
          />
        </FormFieldWrapper>

        {/* Weight */}
        <FormFieldWrapper>
          <FormFieldHeader icon={Weight} label={t("examinations.basic.weight")} />
          <Input
            type="text"
            inputMode="decimal"
            value={weightInput}
            {...weightReg}
            onChange={(e) =>
              handleDecimalChangeWithField(e, {
                setInput: setWeightInput,
                field: "weight",
                reg: weightReg,
                onChange,
                maxDecimals: 2,
              })
            }
            placeholder={t("examinations.basic.placeholders.weight")}
            className={
              getFieldError("basicInformation.weight") && (isSubmitted || isFieldTouched("basicInformation.weight"))
                ? "border-red-500"
                : ""
            }
          />
          {errors?.basicInformation?.weight?.message && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.basicInformation.weight.message}</p>
          )}
        </FormFieldWrapper>

        {/* BCS */}
        <FormFieldWrapper>
          <FormFieldHeader icon={Stethoscope} label={t("examinations.basic.bcs")} />
          <Input
            type="text"
            inputMode="decimal"
            value={bcsInput}
            onChange={(e) => {
              const value = e.target.value
              // Allow numbers, dots, and empty string
              if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
                setBcsInput(value)
                // Convert to number for parent formData
                const numValue = value === "" || value === "." ? null : Number.parseFloat(value)
                onChange("bcs", numValue)
              }
            }}
            placeholder={t("examinations.basic.placeholders.bcs")}
            className={
              getFieldError("basicInformation.bcs") && (isSubmitted || isFieldTouched("basicInformation.bcs"))
                ? "border-red-500"
                : ""
            }
          />
          {errors?.basicInformation?.bcs?.message && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.basicInformation.bcs.message}</p>
          )}
        </FormFieldWrapper>

        {/* Age */}
        <FormFieldWrapper>
          <FormFieldHeader icon={Cake} label={t("examinations.basic.age")} />
          <Input
            value={
              safeFormData.age ||
              (animalData?.dateOfBirth || animalData?.birthDate
                ? calculateAgeFromDOB(
                    new Date(animalData?.dateOfBirth || animalData?.birthDate).toISOString().split("T")[0],
                  ) || "0"
                : "")
            }
            readOnly
            className={`${isEditMode ? "bg-gray-50 dark:bg-zinc-800 opacity-75 dark:text-white" : "bg-gray-100 dark:bg-zinc-800 dark:text-white"}`}
          />
        </FormFieldWrapper>
      </FormGrid>

      {/* Payment Section */}
      <div className="border-t border-gray-200 dark:border-zinc-700 pt-6 mt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-950/30 rounded-xl border border-green-200 dark:border-green-800">
            <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">{t("examinations.basic.payment_details")}</h3>
        </div>

        <div className="space-y-6">
          {/* Amount */}
          <FormFieldWrapper>
            <FormFieldHeader label={t("examinations.basic.amount")} />
            <div className="flex flex-wrap gap-3 mt-2">
              {amountOptions.map((amount) => (
                <label key={amount} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="amount"
                    value={amount}
                    checked={
                      isEditMode
                        ? amount === "other"
                        : (amount !== "other" && safeFormData.amount === Number(amount) && !customAmountActive) ||
                          (amount === "other" && customAmountActive)
                    }
                    onChange={(e) => handleAmountChange(e.target.value)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <span className={`${isRTL ? "mr-2" : "ml-2"} dark:text-white`}>
                    {amount === "other" ? t("common.other") : `${formatNumber(amount)} ${CURRENCY.SHORT_NAME}`}
                  </span>
                </label>
              ))}
            </div>
            {customAmountActive && (
              <Input
                type="text"
                value={formatNumber(safeFormData.amount === "other" ? "" : safeFormData.amount)}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                placeholder={t("examinations.basic.placeholders.amount")}
                className="mt-2"
              />
            )}
            {errors?.basicInformation?.amount?.message && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.basicInformation.amount.message}</p>
            )}
          </FormFieldWrapper>

          {/* Received Amount */}
          <FormFieldWrapper>
            <FormFieldHeader label={t("examinations.basic.received_amount")} />
            <div className="flex flex-wrap gap-3 mt-2">
              {amountOptions.map((amount) => (
                <label key={amount} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="receivedAmount"
                    value={amount}
                    checked={
                      isEditMode
                        ? amount === "other"
                        : (amount !== "other" &&
                            safeFormData.receivedAmount === Number(amount) &&
                            !customReceivedAmountActive) ||
                          (amount === "other" && customReceivedAmountActive)
                    }
                    onChange={(e) => handleReceivedAmountChange(e.target.value)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <span className={`${isRTL ? "mr-2" : "ml-2"} dark:text-white`}>
                    {amount === "other" ? t("common.other") : `${formatNumber(amount)} ${CURRENCY.SHORT_NAME}`}
                  </span>
                </label>
              ))}
            </div>
            {customReceivedAmountActive && (
              <Input
                type="text"
                value={formatNumber(safeFormData.receivedAmount === "other" ? "" : safeFormData.receivedAmount)}
                onChange={(e) => handleCustomReceivedAmountChange(e.target.value)}
                placeholder={t("examinations.basic.placeholders.received_amount")}
                className="mt-2"
              />
            )}
            {errors?.basicInformation?.receivedAmount?.message && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {errors.basicInformation.receivedAmount.message}
              </p>
            )}
          </FormFieldWrapper>
        </div>
      </div>
    </FormSection>
  )
}
