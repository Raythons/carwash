"use client";

import React from 'react';
import { useAnimalTypes } from '@/hooks/queries/useAnimalTypeQueries';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utilities/cn';

/**
 * A reusable AnimalType selector component that displays animal types as radio buttons
 * @param {Object} props - Component props
 * @param {string} props.name - The name attribute for the radio group
 * @param {string} props.label - The label for the selector
 * @param {boolean} [props.required=false] - Whether the field is required
 * @param {string} props.value - The currently selected animal type name
 * @param {Function} props.onChange - Callback when selection changes
 * @param {string} [props.error] - Error message to display
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} The AnimalTypeSelector component
 */
const AnimalTypeSelector = ({
  name,
  label,
  required = false,
  value,
  onChange,
  error,
  className = "",
  ...props
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  // Fetch animal types using clinic-scoped hook
  const { data: animalTypes, isLoading, isError } = useAnimalTypes();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className="text-destructive p-2 text-sm">
        {t("common.error_occurred", { message: t("animals_form.error_loading_types") })}
      </div>
    );
  }

  // Handle selection change - now using animal type name as the value
  const handleChange = (animalTypeName) => {
    if (onChange) {
      onChange(animalTypeName);
    }
  };

  const actualLabel = label !== undefined ? label : t("animals_form.type");

  return (
    <div className={cn("space-y-2", className)} dir={isRTL ? "rtl" : "ltr"}>
      {actualLabel && (
        <label className={cn("block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1", isRTL ? "text-right" : "text-left")}>
          {actualLabel} {required && <span className="text-red-500 font-bold">*</span>}
        </label>
      )}

      <div className="flex flex-wrap gap-3">
        {animalTypes?.data?.map((animalType) => (
          <label
            key={animalType.name}
            className={cn(
              "flex items-center cursor-pointer p-2.5 rounded-md border transition-all duration-300",
              isRTL ? "space-x-reverse space-x-2" : "space-x-2",
              value === animalType.name
                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800/80 shadow-sm'
            )}
          >
            <div className="flex items-center">
              <div className={cn(
                "h-4 w-4 rounded-full border flex items-center justify-center transition-colors",
                value === animalType.name
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900'
              )}>
                {value === animalType.name && (
                  <div className="h-2 w-2 rounded-full bg-white"></div>
                )}
              </div>
              <input
                type="radio"
                name={name}
                value={animalType.name}
                checked={value === animalType.name}
                onChange={() => handleChange(animalType.name)}
                className="sr-only" // Hide the default radio button
              />
              <span className={cn("text-sm font-medium text-gray-700 dark:text-zinc-300 transition-colors", isRTL ? "mr-1" : "ml-1")}>
                {/* 
                  Try to translate the animal type name if a key exists, 
                  otherwise fallback to the record name 
                */}
                {t(`animal_types.${animalType.name}`, { defaultValue: animalType.name })}
              </span>
            </div>
          </label>
        ))}
      </div>

      {error && (
        <p className={cn("text-sm text-red-600 flex items-center gap-1 mt-1", isRTL ? "text-right justify-end" : "text-left")}>
          <span className="text-red-500">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
};

export default AnimalTypeSelector;
