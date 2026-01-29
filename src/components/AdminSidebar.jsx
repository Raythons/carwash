"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "../utilities/cn";
import { Button } from "./ui/Button";
import { Dialog, MobileSheet } from "./ui/Dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/Tooltip";

const adminRoutes = [
  {
    label: "admin.dashboard",
    icon: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    href: "/admin/dashboard",
    color: "text-blue-600",
    bgColor: "bg-blue-600",
  },
  {
    label: "admin.create_organization",
    icon: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    href: "/admin/organizations/create",
    color: "text-green-600",
    bgColor: "bg-green-600",
  },
];

export function AdminSidebar({
  currentPath,
  isCollapsed,
  setIsCollapsed,
}) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === "ar";

  const SidebarItem = ({ route, collapsed }) => {
    const isActive = currentPath === route.href;

    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to={route.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-300 mb-1",
                isActive
                  ? "bg-primary-500 text-white shadow-md shadow-primary-200/50"
                  : "text-primary-700 dark:text-zinc-50 hover:bg-primary-50 dark:hover:bg-zinc-800"
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300",
                  isActive
                    ? "bg-white/20"
                    : cn("bg-white dark:bg-zinc-800 shadow-sm transition-colors", route.color)
                )}
              >
                {route.icon()}
              </div>
              {!collapsed && (
                <span className="text-sm font-medium truncate">{t(route.label)}</span>
              )}
            </Link>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side={isRTL ? "left" : "right"}>
              {t(route.label)}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-primary-50 to-primary-100 dark:from-zinc-900 dark:to-zinc-950 border-primary-200 dark:border-zinc-800 transition-colors shadow-xl">
      <div className="p-4 flex items-center justify-between border-b border-primary-200 dark:border-zinc-800">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-zinc-800 flex-shrink-0 shadow-sm">
              <span className="text-primary-600 font-bold text-sm">SA</span>
            </div>
            <div className="grid flex-1 text-sm leading-tight">
              <span className="truncate font-semibold text-primary-900 dark:text-zinc-50">
                Super Admin
              </span>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 text-primary-600 dark:text-zinc-400 hover:bg-primary-200 dark:hover:bg-zinc-800"
        >
          {isCollapsed ? (
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
             </svg>
          ) : (
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
             </svg>
          )}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
        {adminRoutes.map((route) => (
          <SidebarItem key={route.href} route={route} collapsed={isCollapsed} />
        ))}
      </div>

      <div className="p-3 border-t border-primary-200 dark:border-zinc-800">
        <Button
           variant="ghost"
           className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
           onClick={() => {
              localStorage.clear();
              window.location.reload();
           }}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {!isCollapsed && <span>{t("sidebar.logout")}</span>}
        </Button>
      </div>
    </div>
  );
}
