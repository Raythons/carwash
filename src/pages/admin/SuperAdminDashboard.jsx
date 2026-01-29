"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import api from "@/api";
import { format } from "date-fns";
import { cn } from "../../utilities/cn";

export default function SuperAdminDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: organizations, isLoading, error } = useQuery({
    queryKey: ["superadmin", "organizations"],
    queryFn: async () => {
      const response = await api.get("/superadmin/organizations");
      return response.data.data;
    },
  });

  if (isLoading) return <div className="p-8 text-center text-zinc-500">Loading organizations...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error loading organizations.</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {t("admin.organizations_overview")}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Manage all platform organizations and their subscriptions.
          </p>
        </div>
        <Button
          onClick={() => navigate("/admin/organizations/create")}
          className="bg-primary-500 hover:bg-primary-600 text-white"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t("admin.create_organization")}
        </Button>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" dir="rtl">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 uppercase text-xs font-semibold">
                <th className="px-6 py-4 border-b dark:border-zinc-800">Organization Name</th>
                <th className="px-6 py-4 border-b dark:border-zinc-800">Owner</th>
                <th className="px-6 py-4 border-b dark:border-zinc-800">Clinics</th>
                <th className="px-6 py-4 border-b dark:border-zinc-800">Current Plan</th>
                <th className="px-6 py-4 border-b dark:border-zinc-800">Expires On</th>
                <th className="px-6 py-4 border-b dark:border-zinc-800">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {organizations?.map((org) => {
                const isExpired = org.expiryDate && new Date(org.expiryDate) < new Date();
                const isExpiringSoon = org.expiryDate && new Date(org.expiryDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

                return (
                  <tr key={org.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-50">
                      {org.name}
                    </td>
                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                      {org.ownerEmail}
                    </td>
                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400 text-center">
                      {org.clinicCount}
                    </td>
                    <td className="px-6 py-4 text-zinc-900 dark:text-zinc-300">
                      <span className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-medium">
                        {org.planName || "No Plan"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                      {org.expiryDate ? (
                        <span className={cn(
                          isExpired ? "text-red-500 font-bold" : isExpiringSoon ? "text-orange-500 font-medium" : ""
                        )}>
                          {format(new Date(org.expiryDate), "dd/MM/yyyy")}
                        </span>
                      ) : "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        org.isActive ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      )}>
                        {org.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
