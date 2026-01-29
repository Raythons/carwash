import React from "react";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Calendar as CalendarComponent } from "../../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { User, Mail, Phone, Calendar } from "lucide-react";
import { formatNumberWithThousands } from "../../../utilities/number";
import { useTranslation } from "react-i18next";
import { cn } from "@/utilities/cn";

export default function EmployeeBasicInfoForm({
  formData,
  errors,
  hireDateOpen,
  setHireDateOpen,
  salaryInput,
  setSalaryInput,
  handleInputChange,
  handleSalaryChange,
  handleUserTypeChange,
  setFormData,
  isEdit = false
}) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className={cn("text-sm font-medium text-gray-700 dark:text-zinc-100 block", isRTL ? "text-right" : "text-left")}>
            {t("common.name")} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className={cn("absolute top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4", isRTL ? "right-3" : "left-3")} />
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder={t("employees.placeholder_name")}
              className={cn(isRTL ? "pr-10" : "pl-10", errors.name ? "border-red-500" : "")}
            />
          </div>
          {errors.name && (
            <p className={cn("text-red-500 text-sm mt-1", isRTL ? "text-right" : "text-left")}>{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className={cn("text-sm font-medium text-gray-700 dark:text-zinc-100 block", isRTL ? "text-right" : "text-left")}>
            {t("common.email")} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className={cn("absolute top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4", isRTL ? "right-3" : "left-3")} />
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={t("employees.placeholder_email")}
              className={cn(isRTL ? "pr-10" : "pl-10", errors.email ? "border-red-500" : "")}
            />
          </div>
          {errors.email && (
            <p className={cn("text-red-500 text-sm mt-1", isRTL ? "text-right" : "text-left")}>{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className={cn("text-sm font-medium text-gray-700 dark:text-zinc-100 block", isRTL ? "text-right" : "text-left")}>
            {t("common.phone")} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className={cn("absolute top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4", isRTL ? "right-3" : "left-3")} />
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder={t("employees.placeholder_phone")}
              className={cn(isRTL ? "pr-10" : "pl-10", errors.phone ? "border-red-500" : "")}
            />
          </div>
          {errors.phone && (
            <p className={cn("text-red-500 text-sm mt-1", isRTL ? "text-right" : "text-left")}>{errors.phone}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className={cn("text-sm font-medium text-gray-700 dark:text-zinc-100 block", isRTL ? "text-right" : "text-left")}>
            {t("employees.user_type")} <span className="text-red-500">*</span>
          </label>
          <Select value={formData.userType} onValueChange={handleUserTypeChange}>
            <SelectTrigger className={errors.userType ? "border-red-500" : ""}>
              <SelectValue placeholder={t("employees.select_user_type")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Owner">{t("employees.types.Owner")}</SelectItem>
              <SelectItem value="Doctor">{t("employees.types.Doctor")}</SelectItem>
              <SelectItem value="Reception">{t("employees.types.Reception")}</SelectItem>
              <SelectItem value="Nurse">{t("employees.types.Nurse")}</SelectItem>
              <SelectItem value="Employee">{t("employees.types.Employee")}</SelectItem>
              <SelectItem value="Admin">{t("employees.types.Admin")}</SelectItem>
            </SelectContent>
          </Select>
          {errors.userType && (
            <p className={cn("text-red-500 text-sm mt-1", isRTL ? "text-right" : "text-left")}>{errors.userType}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className={cn("text-sm font-medium text-gray-700 dark:text-zinc-100 block", isRTL ? "text-right" : "text-left")}>
            {t("employees.join_date")} <span className="text-red-500">*</span>
          </label>
          <Popover open={hireDateOpen} onOpenChange={setHireDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full font-normal",
                  isRTL ? "text-right justify-start space-x-reverse" : "text-left justify-start",
                  !formData.hireDate && "text-muted-foreground",
                  errors.hireDate ? "border-red-500" : ""
                )}
              >
                <Calendar className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                {formData.hireDate ? (
                  new Date(formData.hireDate).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')
                ) : (
                  <span>{t("employees.select_hire_date")}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align={isRTL ? "end" : "start"}>
              <CalendarComponent
                mode="single"
                selected={formData.hireDate ? new Date(formData.hireDate) : undefined}
                onSelect={(d) => {
                  if (d) {
                    const y = d.getFullYear();
                    const m = String(d.getMonth() + 1).padStart(2, "0");
                    const day = String(d.getDate()).padStart(2, "0");
                    setFormData(prev => ({
                      ...prev,
                      hireDate: `${y}-${m}-${day}`
                    }));
                    setHireDateOpen(false);
                  }
                }}
                disabled={(date) => date > new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.hireDate && (
            <p className={cn("text-red-500 text-sm mt-1", isRTL ? "text-right" : "text-left")}>{errors.hireDate}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className={cn("text-sm font-medium text-gray-700 dark:text-zinc-100 block", isRTL ? "text-right" : "text-left")}>
            {t("employees.salary")}
          </label>
          <Input
            name="salary"
            type="text"
            inputMode="decimal"
            value={salaryInput}
            onChange={(e) => handleSalaryChange(e.target.value)}
            placeholder={t("employees.placeholder_salary")}
            className={isRTL ? "text-right" : "text-left"}
          />
        </div>

        {!isEdit && (
          <>
            <div className="space-y-2">
              <label className={cn("text-sm font-medium text-gray-700 dark:text-zinc-100 block", isRTL ? "text-right" : "text-left")}>
                {t("employees.password")} <span className="text-red-500">*</span>
              </label>
              <Input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={t("employees.placeholder_password")}
                className={cn(isRTL ? "text-right" : "text-left", errors.password ? "border-red-500" : "")}
              />
              {errors.password && (
                <p className={cn("text-red-500 text-sm mt-1", isRTL ? "text-right" : "text-left")}>{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className={cn("text-sm font-medium text-gray-700 dark:text-zinc-100 block", isRTL ? "text-right" : "text-left")}>
                {t("employees.confirm_password")} <span className="text-red-500">*</span>
              </label>
              <Input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder={t("employees.placeholder_confirm_password")}
                className={cn(isRTL ? "text-right" : "text-left", errors.confirmPassword ? "border-red-500" : "")}
              />
              {errors.confirmPassword && (
                <p className={cn("text-red-500 text-sm mt-1", isRTL ? "text-right" : "text-left")}>{errors.confirmPassword}</p>
              )}
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <label className={cn("text-sm font-medium text-gray-700 dark:text-zinc-100 block", isRTL ? "text-right" : "text-left")}>
            {t("common.address")}
          </label>
          <Input
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder={t("employees.placeholder_address")}
            className={isRTL ? "text-right" : "text-left"}
          />
        </div>

        <div className="space-y-2">
          <label className={cn("text-sm font-medium text-gray-700 dark:text-zinc-100 block", isRTL ? "text-right" : "text-left")}>
            {t("common.notes")}
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder={t("employees.placeholder_notes")}
            className={cn(
              "w-full px-3 py-2 border border-gray-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent resize-none transition-all",
              isRTL ? "text-right" : "text-left"
            )}
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}
