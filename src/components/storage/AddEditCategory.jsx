"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { WithLoading } from "../ui/WithLoading"
import { Skeleton } from "../ui/Skeleton"
import { useCategory, useCreateCategory, useUpdateCategory } from "@/hooks/queries/useStorageQueries"
import { toast } from "react-toastify"
import { useTranslation } from "react-i18next"

function AddEditCategorySkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {[1, 2].map((i) => (
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

export function AddEditCategory() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })
  const [errors, setErrors] = useState({})

  const { data: categoryData, isLoading: isLoadingCategory } = useCategory(id)
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory()
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory()

  const isSaving = isCreating || isUpdating

  useEffect(() => {
    if (isEdit && categoryData) {
      setFormData({
        name: categoryData.name || "",
        description: categoryData.description || "",
      })
    }
  }, [isEdit, categoryData])

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

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = t("storage.categories.form.validation.name_required")
    } else if (formData.name.length > 100) {
      newErrors.name = t("storage.categories.form.validation.name_max_length")
    }

    if (formData.description && formData.description.length > 300) {
      newErrors.description = t("storage.categories.form.validation.description_max_length")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    if (isEdit) {
      updateCategory(
        { id: Number(id), data: { ...formData, id: Number(id) } },
        {
          onSuccess: () => {
            toast.success(t("storage.categories.form.success.update"))
            navigate("/clinic/storage/categories")
          },
          onError: (error) => {
            console.error("Update category error:", error)
          },
        },
      )
    } else {
      createCategory(formData, {
        onSuccess: () => {
          toast.success(t("storage.categories.form.success.create"))
          navigate("/clinic/storage/categories")
        },
        onError: (error) => {
          console.error("Create category error:", error)
        },
      })
    }
  }

  return (
    <WithLoading isLoading={isEdit && isLoadingCategory} skeleton={<AddEditCategorySkeleton />}>
      <div className="space-y-6" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary-900 dark:text-zinc-100">
            {isEdit ? t("storage.categories.form.edit_title") : t("storage.categories.form.add_title")}
          </h1>
          <Button variant="outline" onClick={() => navigate("/clinic/storage/categories")}>
            {t("storage.categories.form.back_to_list")}
          </Button>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-zinc-100 border-b border-gray-200 dark:border-zinc-700 pb-2">
                {t("storage.categories.form.category_info")}
              </h2>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                    {t("storage.categories.form.name_label")} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder={t("storage.categories.form.name_placeholder")}
                    className={errors.name ? "border-red-500" : ""}
                    maxLength={100}
                  />
                  <div className="flex justify-between items-center">
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    <p className={`text-xs ${formData.name.length > 90 ? "text-orange-500" : "text-gray-500"} mr-auto`}>
                      {formData.name.length}/100
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                    {t("storage.categories.form.description_label")}
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder={t("storage.categories.form.description_placeholder")}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-700 ${
                      errors.description ? "border-red-500" : "border-gray-300 dark:border-zinc-700"
                    }`}
                    rows={4}
                    maxLength={300}
                  />
                  <div className="flex justify-between items-center">
                    {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                    <p
                      className={`text-xs ${formData.description.length > 270 ? "text-orange-500" : "text-gray-500"} mr-auto`}
                    >
                      {formData.description.length}/300
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-zinc-700">
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3"
              >
                {isSaving
                  ? t("storage.categories.form.saving")
                  : isEdit
                    ? t("storage.categories.form.update_button")
                    : t("storage.categories.form.save_button")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </WithLoading>
  )
}
