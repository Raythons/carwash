"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/Select"
import { Calendar } from "../ui/Calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover"
import { WithLoading } from "../ui/WithLoading"
import { Skeleton } from "../ui/Skeleton"
import { useDeal, useCreateDeal, useUpdateDeal, useSuppliers, useCategories } from "@/hooks/queries/useStorageQueries"
import storageApi from "@/api/storage"
import { toast } from "react-toastify"
import { Plus, Trash2, Package, CalendarIcon } from "lucide-react"
import { CURRENCY } from "@/constants/currency"
import { toDateOnly } from "@/utilities/date"
import { useStorage } from "@/contexts/StorageContext"
import { useTranslation } from "react-i18next"

function AddEditDealSkeleton() {
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

export function AddEditDeal() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id

  const [formData, setFormData] = useState({
    supplierId: "",
    dealDate: new Date().toISOString().split("T")[0],
    notes: "",
    items: [
      {
        categoryId: "", // For filtering products
        productId: "", // For filtering variants
        productVariantId: "",
        quantity: 1,
        unitPurchasePrice: 0,
        batchNumber: "",
        expiryDate: new Date().toISOString().split("T")[0],
        expiryDateOpen: false,
        notes: "",
      },
    ],
  })
  const [errors, setErrors] = useState({})
  const [dealDateOpen, setDealDateOpen] = useState(false)

  const [itemProducts, setItemProducts] = useState({}) // { [index]: { data, isLoading } }
  const [itemVariants, setItemVariants] = useState({}) // { [index]: { data, isLoading } }

  const { data: dealData, isLoading: isLoadingDeal } = useDeal(id)
  const { data: suppliersData, isLoading: isLoadingSuppliers } = useSuppliers({ page: 1, pageSize: 100 })
  const { data: categoriesData, isLoading: isLoadingCategories } = useCategories()
  const { mutate: createDeal, isPending: isCreating } = useCreateDeal()
  const { mutate: updateDeal, isPending: isUpdating } = useUpdateDeal()
  const { selectedStorageId, selectStorage } = useStorage()

  const isSaving = isCreating || isUpdating
  const [isInitializing, setIsInitializing] = useState(false)

  // Normalize deal shape once here (must be before useMemo that uses it)
  const deal = dealData?.data || dealData

  // Normalize suppliers and categories to arrays regardless of backend shape
  const suppliersRaw =
    suppliersData?.items ??
    suppliersData?.Items ??
    suppliersData?.data?.items ??
    suppliersData?.data?.Items ??
    suppliersData ??
    []
  const suppliers = Array.isArray(suppliersRaw) ? suppliersRaw : []
  const categoriesRaw =
    categoriesData?.items ??
    categoriesData?.Items ??
    categoriesData?.data?.items ??
    categoriesData?.data?.Items ??
    categoriesData ??
    []
  const categories = Array.isArray(categoriesRaw) ? categoriesRaw : []

  // Determine if item option lookups are still loading for any row
  const isAnyItemLoading =
    Object.values(itemProducts).some((v) => v?.isLoading) || Object.values(itemVariants).some((v) => v?.isLoading)

  // Ready to render when all data required for selects is available
  const isFormReady =
    !isInitializing && !isLoadingDeal && !isLoadingSuppliers && !isLoadingCategories && !isAnyItemLoading

  useEffect(() => {
    const initializeEdit = async () => {
      if (!isEdit || !deal) return
      setIsInitializing(true)

      // 1) Ensure the storage context matches the deal's storage so that suppliers/products/variants load from the correct storage
      if (deal?.storageId && selectedStorageId !== deal.storageId) {
        selectStorage(deal.storageId)
        // Wait a tick so interceptor updates localStorage
        await new Promise((r) => setTimeout(r, 0))
      }

      // 2) Populate form fields
      setFormData({
        supplierId: deal?.supplierId?.toString() || "",
        dealDate: deal?.dealDate || new Date().toISOString().split("T")[0],
        notes: deal?.notes || "",
        items:
          deal?.items?.map((item) => ({
            categoryId: item.categoryId?.toString() || "",
            productId: item.productId?.toString() || "",
            productVariantId: item.productVariantId?.toString() || "",
            quantity: item.quantity,
            unitPurchasePrice: item.unitPurchasePrice,
            batchNumber: item.batchNumber || "",
            expiryDate: item.expiryDate || "",
            expiryDateOpen: false,
            notes: item.notes || "",
          })) || [],
      })

      // 3) Preload products and variants for each item to ensure selects have options
      const preloadTasks = []
      deal?.items?.forEach((item, index) => {
        if (item.categoryId) {
          preloadTasks.push(
            fetchProductsForCategory(index, item.categoryId.toString(), item.productId, item.productName),
          )
        }
        if (item.productId) {
          preloadTasks.push(
            fetchVariantsForProduct(
              index,
              item.productId.toString(),
              item.productVariantId,
              item.variantName,
              item.sku || item.SKU || undefined,
            ),
          )
        }
      })

      try {
        await Promise.all(preloadTasks)
      } finally {
        setIsInitializing(false)
      }
    }

    initializeEdit()
  }, [isEdit, deal, selectedStorageId, selectStorage])

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

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items]
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    }
    setFormData((prev) => ({
      ...prev,
      items: newItems,
    }))
  }

  // Fetch products when category is selected
  const fetchProductsForCategory = async (index, categoryId, expectedProductId = null, expectedProductName = null) => {
    if (!categoryId) return

    try {
      const result = await storageApi.getProducts({ categoryId, page: 1, pageSize: 150 })
      const rawLevel1 = result?.data ?? result ?? []
      const products =
        // Common shapes: { data: { items: [] } } | { data: { Items: [] } } | { items: [] } | { Items: [] } | []
        Array.isArray(rawLevel1)
          ? rawLevel1
          : (rawLevel1?.items ?? rawLevel1?.Items ?? rawLevel1?.data?.items ?? rawLevel1?.data?.Items ?? [])
      let finalProducts = Array.isArray(products) ? products : []
      // Ensure the currently selected product appears in options
      if (expectedProductId && !finalProducts.some((p) => p.id === Number(expectedProductId))) {
        finalProducts = [
          ...finalProducts,
          { id: Number(expectedProductId), name: expectedProductName || `#${expectedProductId}` },
        ]
      }
      setItemProducts((prev) => ({
        ...prev,
        [index]: { data: finalProducts, isLoading: false },
      }))
      return finalProducts
    } catch (error) {
      console.error("Error fetching products:", error)
      toast.error(t("storage.deals.form.messages.load_products_failed"))
      setItemProducts((prev) => ({
        ...prev,
        [index]: { data: prev[index]?.data || [], isLoading: false },
      }))
      return []
    }
  }

  // Fetch variants when product is selected
  const fetchVariantsForProduct = async (
    index,
    productId,
    expectedVariantId = null,
    expectedVariantName = null,
    expectedSku = null,
  ) => {
    if (!productId) return

    try {
      const result = await storageApi.getVariantsByProductId(productId)
      const rawLevel1 = result?.data ?? result ?? []
      const variants = Array.isArray(rawLevel1)
        ? rawLevel1
        : (rawLevel1?.items ?? rawLevel1?.Items ?? rawLevel1?.data?.items ?? rawLevel1?.data?.Items ?? [])
      let finalVariants = Array.isArray(variants) ? variants : []
      // Ensure the currently selected variant appears in options
      if (expectedVariantId && !finalVariants.some((v) => v.id === Number(expectedVariantId))) {
        finalVariants = [
          ...finalVariants,
          {
            id: Number(expectedVariantId),
            variantName: expectedVariantName || `Variant #${expectedVariantId}`,
            sku: expectedSku || "",
          },
        ]
      }
      setItemVariants((prev) => ({
        ...prev,
        [index]: { data: finalVariants, isLoading: false },
      }))
      return finalVariants
    } catch (error) {
      console.error("Error fetching variants:", error)
      toast.error(t("storage.deals.form.messages.load_variants_failed"))
      setItemVariants((prev) => ({
        ...prev,
        [index]: { data: [], isLoading: false },
      }))
      return []
    }
  }

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          categoryId: "",
          productId: "",
          productVariantId: "",
          quantity: 1,
          unitPurchasePrice: 0,
          batchNumber: "",
          expiryDate: new Date().toISOString().split("T")[0],
          expiryDateOpen: false,
          notes: "",
        },
      ],
    }))
  }

  const removeItem = (index) => {
    if (formData.items.length === 1) {
      toast.error(t("storage.deals.form.messages.min_item_required"))
      return
    }
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => {
      return sum + item.quantity * item.unitPurchasePrice
    }, 0)
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.supplierId) {
      newErrors.supplierId = t("storage.deals.form.validation.supplier_required")
    }
    if (!formData.dealDate) {
      newErrors.dealDate = t("storage.deals.form.validation.deal_date_required")
    }
    if (formData.items.length === 0) {
      newErrors.items = t("storage.deals.form.validation.items_required")
    }

    formData.items.forEach((item, index) => {
      if (!item.categoryId) {
        newErrors[`item_${index}_category`] = t("storage.deals.form.validation.category_required")
      }
      if (!item.productId) {
        newErrors[`item_${index}_product`] = t("storage.deals.form.validation.product_required")
      }
      if (!item.productVariantId) {
        newErrors[`item_${index}_variant`] = t("storage.deals.form.validation.variant_required")
      }
      if (!item.quantity || item.quantity <= 0) {
        newErrors[`item_${index}_quantity`] = t("storage.deals.form.validation.quantity_required")
      }
      if (!item.unitPurchasePrice || item.unitPurchasePrice <= 0) {
        newErrors[`item_${index}_price`] = t("storage.deals.form.validation.price_required")
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const submitData = {
      supplierId: Number(formData.supplierId),
      // storageId will be sent via X-Storage-Id header by API interceptor
      dealDate: formData.dealDate,
      notes: formData.notes,
      items: formData.items.map((item) => ({
        productVariantId: Number(item.productVariantId),
        quantity: Number(item.quantity),
        unitPurchasePrice: Number(item.unitPurchasePrice),
        batchNumber: item.batchNumber || null,
        expiryDate: item.expiryDate || null,
        notes: item.notes || null,
      })),
    }

    if (isEdit) {
      updateDeal(
        { id: Number(id), data: submitData },
        {
          onSuccess: () => {
            toast.success(t("storage.deals.form.success.update"))
            navigate("/clinic/storage/deals")
          },
          onError: (error) => {
            console.error("Update deal error:", error)
          },
        },
      )
    } else {
      createDeal(submitData, {
        onSuccess: () => {
          toast.success(t("storage.deals.form.success.create"))
          navigate("/clinic/storage/deals")
        },
        onError: (error) => {
          console.error("Create deal error:", error)
        },
      })
    }
  }

  return (
    <WithLoading isLoading={!isFormReady} skeleton={<AddEditDealSkeleton />}>
      <div className="space-y-6" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary-900 dark:text-zinc-100">
            {isEdit ? t("storage.deals.form.edit_title") : t("storage.deals.form.add_title")}
          </h1>
          <Button variant="outline" onClick={() => navigate("/clinic/storage/deals")}>
            {t("storage.deals.form.back_to_list")}
          </Button>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Deal Info Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-zinc-100 border-b border-gray-200 dark:border-zinc-700 pb-2">
                {t("storage.deals.form.deal_info")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                    {t("storage.deals.form.supplier_label")} <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.supplierId?.toString()}
                    onValueChange={(value) => handleInputChange("supplierId", value)}
                    disabled={!isFormReady}
                  >
                    <SelectTrigger className={`dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100 ${errors.supplierId ? "border-red-500" : ""}`}>
                      <SelectValue placeholder={t("storage.deals.form.supplier_placeholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id.toString()}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.supplierId && <p className="text-sm text-red-500">{errors.supplierId}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                    {t("storage.deals.form.deal_date_label")} <span className="text-red-500">*</span>
                  </label>
                  <Popover open={dealDateOpen} onOpenChange={setDealDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-between font-normal bg-transparent dark:border-zinc-700 dark:text-zinc-300 ${errors.dealDate ? "border-red-500" : ""}`}
                      >
                        {formData.dealDate
                          ? new Date(formData.dealDate).toLocaleDateString("en-SA")
                          : t("storage.deals.form.deal_date_placeholder")}
                        <CalendarIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.dealDate ? new Date(formData.dealDate) : undefined}
                        onSelect={(date) => {
                          if (date) handleInputChange("dealDate", toDateOnly(date))
                          setDealDateOpen(false)
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.dealDate && <p className="text-sm text-red-500">{errors.dealDate}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">{t("storage.deals.form.notes_label")}</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder={t("storage.deals.form.notes_placeholder")}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Deal Items Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-zinc-700 pb-2">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-zinc-100">{t("storage.deals.form.items_section")}</h2>
                <Button
                  type="button"
                  onClick={addItem}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t("storage.deals.form.add_item_button")}</span>
                </Button>
              </div>

              {errors.items && <p className="text-sm text-red-500">{errors.items}</p>}

              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <div key={index} className="border border-gray-200 dark:border-zinc-700 rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        <h3 className="font-medium text-gray-900 dark:text-zinc-100">
                          {t("storage.deals.form.item_title")} {index + 1}
                        </h3>
                      </div>
                      {formData.items.length > 1 && !isEdit && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(index)}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Category Selection */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                          {t("storage.deals.form.category_label")} <span className="text-red-500">*</span>
                        </label>
                        <Select
                          value={item.categoryId?.toString()}
                          onValueChange={(value) => {
                            // Update all fields at once to avoid state conflicts
                            const newItems = [...formData.items]
                            newItems[index] = {
                              ...newItems[index],
                              categoryId: value,
                              productId: "",
                              productVariantId: "",
                            }
                            setFormData((prev) => ({ ...prev, items: newItems }))
                            // Fetch products for this category
                            fetchProductsForCategory(index, value)
                          }}
                          disabled={!isFormReady}
                        >
                          <SelectTrigger className={`dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100 ${errors[`item_${index}_category`] ? "border-red-500" : ""}`}>
                            <SelectValue placeholder={t("storage.deals.form.category_placeholder")}>
                              {item.categoryId
                                ? (() => {
                                    const selectedCategory = categories.find(
                                      (c) => c.id?.toString() === item.categoryId?.toString(),
                                    )
                                    if (selectedCategory) {
                                      return selectedCategory.name
                                    }
                                    // If category not in list (from deal item), show the category name from deal
                                    if (isEdit && deal?.items?.[index]?.categoryName) {
                                      return deal.items[index].categoryName
                                    }
                                    return null
                                  })()
                                : null}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {Array.isArray(categories) && categories.length > 0 ? (
                              categories.map((category) => (
                                <SelectItem key={category.id} value={category.id.toString()}>
                                  {category.name}
                                </SelectItem>
                              ))
                            ) : (
                              <div className="p-2 text-center text-gray-500">
                                {t("storage.deals.form.no_categories")}
                              </div>
                            )}
                          </SelectContent>
                        </Select>
                        {errors[`item_${index}_category`] && (
                          <p className="text-sm text-red-500">{errors[`item_${index}_category`]}</p>
                        )}
                      </div>

                      {/* Product Selection (filtered by category) */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                          {t("storage.deals.form.product_label")} <span className="text-red-500">*</span>
                        </label>
                        <Select
                          value={item.productId?.toString()}
                          onValueChange={(value) => {
                            // Update product and reset variant at once
                            const newItems = [...formData.items]
                            newItems[index] = {
                              ...newItems[index],
                              productId: value,
                              productVariantId: "",
                            }
                            setFormData((prev) => ({ ...prev, items: newItems }))
                            // Fetch variants for this product
                            fetchVariantsForProduct(index, value)
                          }}
                          disabled={!isFormReady || !item.categoryId}
                        >
                          <SelectTrigger className={`dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100 ${errors[`item_${index}_product`] ? "border-red-500" : ""}`}>
                            <SelectValue
                              placeholder={
                                item.categoryId
                                  ? t("storage.deals.form.product_placeholder")
                                  : t("storage.deals.form.category_first")
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.isArray(itemProducts[index]?.data) && itemProducts[index].data.length > 0 ? (
                              itemProducts[index].data.map((product) => (
                                <SelectItem key={product.id} value={product.id.toString()}>
                                  {product.name}
                                </SelectItem>
                              ))
                            ) : item.categoryId ? (
                              <div className="p-2 text-center text-gray-500">{t("storage.deals.form.no_products")}</div>
                            ) : null}
                          </SelectContent>
                        </Select>
                        {errors[`item_${index}_product`] && (
                          <p className="text-sm text-red-500">{errors[`item_${index}_product`]}</p>
                        )}
                      </div>

                      {/* Variant Selection (filtered by product) */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                          {t("storage.deals.form.variant_label")} <span className="text-red-500">*</span>
                        </label>
                        <Select
                          value={item.productVariantId?.toString()}
                          onValueChange={(value) => handleItemChange(index, "productVariantId", value)}
                          disabled={!isFormReady || !item.productId}
                        >
                          <SelectTrigger className={`dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100 ${errors[`item_${index}_variant`] ? "border-red-500" : ""}`}>
                            <SelectValue
                              placeholder={
                                item.productId
                                  ? t("storage.deals.form.variant_placeholder")
                                  : t("storage.deals.form.product_first")
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.isArray(itemVariants[index]?.data) && itemVariants[index].data.length > 0 ? (
                              itemVariants[index].data.map((variant) => (
                                <SelectItem key={variant.id} value={variant.id.toString()}>
                                  {variant.variantName} ({variant.sku})
                                </SelectItem>
                              ))
                            ) : item.productId ? (
                              <div className="p-2 text-center text-gray-500">{t("storage.deals.form.no_variants")}</div>
                            ) : null}
                          </SelectContent>
                        </Select>
                        {errors[`item_${index}_variant`] && (
                          <p className="text-sm text-red-500">{errors[`item_${index}_variant`]}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                          {t("storage.deals.form.quantity_label")} <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                          className={errors[`item_${index}_quantity`] ? "border-red-500" : ""}
                        />
                        {errors[`item_${index}_quantity`] && (
                          <p className="text-sm text-red-500">{errors[`item_${index}_quantity`]}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                          {t("storage.deals.form.unit_price_label")} ({CURRENCY.SHORT_NAME}){" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPurchasePrice}
                          onChange={(e) => handleItemChange(index, "unitPurchasePrice", e.target.value)}
                          className={errors[`item_${index}_price`] ? "border-red-500" : ""}
                          placeholder="0.00"
                        />
                        {errors[`item_${index}_price`] && (
                          <p className="text-sm text-red-500">{errors[`item_${index}_price`]}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                          {t("storage.deals.form.batch_number_label")}
                        </label>
                        <Input
                          value={item.batchNumber}
                          onChange={(e) => handleItemChange(index, "batchNumber", e.target.value)}
                          placeholder={t("storage.deals.form.batch_number_placeholder")}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                          {t("storage.deals.form.expiry_date_label")}
                        </label>
                        <Popover
                          open={item.expiryDateOpen}
                          onOpenChange={(open) => {
                            const newItems = [...formData.items]
                            newItems[index] = { ...newItems[index], expiryDateOpen: open }
                            setFormData((prev) => ({ ...prev, items: newItems }))
                          }}
                        >
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-between font-normal bg-transparent dark:border-zinc-700 dark:text-zinc-300">
                              {item.expiryDate
                                ? new Date(item.expiryDate).toLocaleDateString("en-SA")
                                : t("storage.deals.form.expiry_date_placeholder")}
                              <CalendarIcon className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={item.expiryDate ? new Date(item.expiryDate) : undefined}
                              onSelect={(date) => {
                                if (date) {
                                  setFormData((prev) => {
                                    const newItems = [...prev.items]
                                    newItems[index] = { 
                                      ...newItems[index], 
                                      expiryDate: toDateOnly(date),
                                      expiryDateOpen: false 
                                    }
                                    return { ...prev, items: newItems }
                                  })
                                }
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                          {t("storage.deals.form.item_total_label")}
                        </label>
                        <Input
                          value={(item.quantity * item.unitPurchasePrice).toFixed(2)}
                          disabled
                          className="bg-gray-50 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-400"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Section */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900 dark:text-zinc-100">{t("storage.deals.form.grand_total_label")}</span>
                <span className="text-2xl font-bold text-primary-600">
                  {calculateTotal().toFixed(2)} {CURRENCY.SHORT_NAME}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-zinc-700">
              <Button type="button" variant="outline" onClick={() => navigate("/clinic/storage/deals")} className="dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 bg-transparent">
                {t("storage.deals.form.cancel_button")}
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3"
              >
                {isSaving
                  ? t("storage.deals.form.saving")
                  : isEdit
                    ? t("storage.deals.form.update_button")
                    : t("storage.deals.form.save_button")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </WithLoading>
  )
}
