"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/Select"
import { WithLoading } from "../ui/WithLoading"
import { Skeleton } from "../ui/Skeleton"
import { useProduct, useCreateProduct, useUpdateProduct, useCategories } from "@/hooks/queries/useStorageQueries"
import { toast } from "react-toastify"
import { useTranslation } from "react-i18next"

function AddEditProductSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
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

export function AddEditProduct() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    description: "",
    baseUnit: "",
    isActive: true,
  })
  const [variants, setVariants] = useState([{ variantName: "", currentSellPrice: "", minStockLevel: "" }])
  const [errors, setErrors] = useState({})

  const { data: productData, isLoading: isLoadingProduct } = useProduct(id)
  const { data: categoriesData, isLoading: isLoadingCategories } = useCategories()
  const categories = categoriesData?.items ?? []
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct()
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct()

  const isSaving = isCreating || isUpdating

  useEffect(() => {
    if (isEdit && productData) {
      setFormData({
        name: productData.name || "",
        categoryId: productData.categoryId || "",
        description: productData.description || "",
        baseUnit: productData.baseUnit || "",
        isActive: productData.isActive ?? true,
      })

      // Load existing variants
      if (productData.variants && productData.variants.length > 0) {
        setVariants(
          productData.variants.map((v) => ({
            id: v.id,
            variantName: v.variantName || "",
            currentSellPrice: v.currentSellPrice || "",
            minStockLevel: v.minStockLevel || "",
          })),
        )
      }
    }
  }, [isEdit, productData])

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

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants]

    // Validate price input - only allow numbers with max 2 decimal places
    if (field === "currentSellPrice") {
      // Remove any non-numeric characters except decimal point
      const numericValue = value.replace(/[^\d.]/g, "")

      // Limit to reasonable number (max 999999999.99)
      const numValue = Number.parseFloat(numericValue)
      if (numValue > 999999999.99) {
        return // Don't update if too large
      }

      newVariants[index][field] = numericValue
    } else if (field === "minStockLevel") {
      // Only allow integers for stock level
      const numericValue = value.replace(/[^\d]/g, "")

      // Limit to reasonable number (max 999999)
      const numValue = Number.parseInt(numericValue)
      if (numValue > 999999) {
        return // Don't update if too large
      }

      newVariants[index][field] = numericValue
    } else {
      newVariants[index][field] = value
    }

    setVariants(newVariants)
  }

  const addVariant = () => {
    setVariants([...variants, { variantName: "", currentSellPrice: "", minStockLevel: "" }])
  }

  const removeVariant = (index) => {
    const newVariants = variants.filter((_, i) => i !== index)
    if (newVariants.length === 0) {
      setVariants([{ variantName: "", currentSellPrice: "", minStockLevel: "" }])
    } else {
      setVariants(newVariants)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = t("storage.products.form.validation.name_required")
    }
    if (!formData.categoryId) {
      newErrors.categoryId = t("storage.products.form.validation.category_required")
    }
    if (!formData.baseUnit.trim()) {
      newErrors.baseUnit = t("storage.products.form.validation.base_unit_required")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    // Filter out empty variants
    const validVariants = variants.filter(
      (v) => v.variantName && v.variantName.trim() && v.currentSellPrice && Number(v.currentSellPrice) > 0,
    )

    const submitData = {
      name: formData.name,
      categoryId: Number(formData.categoryId),
      description: formData.description,
      baseUnit: formData.baseUnit,
      isActive: formData.isActive,
    }

    // Add variants for create mode
    if (!isEdit) {
      submitData.variants =
        validVariants.length > 0
          ? validVariants.map((v) => ({
              variantName: v.variantName.trim(),
              currentSellPrice: Number(v.currentSellPrice),
              minStockLevel: v.minStockLevel && v.minStockLevel !== "" ? Number(v.minStockLevel) : 0,
            }))
          : null
    } else {
      // Add variants for edit mode (only existing variants with IDs)
      submitData.variants = variants
        .filter((v) => v.id) // Only include variants that already exist
        .map((v) => ({
          id: v.id,
          variantName: v.variantName.trim(),
          currentSellPrice: Number(v.currentSellPrice),
          minStockLevel: v.minStockLevel && v.minStockLevel !== "" ? Number(v.minStockLevel) : 0,
        }))
    }

    if (isEdit) {
      updateProduct(
        { id: Number(id), data: { ...submitData, id: Number(id) } },
        {
          onSuccess: () => {
            toast.success(t("storage.products.form.success.update"))
            navigate("/clinic/storage/products")
          },
          onError: (error) => {
            console.error("Update product error:", error)
          },
        },
      )
    } else {
      createProduct(submitData, {
        onSuccess: () => {
          toast.success(t("storage.products.form.success.create"))
          navigate("/clinic/storage/products")
        },
        onError: (error) => {
          console.error("Create product error:", error)
        },
      })
    }
  }

  return (
    <WithLoading isLoading={(isEdit && isLoadingProduct) || isLoadingCategories} skeleton={<AddEditProductSkeleton />}>
      <div className="space-y-6" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary-900 dark:text-zinc-100">
            {isEdit ? t("storage.products.form.edit_title") : t("storage.products.form.add_title")}
          </h1>
          <Button variant="outline" onClick={() => navigate("/clinic/storage/products")}>
            {t("storage.products.form.back_to_list")}
          </Button>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-zinc-100 border-b border-gray-200 dark:border-zinc-700 pb-2">
                {t("storage.products.form.product_info")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                    {t("storage.products.form.name_label")} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder={t("storage.products.form.name_placeholder")}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                    {t("storage.products.form.category_label")} <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.categoryId?.toString()}
                    onValueChange={(value) => handleInputChange("categoryId", value)}
                  >
                    <SelectTrigger className={`dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100 ${errors.categoryId ? "border-red-500" : ""}`}>
                      <SelectValue placeholder={t("storage.products.form.category_placeholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                    {t("storage.products.form.base_unit_label")} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.baseUnit}
                    onChange={(e) => handleInputChange("baseUnit", e.target.value)}
                    placeholder={t("storage.products.form.base_unit_placeholder")}
                    className={errors.baseUnit ? "border-red-500" : ""}
                  />
                  {errors.baseUnit && <p className="text-sm text-red-500">{errors.baseUnit}</p>}
                </div>

                <div className="space-y-4 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                      {isEdit
                        ? t("storage.products.form.variants_label")
                        : t("storage.products.form.variants_optional")}
                    </label>
                    {/* Only show the Add Variant button in create mode */}
                    {!isEdit && (
                      <Button
                        type="button"
                        onClick={addVariant}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm"
                      >
                        {t("storage.products.form.add_variant_button")}
                      </Button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {variants.map((variant, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start p-3 bg-gray-50 dark:bg-zinc-700/40 rounded-lg"
                      >
                        <div className="md:col-span-4">
                          <Input
                            value={variant.variantName}
                            onChange={(e) => handleVariantChange(index, "variantName", e.target.value)}
                            placeholder={t("storage.products.form.variant_name_placeholder")}
                            className="w-full"
                          />
                        </div>
                        <div className="md:col-span-3">
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            max="999999999.99"
                            value={variant.currentSellPrice}
                            onChange={(e) => handleVariantChange(index, "currentSellPrice", e.target.value)}
                            placeholder={t("storage.products.form.sell_price_placeholder")}
                            className="w-full"
                            onKeyPress={(e) => {
                              // Prevent 'e', '+', '-' characters
                              if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") {
                                e.preventDefault()
                              }
                            }}
                          />
                        </div>
                        <div className="md:col-span-3">
                          <Input
                            type="number"
                            min="0"
                            max="999999"
                            value={variant.minStockLevel}
                            onChange={(e) => handleVariantChange(index, "minStockLevel", e.target.value)}
                            placeholder={t("storage.products.form.min_stock_placeholder")}
                            className="w-full"
                            onKeyPress={(e) => {
                              // Prevent 'e', '+', '-', '.' characters
                              if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-" || e.key === ".") {
                                e.preventDefault()
                              }
                            }}
                          />
                        </div>
                        <div className="md:col-span-2">
                          {variants.length > 1 && (
                            <Button
                              type="button"
                              onClick={() => removeVariant(index)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 w-full"
                            >
                              {t("storage.products.form.remove_variant")}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                    {t("storage.products.form.description_label")}
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder={t("storage.products.form.description_placeholder")}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-zinc-900 dark:text-zinc-100"
                    rows={4}
                  />
                </div>

                {isEdit && (
                  <div className="space-y-2 md:col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => handleInputChange("isActive", e.target.checked)}
                        className="w-4 h-4 text-primary-600 border-gray-300 dark:border-zinc-700 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                        {t("storage.products.form.active_label")}
                      </span>
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-zinc-700">
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3"
              >
                {isSaving
                  ? t("storage.products.form.saving")
                  : isEdit
                    ? t("storage.products.form.update_button")
                    : t("storage.products.form.save_button")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </WithLoading>
  )
}
