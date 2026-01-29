"use client"

import { useNavigate, useParams } from "react-router-dom"
import { Button } from "../ui/Button"
import { useRef } from "react"
import { WithLoading } from "../ui/WithLoading"
import { Skeleton } from "../ui/Skeleton"
import { useDeal } from "@/hooks/queries/useStorageQueries"
import { Package, Calendar, User, FileText, DollarSign } from "lucide-react"
import { formatNumberWithThousands } from "@/utilities/number"
import { CURRENCY } from "@/constants/currency"
import { useTranslation } from "react-i18next"

function ViewDealSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function ViewDeal() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { t, i18n } = useTranslation()
  const isRTL = i18n.language === "ar"

  const { data: deal, isLoading } = useDeal(id)

  // Ref to the area we will print as PDF
  const printRef = useRef(null)

  const formatDate = (dateString) => {
    if (!dateString) return t("common.not_specified")
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(i18n.language === "ar" ? "ar-EG" : "en-US", options)
  }

  const handleDownloadPdf = () => {
    if (!printRef.current) return
    const contentHtml = printRef.current.innerHTML
    const printWindow = window.open("", "_blank", "width=1024,height=768")
    if (!printWindow) return
    
    const direction = isRTL ? "rtl" : "ltr"
    const lang = i18n.language
    const textAlign = isRTL ? "right" : "left"

    printWindow.document.open()
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="${lang}" dir="${direction}">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>${t("storage.deals.view.print_title", { number: deal?.dealNumber || "" })}</title>
          <style>
            @page { size: A4; margin: 16mm; }
            body { font-family: system-ui, Tahoma, Arial, sans-serif; color: #111827; direction: ${direction}; text-align: ${textAlign}; }
            .header { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
            .title { font-size:20px; font-weight:700; color:#111827; }
            .muted { color:#6B7280; font-size:12px; }
            .section { margin: 16px 0; }
            table { width:100%; border-collapse: collapse; }
            thead th { background:#F9FAFB; color:#374151; font-size:12px; padding:8px; border-bottom:1px solid #E5E7EB; text-align:${textAlign}; }
            tbody td { font-size:12px; padding:8px; border-bottom:1px solid #F3F4F6; text-align:${textAlign}; }
            tfoot td { background:#F5F3FF; padding:10px; font-weight:700; font-size:14px; color:#1F2937; text-align:${textAlign}; }
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
    // Wait for content to load before printing
    printWindow.onload = () => {
      printWindow.focus()
      printWindow.print()
      printWindow.close()
    }
  }

  return (
    <WithLoading isLoading={isLoading} skeleton={<ViewDealSkeleton />}>
      {deal && (
        <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-primary-900 dark:text-zinc-100">{deal.dealNumber}</h1>
              <p className="text-gray-600 dark:text-zinc-400 mt-1">{t("storage.deals.view.subtitle")}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleDownloadPdf}
                className="text-primary-700 border-primary-300 hover:bg-primary-50 bg-transparent dark:text-zinc-300 dark:border-zinc-700 dark:hover:bg-zinc-800"
                title={t("storage.deals.view.download_pdf")}
              >
                {t("storage.deals.view.download_pdf")}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(`/clinic/storage/deals/edit/${id}`)}
                className="text-amber-600 border-amber-300 hover:bg-amber-50 dark:border-amber-900 dark:hover:bg-amber-950/30 bg-transparent"
              >
                {t("storage.deals.view.edit_deal")}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate("/clinic/storage/deals")}
                className="dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 bg-transparent"
              >
                {t("storage.deals.view.back_to_list")}
              </Button>
            </div>
          </div>

          {/* Printable Area START */}
          <div ref={printRef}>
            {/* Deal Info Card */}
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-zinc-100 border-b border-gray-200 dark:border-zinc-700 pb-2">
                {t("storage.deals.view.info_section")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-zinc-400">{t("storage.deals.view.supplier")}</p>
                    <p className="text-base font-medium text-gray-900 dark:text-zinc-100">{deal.supplierName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-zinc-400">{t("storage.deals.view.deal_date")}</p>
                    <p className="text-base font-medium text-gray-900 dark:text-zinc-100">
                      {formatDate(deal.dealDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-zinc-400">{t("storage.deals.view.item_count")}</p>
                    <p className="text-base font-medium text-gray-900 dark:text-zinc-100">{deal.items?.length || 0}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-zinc-400">{t("storage.deals.view.total_cost")}</p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">
                      {isRTL ? `${CURRENCY.SHORT_NAME} ${formatNumberWithThousands(deal.totalCost)}` : `${formatNumberWithThousands(deal.totalCost)} ${CURRENCY.SHORT_NAME}`}
                    </p>
                  </div>
                </div>

                {deal.notes && (
                  <div className="flex items-start gap-3 md:col-span-2">
                    <FileText className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-zinc-400">{t("storage.deals.view.notes")}</p>
                      <p className="text-base text-gray-900 dark:text-zinc-100 whitespace-pre-wrap">{deal.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Deal Items */}
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-2 lg:p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-zinc-100 border-b border-gray-200 dark:border-zinc-700 pb-2">
                {t("storage.deals.view.items_section")}
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-zinc-900">
                    <tr>
                      <th className={`px-4 py-3 text-sm font-semibold text-gray-700 dark:text-zinc-300 ${isRTL ? "text-right" : "text-left"}`}>#</th>
                      <th className={`px-4 py-3 text-sm font-semibold text-gray-700 dark:text-zinc-300 ${isRTL ? "text-right" : "text-left"}`}>
                        {t("storage.deals.view.table.product")}
                      </th>
                      <th className={`px-4 py-3 text-sm font-semibold text-gray-700 dark:text-zinc-300 ${isRTL ? "text-right" : "text-left"}`}>
                        {t("storage.deals.view.table.quantity")}
                      </th>
                      <th className={`px-4 py-3 text-sm font-semibold text-gray-700 dark:text-zinc-300 ${isRTL ? "text-right" : "text-left"}`}>
                        {t("storage.deals.view.table.unit_price")}
                      </th>
                      <th className={`px-4 py-3 text-sm font-semibold text-gray-700 dark:text-zinc-300 ${isRTL ? "text-right" : "text-left"}`}>
                        {t("storage.deals.view.table.total")}
                      </th>
                      <th className={`px-4 py-3 text-sm font-semibold text-gray-700 dark:text-zinc-300 ${isRTL ? "text-right" : "text-left"}`}>
                        {t("storage.deals.view.table.batch")}
                      </th>
                      <th className={`px-4 py-3 text-sm font-semibold text-gray-700 dark:text-zinc-300 ${isRTL ? "text-right" : "text-left"}`}>
                        {t("storage.deals.view.table.expiry")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
                    {deal.items?.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-zinc-100">{index + 1}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-zinc-100">
                          {item.productName}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-zinc-100">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-zinc-100">
                          {formatNumberWithThousands(item.unitPurchasePrice)} {CURRENCY.SHORT_NAME}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-green-600 dark:text-green-400">
                          {formatNumberWithThousands(item.totalPrice)} {CURRENCY.SHORT_NAME}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-zinc-400">
                          {item.batchNumber || "-"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-zinc-400">
                          {item.expiryDate ? formatDate(item.expiryDate) : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-primary-50 dark:bg-primary-900/30">
                    <tr>
                      <td
                        colSpan="4"
                        className={`px-4 py-3 text-base font-bold text-gray-900 dark:text-zinc-100 ${isRTL ? "text-right" : "text-left"}`}
                      >
                        {t("storage.deals.view.grand_total")}:
                      </td>
                      <td colSpan="3" className="px-4 py-3 text-xl font-bold text-primary-600 dark:text-primary-400">
                        {formatNumberWithThousands(deal.totalCost)} {CURRENCY.SHORT_NAME}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
          {/* Printable Area END */}
        </div>
      )}
    </WithLoading>
  )
}
