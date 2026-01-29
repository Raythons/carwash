// // "use client";

// // import { useState, useEffect } from "react";
// // import { Outlet, useLocation } from "react-router-dom";
// // import { AppSidebar } from "./AppSidebar";
// // import { DashboardNavbar } from "./DashboardNavbar";
// // import { ContentContainer } from "./ContentContainer";
// // export function Layout() {
// //   const [sidebarMode, setSidebarMode] = useState("warehouse");
// //   const [isCollapsed, setIsCollapsed] = useState(false);
// //   const [isMobile, setIsMobile] = useState(false);
// //   const location = useLocation();

// //   console.log("i loaded twice?");

// //   useEffect(() => {
// //     const checkMobile = () => {
// //       setIsMobile(window.innerWidth < 640);
// //     };

// //     checkMobile();
// //     window.addEventListener("resize", checkMobile);
// //     return () => window.removeEventListener("resize", checkMobile);
// //   }, []);

// //   // Update sidebar mode based on current path
// //   useEffect(() => {
// //     if (location.pathname.startsWith("/warehouse")) {
// //       setSidebarMode("warehouse");
// //     } else if (location.pathname.startsWith("/clinic")) {
// //       setSidebarMode("clinic");
// //     }
// //   }, [location.pathname]);

// //   // Calculate sidebar width
// //   const sidebarWidth = isMobile ? "0px" : isCollapsed ? "64px" : "280px";

// //   return (
// //     <div className="min-h-screen bg-gray-50 w-full max-w-full">
// //       <div className="flex min-h-screen  relative">
// //         {/* Fixed Sidebar Container - Responsive Width */}
// //         {!isMobile && (
// //           <div
// //             className="fixed right-0 top-0 z-50 h-screen bg-gradient-to-b from-primary-50 to-primary-100 border-l border-primary-200 transition-all duration-300 sidebar-container"
// //             style={{ width: sidebarWidth }}
// //           >
// //             <AppSidebar
// //               currentPath={location.pathname}
// //               sidebarMode={sidebarMode}
// //               setSidebarMode={setSidebarMode}
// //               isCollapsed={isCollapsed}
// //               setIsCollapsed={setIsCollapsed}
// //             />
// //           </div>
// //         )}

// //         {/* Mobile Sidebar */}
// //         {isMobile && (
// //           <AppSidebar
// //             currentPath={location.pathname}
// //             sidebarMode={sidebarMode}
// //             setSidebarMode={setSidebarMode}
// //           />
// //         )}

// //         {/* Main Content with Dynamic Right Margin */}
// //         <div
// //           className="min-h-screen transition-all duration-300 main-content w-full overflow-hidden"
// //           style={{
// //             marginRight: isMobile ? "0px" : sidebarWidth,
// //           }}
// //         >
// //           <DashboardNavbar />
// //           <main className="p-4 md:p-6 lg:p-8 overflow-x-hidden" dir="rtl">
// //             <ContentContainer>
// //               <Outlet />
// //             </ContentContainer>
// //           </main>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
// "use client"

// import { useMemo } from "react"
// import { Outlet, useLocation } from "react-router-dom"
// import { AppSidebar } from "./AppSidebar"
// import { DashboardNavbar } from "./DashboardNavbar"
// import { ContentContainer } from "./ContentContainer"
// import { useResponsive } from "../hooks/useResponsive"

// export function Layout() {
//   const location = useLocation()
//   const { isMobile, isCollapsed, setIsCollapsed } = useResponsive()

//   // Memoize sidebar mode to prevent unnecessary re-renders
//   const sidebarMode = useMemo(() => {
//     if (location.pathname.startsWith("/warehouse")) return "warehouse"
//     if (location.pathname.startsWith("/clinic")) return "clinic"
//     return "warehouse"
//   }, [location.pathname])

//   // Calculate sidebar width
//   const sidebarWidth = useMemo(() => {
//     if (isMobile) return "0px"
//     return isCollapsed ? "64px" : "280px"
//   }, [isMobile, isCollapsed])

//   return (
//     <div className="min-h-screen bg-gray-50 w-full max-w-full">
//       <div className="flex min-h-screen relative">
//         {/* Fixed Sidebar Container - Responsive Width */}
//         {!isMobile && (
//           <div
//             className="fixed right-0 top-0 z-50 h-screen bg-gradient-to-b from-primary-50 to-primary-100 border-l border-primary-200 transition-all duration-300 sidebar-container"
//             style={{ width: sidebarWidth }}
//           >
//             <AppSidebar
//               currentPath={location.pathname}
//               sidebarMode={sidebarMode}
//               setSidebarMode={() => {}} // Remove this prop since it's calculated
//               isCollapsed={isCollapsed}
//               setIsCollapsed={setIsCollapsed}
//             />
//           </div>
//         )}

//         {/* Mobile Sidebar */}
//         {isMobile && (
//           <AppSidebar
//             currentPath={location.pathname}
//             sidebarMode={sidebarMode}
//             setSidebarMode={() => {}} // Remove this prop since it's calculated
//           />
//         )}

//         {/* Main Content with Dynamic Right Margin */}
//         <div
//           className="min-h-screen transition-all duration-300 main-content w-full overflow-hidden"
//           style={{
//             marginRight: isMobile ? "0px" : sidebarWidth,
//           }}
//         >
//           <DashboardNavbar />
//           <main className="p-4 md:p-6 lg:p-8 overflow-x-hidden" dir="rtl">
//             <ContentContainer>
//               <Outlet />
//             </ContentContainer>
//           </main>
//         </div>
//       </div>
//     </div>
//   )
// }

import { useMemo, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppSidebar } from "./AppSidebar";
import { AdminSidebar } from "./AdminSidebar";
import { DashboardNavbar } from "./DashboardNavbar";
import { ContentContainer } from "./ContentContainer";
import { cn } from "../lib/utils";
import { usePermissions } from "../hooks/usePermissions";

export function Layout() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isSuperAdmin } = usePermissions();
  const superAdmin = isSuperAdmin();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(false);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const sidebarMode = useMemo(() => {
    if (location.pathname.startsWith("/clinic/storage")) return "warehouse";
    if (location.pathname.startsWith("/warehouse")) return "warehouse";
    if (location.pathname.startsWith("/clinic")) return "clinic";
    return "clinic";
  }, [location.pathname]);

  const setSidebarMode = (mode) => {
    if (mode === "warehouse") {
      navigate("/clinic/storage/statistics");
    } else if (mode === "clinic") {
      navigate("/clinic/clinics");
    }
  };

  const sidebarWidth = useMemo(() => {
    if (isMobile) return "0px";
    return isCollapsed ? "64px" : "280px";
  }, [isMobile, isCollapsed]);

  const isRTL = i18n.language === "ar";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-900 w-full max-w-full" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex min-h-screen relative">
        {!isMobile && (
          <div
            className={cn(
              "fixed top-0 z-50 h-screen transition-all duration-300 sidebar-container",
              isRTL ? "right-0" : "left-0"
            )}
            style={{ width: sidebarWidth }}
          >
            {superAdmin ? (
              <AdminSidebar
                currentPath={location.pathname}
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
              />
            ) : (
              <AppSidebar
                currentPath={location.pathname}
                sidebarMode={sidebarMode}
                setSidebarMode={setSidebarMode}
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
              />
            )}
          </div>
        )}

        {isMobile && (
          superAdmin ? (
            <AdminSidebar
              currentPath={location.pathname}
              isCollapsed={false}
              setIsCollapsed={() => {}}
            />
          ) : (
            <AppSidebar
              currentPath={location.pathname}
              sidebarMode={sidebarMode}
              setSidebarMode={setSidebarMode}
            />
          )
        )}

        <div
          className="min-h-screen transition-all duration-300 main-content w-full overflow-hidden"
          style={{
            marginRight: isRTL && !isMobile ? sidebarWidth : "0px",
            marginLeft: !isRTL && !isMobile ? sidebarWidth : "0px",
          }}
        >
          <DashboardNavbar isMobile={isMobile} />

          <main className="p-4 md:p-6 lg:p-8 overflow-x-hidden dark:bg-[#1a1a21]">
            <ContentContainer>
              <Outlet />
            </ContentContainer>
          </main>
        </div>
      </div>
    </div>
  );
}
