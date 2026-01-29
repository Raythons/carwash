"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { WithLoading } from "../ui/WithLoading"
import { Skeleton } from "../ui/Skeleton"
import { useProduct } from "@/hooks/queries/useStorageQueries"
import { toast } from "react-toastify"
import productsApi from "@/api/products"
import { useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

function AddEditVariantSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  )
}

// Helper function to generate random SKU
const generateRandomSKU = () => {
  const randomNumber = Math.floor(100000 + Math.random() * 900000) // Generates 6-digit number
  return `SKU-${randomNumber}`
}

export function AddEditProductVariant() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { productId, variantId } = useParams()
  const isEdit = !!variantId
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState({
    productId: productId,
    variantName: "",
    sku: "",
    currentSellPrice: 0,
    minStockLevel: 0,
  })
  const [errors, setErrors] = useState({})
  const [isSaving, setIsSaving] = useState(false)

  const { data: product, isLoading: isLoadingProduct } = useProduct(productId)

  useEffect(() => {
    if (!isEdit) {
      // Generate random SKU only in add mode
      const randomSKU = generateRandomSKU()
      setFormData((prev) => ({
        ...prev,
        sku: randomSKU,
      }))
    }
  }, [isEdit])

  useEffect(() => {
    if (isEdit && product?.variants) {
      const variant = product.variants.find((v) => v.id === Number(variantId))
      if (variant) {
        setFormData({
          productId: productId,
          variantName: variant.variantName || "",
          sku: variant.sku || "",
          currentSellPrice: variant.currentSellPrice || 0,
          minStockLevel: variant.minStockLevel || 0,
        })
      }
    }
  }, [isEdit, product, variantId, productId])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  // Function to regenerate SKU
  const regenerateSKU = () => {
    if (!isEdit) {
      const newSKU = generateRandomSKU()
      setFormData((prev) => ({
        ...prev,
        sku: newSKU,
      }))
      toast.success(t("products.variant.sku_regenerated"))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.variantName.trim()) {
      newErrors.variantName = t("products.variant.name_required")
    }
    if (!formData.sku.trim()) {
      newErrors.sku = t("products.variant.sku_required")
    }
    if (!formData.currentSellPrice || formData.currentSellPrice <= 0) {
      newErrors.currentSellPrice = t("products.variant.price_positive")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSaving(true)

    try {
      const submitData = {
        ...(isEdit && { id: Number(variantId) }),
        productId: Number(productId),
        variantName: formData.variantName,
        sku: formData.sku,
        currentSellPrice: Number(formData.currentSellPrice),
        minStockLevel: Number(formData.minStockLevel),
      }

      if (isEdit) {
        await productsApi.updateVariant(Number(variantId), submitData)
        toast.success(t("products.variant.update_success"))
      } else {
        await productsApi.createVariant(submitData)
        toast.success(t("products.variant.create_success"))
      }

      // Invalidate product query to refresh data
      queryClient.invalidateQueries(["products", "detail"])
      navigate(`/clinic/storage/products/${productId}`)
    } catch (error) {
      console.error("Variant save error:", error)
      toast.error(error.response?.data?.message || t("common.error"))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <WithLoading isLoading={isLoadingProduct} skeleton={<AddEditVariantSkeleton />}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary-900 dark:text-zinc-100">
              {isEdit ? t("products.view.edit_variant") : t("products.view.add_new_variant")}
            </h1>
            {product && (
              <p className="text-gray-600 dark:text-zinc-400 mt-1">
                {t("products.variant.product_label")}: {product.name}
              </p>
            )}
          </div>
          <Button variant="outline" onClick={() => navigate(`/clinic/storage/products/${productId}`)}>
            {t("products.view.back_to_list")}
          </Button>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-zinc-100 border-b border-gray-200 dark:border-zinc-700 pb-2">
                {t("products.form.product_info")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                    {t("products.variant.variant_name")} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.variantName}
                    onChange={(e) => handleInputChange("variantName", e.target.value)}
                    placeholder={t("products.form.variant_name_placeholder")}
                    className={errors.variantName ? "border-red-500" : ""}
                  />
                  {errors.variantName && <p className="text-sm text-red-500">{errors.variantName}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                      {t("products.variant.sku")} <span className="text-red-500">*</span>
                    </label>
                    {!isEdit && (
                      <Button
                        type="button"
                        onClick={regenerateSKU}
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1"
                      >
                        {t("products.variant.regenerate")}
                      </Button>
                    )}
                  </div>
                  <Input
                    value={formData.sku}
                    onChange={(e) => handleInputChange("sku", e.target.value)}
                    placeholder="مثال: SKU-123456"
                    className={errors.sku ? "border-red-500" : ""}
                    disabled={isEdit}
                  />
                  {errors.sku && <p className="text-sm text-red-500">{errors.sku}</p>}
                  {isEdit ? (
                    <p className="text-xs text-gray-500 dark:text-zinc-400">{t("products.qr_code_error")}</p>
                  ) : (
                    <p className="text-xs text-gray-500 dark:text-zinc-400">
                      {t("products.variant.sku_placeholder_desc")}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                    {t("products.variant.sell_price")} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.currentSellPrice}
                    onChange={(e) => handleInputChange("currentSellPrice", e.target.value)}
                    placeholder="0.00"
                    className={errors.currentSellPrice ? "border-red-500" : ""}
                  />
                  {errors.currentSellPrice && <p className="text-sm text-red-500">{errors.currentSellPrice}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                    {t("products.variant.min_stock")}
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.minStockLevel}
                    onChange={(e) => handleInputChange("minStockLevel", e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>

              {!isEdit && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <strong>ملاحظة:</strong> سيتم إنشاء رمز QR تلقائياً لهذا الخيار بعد الحفظ
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-zinc-700">
              <Button type="button" variant="outline" onClick={() => navigate(`/clinic/storage/products/${productId}`)}>
                {t("products.variant.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3"
              >
                {isSaving ? t("products.variant.saving") : isEdit ? t("products.variant.update") : t("products.variant.save")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </WithLoading>
  )
}
