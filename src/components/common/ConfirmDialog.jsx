"use client";

import React from "react";
import { Dialog, DialogContent } from "../ui/Dialog";
import { Button } from "../ui/Button";
import { useTranslation } from "react-i18next";
import { cn } from "@/utilities/cn";

/**
 * Reusable confirmation dialog using shadcn-like Dialog primitives.
 * Dynamic LTR/RTL support and localized defaults.
 */
export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  loadingLabel,
  onConfirm,
  isLoading = false,
  confirmVariant = "destructive", // or "default"
  children,
}) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const actualTitle = title || t("common.confirm");
  const actualDescription = description || t("common.confirm_description");
  const actualConfirmLabel = confirmLabel || t("common.confirm");
  const actualCancelLabel = cancelLabel || t("common.cancel");
  const actualLoadingLabel = loadingLabel || t("common.loading");

  const handleConfirm = async () => {
    if (!onConfirm || isLoading) return;
    await onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95%] max-w-md dark:bg-zinc-900 dark:border-zinc-800" open={open} onOpenChange={onOpenChange}>
        <div className="space-y-4" dir={isRTL ? "rtl" : "ltr"}>
          <div className="space-y-1">
            <h2 className={cn("text-lg font-semibold text-gray-900 dark:text-zinc-50", isRTL ? "text-right" : "text-left")}>{actualTitle}</h2>
            <p className={cn("text-sm text-gray-600 dark:text-zinc-400", isRTL ? "text-right" : "text-left")}>{actualDescription}</p>
          </div>

          {children}

          <div className={cn("flex items-center gap-3 pt-2", isRTL ? "justify-start" : "justify-end")}>
            {actualCancelLabel && (
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                className="px-4 py-2"
              >
                {actualCancelLabel}
              </Button>
            )}

            <Button
              type="button"
              onClick={handleConfirm}
              variant={confirmVariant === "destructive" ? "destructive" : "default"}
              className={cn(
                "px-4 py-2",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
              disabled={isLoading}
            >
              {isLoading ? actualLoadingLabel : actualConfirmLabel}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
