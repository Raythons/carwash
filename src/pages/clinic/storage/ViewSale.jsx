"use client"

import { useParams, Link, useNavigate } from "react-router-dom"
import { useRef } from "react"
import { useQuery } from "@tanstack/react-query"
import { ArrowRight, Calendar, User, Package, DollarSign, Loader2, Edit } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getSaleById } from "@/api/sales"
import { useTranslation } from "react-i18next"
import { formatNumberWithThousands } from "@/utilities/number"
import { CURRENCY } from "@/constants/currency"

export default function ViewSale() {
  const { id } = useParams()
  const navigate = useNavigate()
  const printRef = useRef(null)

  const {
    data: saleData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["sale", id],
    queryFn: () => getSaleById(id),
    enabled: !!id,
  })

  const sale = saleData?.data || saleData
  const saleItems = sale?.items || sale?.saleItems || []

  const { t, i18n } = useTranslation()

  const formatDate = (date) => {
    if (!date) return ""
    return new Date(date).toLocaleDateString(i18n.language === "ar" ? "ar-EG" : "en-US")
  }

  const handleDownloadPdf = () => {
    if (!printRef.current) return
    const contentHtml = printRef.current.innerHTML
    const printWindow = window.open("", "_blank", "width=1024,height=768")
    if (!printWindow) return
    printWindow.document.open()
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="${i18n.language}" dir="${i18n.language === "ar" ? "rtl" : "ltr"}">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>${t("storage.sales.view.print_title")} ${sale?.saleNumber || ""}</title>
          <style>
            @page { size: A4; margin: 16mm; }
            body { font-family: system-ui, Tahoma, Arial, sans-serif; color: #111827; }
            .header { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
            .title { font-size:20px; font-weight:700; color:#111827; }
            .muted { color:#6B7280; font-size:12px; }
            .section { margin: 16px 0; }
            table { width:100%; border-collapse: collapse; }
            thead th { background:#F9FAFB; color:#374151; font-size:12px; padding:8px; border-bottom:1px solid #E5E7EB; text-align:right; }
            tbody td { font-size:12px; padding:8px; border-bottom:1px solid #F3F4F6; }
            tfoot td { background:#F5F3FF; padding:10px; font-weight:700; font-size:14px; color:#1F2937; }
            .badge { display:inline-block; padding:2px 8px; background:#EEF2FF; color:#1E40AF; border-radius:6px; font-size:12px; }
            .row { display:flex; gap:12px; margin:8px 0; }
            .box { background:#F9FAFB; padding:10px 12px; border-radius:8px; flex:1; }
            .label { font-size:12px; color:#6B7280; margin-bottom:4px; }
            .value { font-size:14px; font-weight:600; color:#111827; }
          </style>
        </head>
        <body>
          ${contentHtml}
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.onload = () => {
      printWindow.focus()
      printWindow.print()
      printWindow.close()
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        <span className="mr-2 text-lg">{t("common.loading")}</span>
      </div>
    )
  }

  if (isError || !sale) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm p-10 text-center">
            <div className="text-red-500 mb-4">
              <Package className="w-16 h-16 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              {t("storage.sales.view.not_found")}
            </h2>
            <p className="text-gray-600 dark:text-zinc-400 mb-6">{t("storage.sales.view.not_found_desc")}</p>
            <Link
              to="/clinic/storage/sales"
              className="px-4 py-2 border rounded-md text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-700"
            >
              <ArrowRight className={`${i18n.language === "ar" ? "" : "rotate-180"} w-4 h-4 ml-2 inline`} />
              {t("storage.sales.view.back_to_list")}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const totalAmount = sale.totalAmount || sale.finalAmount || 0
  const amountPaid = sale.amountPaid || 0
  const amountRemaining = totalAmount - amountPaid
  const paymentStatus = sale.paymentStatus || "غير مدفوع"

  const paymentStatusKey =
    paymentStatus === "مدفوع" ? "paid" : paymentStatus === "مدفوع جزئياً" ? "partially_paid" : "unpaid"

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/clinic/storage/sales"
              className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
            >
              <ArrowRight className={`${i18n.language === "ar" ? "" : "rotate-180"} w-5 h-5`} />
              {t("storage.sales.view.back_to_list")}
            </Link>
            <h1 className="text-3xl font-bold text-primary-800 dark:text-white">{t("storage.sales.view.title")}</h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleDownloadPdf}
              className="text-primary-700 border-primary-300 hover:bg-primary-50 bg-transparent"
              title={t("storage.sales.view.download_pdf")}
            >
              {t("storage.sales.view.download_pdf")}
            </Button>
            <Button asChild className="bg-amber-500 hover:bg-amber-600 text-white">
              <Link to={`/clinic/storage/sales/edit/${sale.id}`}>
                <Edit className="w-4 h-4 ml-2" />
                {t("storage.sales.view.edit_sale")}
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6" ref={printRef}>
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
                    <DollarSign className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                        {t("storage.sales.table.payment_status")}
                      </p>
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
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Items Card */}
            <Card>
              <CardHeader className="bg-primary-50 dark:bg-primary-900/30 border-b border-primary-200 dark:border-primary-800">
                <CardTitle className="text-lg font-semibold text-primary-800 dark:text-primary-300">
                  {t("storage.sales.view.items_section")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-zinc-900">
                      <tr>
                        <th
                          className={`px-4 py-3 ${i18n.language === "ar" ? "text-right" : "text-left"} text-sm font-semibold text-gray-700 dark:text-zinc-300`}
                        >
                          {t("storage.sales.view.product")}
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-zinc-300">
                          {t("storage.sales.view.quantity")}
                        </th>
                        <th
                          className={`px-4 py-3 ${i18n.language === "ar" ? "text-right" : "text-left"} text-sm font-semibold text-gray-700 dark:text-zinc-300`}
                        >
                          {t("storage.sales.view.sell_price")}
                        </th>
                        <th
                          className={`px-4 py-3 ${i18n.language === "ar" ? "text-right" : "text-left"} text-sm font-semibold text-gray-700 dark:text-zinc-300`}
                        >
                          {t("storage.sales.view.purchase_price")}
                        </th>
                        <th
                          className={`px-4 py-3 ${i18n.language === "ar" ? "text-right" : "text-left"} text-sm font-semibold text-gray-700 dark:text-zinc-300`}
                        >
                          {t("storage.sales.view.profit_per_unit")}
                        </th>
                        <th
                          className={`px-4 py-3 ${i18n.language === "ar" ? "text-right" : "text-left"} text-sm font-semibold text-gray-700 dark:text-zinc-300`}
                        >
                          {t("storage.sales.view.total")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-zinc-700">
                      {saleItems.map((item, index) => {
                        const profitPerUnit =
                          item.profitPerUnit || item.unitSellPrice - (item.unitPurchasePriceSnapshot || 0)

                        return (
                          <tr key={index} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                            <td className={`px-4 py-3 ${i18n.language === "ar" ? "text-right" : "text-left"}`}>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-zinc-100">{item.productName}</p>
                                <p className="text-sm text-gray-600 dark:text-zinc-400">{item.variantName}</p>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <Badge variant="secondary">{item.quantity}</Badge>
                            </td>
                            <td
                              className={`px-4 py-3 ${i18n.language === "ar" ? "text-right" : "text-left"} text-gray-900 dark:text-zinc-100`}
                            >
                              {formatNumberWithThousands(Number(item.unitSellPrice).toFixed(2))} {CURRENCY.SHORT_NAME}
                            </td>
                            <td
                              className={`px-4 py-3 ${i18n.language === "ar" ? "text-right" : "text-left"} text-gray-600 dark:text-zinc-400`}
                            >
                              {formatNumberWithThousands(
                                Number(item.unitPurchasePrice || item.unitPurchasePriceSnapshot || 0).toFixed(2),
                              )}{" "}
                              {CURRENCY.SHORT_NAME}
                            </td>
                            <td
                              className={`px-4 py-3 ${i18n.language === "ar" ? "text-right" : "text-left"} font-semibold text-blue-600 dark:text-blue-500`}
                            >
                              {formatNumberWithThousands(Number(profitPerUnit).toFixed(2))} {CURRENCY.SHORT_NAME}
                            </td>
                            <td
                              className={`px-4 py-3 ${i18n.language === "ar" ? "text-right" : "text-left"} font-semibold text-green-600 dark:text-green-500`}
                            >
                              {formatNumberWithThousands(Number(item.totalPrice).toFixed(2))} {CURRENCY.SHORT_NAME}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Payment Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader className="bg-green-50 dark:bg-green-900/30 border-b border-green-200 dark:border-green-800">
                <CardTitle className="text-lg font-semibold text-green-800 dark:text-green-300">
                  {t("storage.sales.view.summary_section")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b dark:border-zinc-700">
                  <span className="text-gray-700 dark:text-zinc-300">{t("storage.sales.view.total_amount")}:</span>
                  <span className="text-xl font-bold text-gray-900 dark:text-zinc-100">
                    {formatNumberWithThousands(totalAmount)} {CURRENCY.SHORT_NAME}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b dark:border-zinc-700">
                  <span className="text-gray-700 dark:text-zinc-300">{t("storage.sales.view.amount_paid")}:</span>
                  <span className="text-xl font-bold text-green-600 dark:text-green-500">
                    {formatNumberWithThousands(amountPaid)} {CURRENCY.SHORT_NAME}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b dark:border-zinc-700">
                  <span className="text-gray-700 dark:text-zinc-300">{t("storage.sales.view.amount_remaining")}:</span>
                  <span
                    className={`text-xl font-bold ${amountRemaining > 0 ? "text-red-600 dark:text-red-500" : "text-green-600 dark:text-green-500"}`}
                  >
                    {formatNumberWithThousands(amountRemaining)} {CURRENCY.SHORT_NAME}
                  </span>
                </div>
                <div className="pt-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-zinc-400">
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
                      className="text-sm"
                    >
                      {t(`storage.sales.payment_statuses.${paymentStatusKey}`)}
                    </Badge>
                  </div>
                  {amountRemaining > 0 && (
                    <div className="mt-4">
                      <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white">
                        <Link to={`/clinic/storage/sales/edit/${sale.id}`}>
                          <DollarSign className="w-4 h-4 ml-2" />
                          {t("storage.sales.view.update_status")}
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
