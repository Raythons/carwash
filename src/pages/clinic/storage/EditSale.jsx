"use client"

import { useParams, Link, useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { ArrowRight, Calendar, User, Package, DollarSign, Loader2, Save } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getSaleById, updateSale } from "@/api/sales"
import { formatNumberWithThousands } from "@/utilities/number"
import { CURRENCY } from "@/constants/currency"
import { toast } from "react-toastify"

export default function EditSale() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { t, i18n } = useTranslation()

  const [receivedAmount, setReceivedAmount] = useState("")
  const [formData, setFormData] = useState({
    amount: 0,
    receivedAmount: 0,
  })
  const [editableItems, setEditableItems] = useState([])

  const {
    data: saleData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["sale", id],
    queryFn: () => getSaleById(id),
    enabled: !!id,
  })

  const sale = saleData?.data || saleData
  const saleItems = sale?.items || sale?.saleItems || []

  // Initialize form when sale data loads
  useEffect(() => {
    if (sale) {
      const totalAmount = Number(sale.totalAmount || sale.finalAmount || 0).toFixed(2)
      const amountPaid = Number(sale.amountPaid || 0).toFixed(2)

      setFormData({
        amount: Number.parseFloat(totalAmount),
        receivedAmount: Number.parseFloat(amountPaid),
      })

      setReceivedAmount(amountPaid.toString())

      setEditableItems(
        saleItems.map((item) => ({
          id: item.id || item.saleItemId,
          quantity: item.quantity,
          unitSellPrice: item.unitSellPrice,
          productName: item.productName,
          variantName: item.variantName,
        })),
      )
    }
  }, [sale, saleItems])

  const updateMutation = useMutation({
    mutationFn: (data) => updateSale(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["sale", id])
      queryClient.invalidateQueries(["sales"])
      toast.success(t("storage.sales.edit.success_message"))
      navigate(`/clinic/storage/sales/${id}`)
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || t("storage.sales.edit.error_message"))
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    const updateData = {
      items: editableItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      })),
      payment: {
        receivedAmount: Number.parseFloat(receivedAmount) || 0,
        isPaid: (Number.parseFloat(receivedAmount) || 0) >= formData.amount,
      },
    }

    updateMutation.mutate(updateData)
  }

  const handleQuantityChange = (itemId, newQuantity) => {
    const quantity = Number.parseInt(newQuantity) || 0
    if (quantity < 0) return

    setEditableItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, quantity } : item)))

    // Recalculate total amount logic if needed, but usually we just want to update the summary
  }

  // Recalculate total when editableItems change
  useEffect(() => {
    const newTotal = editableItems.reduce((sum, item) => {
      return sum + item.quantity * item.unitSellPrice
    }, 0)

    const formattedTotal = Number(newTotal).toFixed(2)
    setFormData((prev) => ({ ...prev, amount: Number.parseFloat(formattedTotal) }))
  }, [editableItems])

  const handlePayAll = () => {
    const totalAmountVal = Number(formData.amount).toFixed(2)
    setReceivedAmount(totalAmountVal.toString())
    setFormData((prev) => ({ ...prev, receivedAmount: Number.parseFloat(totalAmountVal) }))
  }

  const formatDate = (date) => {
    if (!date) return ""
    return new Date(date).toLocaleDateString(i18n.language === "ar" ? "ar-EG" : "en-US")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        <span className={`${i18n.language === "ar" ? "mr-2" : "ml-2"} text-lg`}>{t("common.loading")}</span>
      </div>
    )
  }

  if (isError || !sale) {
    return (
      <div
        className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex items-center justify-center"
        dir={i18n.language === "ar" ? "rtl" : "ltr"}
      >
        <Card className="max-w-md w-full p-8 text-center">
          <Package className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">{t("storage.sales.view.not_found")}</h2>
          <p className="text-gray-600 mb-6">{t("storage.sales.view.not_found_desc")}</p>
          <Button asChild variant="outline" className="mt-4 bg-transparent">
            <Link to="/clinic/storage/sales">{t("storage.sales.view.back_to_list")}</Link>
          </Button>
        </Card>
      </div>
    )
  }

  const totalAmount = formData.amount
  const amountPaid = Number.parseFloat(receivedAmount) || 0
  const amountRemaining = totalAmount - amountPaid

  const paymentStatusKey = amountPaid >= totalAmount ? "paid" : amountPaid > 0 ? "partially_paid" : "unpaid"

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              to={`/clinic/storage/sales/${id}`}
              className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
            >
              <ArrowRight className={`${i18n.language === "ar" ? "" : "rotate-180"} w-5 h-5`} />
              {t("storage.sales.edit.back_to_details")}
            </Link>
            <h1 className="text-3xl font-bold text-primary-800 dark:text-white">
              {t("storage.sales.edit.title")} ({sale.saleNumber})
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Sale Info Card */}
            <Card>
              <CardHeader className="bg-primary-50 dark:bg-primary-900/30 border-b border-primary-200 dark:border-primary-800">
                <CardTitle className="text-lg font-semibold text-primary-800 dark:text-primary-300">
                  {t("storage.sales.view.info_section")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                    <Package className="w-5 h-5 text-primary-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                        {t("storage.sales.table.invoice_number")}
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-zinc-100">{sale.saleNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                    <Calendar className="w-5 h-5 text-primary-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                        {t("storage.sales.table.date")}
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-zinc-100">
                        {formatDate(sale.saleDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                    <User className="w-5 h-5 text-primary-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                        {t("storage.sales.table.customer_name")}
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-zinc-100">
                        {sale.customerName || t("storage.sales.direct_customer")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                    <Package className="w-5 h-5 text-primary-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                        {t("storage.sales.view.quantity")}
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-zinc-100">{saleItems.length}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Form */}
            <Card>
              <CardHeader className="bg-green-50 dark:bg-green-900/30 border-b border-green-200 dark:border-green-800">
                <CardTitle className="text-lg font-semibold text-green-800 dark:text-green-300">
                  {t("storage.sales.edit.update_payment_title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Total Amount (Read-only) */}
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                        {t("storage.sales.view.total_amount")}
                      </Label>
                      <div className="relative">
                        <DollarSign
                          className={`absolute ${i18n.language === "ar" ? "right-3" : "left-3"} top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5`}
                        />
                        <Input
                          type="text"
                          value={formatNumberWithThousands(Number(totalAmount).toFixed(2))}
                          disabled
                          className={`${i18n.language === "ar" ? "pr-12" : "pl-12"} py-3 bg-gray-100 cursor-not-allowed`}
                        />
                        <span
                          className={`absolute ${i18n.language === "ar" ? "left-3" : "right-3"} top-1/2 transform -translate-y-1/2 text-gray-500 text-sm`}
                        >
                          {CURRENCY.SHORT_NAME}
                        </span>
                      </div>
                    </div>

                    {/* Received Amount */}
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                        {t("storage.sales.edit.received_amount")} <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <DollarSign
                          className={`absolute ${i18n.language === "ar" ? "right-3" : "left-3"} top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5`}
                        />
                        <Input
                          type="number"
                          step="0.01"
                          value={receivedAmount}
                          onChange={(e) => setReceivedAmount(e.target.value)}
                          className={`${i18n.language === "ar" ? "pr-12" : "pl-12"} py-3`}
                          placeholder={t("storage.sales.edit.received_placeholder")}
                          required
                        />
                        <span
                          className={`absolute ${i18n.language === "ar" ? "left-3" : "right-3"} top-1/2 transform -translate-y-1/2 text-gray-500 text-sm`}
                        >
                          {CURRENCY.SHORT_NAME}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pay All Button */}
                  <div>
                    <Button
                      type="button"
                      onClick={handlePayAll}
                      variant="outline"
                      className="w-full border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                    >
                      <DollarSign className={`${i18n.language === "ar" ? "ml-2" : "mr-2"} w-4 h-4`} />
                      {t("storage.sales.edit.pay_all")}
                    </Button>
                  </div>

                  {/* Payment Status Indicator */}
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-zinc-800 border dark:border-zinc-700">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                        {t("storage.sales.table.payment_status")}:
                      </span>
                      <Badge
                        variant={
                          paymentStatusKey === "paid"
                            ? "success"
                            : paymentStatusKey === "partially_paid"
                              ? "warning"
                              : "destructive"
                        }
                      >
                        {t(`storage.sales.payment_statuses.${paymentStatusKey}`)}
                      </Badge>
                    </div>
                    {amountRemaining !== 0 && (
                      <div className="text-sm text-gray-600 dark:text-zinc-400">
                        {t("storage.sales.view.amount_remaining")}:{" "}
                        <span className="font-semibold text-red-600">
                          {formatNumberWithThousands(Number(Math.abs(amountRemaining)).toFixed(2))}{" "}
                          {CURRENCY.SHORT_NAME}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      type="submit"
                      disabled={updateMutation.isPending}
                      className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-3"
                    >
                      {updateMutation.isPending ? (
                        <>
                          <Loader2 className={`${i18n.language === "ar" ? "ml-2" : "mr-2"} w-5 h-5 animate-spin`} />
                          {t("storage.sales.edit.saving")}
                        </>
                      ) : (
                        <>
                          <Save className={`${i18n.language === "ar" ? "ml-2" : "mr-2"} w-5 h-5`} />
                          {t("storage.sales.edit.save_changes")}
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate(`/clinic/storage/sales/${id}`)}
                      className="px-6 py-3"
                    >
                      {t("storage.sales.edit.cancel")}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Items List */}
            <Card>
              <CardHeader className="bg-primary-50 dark:bg-primary-900/30 border-b border-primary-200 dark:border-primary-800">
                <CardTitle className="text-lg font-semibold text-primary-800 dark:text-primary-300">
                  {t("storage.sales.view.items_section")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
                {editableItems.map((item) => {
                  const itemTotal = item.quantity * item.unitSellPrice
                  return (
                    <div
                      key={item.id}
                      className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg border dark:border-zinc-700"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-900 dark:text-zinc-100">{item.productName}</p>
                          <p className="text-xs text-gray-600 dark:text-zinc-400">{item.variantName}</p>
                        </div>
                      </div>

                      {/* Editable Quantity */}
                      <div className="mb-2">
                        <Label className="text-xs text-gray-600 dark:text-zinc-400 mb-1">
                          {t("storage.sales.view.quantity")}:
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                          className="h-8 text-sm"
                        />
                      </div>

                      <div className="flex justify-between text-xs text-gray-600 dark:text-zinc-400">
                        <span>{t("storage.sales.view.sell_price")}:</span>
                        <span className="font-semibold">
                          {formatNumberWithThousands(Number(item.unitSellPrice).toFixed(2))} {CURRENCY.SHORT_NAME}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-900 dark:text-zinc-100 font-semibold mt-1 pt-1 border-t dark:border-zinc-700">
                        <span>{t("storage.sales.view.total")}:</span>
                        <span className="text-green-600">
                          {formatNumberWithThousands(Number(itemTotal).toFixed(2))} {CURRENCY.SHORT_NAME}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Summary */}
          <div className="md:col-span-1">
            <Card className="sticky top-4">
              <CardHeader className="bg-green-50 dark:bg-green-900/30 border-b dark:border-green-800">
                <CardTitle className="text-lg font-semibold text-green-800 dark:text-green-300">
                  {t("storage.sales.view.summary_section")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-zinc-700">
                  <span className="text-gray-600 dark:text-zinc-400">{t("storage.sales.view.total_amount")}</span>
                  <span className="font-bold text-gray-900 dark:text-zinc-100">
                    {formatNumberWithThousands(totalAmount.toFixed(2))} {CURRENCY.SHORT_NAME}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-zinc-700 text-green-600">
                  <span className="font-medium">{t("storage.sales.view.amount_paid")}</span>
                  <span className="font-bold">
                    {formatNumberWithThousands(amountPaid.toFixed(2))} {CURRENCY.SHORT_NAME}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-zinc-700 text-red-600 font-bold">
                  <span>{t("storage.sales.view.amount_remaining")}</span>
                  <span>
                    {formatNumberWithThousands(amountRemaining.toFixed(2))} {CURRENCY.SHORT_NAME}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
