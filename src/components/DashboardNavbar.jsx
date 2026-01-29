// import { Button } from "./ui/Button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "./ui/DropdownMenu"

// export function DashboardNavbar() {
//   return (
//     <header className="sticky top-0 z-40 w-full border-b border-primary-200 bg-white/95 backdrop-blur">
//       <div className="flex h-16 items-center justify-between px-4 md:px-6 lg:px-8 w-full" dir="rtl">
//         <div className="flex items-center gap-4">
//           <div className="flex items-center gap-2">
//             <h1 className="text-xl font-bold text-primary-900 sm:block hidden">لوحة تحكم</h1>
//             <h1 className="text-lg font-bold text-primary-900 sm:hidden block mr-16">لوحة التحكم</h1>
//           </div>
//         </div>

//         <div className="flex items-center gap-4">
//           {/* Search */}
//           <div className="relative hidden md:block">
//             <svg
//               className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-500"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//               />
//             </svg>
//             <input
//               placeholder="بحث..."
//               className="w-64 pr-10 pl-3 py-2 border border-primary-200 rounded-md focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all duration-300"
//             />
//           </div>

//           {/* User Menu */}
//           <DropdownMenu>
//             <DropdownMenuTrigger>
//               <Button variant="ghost" size="icon" className="hover:bg-primary-100 transition-colors duration-300">
//                 <svg className="h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                   />
//                 </svg>
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-56">
//               <DropdownMenuLabel>حسابي</DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem>الملف الشخصي</DropdownMenuItem>
//               <DropdownMenuItem>الإعدادات</DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem>تسجيل الخروج</DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>
//     </header>
//   )
// }

import { Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu";
import UserProfile from "./auth/UserProfile";
import { ThemeToggle } from "./ThemeToggle";

export function DashboardNavbar({ onMobileSidebarToggle, isMobile }) {
  const { t, i18n } = useTranslation();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-primary-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur">
      <div
        className="flex h-16 items-center justify-between px-4 md:px-6 lg:px-8 w-full"
        dir={i18n.language === "ar" ? "rtl" : "ltr"}
      >
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              onClick={onMobileSidebarToggle}
              className="p-2 rounded-lg hover:bg-primary-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Toggle mobile sidebar"
            >
              <Menu className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-primary-900 dark:text-zinc-100 sm:block hidden">
              {t("sidebar.dashboard_subtitle")}
            </h1>
            <h1 className="text-lg font-bold text-primary-900 dark:text-zinc-100 sm:hidden block mr-16">
              {t("sidebar.dashboard_subtitle")}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          {/* Search */}

          {/* User Profile */}
          {/* <UserProfile /> */}
        </div>
      </div>
    </header>
  );
}
