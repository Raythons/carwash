// "use client";

// import { useState, useEffect } from "react";

// export function useResponsive() {
//   const [isMobile, setIsMobile] = useState(false);
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 640);
//     };

//     checkMobile();
//     window.addEventListener("resize", checkMobile);
//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   return {
//     isMobile,
//     isCollapsed,
//     setIsCollapsed,
//   };
// }

"use client";

import { useState, useEffect } from "react";

export function useResponsive() {
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return {
    isMobile,
    isCollapsed,
    setIsCollapsed,
  };
}
