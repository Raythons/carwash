"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "../../components/ui/Button";
import api from "@/api";
import { toast } from "react-toastify";

export default function CreateOrganization() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      subscriptionMonths: 12
    }
  });

  const { data: plans } = useQuery({
    queryKey: ["superadmin", "plans"],
    queryFn: async () => {
      const response = await api.get("/superadmin/plans");
      return response.data.data;
    },
  });

  const mutation = useMutation({
    mutationFn: (data) => api.post("/superadmin/organizations", data),
    onSuccess: () => {
      toast.success(t("admin.organization.create_success"));
      navigate("/admin/dashboard");
    },
    onError: (error) => {
      toast.error(error.response?.data?.errors?.[0] || t("admin.organization.create_error"));
    }
  });

  const onSubmit = (data) => {
    mutation.mutate({
      ...data,
      planId: parseInt(data.planId),
      subscriptionMonths: parseInt(data.subscriptionMonths)
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          {t("admin.create_organization")}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          {t("admin.organization.subtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t("admin.organization.name_label")}</label>
            <input
              {...register("organizationName", { required: t("admin.organization.name_required") })}
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder={t("admin.organization.name_placeholder")}
            />
            {errors.organizationName && <p className="text-xs text-red-500">{errors.organizationName.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t("admin.organization.clinic_label")}</label>
            <input
              {...register("clinicName", { required: t("admin.organization.clinic_required") })}
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder={t("admin.organization.clinic_placeholder")}
            />
            {errors.clinicName && <p className="text-xs text-red-500">{errors.clinicName.message}</p>}
          </div>
        </div>

        <div className="border-t border-zinc-100 dark:border-zinc-800 pt-6">
          <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-50">{t("admin.organization.owner_section")}</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t("admin.organization.owner_name_label")}</label>
              <input
                {...register("ownerFullName", { required: t("admin.organization.owner_name_required") })}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-primary-500 outline-none"
              />
              {errors.ownerFullName && <p className="text-xs text-red-500">{errors.ownerFullName.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t("admin.organization.owner_email_label")}</label>
                <input
                  type="email"
                  {...register("ownerEmail", { required: t("admin.organization.owner_email_required") })}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-primary-500 outline-none"
                />
                {errors.ownerEmail && <p className="text-xs text-red-500">{errors.ownerEmail.message}</p>}
              </div>
 
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t("admin.organization.owner_password_label")}</label>
                <input
                  type="password"
                  {...register("ownerPassword", { required: t("admin.organization.owner_password_required"), minLength: { value: 6, message: t("admin.organization.owner_password_min") } })}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-primary-500 outline-none"
                />
                {errors.ownerPassword && <p className="text-xs text-red-500">{errors.ownerPassword.message}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-100 dark:border-zinc-800 pt-6">
          <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-50">{t("admin.organization.plan_section")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t("admin.organization.plan_label")}</label>
              <select
                {...register("planId", { required: t("admin.organization.plan_required") })}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-primary-500 outline-none"
              >
                <option value="">{t("admin.organization.plan_placeholder")}</option>
                {plans?.map(plan => (
                  <option key={plan.id} value={plan.id}>{plan.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t("admin.organization.duration_label")}</label>
              <input
                type="number"
                {...register("subscriptionMonths", { required: true, min: 1 })}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/dashboard")}
            className="flex-1"
          >
            {t("admin.organization.cancel")}
          </Button>
          <Button
            type="submit"
            disabled={mutation.isLoading}
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-200/50"
          >
            {mutation.isLoading ? t("admin.organization.submitting") : t("admin.organization.submit")}
          </Button>
        </div>
      </form>
    </div>
  );
}
