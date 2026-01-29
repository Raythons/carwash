"use client";

import { useState, useEffect } from "react";
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
import ClinicSelector from "./common/ClinicSelector";
import StorageSelector from "./common/StorageSelector";

// Warehouse routes - مستودع
// const warehouseRoutes = [
//   {
//     label: "لوحة المستودع",
//     icon: () => (
//       <svg
//         className="w-5 h-5"
//         fill="none"
//         stroke="currentColor"
//         viewBox="0 0 24 24"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth={2}
//           d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
//         />
//       </svg>
//     ),
//     href: "/warehouse/dashboard",
//     color: "text-blue-500",
//     bgColor: "bg-blue-500",
//     hoverBg: "hover:bg-blue-500",
//   },
//   {
//     label: "المنتجات",
//     icon: () => (
//       <svg
//         className="w-5 h-5"
//         fill="none"
//         stroke="currentColor"
//         viewBox="0 0 24 24"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth={2}
//           d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
//         />
//       </svg>
//     ),
//     href: "/warehouse/products",
//     color: "text-green-500",
//     bgColor: "bg-green-500",
//     hoverBg: "hover:bg-green-500",
//   },
//   {
//     label: "المخزون",
//     icon: () => (
//       <svg
//         className="w-5 h-5"
//         fill="none"
//         stroke="currentColor"
//         viewBox="0 0 24 24"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth={2}
//           d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
//         />
//       </svg>
//     ),
//     href: "/warehouse/inventory",
//     color: "text-purple-500",
//     bgColor: "bg-purple-500",
//     hoverBg: "hover:bg-purple-500",
//   },
//   {
//     label: "الطلبات",
//     icon: () => (
//       <svg
//         className="w-5 h-5"
//         fill="none"
//         stroke="currentColor"
//         viewBox="0 0 24 24"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth={2}
//           d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
//         />
//       </svg>
//     ),
//     href: "/warehouse/orders",
//     color: "text-orange-500",
//     bgColor: "bg-orange-500",
//     hoverBg: "hover:bg-orange-500",
//   },
//   {
//     label: "الموردين",
//     icon: () => (
//       <svg
//         className="w-5 h-5"
//         fill="none"
//         stroke="currentColor"
//         viewBox="0 0 24 24"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth={2}
//           d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
//         />
//       </svg>
//     ),
//     href: "/warehouse/suppliers",
//     color: "text-cyan-500",
//     bgColor: "bg-cyan-500",
//     hoverBg: "hover:bg-cyan-500",
//   },
//   {
//     label: "التقارير",
//     icon: () => (
//       <svg
//         className="w-5 h-5"
//         fill="none"
//         stroke="currentColor"
//         viewBox="0 0 24 24"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth={2}
//           d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
//         />
//       </svg>
//     ),
//     href: "/warehouse/reports",
//     color: "text-yellow-500",
//     bgColor: "bg-yellow-500",
//     hoverBg: "hover:bg-yellow-500",
//   },
//   {
//     label: "الإعدادات",
//     icon: () => (
//       <svg
//         className="w-5 h-5"
//         fill="none"
//         stroke="currentColor"
//         viewBox="0 0 24 24"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth={2}
//           d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
//         />
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth={2}
//           d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//         />
//       </svg>
//     ),
//     href: "/warehouse/settings",
//     color: "text-gray-500",
//     bgColor: "bg-gray-500",
//     hoverBg: "hover:bg-gray-500",
//   },
// ];

// Warehouse routes - مستودع (Storage System)
const warehouseRoutes = [
  {
    label: "sidebar.statistics",
    icon: () => (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    href: "/clinic/storage/statistics",
    color: "text-purple-500",
    bgColor: "bg-purple-500",
    hoverBg: "hover:bg-purple-500",
  },
  {
    label: "sidebar.categories",
    icon: () => (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
        />
      </svg>
    ),
    href: "/clinic/storage/categories",
    color: "text-blue-500",
    bgColor: "bg-blue-500",
    hoverBg: "hover:bg-blue-500",
  },
  {
    label: "sidebar.suppliers",
    icon: () => (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    href: "/clinic/storage/suppliers",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500",
    hoverBg: "hover:bg-cyan-500",
  },
  {
    label: "sidebar.products",
    icon: () => (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
    ),
    href: "/clinic/storage/products",
    color: "text-green-500",
    bgColor: "bg-green-500",
    hoverBg: "hover:bg-green-500",
  },
  {
    label: "sidebar.deals",
    icon: () => (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
    ),
    href: "/clinic/storage/deals",
    color: "text-orange-500",
    bgColor: "bg-orange-500",
    hoverBg: "hover:bg-orange-500",
  },
  {
    label: "sidebar.pos",
    icon: () => (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    href: "/clinic/storage/pos",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500",
    hoverBg: "hover:bg-emerald-500",
  },
  {
    label: "sidebar.sales",
    icon: () => (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    href: "/clinic/storage/sales",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500",
    hoverBg: "hover:bg-indigo-500",
  },
  {
    label: "sidebar.analytics",
    icon: () => (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4v16"
        />
      </svg>
    ),
    href: "/clinic/storage/analytics",
    color: "text-pink-500",
    bgColor: "bg-pink-500",
    hoverBg: "hover:bg-pink-500",
  },
];

// Clinic routes - عيادة
const clinicRoutes = [
  {
    label: "sidebar.clinics",
    icon: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    href: "/clinic/clinics",
    color: "text-teal-600",
    bgColor: "bg-teal-600",
    hoverBg: "hover:bg-teal-600",
  },
  {
    label: "sidebar.owners",
    icon: () => (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
        />
      </svg>
    ),
    href: "/clinic/owners",
    color: "text-green-600",
    bgColor: "bg-green-600",
    hoverBg: "hover:bg-green-600",
  },
  {
    label: "sidebar.employees",
    icon: () => (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
        />
      </svg>
    ),
    href: "/clinic/employees",
    color: "text-blue-600",
    bgColor: "bg-blue-600",
    hoverBg: "hover:bg-blue-600",
  },
  {
    label: "sidebar.animals",
    icon: () => (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v-4m6 0a2 2 0 100-4m0 4a2 2 0 100 4m0-4v-4m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v-4"
        />
      </svg>
    ),
    href: "/clinic/animals",
    color: "text-orange-500",
    bgColor: "bg-orange-500",
    hoverBg: "hover:bg-orange-500",
  },
  {
    label: "sidebar.residents",
    icon: () => (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
    href: "/clinic/residences",
    color: "text-purple-500",
    bgColor: "bg-purple-500",
    hoverBg: "hover:bg-purple-500",
  },
  {
    label: "sidebar.appointments",
    icon: () => (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    href: "/clinic/appointments",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500",
    hoverBg: "hover:bg-indigo-500",
  },
  {
    label: "sidebar.surgery_appointments",
    icon: () => (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    href: "/clinic/surgery-appointments",
    color: "text-rose-500",
    bgColor: "bg-rose-500",
    hoverBg: "hover:bg-rose-500",
  },
  {
    label: "sidebar.surgeries",
    icon: () => (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
        />
      </svg>
    ),
    href: "/clinic/surgeries",
    color: "text-red-600",
    bgColor: "bg-red-600",
    hoverBg: "hover:bg-red-600",
  },
  {
    label: "sidebar.expected_visits",
    icon: () => (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    href: "/clinic/expected-visits",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500",
    hoverBg: "hover:bg-indigo-500",
  },
  {
    label: "sidebar.examinations_list",
    icon: () => (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        />
      </svg>
    ),
    href: "/clinic/animals/examinations",
    color: "text-amber-500",
    bgColor: "bg-amber-500",
    hoverBg: "hover:bg-amber-500",
  },

  {
    label: "sidebar.statistics",
    icon: () => (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    href: "/clinic/statistics",
    color: "text-purple-600",
    bgColor: "bg-purple-600",
    hoverBg: "hover:bg-purple-600",
  },
  {
    label: "sidebar.goals",
    icon: () => (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
        />
      </svg>
    ),
    href: "/clinic/goals",
    color: "text-emerald-600",
    bgColor: "bg-emerald-600",
    hoverBg: "hover:bg-emerald-600",
  },
  {
    label: "sidebar.warehouse",
    icon: () => (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
    ),
    href: "/clinic/storage/products",
    color: "text-cyan-600",
    bgColor: "bg-cyan-600",
    hoverBg: "hover:bg-cyan-600",
  },
  {
    label: "sidebar.settings",
    icon: () => (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    href: "/clinic/settings",
    color: "text-gray-600",
    bgColor: "bg-gray-600",
    hoverBg: "hover:bg-gray-600",
  },
];

// Refactored Mobile Sidebar Component using Radix Dialog - Fixed version
function MobileSidebar({
  currentPath,
  sidebarMode,
  setSidebarMode,
  isOpen,
  setIsOpen,
}) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const toggleLanguage = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLang;
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleModeSwitch = (mode) => {
    setSidebarMode(mode);
    handleClose();
  };

  const currentRoutes =
    sidebarMode === "warehouse" ? warehouseRoutes : clinicRoutes;

  return (
    <>
      {!isOpen && (
        <button
          className="fixed top-4 right-4 z-[60] h-10 w-10 bg-white dark:bg-zinc-900 shadow-lg hover:bg-primary-50 dark:hover:bg-zinc-800 transition-all duration-300 border border-primary-200 dark:border-zinc-800 rounded-md flex items-center justify-center sm:hidden"
          onClick={() => setIsOpen(true)}
        >
          <svg
            className="h-5 w-5 text-primary-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <MobileSheet
          side={i18n.language === "ar" ? "right" : "left"}
          className={cn(
            "w-full bg-gradient-to-b from-primary-50 to-primary-100 dark:from-zinc-900 dark:to-zinc-950 border-primary-200 dark:border-zinc-800",
            i18n.language === "ar" ? "border-l" : "border-r"
          )}
        >
          <div className="h-full flex flex-col" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
            <button
              onClick={handleClose}
              className={cn(
                "absolute top-4 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-300 z-[102] bg-white dark:bg-zinc-900 shadow-sm transition-all",
                i18n.language === "ar" ? "left-4" : "right-4"
              )}
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="border-b border-primary-200 dark:border-zinc-800 bg-gradient-to-b from-primary-50 to-primary-100 dark:from-zinc-900 dark:to-zinc-950 p-4 pt-16 transition-colors">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-zinc-800 flex-shrink-0 transition-colors shadow-sm">
                  <span className="text-primary-600 font-bold text-sm">
                    {i18n.language === "ar" ? "م" : "M"}
                  </span>
                </div>
                <div
                  className={cn(
                    "grid flex-1 text-sm leading-tight",
                    i18n.language === "ar" ? "text-right" : "text-left"
                  )}
                >
                  <span className="truncate font-semibold text-primary-900 dark:text-zinc-50">
                    {t("sidebar.admin_name")}
                  </span>
                  <span className="truncate text-xs text-primary-600 dark:text-zinc-200">
                    {t("sidebar.dashboard_subtitle")}
                  </span>
                </div>
              </div>

              <div className="flex bg-white dark:bg-zinc-800 rounded-lg p-1 transition-colors">
                <button
                  onClick={() => handleModeSwitch("warehouse")}
                  className={cn(
                    "flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-300",
                    sidebarMode === "warehouse"
                      ? "bg-primary-500 text-white shadow-sm"
                      : "text-primary-700 dark:text-zinc-50 hover:bg-primary-100 dark:hover:bg-zinc-700"
                  )}
                >
                  {t("sidebar.warehouse_mode")}
                </button>
                <button
                  onClick={() => handleModeSwitch("clinic")}
                  className={cn(
                    "flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-300",
                    sidebarMode === "clinic"
                      ? "bg-primary-500 text-white shadow-sm"
                      : "text-primary-700 dark:text-zinc-50 hover:bg-primary-100 dark:hover:bg-zinc-700"
                  )}
                >
                  {t("sidebar.clinic_mode")}
                </button>
              </div>

              <div className="mt-4">
                <button
                  onClick={toggleLanguage}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-white dark:bg-zinc-800 border border-primary-200 dark:border-zinc-700 text-primary-700 dark:text-zinc-200 hover:bg-primary-50 dark:hover:bg-zinc-700 transition-all duration-300 shadow-sm"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                    />
                  </svg>
                  {t("sidebar.switch_language")}
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 sidebar-scroll">
              <div className="space-y-2">
                {currentRoutes.map((item) => {
                  const isActive = currentPath === item.href;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => handleClose()}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-300 group w-full",
                        isActive
                          ? `${item.bgColor} text-white shadow-md`
                          : `text-gray-700 dark:text-zinc-100 ${item.hoverBg} hover:text-white hover:shadow-md`,
                        i18n.language === "ar" ? "text-right" : "text-left"
                      )}
                    >
                      <span className="truncate">{t(item.label)}</span>
                      <div
                        className={cn(
                          "h-5 w-5 transition-colors duration-300 flex-shrink-0",
                          isActive
                            ? "text-white"
                            : `${item.color} group-hover:text-white`
                        )}
                      >
                        <item.icon />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-primary-200 dark:border-zinc-800 p-4 bg-gradient-to-b from-primary-50 to-primary-100 dark:from-zinc-900 dark:to-zinc-950 transition-colors">
              <button
                onClick={() => handleLogout()}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-700 dark:text-zinc-200 hover:bg-red-500 hover:text-white transition-all duration-300 w-full group",
                  i18n.language === "ar" ? "text-right" : "text-left"
                )}
              >
                <span>{t("common.logout")}</span>
                <svg
                  className="h-5 w-5 flex-shrink-0 text-red-500 group-hover:text-white transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>
          </div>
        </MobileSheet>
      </Dialog>
    </>
  );
}

export function AppSidebar({
  currentPath,
  sidebarMode,
  setSidebarMode,
  isCollapsed,
  setIsCollapsed,
}) {
  const { t, i18n } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleLanguage = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLang;
  };

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
    };
    checkMobile();
    let timeoutId;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 100);
    };
    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(timeoutId);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleModeSwitch = (mode) => {
    setSidebarMode(mode);
  };

  const currentRoutes =
    sidebarMode === "warehouse" ? warehouseRoutes : clinicRoutes;

  if (isMobile) {
    return (
      <MobileSidebar
        currentPath={currentPath}
        sidebarMode={sidebarMode}
        setSidebarMode={setSidebarMode}
        isOpen={isMobileSidebarOpen}
        setIsOpen={setIsMobileSidebarOpen}
      />
    );
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div
        className={cn(
          "h-screen flex flex-col bg-gradient-to-b from-primary-50 to-primary-100 dark:from-zinc-900 dark:to-zinc-950 border-primary-200 dark:border-zinc-800 transition-all duration-300 relative",
          i18n.language === "ar" ? "border-l" : "border-r"
        )}
        dir={i18n.language === "ar" ? "rtl" : "ltr"}
      >
        <Button
          onClick={() => setIsCollapsed(!isCollapsed)}
          variant="outline"
          size="icon"
          className={cn(
            "absolute top-1/2 -translate-y-1/2 z-50 h-6 w-6 rounded-full border border-primary-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-md hover:bg-primary-50 dark:hover:bg-zinc-800 transition-all duration-300 flex items-center justify-center",
            i18n.language === "ar" ? "-left-3" : "-right-3"
          )}
        >
          {isCollapsed ? (
            <svg className="h-3 w-3 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={i18n.language === "ar" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
            </svg>
          ) : (
            <svg className="h-3 w-3 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={i18n.language === "ar" ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
            </svg>
          )}
        </Button>

        <div className="border-b border-primary-200 dark:border-zinc-800 bg-gradient-to-b from-primary-50 to-primary-100 dark:from-zinc-900 dark:to-zinc-950 transition-colors flex-shrink-0">
          <div className={cn("flex items-center transition-all duration-300", isCollapsed ? "justify-center px-2 py-4" : "gap-2 px-4 py-4")}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-zinc-800 flex-shrink-0 transition-colors shadow-sm">
              <span className="text-primary-600 font-bold text-sm">{i18n.language === "ar" ? "م" : "M"}</span>
            </div>
            {!isCollapsed && (
              <div className={cn("grid flex-1 text-sm leading-tight", i18n.language === "ar" ? "text-right" : "text-left")}>
                <span className="truncate font-semibold text-primary-900 dark:text-zinc-50">{t("sidebar.admin_name")}</span>
                <span className="truncate text-xs text-primary-600 dark:text-zinc-200">{t("sidebar.dashboard_subtitle")}</span>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <div className="px-4 pb-4 space-y-3">
              <div className="flex bg-white dark:bg-zinc-800 rounded-lg p-1 transition-colors">
                <button
                  onClick={() => handleModeSwitch("warehouse")}
                  className={cn(
                    "flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-300",
                    sidebarMode === "warehouse" ? "bg-primary-500 text-white shadow-sm" : "text-primary-700 dark:text-zinc-50 hover:bg-primary-100 dark:hover:bg-zinc-700"
                  )}
                >
                  {t("sidebar.warehouse_mode")}
                </button>
                <button
                  onClick={() => handleModeSwitch("clinic")}
                  className={cn(
                    "flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-300",
                    sidebarMode === "clinic" ? "bg-primary-500 text-white shadow-sm" : "text-primary-700 dark:text-zinc-50 hover:bg-primary-100 dark:hover:bg-zinc-700"
                  )}
                >
                  {t("sidebar.clinic_mode")}
                </button>
              </div>

              <button
                onClick={toggleLanguage}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-white dark:bg-zinc-800 border border-primary-200 dark:border-zinc-700 text-primary-700 dark:text-zinc-50 hover:bg-primary-50 dark:hover:bg-zinc-700 transition-all duration-300 shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                {t("sidebar.switch_language")}
              </button>

              {sidebarMode === "clinic" && <div className="mt-3"><ClinicSelector /></div>}
              {sidebarMode === "warehouse" && <div className="mt-3"><StorageSelector /></div>}
            </div>
          )}

          {isCollapsed && (
            <div className="flex justify-center pb-4">
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <button onClick={toggleLanguage} className="flex items-center justify-center h-10 w-10 rounded-lg bg-white dark:bg-zinc-900 border border-primary-200 dark:border-zinc-800 text-primary-700 dark:text-zinc-50 hover:bg-primary-50 dark:hover:bg-zinc-800 transition-all duration-300 shadow-md">
                    <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                  </button>
                </TooltipTrigger>
                <TooltipContent side={i18n.language === "ar" ? "left" : "right"} className="bg-gray-900 text-white border-gray-700 font-medium text-sm">
                  {t("sidebar.switch_language")}
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-2 sidebar-scroll">
          <div className="space-y-1">
            {currentRoutes.map((item) => {
              const isActive = currentPath === item.href;
              const translatedLabel = t(item.label);
              const linkContent = (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center rounded-lg text-md font-semibold transition-all duration-300 group w-full relative",
                    isActive ? `${item.bgColor} text-white shadow-md` : `text-gray-700 dark:text-zinc-100 ${item.hoverBg} hover:text-white hover:shadow-md`,
                    isCollapsed ? "justify-center p-3 h-12" : "gap-3 px-3 py-2",
                    !isCollapsed && (i18n.language === "ar" ? "text-right" : "text-left")
                  )}
                >
                  <div className={cn("transition-colors duration-300 flex-shrink-0", isCollapsed ? "h-6 w-6" : "h-5 w-5", isActive ? "text-white" : `${item.color} group-hover:text-white`)}>
                    <item.icon />
                  </div>
                  {!isCollapsed && <span className="truncate">{translatedLabel}</span>}
                </Link>
              );

              if (isCollapsed) {
                return (
                  <Tooltip key={item.href} delayDuration={200}>
                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                    <TooltipContent side={i18n.language === "ar" ? "left" : "right"} className="bg-gray-900 text-white border-gray-700 font-medium text-sm">
                      {translatedLabel}
                    </TooltipContent>
                  </Tooltip>
                );
              }
              return linkContent;
            })}
          </div>
        </div>

        <div className="border-t border-primary-200 dark:border-zinc-800 p-2 bg-gradient-to-b from-primary-50 to-primary-100 dark:from-zinc-900 dark:to-zinc-950 transition-colors flex-shrink-0">
          {isCollapsed ? (
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <button onClick={handleLogout} className="flex items-center justify-center rounded-lg text-sm font-medium text-gray-700 dark:text-zinc-400 hover:bg-red-500 hover:text-white transition-all duration-300 w-12 h-12 group mx-auto">
                  <svg className="h-6 w-6 flex-shrink-0 text-red-500 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </TooltipTrigger>
              <TooltipContent side={i18n.language === "ar" ? "left" : "right"} className="bg-gray-900 text-white border-gray-700 font-medium text-sm">
                {t("common.logout")}
              </TooltipContent>
            </Tooltip>
          ) : (
            <button onClick={handleLogout} className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-zinc-100 hover:bg-red-500 hover:text-white transition-all duration-300 w-full group", i18n.language === "ar" ? "text-right" : "text-left")}>
              <span>{t("common.logout")}</span>
              <svg className="h-5 w-5 flex-shrink-0 text-red-500 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
