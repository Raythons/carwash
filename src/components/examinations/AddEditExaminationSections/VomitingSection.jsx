"use client"

import { useTranslation } from "react-i18next";
import { useEffect, useState, useMemo, useRef } from "react";
import { FlaskConical, Hash, Droplets, Utensils, AlertCircle, Activity } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "../../ui/Input"
import { Textarea } from "../../ui/Textarea"
import { FormSection, FormGrid } from "./FormSection"
import { FormFieldWrapper, FormFieldHeader } from "./FormFieldWrapper"

const RadioGroup = ({ name, options, selectedValue, onChange, color }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 pt-2">
    {options.map(({ label, value }) => {
      const isActive = selectedValue === value
      return (
        <label
          key={String(value)}
          className={`flex items-center justify-center cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 text-center min-h-[44px] ${isActive ? `${color.border} ${color.bg} shadow-md` : "bg-gray-50 border-gray-200 hover:bg-gray-100 dark:bg-zinc-800 dark:border-zinc-700 dark:hover:bg-zinc-700"}`}>
          <input type="radio" name={name} checked={isActive} onChange={() => onChange(value)} className="hidden" />
          <span className={`font-medium text-xs sm:text-sm leading-tight break-words ${isActive ? color.text : "text-gray-700 dark:text-zinc-300"}`}>{label}</span>
        </label>
      )
    })}
  </div>
)

const PREDEFINED_CONTENT = ["blood", "food", "drink", "juice", "undigested_food", "yellow_liquid", "white_foam", "bile"];

export function VomitingSection({
  formData,
  mode,
  onChange,
  onCheckboxChange,
  errors,
  getFieldError,
  isFieldTouched,
  isSubmitted,
}) {
  const { t } = useTranslation();
  const vomitingData = formData || {};
  
  const contentOptions = useMemo(() => [
    { label: t("examinations.vomiting.content_options.blood"), value: "blood" },
    { label: t("examinations.vomiting.content_options.food"), value: "food" },
    { label: t("examinations.vomiting.content_options.drink"), value: "drink" },
    { label: t("examinations.vomiting.content_options.juice"), value: "juice" },
    { label: t("examinations.vomiting.content_options.undigested_food"), value: "undigested_food" },
    { label: t("examinations.vomiting.content_options.yellow_liquid"), value: "yellow_liquid" },
    { label: t("examinations.vomiting.content_options.white_foam"), value: "white_foam" },
    { label: t("examinations.vomiting.content_options.bile"), value: "bile" },
    { label: t("examinations.vomiting.content_options.other"), value: "other" },
  ], [t]);

  const foodRelationOptions = useMemo(() => [
    { label: t("examinations.vomiting.food_relation_options.immediately_after"), value: "immediately_after" },
    { label: t("examinations.vomiting.food_relation_options.soon_after"), value: "soon_after" },
    { label: t("examinations.vomiting.food_relation_options.half_to_one_hour"), value: "half_to_one_hour" },
    { label: t("examinations.vomiting.food_relation_options.no_relation"), value: "no_relation" },
  ], [t]);

  // Convert array to comma-separated string for display, including custom input if exists
  const getVomitContentString = () => {
    if (!vomitingData?.vomitContent) {
      return vomitingData?.customVomitContent || t("common.not_specified")
    }

    const contentArray = Array.isArray(vomitingData.vomitContent) ? vomitingData.vomitContent : [vomitingData.vomitContent];
    
    const displayArray = contentArray.map(val => {
      const option = contentOptions.find(o => o.value === val);
      return option ? option.label : val;
    });

    // Add custom input to display if it exists and "other" is checked
    if (vomitingData?.showCustomVomitContent && vomitingData?.customVomitContent && vomitingData.customVomitContent.trim()) {
      displayArray.push(vomitingData.customVomitContent.trim())
    }

    return displayArray.length > 0 ? displayArray.join(", ") : t("common.not_specified")
  }

  // Handle checkbox changes
  const handleVomitContentChange = (content, checked) => {
    if (!onChange || !onCheckboxChange) return;
    
    if (content === "other") {
      // For "other", just show/hide the input field
      if (checked) {
        onChange("showCustomVomitContent", true)
        if (!isEditMode) {
          onChange("customVomitContent", "") // Reset custom input only in add mode
        }
      } else {
        onChange("showCustomVomitContent", false)
        if (!isEditMode) {
          onChange("customVomitContent", "")
        }
      }
    } else {
      // For regular options
      if (isEditMode || shouldShowCustomInput) {
        // If in edit mode OR "other" is selected, add/remove from the input field
        const currentContent = customInputValue || "";
        const contentArray = currentContent ? currentContent.split(", ").filter(item => item.trim()) : [];
        
        const contentLabel = contentOptions.find(o => o.value === content)?.label || content;

        if (checked) {
          // Add content if not already present
          if (!contentArray.includes(contentLabel)) {
            contentArray.push(contentLabel);
          }
        } else {
          // Remove content
          const index = contentArray.indexOf(contentLabel);
          if (index > -1) {
            contentArray.splice(index, 1);
          }
        }
        
        const newContent = contentArray.join(", ");
        if (isEditMode) {
          onChange("vomitContent", newContent);
        } else {
          onChange("customVomitContent", newContent);
        }
      } else {
        // Normal array behavior for add mode when "other" is not selected
        onCheckboxChange("vomitContent", content, checked);
      }
    }
  }

  const isEditMode = mode === "edit"
  const hasVomiting = vomitingData?.hasVomiting || false

  // In edit mode, if there's vomit content, always show it in "other" input
  const shouldShowCustomInput = isEditMode 
    ? (vomitingData?.vomitContent && vomitingData.vomitContent.length > 0)
    : vomitingData?.showCustomVomitContent

  // Get the content for the custom input
  const customInputValue = isEditMode 
    ? (typeof vomitingData?.vomitContent === 'string' 
        ? vomitingData.vomitContent 
        : Array.isArray(vomitingData?.vomitContent) 
          ? vomitingData.vomitContent.join(", ") 
          : "")
    : vomitingData?.customVomitContent || ""

  // Handle backend data initialization
  const initializedRef = useRef(false);
  
  useEffect(() => {
    if (initializedRef.current || !vomitingData) return;
    initializedRef.current = true;

    // Process Vomit Content
    const backendVomitContent = vomitingData.vomitContent;
    if (backendVomitContent) {
      const mapContent = (val) => {
        if (val === "دم") return "blood";
        if (val === "أكل") return "food";
        if (val === "شراب") return "drink";
        if (val === "عصير") return "juice";
        if (val === "طعام غير مهضوم") return "undigested_food";
        if (val === "سائل أصفر") return "yellow_liquid";
        if (val === "رغوة بيضاء") return "white_foam";
        if (val === "مرارة") return "bile";
        if (val === "غير ذلك") return "other";
        return val;
      };

      if (typeof backendVomitContent === 'string') {
        const mapped = mapContent(backendVomitContent);
        if (mapped === "other" || !PREDEFINED_CONTENT.includes(mapped)) {
          onChange("showCustomVomitContent", true);
          onChange("customVomitContent", backendVomitContent === "غير ذلك" ? "" : backendVomitContent);
          onChange("vomitContent", []);
        } else {
          onChange("vomitContent", [mapped]);
        }
      } else if (Array.isArray(backendVomitContent)) {
        const mappedArray = backendVomitContent.map(mapContent);
        const predefined = mappedArray.filter(item => PREDEFINED_CONTENT.includes(item));
        const nonPredefined = backendVomitContent.filter((item, idx) => !PREDEFINED_CONTENT.includes(mappedArray[idx]) && mappedArray[idx] !== "other");
        
        onChange("vomitContent", predefined);
        if (nonPredefined.length > 0 || mappedArray.includes("other")) {
          onChange("showCustomVomitContent", true);
          if (nonPredefined.length > 0) {
            onChange("customVomitContent", nonPredefined.join(", "));
          }
        }
      }
    }

    // Process Food Relation
    const backendFoodRelation = vomitingData.vomitingFoodRelation;
    if (backendFoodRelation) {
      const mapFoodRel = (val) => {
        if (val === "بعد الأكل مباشرة") return "immediately_after";
        if (val === "بعد الأكل فورًا") return "soon_after";
        if (val === "بعده 1/2 ساعة أو ساعة") return "half_to_one_hour";
        if (val === "ليس له علاقة بالأكل" || val === "ليس له عالقة بالأكل") return "no_relation";
        return val;
      };
      const mapped = mapFoodRel(backendFoodRelation);
      if (mapped !== backendFoodRelation) {
        onChange("vomitingFoodRelation", mapped);
      }
    }
  }, [vomitingData, onChange])



  const colorSchemes = {
    red: { 
      bg: "bg-red-50 dark:bg-red-900/20", 
      border: "border-red-400 dark:border-red-500/50", 
      text: "text-red-800 dark:text-red-300" 
    },
    blue: { 
      bg: "bg-blue-50 dark:bg-blue-900/20", 
      border: "border-blue-400 dark:border-blue-500/50", 
      text: "text-blue-800 dark:text-blue-300" 
    },
  }

  return (
    <FormSection title={t("examinations.vomiting.title")} icon={FlaskConical}>
      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <div className="flex items-center space-x-2 space-x-reverse bg-white dark:bg-zinc-800 p-4 rounded-lg border dark:border-zinc-700 shadow-sm">
          <Checkbox
            id="hasVomiting"
            checked={hasVomiting}
            onCheckedChange={(checked) => onChange && onChange("hasVomiting", checked)}
          />
          <Label htmlFor="hasVomiting" className="text-md font-semibold text-gray-800 dark:text-zinc-100 cursor-pointer">
            {t("examinations.vomiting.question")}
          </Label>
        </div>
      </div>

      {hasVomiting && (
        <FormGrid>
          <FormFieldWrapper>
            <FormFieldHeader icon={Hash} label={t("examinations.vomiting.frequency")} />
            <Input
              value={vomitingData?.vomitingFrequency || ""}
              onChange={(e) => onChange && onChange("vomitingFrequency", e.target.value)}
              placeholder={t("examinations.vomiting.placeholders.frequency")}
              className="w-full"
            />
          </FormFieldWrapper>

          <FormFieldWrapper>
            <FormFieldHeader icon={FlaskConical} label={t("examinations.vomiting.dipstick")} />
            <Input
              value={vomitingData?.dipstick || ""}
              onChange={(e) => onChange && onChange("dipstick", e.target.value)}
              placeholder={t("examinations.vomiting.dipstick")}
              className="w-full"
            />
          </FormFieldWrapper>

          <div className="md:col-span-2 lg:col-span-2">
            <FormFieldWrapper>
              <FormFieldHeader icon={FlaskConical} label={t("examinations.vomiting.content")} />
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 dark:bg-zinc-900 rounded-md border dark:border-zinc-700 text-sm">
                  <span className="text-gray-600 dark:text-zinc-400">{t("examinations.vomiting.currently_selected")} </span>
                  <span className="font-medium text-gray-800 dark:text-zinc-200">{getVomitContentString()}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {contentOptions.map(
                    (option) => (
                      <label
                        key={option.value}
                        className="flex items-center gap-2 space-x-2 space-x-reverse cursor-pointer p-3 rounded-lg  hover:bg-red-50 dark:hover:bg-red-900/20 border border-gray-200 dark:border-zinc-700 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={
                            option.value === "other"
                              ? shouldShowCustomInput
                              : isEditMode || shouldShowCustomInput
                                ? customInputValue.includes(option.label)
                                : vomitingData?.vomitContent?.includes(option.value) || false
                          }
                          onChange={(e) => handleVomitContentChange(option.value, e.target.checked)}
                          className="h-4 w-4 rounded border border-red-300 text-red-600 focus:ring-2 focus:ring-red-500"
                        />
                        <span className="text-sm font-medium leading-none dark:text-zinc-300">{option.label}</span>
                      </label>
                    ),
                  )}
                </div>
                {shouldShowCustomInput && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                      {isEditMode ? t("examinations.vomiting.content") : t("examinations.vomiting.placeholders.custom_content")}
                    </label>
                    <Input
                      value={customInputValue}
                      onChange={(e) => {
                        if (isEditMode) {
                          onChange("vomitContent", e.target.value)
                        } else {
                          onChange("customVomitContent", e.target.value)
                        }
                      }}
                      placeholder={isEditMode ? t("examinations.vomiting.content") : t("examinations.vomiting.placeholders.custom_content")}
                    />
                  </div>
                )}
              </div>
            </FormFieldWrapper>
          </div>

          <FormFieldWrapper>
            <FormFieldHeader icon={Droplets} label={t("examinations.vomiting.water_vomiting")} />
            <RadioGroup
              name="waterVomiting"
              options={[
                { label: t("common.yes"), value: true },
                { label: t("common.no"), value: false },
              ]}
              selectedValue={vomitingData?.waterVomiting}
              onChange={(value) => onChange && onChange("waterVomiting", value)}
              color={colorSchemes.blue}
            />
          </FormFieldWrapper>

          <FormFieldWrapper>
            <FormFieldHeader icon={Utensils} label={t("examinations.vomiting.food_relation")} />
            <RadioGroup
              name="vomitingFoodRelation"
              options={foodRelationOptions}
              selectedValue={vomitingData?.vomitingFoodRelation}
              onChange={(value) => onChange && onChange("vomitingFoodRelation", value)}
              color={colorSchemes.red}
            />
          </FormFieldWrapper>

          <div className="md:col-span-2 lg:col-span-2">
            <FormFieldWrapper>
              <FormFieldHeader icon={FlaskConical} label={t("examinations.vomiting.consistency")} />
              <Textarea
                value={vomitingData?.vomitConsistency || ""}
                onChange={(e) => onChange && onChange("vomitConsistency", e.target.value)}
                placeholder={t("examinations.vomiting.placeholders.consistency")}
                rows={3}
              />
            </FormFieldWrapper>
          </div>

          <FormFieldWrapper>
            <FormFieldHeader icon={AlertCircle} label={t("examinations.vomiting.retching")} />
            <RadioGroup
              name="retching"
              options={[
                { label: t("common.yes"), value: true },
                { label: t("common.no"), value: false },
              ]}
              selectedValue={vomitingData?.retching}
              onChange={(value) => onChange && onChange("retching", value)}
              color={colorSchemes.red}
            />
          </FormFieldWrapper>

          <FormFieldWrapper>
            <FormFieldHeader icon={Activity} label={t("examinations.vomiting.with_diarrhea")} />
            <RadioGroup
              name="withDiarrhea"
              options={[
                { label: t("common.yes"), value: true },
                { label: t("common.no"), value: false },
              ]}
              selectedValue={vomitingData?.withDiarrhea}
              onChange={(value) => onChange && onChange("withDiarrhea", value)}
              color={colorSchemes.red}
            />
          </FormFieldWrapper>

          {vomitingData?.withDiarrhea === true && (
            <div className="md:col-span-2 lg:col-span-2">
              <FormFieldWrapper>
                <FormFieldHeader icon={AlertCircle} label={t("examinations.vomiting.which_started_first")} />
                <Textarea
                  value={vomitingData?.diarrheaDetails || ""}
                  onChange={(e) => onChange && onChange("diarrheaDetails", e.target.value)}
                  placeholder={t("examinations.vomiting.placeholders.diarrhea_details")}
                  rows={3}
                />
              </FormFieldWrapper>
            </div>
          )}
        </FormGrid>
      )}
    </FormSection>
  )
}
