"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { WithLoading } from "../ui/WithLoading"
import { Skeleton } from "../ui/Skeleton"
import { useSupplier, useCreateSupplier, useUpdateSupplier } from "@/hooks/queries/useStorageQueries"
import { toast } from "react-toastify"
import { useTranslation } from "react-i18next"

function AddEditSupplierSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
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

export function AddEditSupplier() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id

  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    phoneNumber: "",
    email: "",
    address: "",
    notes: "",
    isActive: true,
  })
  const [errors, setErrors] = useState({})

  const { data: supplierData, isLoading: isLoadingSupplier } = useSupplier(id)
  const { mutate: createSupplier, isPending: isCreating } = useCreateSupplier()
  const { mutate: updateSupplier, isPending: isUpdating } = useUpdateSupplier()

  const isSaving = isCreating || isUpdating

  useEffect(() => {
    if (isEdit && supplierData) {
      setFormData({
        name: supplierData.name || "",
        contactPerson: supplierData.contactPerson || "",
        phoneNumber: supplierData.phoneNumber || "",
        email: supplierData.email || "",
        address: supplierData.address || "",
        notes: supplierData.notes || "",
        isActive: supplierData.isActive ?? true,
      })
    }
  }, [isEdit, supplierData])

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
      newErrors.name = t("storage.suppliers.form.validation.name_required")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    if (isEdit) {
      updateSupplier(
        { id: Number(id), data: { ...formData, id: Number(id) } },
        {
          onSuccess: () => {
            toast.success(t("storage.suppliers.form.success.update"))
            navigate("/clinic/storage/suppliers")
          },
          onError: (error) => {
            console.error("Update supplier error:", error)
          },
        },
      )
    } else {
      createSupplier(formData, {
        onSuccess: () => {
          toast.success(t("storage.suppliers.form.success.create"))
          navigate("/clinic/storage/suppliers")
        },
        onError: (error) => {
          console.error("Create supplier error:", error)
        },
      })
    }
  }

  return (
    <WithLoading isLoading={isEdit && isLoadingSupplier} skeleton={<AddEditSupplierSkeleton />}>
      <div className="space-y-6" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary-900 dark:text-zinc-100">
            {isEdit ? t("storage.suppliers.form.edit_title") : t("storage.suppliers.form.add_title")}
          </h1>
          <Button variant="outline" onClick={() => navigate("/clinic/storage/suppliers")}>
            {t("storage.suppliers.form.back_to_list")}
          </Button>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-zinc-100 border-b border-gray-200 dark:border-zinc-700 pb-2">
                {t("storage.suppliers.form.supplier_info")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                    {t("storage.suppliers.form.name_label")} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder={t("storage.suppliers.form.name_placeholder")}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                    {t("storage.suppliers.form.contact_person_label")}
                  </label>
                  <Input
                    value={formData.contactPerson}
                    onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                    placeholder={t("storage.suppliers.form.contact_person_placeholder")}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                    {t("storage.suppliers.form.phone_label")}
                  </label>
                  <Input
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    placeholder={t("storage.suppliers.form.phone_placeholder")}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                    {t("storage.suppliers.form.email_label")}
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder={t("storage.suppliers.form.email_placeholder")}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                    {t("storage.suppliers.form.address_label")}
                  </label>
                  <Input
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder={t("storage.suppliers.form.address_placeholder")}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                    {t("storage.suppliers.form.notes_label")}
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder={t("storage.suppliers.form.notes_placeholder")}
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
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                        {t("storage.suppliers.form.active_label")}
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
                  ? t("storage.suppliers.form.saving")
                  : isEdit
                    ? t("storage.suppliers.form.update_button")
                    : t("storage.suppliers.form.save_button")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </WithLoading>
  )
}
