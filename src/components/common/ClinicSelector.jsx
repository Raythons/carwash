import React from 'react';
import { useClinic } from '@/contexts/ClinicContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from "react-i18next";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Building2 } from 'lucide-react';
import { cn } from '@/utilities/cn';

const ClinicSelector = ({ className = "" }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const { selectedClinicId, clinics, isLoading, selectClinic, setDefaultClinic } = useClinic();
    const { hasPermission } = useAuth();

    if (isLoading) {
        return (
            <div className={`flex items-center gap-2 ${className}`}>
                <Building2 className="w-4 h-4 text-gray-400 dark:text-zinc-500" />
                <div className="w-32 h-8 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded"></div>
            </div>
        );
    }

    if (clinics.length <= 1) {
        return null; // Don't show selector if only one clinic
    }

    return (
        <div className={cn("flex items-center gap-2", className)} dir={isRTL ? "rtl" : "ltr"}>
            <Building2 className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <Select
                value={selectedClinicId ? selectedClinicId.toString() : "ALL"}
                onValueChange={(value) => {
                    if (value === "ALL") {
                        // Clear both current selection and default to persist ALL across refresh
                        setDefaultClinic(null);
                        selectClinic(null);
                    } else {
                        selectClinic(parseInt(value, 10));
                    }
                }}
            >
                <SelectTrigger className={cn("w-40 h-8 text-sm border-primary-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 dark:text-zinc-100", isRTL ? "text-right" : "text-left")}>
                    <SelectValue placeholder={t("common.select_clinic")} />
                </SelectTrigger>
                <SelectContent>
                    {/* Only show "All" option if user has AllClinics.Access permission */}
                    {hasPermission('AllClinics.Access') && (
                        <SelectItem value="ALL" className={isRTL ? "text-right" : "text-left"}>
                            {t("common.all")}
                        </SelectItem>
                    )}
                    {clinics.map((clinic) => (
                        <SelectItem
                            key={clinic.id}
                            value={clinic.id.toString()}
                            className={isRTL ? "text-right" : "text-left"}
                        >
                            {clinic.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default ClinicSelector;
