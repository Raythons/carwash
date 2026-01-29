"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Button } from "../ui/Button"
import { WithLoading } from "../ui/WithLoading"
import { Skeleton } from "../ui/Skeleton"
import { useProduct } from "@/hooks/queries/useStorageQueries"
import { Package, Tag, AlertCircle, Plus, Edit, Trash2, QrCode, Download } from "lucide-react"
import ConfirmDialog from "../common/ConfirmDialog"
import { toast } from "react-toastify"
import { CURRENCY } from "@/constants/currency"
import { apiMedia } from "@/api"

// Component to display QR Code using apiMedia
function QRCodeDisplay({ variantId, sku, qrCode }) {
  const { t } = useTranslation()
  const [qrImageUrl, setQrImageUrl] = useState(null)

  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        const response = await apiMedia.get(`/products/variants/${variantId}/qrcode`)
        const imageUrl = URL.createObjectURL(response.data)
        setQrImageUrl(imageUrl)
      } catch (error) {
        console.error("Failed to load QR code:", error)
      }
    }

    fetchQRCode()

    // Cleanup
    return () => {
      if (qrImageUrl) {
        URL.revokeObjectURL(qrImageUrl)
      }
    }
  }, [variantId])

  const handleDownload = async () => {
    try {
      const response = await apiMedia.get(`/products/variants/${variantId}/qrcode`)
      const url = URL.createObjectURL(response.data)
      const link = document.createElement("a")
      link.href = url
      link.download = `qrcode-${sku}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      toast.error(t("storage.products.view.qr_code_error"))
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center bg-white dark:bg-zinc-900 p-1 md:p-4 rounded-lg border-2 border-gray-200 dark:border-zinc-700">
        {qrImageUrl ? (
          <img src={qrImageUrl || "/placeholder.svg"} alt="QR Code" className="w-48 h-48" />
        ) : (
          <div className="w-48 h-48 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-zinc-400 bg-gray-50 dark:bg-zinc-800 p-2 rounded">
        <QrCode className="w-3 h-3 flex-shrink-0" />
        <span className="font-mono break-all">{qrCode}</span>
      </div>
      <Button onClick={handleDownload} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
        <Download className="w-4 h-4 ml-2" />
        {t("storage.products.view.qr_code_download")}
      </Button>
    </div>
  )
}

function ViewProductSkeleton() {
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

export function ViewProduct() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState(null)

  const { data: product, isLoading } = useProduct(id)

  const handleDeleteVariant = async () => {
    // TODO: Implement variant deletion
    toast.success(t("storage.products.view.delete_success"))
    setConfirmOpen(false)
    setSelectedVariant(null)
  }

  const { t } = useTranslation()

  return (
    <WithLoading isLoading={isLoading} skeleton={<ViewProductSkeleton />}>
      {product && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-primary-900 dark:text-zinc-100">{product.name}</h1>
              <p className="text-gray-600 dark:text-zinc-400 mt-1">{product.categoryName}</p>
            </div>
            <div className="flex sm:flex-row flex-col gap-2">
              <Button
                variant="outline"
                onClick={() => navigate(`/clinic/storage/products/edit/${id}`)}
                className="text-amber-600 border-amber-300 hover:bg-amber-50 dark:text-amber-400 dark:border-amber-700 dark:hover:bg-amber-900/30 bg-transparent"
              >
                {t("storage.products.view.edit_product")}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate("/clinic/storage/products")}
                className="dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 bg-transparent"
              >
                {t("storage.products.view.back_to_list")}
              </Button>
            </div>
          </div>

          {/* Product Info Card */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-zinc-100 border-b border-gray-200 dark:border-zinc-700 pb-2">
              {t("storage.products.view.info_section")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Tag className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-zinc-400">{t("storage.products.view.category")}</p>
                  <p className="text-base font-medium text-gray-900 dark:text-zinc-100">{product.categoryName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-zinc-400">{t("storage.products.view.base_unit")}</p>
                  <p className="text-base font-medium text-gray-900 dark:text-zinc-100">{product.baseUnit}</p>
                </div>
              </div>

              {product.description && (
                <div className="flex items-start gap-3 md:col-span-2">
                  <Package className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-zinc-400">{t("storage.products.view.description")}</p>
                    <p className="text-base text-gray-900 dark:text-zinc-100 whitespace-pre-wrap">
                      {product.description}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 md:col-span-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.isActive ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
                    }`}
                  >
                    {product.isActive ? t("storage.products.view.active") : t("storage.products.view.inactive")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Variants */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-2 lg:p-6 space-y-4">
            <div className="sm:flex-row flex-col flex items-center justify-between border-b border-gray-200 dark:border-zinc-700 pb-2">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-zinc-100">
                {t("storage.products.view.variants_section", { count: product.variants?.length || 0 })}
              </h2>
              <Button
                onClick={() => navigate(`/clinic/storage/products/${id}/variants/add`)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>{t("storage.products.view.add_variant")}</span>
              </Button>
            </div>

            {product.variants && product.variants.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {product.variants.map((variant) => (
                  <div
                    key={variant.id}
                    className="border border-gray-200 dark:border-zinc-700 rounded-lg p-4 space-y-3 dark:bg-zinc-900"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-zinc-100 break-words">
                          {variant.variantName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-zinc-400 break-all">SKU: {variant.sku}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => navigate(`/clinic/storage/products/${id}/variants/edit/${variant.id}`)}
                          className="text-amber-600 border-amber-300 hover:bg-amber-50 dark:text-amber-400 dark:border-amber-700 dark:hover:bg-amber-900/30 bg-transparent"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setSelectedVariant(variant)
                            setConfirmOpen(true)
                          }}
                          className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900/30 bg-transparent"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-zinc-400">{t("storage.products.view.stock")}</p>
                        <p
                          className={`font-medium ${
                            (variant.totalStock || 0) < (variant.minStockLevel || 0)
                              ? "text-red-600 dark:text-red-400"
                              : "text-gray-900 dark:text-zinc-100"
                          }`}
                        >
                          {variant.totalStock || 0}
                          {(variant.totalStock || 0) < (variant.minStockLevel || 0) && (
                            <AlertCircle className="w-3 h-3 inline mr-1" />
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-zinc-400">{t("storage.products.view.min_stock")}</p>
                        <p className="font-medium text-gray-900 dark:text-zinc-100">{variant.minStockLevel || 0}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-zinc-400">{t("storage.products.view.sell_price")}</p>
                        <p className="font-medium text-green-600 dark:text-zinc-100">
                          {variant.currentSellPrice} {CURRENCY.SHORT_NAME}
                        </p>
                      </div>
                    </div>

                    {variant.qrCode && (
                      <QRCodeDisplay variantId={variant.id} sku={variant.sku} qrCode={variant.qrCode} />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-zinc-400">
                <Package className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-zinc-600" />
                <p>{t("storage.products.view.no_variants")}</p>
                <Button
                  onClick={() => navigate(`/clinic/storage/products/${id}/variants/add`)}
                  className="mt-4 bg-primary-500 hover:bg-primary-600 text-white"
                >
                  {t("storage.products.view.add_new_variant")}
                </Button>
              </div>
            )}
          </div>

          {/* Delete Confirmation Dialog */}
          <ConfirmDialog
            open={confirmOpen}
            onOpenChange={setConfirmOpen}
            title={t("storage.products.view.delete_confirm_title")}
            description={
              selectedVariant
                ? t("storage.products.view.delete_confirm_desc", { name: selectedVariant.variantName })
                : ""
            }
            confirmText={t("common.delete")}
            cancelText={t("common.cancel")}
            onConfirm={handleDeleteVariant}
            variant="destructive"
          />
        </div>
      )}
    </WithLoading>
  )
}
