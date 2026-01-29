"use client"

import { useTranslation } from "react-i18next"
import { Input } from "../../ui/Input"
import { DollarSign } from "lucide-react"
import CURRENCY from "@/constants/currency"

export function PaymentSection({ formData, onChange, register, errors, getFieldError, isFieldTouched, isSubmitted }) {
  const { t } = useTranslation()
  // Ensure formData exists with default values
  const safeFormData = formData || {
    amount: "",
    customAmount: "",
    receivedAmount: "",
    customReceivedAmount: "",
    paymentReceivedDate: "",
    paymentTypeId: 1,
  }

  // Format number with thousands separator
  const formatNumber = (value) => {
    if (!value) return ""
    const num = value.toString().replace(/[^\d]/g, "")
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  // Parse formatted number back to plain number
  const parseNumber = (value) => {
    if (!value) return ""
    return value.toString().replace(/\./g, "")
  }

  // Handle amount selection
  const handleAmountChange = (value) => {
    onChange("amount", value)
    // Auto-select the same value for received amount
    onChange("receivedAmount", value)
    if (value !== "other") {
      onChange("customAmount", "")
      onChange("customReceivedAmount", "")
    }
  }

  // Handle received amount selection
  const handleReceivedAmountChange = (value) => {
    onChange("receivedAmount", value)
    if (value !== "other") {
      onChange("customReceivedAmount", "")
    }
  }

  // Handle custom amount input
  const handleCustomAmountChange = (value) => {
    const plainValue = parseNumber(value)
    onChange("customAmount", plainValue)
    // Auto-update received amount custom value
    onChange("customReceivedAmount", plainValue)
  }

  // Handle custom received amount input
  const handleCustomReceivedAmountChange = (value) => {
    const plainValue = parseNumber(value)
    onChange("customReceivedAmount", plainValue)
  }

  const amountOptions = [
    { value: "20", label: `20 ${CURRENCY.SHORT_NAME}` },
    { value: "25", label: `25 ${CURRENCY.SHORT_NAME}` },
    { value: "30", label: `30 ${CURRENCY.SHORT_NAME}` },
    { value: "other", label: t("examinations.payment.other") },
  ]

  const paymentMethods = [
    { id: 1, label: t("examinations.payment.methods.cash") },
    { id: 2, label: t("examinations.payment.methods.card") },
    { id: 3, label: t("examinations.payment.methods.transfer") },
  ]

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-gray-200 dark:border-zinc-700 shadow-sm dark:shadow-purple-500/10">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
        <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400 ml-2" />
        <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-3 py-1 rounded-md text-sm font-medium ml-2">
          {t("examinations.payment.title")}
        </span>
      </h3>

      <div className="space-y-8">
        {/* Amount Section */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700 dark:text-white">
            {t("examinations.payment.required_amount")} <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-4">
            {amountOptions.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center space-x-2 space-x-reverse cursor-pointer p-3 rounded-md hover:bg-green-50 dark:hover:bg-green-900/20 border border-gray-200 dark:border-zinc-700 transition-colors"
              >
                <input
                  type="radio"
                  name="amount"
                  value={opt.value}
                  checked={safeFormData.amount === opt.value}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className={`h-4 w-4 rounded-full border text-green-600 focus:ring-2 focus:ring-green-500 ${
                    getFieldError("payment.amount") && (isSubmitted || isFieldTouched("payment.amount"))
                      ? "border-red-500"
                      : "border-green-300 dark:border-green-600"
                  }`}
                />
                <span className="text-sm font-medium leading-none dark:text-white">{opt.label}</span>
              </label>
            ))}
          </div>
          <div className="min-h-[20px]">
            {getFieldError("payment.amount") && (isSubmitted || isFieldTouched("payment.amount")) && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <span className="text-red-500">⚠</span>
                {getFieldError("payment.amount")}
              </p>
            )}
          </div>
          {safeFormData.amount === "other" && (
            <div className="mt-2">
              <Input
                type="text"
                value={formatNumber(safeFormData.customAmount)}
                {...register("payment.customAmount")}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                placeholder={t("examinations.payment.placeholders.custom_amount", { currency: CURRENCY.SHORT_NAME })}
                className="focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          )}
        </div>

        {/* Received Amount Section */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700 dark:text-white">
            {t("examinations.payment.received_amount_label")} <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-4">
            {amountOptions.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center space-x-2 space-x-reverse cursor-pointer p-3 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-gray-200 dark:border-zinc-700 transition-colors"
              >
                <input
                  type="radio"
                  name="receivedAmount"
                  value={opt.value}
                  checked={safeFormData.receivedAmount === opt.value}
                  onChange={(e) => handleReceivedAmountChange(e.target.value)}
                  className={`h-4 w-4 rounded-full border text-blue-600 focus:ring-2 focus:ring-blue-500 ${
                    getFieldError("payment.receivedAmount") && (isSubmitted || isFieldTouched("payment.receivedAmount"))
                      ? "border-red-500"
                      : "border-blue-300 dark:border-blue-600"
                  }`}
                />
                <span className="text-sm font-medium leading-none dark:text-white">{opt.label}</span>
              </label>
            ))}
          </div>
          <div className="min-h-[20px]">
            {getFieldError("payment.receivedAmount") && (isSubmitted || isFieldTouched("payment.receivedAmount")) && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <span className="text-red-500">⚠</span>
                {getFieldError("payment.receivedAmount")}
              </p>
            )}
          </div>
          {safeFormData.receivedAmount === "other" && (
            <div className="mt-2">
              <Input
                type="text"
                value={formatNumber(safeFormData.customReceivedAmount)}
                {...register("payment.customReceivedAmount")}
                onChange={(e) => handleCustomReceivedAmountChange(e.target.value)}
                placeholder={t("examinations.payment.placeholders.custom_received", { currency: CURRENCY.SHORT_NAME })}
                className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
        </div>

        {/* Payment Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-white">
            {t("examinations.payment.date_label")}
          </label>
          <Input
            type="date"
            value={safeFormData.paymentReceivedDate || ""}
            {...register("payment.paymentReceivedDate")}
            onChange={(e) => onChange("paymentReceivedDate", e.target.value)}
            className="focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
          />
          <div className="min-h-[20px]"></div>
        </div>

        {/* Payment Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-white">
            {t("examinations.payment.method_label")}
          </label>
          <div className="flex gap-4">
            {paymentMethods.map((paymentType) => (
              <label
                key={paymentType.id}
                className="flex items-center space-x-2 space-x-reverse cursor-pointer p-2 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-800 border border-gray-200 dark:border-zinc-700 transition-colors"
              >
                <input
                  type="radio"
                  name="paymentTypeId"
                  value={paymentType.id}
                  checked={safeFormData.paymentTypeId === paymentType.id}
                  onChange={(e) => onChange("paymentTypeId", Number(e.target.value))}
                  className="h-4 w-4 rounded-full border border-gray-300 dark:border-zinc-600 text-gray-600 focus:ring-2 focus:ring-gray-500"
                />
                <span className="text-sm font-medium leading-none dark:text-white">{paymentType.label}</span>
              </label>
            ))}
          </div>
          <div className="min-h-[20px]"></div>
        </div>
      </div>
    </div>
  )
}
