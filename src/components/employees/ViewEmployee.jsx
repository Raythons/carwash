import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../ui/Button";
import { 
  ArrowLeft, 
  Edit, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  DollarSign, 
  MapPin, 
  FileText,
  Loader2,
  Badge
} from "lucide-react";
import { useEmployeeById } from "../../hooks/queries/useEmployeeQueries";
import { useTranslation } from "react-i18next";
import { cn } from "@/utilities/cn";

export default function ViewEmployee() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: employee, isLoading, isError } = useEmployeeById(id);

  const formatDate = (dateString) => {
    if (!dateString) return t("common.not_specified");
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(isRTL ? "ar-EG" : "en-US", options);
  };

  const formatSalary = (salary) => {
    if (!salary) return t("common.not_specified");
    return new Intl.NumberFormat(isRTL ? "ar-EG" : "en-US").format(salary);
  };

  const getUserTypeBadgeColor = (userType) => {
    const colors = {
      "Doctor": "bg-blue-100 text-blue-800",
      "Reception": "bg-green-100 text-green-800",
      "Nurse": "bg-purple-100 text-purple-800",
      "Admin": "bg-orange-100 text-orange-800"
    };
    return colors[userType] || "bg-gray-100 text-gray-800";
  };

  const formatServiceDuration = (emp) => {
    const { serviceYears: years, serviceMonths: months } = emp;
    if (years > 0 && months > 0) return t("employees.duration.years_months", { years, months });
    if (years > 0) return t("employees.duration.years", { count: years });
    if (months > 0) return t("employees.duration.months", { count: months });
    return t("employees.duration.less_than_month");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6" dir={isRTL ? "rtl" : "ltr"}>
        <div className={cn("flex items-center justify-center h-64", isRTL && "space-x-reverse")}>
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
          <span className={cn("text-gray-600 dark:text-zinc-400", isRTL ? "mr-2" : "ml-2")}>{t("common.loading")}</span>
        </div>
      </div>
    );
  }

  if (isError || !employee) {
    return (
      <div className="container mx-auto px-4 py-6" dir={isRTL ? "rtl" : "ltr"}>
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border dark:border-zinc-800 p-8 text-center">
          <div className="text-red-500 dark:text-red-400 mb-4">
            <User className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-zinc-100 mb-2">{t("employees.not_found")}</h2>
          <p className="text-gray-600 dark:text-zinc-400 mb-6">{t("employees.not_found_desc")}</p>
          <Button onClick={() => navigate("/clinic/employees")}>
            {t("employees.back_to_list")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6" dir={isRTL ? "rtl" : "ltr"}>
      <div className={cn("flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6", isRTL && "space-x-reverse")}>
        <div className={cn("flex items-center gap-4", isRTL && "space-x-reverse")}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/clinic/employees")}
            className={cn("flex items-center gap-2 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100", isRTL && "space-x-reverse")}
          >
            <ArrowLeft className={cn("w-4 h-4", isRTL && "rotate-180")} />
            {t("common.back")}
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">{t("employees.view_details")}</h1>
        </div>
        
        <Button
          onClick={() => navigate(`/clinic/employees/edit/${id}`)}
          className={cn("flex items-center gap-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-500", isRTL && "space-x-reverse")}
        >
          <Edit className="w-4 h-4" />
          {t("employees.edit_info")}
        </Button>
      </div>

      <div className="max-w-4xl mx-auto space-y-6 text-right">
        {/* Basic Information Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md border dark:border-zinc-800 overflow-hidden transition-all duration-300">
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/30">
            <h2 className={cn("text-lg sm:text-xl font-semibold flex items-center gap-2 text-gray-900 dark:text-zinc-100", isRTL && "space-x-reverse")}>
              <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              {t("employees.personal_info")}
            </h2>
          </div>
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-zinc-500 block mb-1">{t("common.name")}</label>
                  <p className="text-lg font-bold text-gray-900 dark:text-zinc-100">{employee.name}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-zinc-500 block mb-1">{t("employees.user_type")}</label>
                  <div className="mt-1">
                    <span className={cn(
                      "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm border dark:border-opacity-30",
                      getUserTypeBadgeColor(employee.userType),
                      "dark:bg-opacity-20",
                      isRTL && "space-x-reverse"
                    )}>
                      <Badge className={cn("w-3 h-3", isRTL ? "ml-1.5" : "mr-1.5")} />
                      {t(`employees.types.${employee.userType}`)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-zinc-500 block mb-1">{t("employees.join_date")}</label>
                  <div className={cn("flex items-center gap-2 mt-1", isRTL && "space-x-reverse")}>
                    <Calendar className="w-4 h-4 text-gray-400 dark:text-zinc-500" />
                    <p className="font-medium text-gray-900 dark:text-zinc-100">{formatDate(employee.joinDate)}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-zinc-500 block mb-1">{t("common.email")}</label>
                  <div className={cn("flex items-center gap-2 mt-1", isRTL && "space-x-reverse")}>
                    <Mail className="w-4 h-4 text-gray-400 dark:text-zinc-500" />
                    <p className="font-medium text-gray-900 dark:text-zinc-100 break-all">{employee.email || t("common.not_specified")}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-zinc-500 block mb-1">{t("common.phone")}</label>
                  <div className={cn("flex items-center gap-2 mt-1", isRTL && "space-x-reverse")}>
                    <Phone className="w-4 h-4 text-gray-400 dark:text-zinc-500" />
                    <p className="font-medium text-gray-900 dark:text-zinc-100">{employee.phoneNumber || t("common.not_specified")}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-zinc-500 block mb-1">{t("employees.salary")}</label>
                  <div className={cn("flex items-center gap-2 mt-1", isRTL && "space-x-reverse")}>
                    <DollarSign className="w-4 h-4 text-gray-400 dark:text-zinc-500" />
                    <p className="font-medium text-gray-900 dark:text-zinc-100">{formatSalary(employee.salary)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md border dark:border-zinc-800 overflow-hidden text-right transition-all duration-300">
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/30">
            <h2 className={cn("text-lg sm:text-xl font-semibold flex items-center gap-2 text-gray-900 dark:text-zinc-100", isRTL && "space-x-reverse")}>
              <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              {t("employees.additional_info")}
            </h2>
          </div>
          <div className="p-4 sm:p-6">
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-zinc-500 block mb-2">{t("common.address")}</label>
                <div className={cn("flex items-start gap-2", isRTL && "space-x-reverse")}>
                  <MapPin className="w-5 h-5 text-gray-400 dark:text-zinc-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700 dark:text-zinc-300 leading-relaxed font-medium">{employee.address || t("common.not_specified")}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-zinc-500 block mb-2">{t("common.notes")}</label>
                <div className={cn("flex items-start gap-2", isRTL && "space-x-reverse")}>
                  <FileText className="w-5 h-5 text-gray-400 dark:text-zinc-500 mt-0.5 flex-shrink-0" />
                  <p className="whitespace-pre-wrap text-gray-700 dark:text-zinc-300 leading-relaxed font-medium">
                    {employee.notes || t("common.no_notes")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Employee Statistics Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md border dark:border-zinc-800 overflow-hidden text-right transition-all duration-300">
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/30">
            <h2 className={cn("text-lg sm:text-xl font-semibold flex items-center gap-2 text-gray-900 dark:text-zinc-100", isRTL && "space-x-reverse")}>
              <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              {t("employees.statistics_title")}
            </h2>
          </div>
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50/50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/50 flex flex-col justify-between transition-all">
                <div>
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-2" />
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 mb-1">{t("employees.service_duration_label")}</p>
                </div>
                <p className="text-base sm:text-lg font-bold text-blue-700 dark:text-blue-300 truncate">
                  {employee.serviceDuration || t("common.not_specified")}
                </p>
              </div>

              <div className="bg-green-50/50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800/50 flex flex-col justify-between transition-all">
                <div>
                  <User className="w-5 h-5 text-green-600 dark:text-green-400 mb-2" />
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 mb-1">{t("common.status")}</p>
                </div>
                <p className="text-base sm:text-lg font-bold text-green-700 dark:text-green-300">{t("common.active")}</p>
              </div>

              <div className="bg-purple-50/50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800/50 flex flex-col justify-between transition-all">
                <div>
                  <Badge className="w-5 h-5 text-purple-600 dark:text-purple-400 mb-2" />
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 mb-1">{t("employees.position")}</p>
                </div>
                <p className="text-base sm:text-lg font-bold text-purple-700 dark:text-purple-300 truncate">
                  {t(`employees.types.${employee.userType}`)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
