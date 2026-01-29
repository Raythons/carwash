"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import {
  useCreateExaminationFollowUp,
  useUpdateExaminationFollowUp,
} from "@/hooks/queries/useExaminationFollowUpQueries"
import { formatNumberWithThousands, handleDecimalChangeWithField } from "@/utilities/number"
import { toDateOnly } from "@/utilities/date"
import { CURRENCY } from "@/constants/currency"
import { toast } from "react-toastify"

export function AddEditExaminationFollowUp({
  isOpen,
  onClose,
  examinationId,
  followUp = null,
  isEdit = false,
  examinationData = null, // Add examination data to pre-fill payment info
}) {
  const [formData, setFormData] = useState({
    date: "",
    description: "",
    status: "",
    amount: "",
    receivedAmount: "",
    paymentStatus: "unpaid", // 'paid' or 'unpaid'
  })

  // State for date picker
  const [selectedDate, setSelectedDate] = useState(null)
  const [dateOpen, setDateOpen] = useState(false)

  // Local input states for formatted numbers
  const [amountInput, setAmountInput] = useState("")
  const [receivedAmountInput, setReceivedAmountInput] = useState("")

  const createMutation = useCreateExaminationFollowUp(() => {
    toast.success("تم إضافة المراجعة بنجاح")
    onClose()
  })
  const updateMutation = useUpdateExaminationFollowUp(() => {
    toast.success("تم تحديث المراجعة بنجاح")
    onClose()
  })

  useEffect(() => {
    if (isEdit && followUp) {
      const amount = followUp.payment?.amount || 0
      const receivedAmount = followUp.payment?.receivedAmount || 0
      // Handle .NET datetime format with high precision
      const initialDate = followUp.date
        ? (() => {
            try {
              const cleanDate = followUp.date.split("T")[0]
              const date = new Date(cleanDate)
              return isNaN(date.getTime()) ? new Date() : date
            } catch (error) {
              return new Date()
            }
          })()
        : new Date()
      setFormData({
        date: toDateOnly(initialDate),
        description: followUp.description || "",
        status: followUp.status || "",
        amount: amount,
        receivedAmount: receivedAmount,
        paymentStatus: followUp.payment?.isFullyPaid ? "paid" : "unpaid",
      })
      setSelectedDate(initialDate)
      setAmountInput(formatNumberWithThousands(amount))
      setReceivedAmountInput(formatNumberWithThousands(receivedAmount))
    } else {
      const initialDate = new Date()
      // Reset form for new follow-up - start with empty amounts
      setFormData({
        date: toDateOnly(initialDate),
        description: "",
        status: "",
        amount: 0,
        receivedAmount: 0,
        paymentStatus: "unpaid",
      })
      setSelectedDate(initialDate)
      setAmountInput("")
      setReceivedAmountInput("")
    }
  }, [isEdit, followUp, isOpen])

  // Note: Amount change handling is now done directly in the onChange handler using handleDecimalChangeWithField

  const handleSubmit = async (e) => {
    e.preventDefault()

    const submitData = {
      examinationId: Number.parseInt(examinationId),
      date: formData.date,
      description: formData.description,
      status: formData.status,
      // Only include payment fields if payment status is 'paid'
      amount:
        formData.paymentStatus === "paid"
          ? typeof formData.amount === "number"
            ? formData.amount
            : Number.parseFloat(formData.amount) || 0
          : 0,
      receivedAmount:
        formData.paymentStatus === "paid"
          ? typeof formData.receivedAmount === "number"
            ? formData.receivedAmount
            : Number.parseFloat(formData.receivedAmount) || 0
          : 0,
    }

    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: followUp.id, data: submitData })
      } else {
        await createMutation.mutateAsync(submitData)
      }
    } catch (error) {
      // Global API interceptor already shows toast error, so we don't need to show it here
      console.error("Submit error:", error)
    }
  }

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value }

      // Reset payment fields when switching to unpaid
      if (field === "paymentStatus" && value === "unpaid") {
        newData.amount = 0
        newData.receivedAmount = 0
        setAmountInput("")
        setReceivedAmountInput("")
      }

      return newData
    })
  }

  // Handle date change
  const handleDateChange = (date) => {
    if (date) {
      setSelectedDate(date)
      setFormData((prev) => ({ ...prev, date: toDateOnly(date) }))
    }
    setDateOpen(false)
  }

  // Note: Received amount change handling is now done directly in the onChange handler using handleDecimalChangeWithField

  const isLoading = createMutation.isPending || updateMutation.isPending
  const amount = typeof formData.amount === "number" ? formData.amount : Number.parseFloat(formData.amount) || 0
  const receivedAmount =
    typeof formData.receivedAmount === "number"
      ? formData.receivedAmount
      : Number.parseFloat(formData.receivedAmount) || 0
  const remainingAmount = amount - receivedAmount

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[85vh] overflow-y-auto dark:bg-zinc-900 dark:border-zinc-800" dir="rtl">
        <DialogHeader>
          <DialogTitle className="dark:text-white">{isEdit ? "تعديل المراجعة" : "إضافة مراجعة جديدة"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date */}
          <div className="space-y-2">
            <Label className="dark:text-white">
              تاريخ المراجعة <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Button
                variant="outline"
                className="w-full justify-between font-normal bg-transparent"
                type="button"
                onClick={() => setDateOpen((prev) => !prev)}
              >
                {selectedDate ? selectedDate.toLocaleDateString("en-SA") : "اختر تاريخ المراجعة"}
                <CalendarIcon className="h-4 w-4" />
              </Button>
              {dateOpen && (
                <div className="absolute top-full mt-2 w-auto p-0 z-50 bg-white dark:bg-zinc-900 border dark:border-zinc-700 rounded-md shadow-lg">
                  <Calendar mode="single" selected={selectedDate} onSelect={handleDateChange} initialFocus />
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className="dark:text-white">
              حالة الحيوان
            </Label>
            <Input
              id="status"
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value)}
              placeholder="مثال: تحسن، تدهور، مستقر"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="dark:text-white">
              وصف المراجعة
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="اكتب تفاصيل المراجعة..."
              rows={3}
            />
          </div>

          {/* Payment Status Radio Group */}
          <div className="space-y-3">
            <Label className="dark:text-white">حالة الدفع</Label>
            <RadioGroup className="flex gap-6">
              <RadioGroupItem
                value="unpaid"
                name="examPaymentStatus"
                checked={formData.paymentStatus === "unpaid"}
                onCheckedChange={(checked) => checked && handleChange("paymentStatus", "unpaid")}
              >
                غير مدفوع
              </RadioGroupItem>
              <RadioGroupItem
                value="paid"
                name="examPaymentStatus"
                checked={formData.paymentStatus === "paid"}
                onCheckedChange={(checked) => checked && handleChange("paymentStatus", "paid")}
              >
                مدفوع
              </RadioGroupItem>
            </RadioGroup>
          </div>

          {/* Payment Fields - Only show when paid is selected */}
          {formData.paymentStatus === "paid" && (
            <div className="space-y-4 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border dark:border-zinc-700">
              <h4 className="font-medium text-gray-800 dark:text-white">تفاصيل الدفع</h4>

              {/* Payment Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount" className="dark:text-white">
                  تكلفة المراجعة ({CURRENCY.SHORT_NAME}) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="amount"
                  type="text"
                  inputMode="decimal"
                  value={amountInput}
                  onChange={(e) =>
                    handleDecimalChangeWithField(e, {
                      setInput: setAmountInput,
                      field: "amount",
                      onChange: (field, value) => {
                        setFormData((prev) => ({
                          ...prev,
                          [field]: value,
                          // Auto-fill received amount with same value, but user can still edit it
                          receivedAmount: value,
                        }))
                        setReceivedAmountInput(formatNumberWithThousands(value || 0))
                      },
                      maxDecimals: 0,
                    })
                  }
                  placeholder="أدخل التكلفة"
                  required
                />
              </div>

              {/* Received Amount */}
              <div className="space-y-2">
                <Label htmlFor="receivedAmount" className="dark:text-white">
                  المبلغ المدفوع ({CURRENCY.SHORT_NAME})
                </Label>
                <Input
                  id="receivedAmount"
                  type="text"
                  inputMode="decimal"
                  value={receivedAmountInput}
                  onChange={(e) =>
                    handleDecimalChangeWithField(e, {
                      setInput: setReceivedAmountInput,
                      field: "receivedAmount",
                      onChange: (field, value) => {
                        setFormData((prev) => ({
                          ...prev,
                          [field]: value,
                        }))
                      },
                      maxDecimals: 0,
                    })
                  }
                  placeholder="أدخل المبلغ المدفوع"
                />
                <p className="text-xs text-gray-500 dark:text-zinc-400">
                  سيتم ملء هذا الحقل تلقائياً عند إدخال التكلفة، ولكن يمكنك تعديله
                </p>
              </div>

              {/* Payment Summary */}
              {formData.amount && (
                <div className="p-3 bg-white dark:bg-zinc-900 rounded-lg space-y-2 border dark:border-zinc-700">
                  <div className="flex justify-between text-sm dark:text-white">
                    <span>التكلفة الإجمالية:</span>
                    <span className="font-medium">
                      {formatNumberWithThousands(amount)} {CURRENCY.SHORT_NAME}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm dark:text-white">
                    <span>المبلغ المستلم:</span>
                    <span className="font-medium">
                      {formatNumberWithThousands(receivedAmount)} {CURRENCY.SHORT_NAME}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="dark:text-white">المبلغ المتبقي:</span>
                    <span
                      className={
                        remainingAmount > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
                      }
                    >
                      {formatNumberWithThousands(remainingAmount)} {CURRENCY.SHORT_NAME}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "جاري الحفظ..." : isEdit ? "تحديث" : "إضافة"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              إلغاء
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
