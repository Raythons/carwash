// "use client"

// import { useState } from "react"
// import { useNavigate } from "react-router-dom"
// import { useTranslation } from "react-i18next"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
// import { Skeleton } from "@/components/ui/Skeleton"
// import {
//   Package,
//   TrendingUp,
//   DollarSign,
//   ShoppingCart,
//   AlertCircle,
//   BarChart3,
//   CalendarIcon,
//   ArrowRight,
//   Info,
// } from "lucide-react"
// import { formatNumberWithThousands } from "@/utilities/number"
// import { CURRENCY } from "@/constants/currency"
// import { useStorageStatistics } from "@/hooks/queries/useStorageQueries"
// import { Button } from "@/components/ui/button"
// import { Calendar } from "@/components/ui/calendar"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip"
// import { toDateOnly } from "@/utilities/date"

// export function StorageStatistics() {
//   const navigate = useNavigate()
//   const { t, i18n } = useTranslation()
//   const [timeRange, setTimeRange] = useState("all") // all, year, month, week, custom
//   const [customStartDate, setCustomStartDate] = useState(null)
//   const [customEndDate, setCustomEndDate] = useState(null)
//   const [startDateOpen, setStartDateOpen] = useState(false)
//   const [endDateOpen, setEndDateOpen] = useState(false)

//   // Fetch storage statistics using centralized hook
//   const { data: stats, isLoading } = useStorageStatistics(timeRange, customStartDate, customEndDate)

//   if (isLoading) {
//     return (
//       <div className="space-y-6">
//         <Skeleton className="h-8 w-64" />
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {[1, 2, 3, 4].map((i) => (
//             <Skeleton key={i} className="h-32" />
//           ))}
//         </div>
//       </div>
//     )
//   }

//   const metrics = stats || {
//     totalRevenue: 0,
//     totalProfit: 0,
//     totalItemsSold: 0,
//     totalDeals: 0,
//     topSellingProducts: [],
//     topProfitableProducts: [],
//     lowStockProducts: [],
//     recentDeals: [],
//   }

//   // Compact formatter for very large numbers (Arabic compact: مليون, مليار)
//   // Returns { compact, full } where `compact` is the short display and `full` is the full formatted number
//   const formatCompactNumber = (value) => {
//     if (value === null || value === undefined || value === "") return { compact: "0", full: "0" }
//     const num = Number(value)
//     if (Number.isNaN(num)) return { compact: String(value), full: String(value) }

//     const abs = Math.abs(num)
//     // billions / مليار: one decimal in compact, full preserves up to 2 decimals
//     if (abs >= 1_000_000_000) {
//       const compact = `${(num / 1_000_000_000).toFixed(1).replace(/\.0$/, "")} مليار`
//       const full = Number.isInteger(num) ? formatNumberWithThousands(num) : formatNumberWithThousands(num.toFixed(2))
//       return { compact, full }
//     }

//     // millions / مليون: one decimal in compact, full preserves up to 2 decimals
//     if (abs >= 1_000_000) {
//       const compact = `${(num / 1_000_000).toFixed(1).replace(/\.0$/, "")} مليون`
//       const full = Number.isInteger(num) ? formatNumberWithThousands(num) : formatNumberWithThousands(num.toFixed(2))
//       return { compact, full }
//     }

//     // thousands: preserve decimals up to 2 places
//     if (abs >= 1000) {
//       const compact = Number.isInteger(num)
//         ? formatNumberWithThousands(Math.round(num))
//         : formatNumberWithThousands(num.toFixed(2))
//       const full = Number.isInteger(num) ? formatNumberWithThousands(num) : formatNumberWithThousands(num.toFixed(2))
//       return { compact, full }
//     }

//     const full = Number.isInteger(num) ? formatNumberWithThousands(num) : formatNumberWithThousands(num.toFixed(2))
//     return { compact: full, full }
//   }

//   return (
//     <div className="space-y-6" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">{t("storage.statistics.title")}</h1>
//           <p className="text-gray-600 dark:text-zinc-400 mt-1">{t("storage.statistics.subtitle")}</p>
//         </div>

//         {/* Time Range Filter */}
//         <div className="flex flex-col gap-3">
//           <div className="flex gap-2 bg-white dark:bg-zinc-800 rounded-lg p-1 border border-gray-200 dark:border-zinc-700 flex-wrap">
//             <button
//               onClick={() => setTimeRange("week")}
//               className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
//                 timeRange === "week"
//                   ? "bg-primary-500 text-white"
//                   : "text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700"
//               }`}
//             >
//               {t("storage.statistics.filters.week")}
//             </button>
//             <button
//               onClick={() => setTimeRange("month")}
//               className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
//                 timeRange === "month"
//                   ? "bg-primary-500 text-white"
//                   : "text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700"
//               }`}
//             >
//               {t("storage.statistics.filters.month")}
//             </button>
//             <button
//               onClick={() => setTimeRange("year")}
//               className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
//                 timeRange === "year"
//                   ? "bg-primary-500 text-white"
//                   : "text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700"
//               }`}
//             >
//               {t("storage.statistics.filters.year")}
//             </button>
//             <button
//               onClick={() => setTimeRange("all")}
//               className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
//                 timeRange === "all"
//                   ? "bg-primary-500 text-white"
//                   : "text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700"
//               }`}
//             >
//               {t("storage.statistics.filters.all")}
//             </button>
//             <button
//               onClick={() => setTimeRange("custom")}
//               className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
//                 timeRange === "custom"
//                   ? "bg-primary-500 text-white"
//                   : "text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700"
//               }`}
//             >
//               {t("storage.statistics.filters.custom")}
//             </button>
//           </div>

//           {/* Custom Date Range Picker */}
//           {timeRange === "custom" && (
//             <div className="flex gap-3 items-center bg-white dark:bg-zinc-800 rounded-lg p-3 border border-gray-200 dark:border-zinc-700">
//               <div className="flex flex-col gap-2">
//                 <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
//                   {t("storage.statistics.date_picker.from")}
//                 </label>
//                 <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
//                   <PopoverTrigger asChild>
//                     <Button variant="outline" className="w-[200px] justify-between font-normal bg-transparent">
//                       {customStartDate
//                         ? new Date(customStartDate).toLocaleDateString("en-SA")
//                         : t("storage.statistics.date_picker.select_start")}
//                       <CalendarIcon className="h-4 w-4" />
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-auto p-0">
//                     <Calendar
//                       mode="single"
//                       selected={customStartDate ? new Date(customStartDate) : undefined}
//                       onSelect={(date) => {
//                         if (date) setCustomStartDate(toDateOnly(date))
//                         setStartDateOpen(false)
//                       }}
//                     />
//                   </PopoverContent>
//                 </Popover>
//               </div>

//               <div className="flex flex-col gap-2">
//                 <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
//                   {t("storage.statistics.date_picker.to")}
//                 </label>
//                 <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
//                   <PopoverTrigger asChild>
//                     <Button variant="outline" className="w-[200px] justify-between font-normal bg-transparent">
//                       {customEndDate
//                         ? new Date(customEndDate).toLocaleDateString("en-SA")
//                         : t("storage.statistics.date_picker.select_end")}
//                       <CalendarIcon className="h-4 w-4" />
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-auto p-0">
//                     <Calendar
//                       mode="single"
//                       selected={customEndDate ? new Date(customEndDate) : undefined}
//                       onSelect={(date) => {
//                         if (date) setCustomEndDate(toDateOnly(date))
//                         setEndDateOpen(false)
//                       }}
//                       disabled={(date) => customStartDate && date < new Date(customStartDate)}
//                     />
//                   </PopoverContent>
//                 </Popover>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Key Metrics Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {/* Total Revenue */}
//         <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-green-900 dark:text-green-100">
//               {t("storage.statistics.metrics.revenue.title")}
//             </CardTitle>
//             <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-green-900 dark:text-green-100 break-words">
//               {(() => {
//                 const { compact, full } = formatCompactNumber(metrics.totalRevenue)
//                 const showInfo = String(metrics.totalRevenue) && Math.abs(Number(metrics.totalRevenue)) >= 1_000_000
//                 return (
//                   <span className="inline-flex items-center gap-2">
//                     {showInfo ? (
//                       <TooltipProvider delayDuration={150}>
//                         <Tooltip>
//                           <TooltipTrigger asChild>
//                             <button
//                               type="button"
//                               aria-label={full}
//                               className="h-6 w-6 flex items-center justify-center text-blue-500 hover:bg-blue-50 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
//                             >
//                               <Info className="h-4 w-4" />
//                             </button>
//                           </TooltipTrigger>
//                           <TooltipContent side="top" className="max-w-[360px] whitespace-normal break-words text-right">
//                             {full} {CURRENCY.SHORT_NAME}
//                           </TooltipContent>
//                         </Tooltip>
//                       </TooltipProvider>
//                     ) : null}
//                     <span>{compact}</span>
//                     <span className="text-sm align-middle">{CURRENCY.SHORT_NAME}</span>
//                   </span>
//                 )
//               })()}
//             </div>
//             <p className="text-xs text-green-700 dark:text-green-300 mt-1">
//               {t("storage.statistics.metrics.revenue.desc")}
//             </p>
//           </CardContent>
//         </Card>

//         {/* Total Profit */}
//         <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">
//               {t("storage.statistics.metrics.profit.title")}
//             </CardTitle>
//             <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-blue-900 dark:text-blue-100 break-words">
//               {(() => {
//                 const { compact, full } = formatCompactNumber(metrics.totalProfit)
//                 const showInfo = String(metrics.totalProfit) && Math.abs(Number(metrics.totalProfit)) >= 1_000_000
//                 return (
//                   <span className="inline-flex items-center gap-2">
//                     {showInfo ? (
//                       <TooltipProvider delayDuration={150}>
//                         <Tooltip>
//                           <TooltipTrigger asChild>
//                             <button
//                               type="button"
//                               aria-label={full}
//                               className="h-6 w-6 flex items-center justify-center text-blue-500 hover:bg-blue-50 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
//                             >
//                               <Info className="h-4 w-4" />
//                             </button>
//                           </TooltipTrigger>
//                           <TooltipContent side="top" className="max-w-[360px] whitespace-normal break-words text-right">
//                             {full} {CURRENCY.SHORT_NAME}
//                           </TooltipContent>
//                         </Tooltip>
//                       </TooltipProvider>
//                     ) : null}
//                     <span>{compact}</span>
//                     <span className="text-sm align-middle">{CURRENCY.SHORT_NAME}</span>
//                   </span>
//                 )
//               })()}
//             </div>
//             <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
//               {t("storage.statistics.metrics.profit.desc")}
//             </p>
//           </CardContent>
//         </Card>

//         {/* Total Items Sold */}
//         <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-purple-900 dark:text-purple-100">
//               {t("storage.statistics.metrics.items_sold.title")}
//             </CardTitle>
//             <Package className="h-5 w-5 text-purple-600 dark:text-purple-400" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-purple-900 dark:text-purple-100 break-words">
//               {(() => {
//                 const { compact, full } = formatCompactNumber(metrics.totalItemsSold)
//                 const showInfo = String(metrics.totalItemsSold) && Math.abs(Number(metrics.totalItemsSold)) >= 1_000_000
//                 return (
//                   <span className="inline-flex items-center gap-2">
//                     {showInfo ? (
//                       <TooltipProvider delayDuration={150}>
//                         <Tooltip>
//                           <TooltipTrigger asChild>
//                             <button
//                               type="button"
//                               aria-label={full}
//                               className="h-6 w-6 flex items-center justify-center text-blue-500 hover:bg-blue-50 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
//                             >
//                               <Info className="h-4 w-4" />
//                             </button>
//                           </TooltipTrigger>
//                           <TooltipContent side="top" className="max-w-[360px] whitespace-normal break-words text-right">
//                             {full}
//                           </TooltipContent>
//                         </Tooltip>
//                       </TooltipProvider>
//                     ) : null}
//                     <span>{compact}</span>
//                   </span>
//                 )
//               })()}
//             </div>
//             <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
//               {t("storage.statistics.metrics.items_sold.desc")}
//             </p>
//           </CardContent>
//         </Card>

//         {/* Total Deals */}
//         <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-orange-900 dark:text-orange-100">
//               {t("storage.statistics.metrics.deals.title")}
//             </CardTitle>
//             <ShoppingCart className="h-5 w-5 text-orange-600 dark:text-orange-400" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-orange-900 dark:text-orange-100 break-words">
//               {(() => {
//                 const { compact, full } = formatCompactNumber(metrics.totalDeals)
//                 const showInfo = String(metrics.totalDeals) && Math.abs(Number(metrics.totalDeals)) >= 1_000_000
//                 return (
//                   <span className="inline-flex items-center gap-2">
//                     {showInfo ? (
//                       <TooltipProvider delayDuration={150}>
//                         <Tooltip>
//                           <TooltipTrigger asChild>
//                             <button
//                               type="button"
//                               aria-label={full}
//                               className="h-6 w-6 flex items-center justify-center text-blue-500 hover:bg-blue-50 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
//                             >
//                               <Info className="h-4 w-4" />
//                             </button>
//                           </TooltipTrigger>
//                           <TooltipContent side="top" className="max-w-[360px] whitespace-normal break-words text-right">
//                             {full}
//                           </TooltipContent>
//                         </Tooltip>
//                       </TooltipProvider>
//                     ) : null}
//                     <span>{compact}</span>
//                   </span>
//                 )
//               })()}
//             </div>
//             <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
//               {t("storage.statistics.metrics.deals.desc")}
//             </p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Charts and Tables Row */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Top Selling Products */}
//         <Card>
//           <CardHeader>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <BarChart3 className="h-5 w-5 text-primary-600" />
//                 <CardTitle>{t("storage.statistics.sections.top_selling")}</CardTitle>
//               </div>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() =>
//                   navigate("/clinic/storage/statistics/top-selling", {
//                     state: { timeRange, customStartDate, customEndDate },
//                   })
//                 }
//                 className="text-primary-600 hover:text-primary-700 hover:bg-primary-50"
//               >
//                 {t("storage.statistics.actions.view_all")}
//                 <ArrowRight className="h-4 w-4 mr-1" />
//               </Button>
//             </div>
//           </CardHeader>
//           <CardContent>
//             {metrics.topSellingProducts?.length > 0 ? (
//               <div className="space-y-4">
//                 {metrics.topSellingProducts.map((product, index) => (
//                   <div key={product.id} className="flex items-center gap-4">
//                     <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold">
//                       {index + 1}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="font-medium text-gray-900 dark:text-zinc-100 truncate">{product.name}</p>
//                       <p className="text-sm text-gray-600 dark:text-zinc-400">{product.categoryName}</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="font-bold text-primary-600 dark:text-primary-400">{product.totalSold}</p>
//                       <p className="text-xs text-gray-600 dark:text-zinc-400">{t("storage.statistics.labels.unit")}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-8 text-gray-500 dark:text-zinc-400">
//                 <Package className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-zinc-600" />
//                 <p>{t("storage.statistics.empty.no_sales")}</p>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Top Profitable Products */}
//         <Card>
//           <CardHeader>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <TrendingUp className="h-5 w-5 text-green-600" />
//                 <CardTitle>{t("storage.statistics.sections.top_profitable")}</CardTitle>
//               </div>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() =>
//                   navigate("/clinic/storage/statistics/top-profitable", {
//                     state: { timeRange, customStartDate, customEndDate },
//                   })
//                 }
//                 className="text-green-600 hover:text-green-700 hover:bg-green-50"
//               >
//                 {t("storage.statistics.actions.view_all")}
//                 <ArrowRight className="h-4 w-4 mr-1" />
//               </Button>
//             </div>
//           </CardHeader>
//           <CardContent>
//             {metrics.topProfitableProducts?.length > 0 ? (
//               <div className="space-y-4">
//                 {metrics.topProfitableProducts.map((product, index) => (
//                   <div key={product.id} className="flex items-center gap-4">
//                     <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center font-bold">
//                       {index + 1}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="font-medium text-gray-900 dark:text-zinc-100 truncate">{product.name}</p>
//                       <p className="text-sm text-gray-600 dark:text-zinc-400">
//                         {t("storage.statistics.labels.profit_margin")}: {product.profitMargin.toFixed(2)}%
//                       </p>
//                     </div>
//                     <div className="text-right">
//                       <p className="font-bold text-green-600 dark:text-green-400">
//                         {formatNumberWithThousands(product.totalProfit.toFixed(2))} {CURRENCY.SHORT_NAME}
//                       </p>
//                       <p className="text-xs text-gray-600 dark:text-zinc-400">{t("storage.statistics.labels.profit")}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-8 text-gray-500 dark:text-zinc-400">
//                 <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-zinc-600" />
//                 <p>{t("storage.statistics.empty.no_profit")}</p>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Low Stock Alert */}
//       <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-900">
//         <CardHeader>
//           <div className="flex items-center gap-2">
//             <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
//             <CardTitle className="text-red-900 dark:text-red-100">
//               {t("storage.statistics.sections.low_stock")}
//             </CardTitle>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {metrics.lowStockVariants?.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {metrics.lowStockVariants.map((variant) => (
//                 <div
//                   key={variant.variantId}
//                   onClick={() => navigate(`/clinic/storage/products/${variant.productId}`)}
//                   className="bg-white dark:bg-zinc-800 rounded-lg p-4 border border-red-200 dark:border-red-800 cursor-pointer hover:border-red-300 dark:hover:border-red-900 hover:shadow-md transition-all"
//                 >
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1 min-w-0">
//                       <p className="font-medium text-gray-900 dark:text-zinc-100 truncate">{variant.productName}</p>
//                       <p className="text-sm text-gray-600 dark:text-zinc-400">{variant.variantName}</p>
//                       <p className="text-xs text-gray-500 dark:text-zinc-600 mt-1">{variant.categoryName}</p>
//                     </div>
//                     <span className="flex-shrink-0 px-2 py-1 text-xs font-medium bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100 rounded">
//                       {variant.currentStock} {t("storage.statistics.labels.remaining")}
//                     </span>
//                   </div>
//                   <div className="mt-2 text-xs text-gray-600 dark:text-zinc-400">
//                     {t("storage.statistics.labels.min_level")}: {variant.minStockLevel}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-8 text-gray-600 dark:text-zinc-400">
//               <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-zinc-600" />
//               <p>{t("storage.statistics.empty.safe_level")}</p>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Recent Deals */}
//       <Card>
//         <CardHeader>
//           <div className="flex items-center gap-2">
//             <ShoppingCart className="h-5 w-5 text-primary-600" />
//             <CardTitle>{t("storage.statistics.sections.recent_deals")}</CardTitle>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {metrics.recentDeals?.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50 dark:bg-zinc-900">
//                   <tr>
//                     <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-zinc-300">
//                       {t("storage.statistics.table.deal_number")}
//                     </th>
//                     <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-zinc-300">
//                       {t("storage.statistics.table.supplier")}
//                     </th>
//                     <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-zinc-300">
//                       {t("storage.statistics.table.date")}
//                     </th>
//                     <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-zinc-300">
//                       {t("storage.statistics.table.items_count")}
//                     </th>
//                     <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-zinc-300">
//                       {t("storage.statistics.table.cost")}
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
//                   {metrics.recentDeals.map((deal) => (
//                     <tr
//                       key={deal.id}
//                       className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors"
//                       onClick={() => navigate(`/clinic/storage/deals/${deal.id}`)}
//                     >
//                       <td className="px-4 py-3 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
//                         {deal.dealNumber}
//                       </td>
//                       <td className="px-4 py-3 text-sm text-gray-900 dark:text-zinc-100">{deal.supplierName}</td>
//                       <td className="px-4 py-3 text-sm text-gray-600 dark:text-zinc-400">
//                         {new Date(deal.dealDate).toLocaleDateString("en-SA")}
//                       </td>
//                       <td className="px-4 py-3 text-sm text-gray-600 dark:text-zinc-400">{deal.itemCount}</td>
//                       <td className="px-4 py-3 text-sm font-semibold text-green-600 dark:text-green-400">
//                         {formatNumberWithThousands(deal.totalCost)} {CURRENCY.SHORT_NAME}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="text-center py-8 text-gray-500 dark:text-zinc-400">
//               <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-zinc-600" />
//               <p>{t("storage.statistics.empty.no_deals")}</p>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Skeleton } from "@/components/ui/Skeleton"
import {
  Package,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  AlertCircle,
  BarChart3,
  CalendarIcon,
  ArrowRight,
  Info,
} from "lucide-react"
import { formatNumberWithThousands } from "@/utilities/number"
import { CURRENCY } from "@/constants/currency"
import { useStorageStatistics } from "@/hooks/queries/useStorageQueries"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip"
import { toDateOnly } from "@/utilities/date"

export function StorageStatistics() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const [timeRange, setTimeRange] = useState("all") // all, year, month, week, custom
  const [customStartDate, setCustomStartDate] = useState(null)
  const [customEndDate, setCustomEndDate] = useState(null)
  const [startDateOpen, setStartDateOpen] = useState(false)
  const [endDateOpen, setEndDateOpen] = useState(false)

  // Fetch storage statistics using centralized hook
  const { data: stats, isLoading } = useStorageStatistics(timeRange, customStartDate, customEndDate)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    )
  }

  const metrics = stats || {
    totalRevenue: 0,
    totalProfit: 0,
    totalItemsSold: 0,
    totalDeals: 0,
    topSellingProducts: [],
    topProfitableProducts: [],
    lowStockProducts: [],
    recentDeals: [],
  }

  const formatCompactNumber = (value) => {
    if (value === null || value === undefined || value === "") return { compact: "0", full: "0" }
    const num = Number(value)
    if (Number.isNaN(num)) return { compact: String(value), full: String(value) }

    const abs = Math.abs(num)
    if (abs >= 1_000_000_000) {
      const compact = `${(num / 1_000_000_000).toFixed(1).replace(/\.0$/, "")} مليار`
      const full = Number.isInteger(num) ? formatNumberWithThousands(num) : formatNumberWithThousands(num.toFixed(2))
      return { compact, full }
    }

    if (abs >= 1_000_000) {
      const compact = `${(num / 1_000_000).toFixed(1).replace(/\.0$/, "")} مليون`
      const full = Number.isInteger(num) ? formatNumberWithThousands(num) : formatNumberWithThousands(num.toFixed(2))
      return { compact, full }
    }

    if (abs >= 1000) {
      const compact = Number.isInteger(num)
        ? formatNumberWithThousands(Math.round(num))
        : formatNumberWithThousands(num.toFixed(2))
      const full = Number.isInteger(num) ? formatNumberWithThousands(num) : formatNumberWithThousands(num.toFixed(2))
      return { compact, full }
    }

    const full = Number.isInteger(num) ? formatNumberWithThousands(num) : formatNumberWithThousands(num.toFixed(2))
    return { compact: full, full }
  }

  return (
    <div className="space-y-6" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">{t("storage.statistics.title")}</h1>
          <p className="text-gray-600 dark:text-zinc-400 mt-1">{t("storage.statistics.subtitle")}</p>
        </div>

        {/* Time Range Filter */}
        <div className="flex flex-col gap-3">
          <div className="flex gap-2 bg-white dark:bg-zinc-900 rounded-lg p-1 border border-gray-200 dark:border-zinc-800 flex-wrap">
            {["week", "month", "year", "all", "custom"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  timeRange === range
                    ? "bg-primary-500 text-white dark:bg-zinc-700 dark:text-zinc-100 shadow-sm"
                    : "text-gray-700 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800"
                }`}
              >
                {t(`storage.statistics.filters.${range}`)}
              </button>
            ))}
          </div>

          {/* Custom Date Range Picker */}
          {timeRange === "custom" && (
            <div className="flex gap-3 items-center bg-white dark:bg-zinc-900 rounded-lg p-3 border border-gray-200 dark:border-zinc-800">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                  {t("storage.statistics.date_picker.from")}
                </label>
                <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[200px] justify-between font-normal bg-transparent dark:border-zinc-700 dark:text-zinc-200">
                      {customStartDate
                        ? new Date(customStartDate).toLocaleDateString("en-SA")
                        : t("storage.statistics.date_picker.select_start")}
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 dark:bg-zinc-900 dark:border-zinc-800">
                    <Calendar
                      mode="single"
                      selected={customStartDate ? new Date(customStartDate) : undefined}
                      onSelect={(date) => {
                        if (date) setCustomStartDate(toDateOnly(date))
                        setStartDateOpen(false)
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                  {t("storage.statistics.date_picker.to")}
                </label>
                <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[200px] justify-between font-normal bg-transparent dark:border-zinc-700 dark:text-zinc-200">
                      {customEndDate
                        ? new Date(customEndDate).toLocaleDateString("en-SA")
                        : t("storage.statistics.date_picker.select_end")}
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 dark:bg-zinc-900 dark:border-zinc-800">
                    <Calendar
                      mode="single"
                      selected={customEndDate ? new Date(customEndDate) : undefined}
                      onSelect={(date) => {
                        if (date) setCustomEndDate(toDateOnly(date))
                        setEndDateOpen(false)
                      }}
                      disabled={(date) => customStartDate && date < new Date(customStartDate)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-zinc-900 dark:to-zinc-900 dark:border-zinc-800 dark:border-l-4 dark:border-l-emerald-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-900 dark:text-zinc-400">
              {t("storage.statistics.metrics.revenue.title")}
            </CardTitle>
            <DollarSign className="h-5 w-5 text-green-600 dark:text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-zinc-100 break-words">
              {(() => {
                const { compact, full } = formatCompactNumber(metrics.totalRevenue)
                const showInfo = String(metrics.totalRevenue) && Math.abs(Number(metrics.totalRevenue)) >= 1_000_000
                return (
                  <span className="inline-flex items-center gap-2">
                    {showInfo && (
                      <TooltipProvider delayDuration={150}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button type="button" className="h-6 w-6 flex items-center justify-center text-blue-500 dark:text-zinc-500 hover:opacity-80">
                              <Info className="h-4 w-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="dark:bg-zinc-800 dark:border-zinc-700 text-right">
                            {full} {CURRENCY.SHORT_NAME}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    <span>{compact}</span>
                    <span className="text-sm align-middle opacity-70 ml-1">{CURRENCY.SHORT_NAME}</span>
                  </span>
                )
              })()}
            </div>
            <p className="text-xs text-green-700 dark:text-emerald-500/80 mt-1">{t("storage.statistics.metrics.revenue.desc")}</p>
          </CardContent>
        </Card>

        {/* Total Profit */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-zinc-900 dark:to-zinc-900 dark:border-zinc-800 dark:border-l-4 dark:border-l-blue-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-900 dark:text-zinc-400">
              {t("storage.statistics.metrics.profit.title")}
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-zinc-100 break-words">
              {(() => {
                const { compact, full } = formatCompactNumber(metrics.totalProfit)
                const showInfo = String(metrics.totalProfit) && Math.abs(Number(metrics.totalProfit)) >= 1_000_000
                return (
                  <span className="inline-flex items-center gap-2">
                    {showInfo && (
                      <TooltipProvider delayDuration={150}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button type="button" className="h-6 w-6 flex items-center justify-center text-blue-500 dark:text-zinc-500 hover:opacity-80">
                              <Info className="h-4 w-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="dark:bg-zinc-800 dark:border-zinc-700 text-right">
                            {full} {CURRENCY.SHORT_NAME}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    <span>{compact}</span>
                    <span className="text-sm align-middle opacity-70 ml-1">{CURRENCY.SHORT_NAME}</span>
                  </span>
                )
              })()}
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-500/80 mt-1">{t("storage.statistics.metrics.profit.desc")}</p>
          </CardContent>
        </Card>

        {/* Total Items Sold */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 dark:from-zinc-900 dark:to-zinc-900 dark:border-zinc-800 dark:border-l-4 dark:border-l-purple-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-purple-900 dark:text-zinc-400">
              {t("storage.statistics.metrics.items_sold.title")}
            </CardTitle>
            <Package className="h-5 w-5 text-purple-600 dark:text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-zinc-100 break-words">
              {(() => {
                const { compact, full } = formatCompactNumber(metrics.totalItemsSold)
                const showInfo = String(metrics.totalItemsSold) && Math.abs(Number(metrics.totalItemsSold)) >= 1_000_000
                return (
                  <span className="inline-flex items-center gap-2">
                    {showInfo && (
                      <TooltipProvider delayDuration={150}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button type="button" className="h-6 w-6 flex items-center justify-center text-blue-500 dark:text-zinc-500 hover:opacity-80">
                              <Info className="h-4 w-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="dark:bg-zinc-800 dark:border-zinc-700 text-right">
                            {full}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    <span>{compact}</span>
                  </span>
                )
              })()}
            </div>
            <p className="text-xs text-purple-700 dark:text-purple-500/80 mt-1">{t("storage.statistics.metrics.items_sold.desc")}</p>
          </CardContent>
        </Card>

        {/* Total Deals */}
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 dark:from-zinc-900 dark:to-zinc-900 dark:border-zinc-800 dark:border-l-4 dark:border-l-orange-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-orange-900 dark:text-zinc-400">
              {t("storage.statistics.metrics.deals.title")}
            </CardTitle>
            <ShoppingCart className="h-5 w-5 text-orange-600 dark:text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-zinc-100 break-words">
              {(() => {
                const { compact, full } = formatCompactNumber(metrics.totalDeals)
                const showInfo = String(metrics.totalDeals) && Math.abs(Number(metrics.totalDeals)) >= 1_000_000
                return (
                  <span className="inline-flex items-center gap-2">
                    {showInfo && (
                      <TooltipProvider delayDuration={150}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button type="button" className="h-6 w-6 flex items-center justify-center text-blue-500 dark:text-zinc-500 hover:opacity-80">
                              <Info className="h-4 w-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="dark:bg-zinc-800 dark:border-zinc-700 text-right">
                            {full}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    <span>{compact}</span>
                  </span>
                )
              })()}
            </div>
            <p className="text-xs text-orange-700 dark:text-orange-500/80 mt-1">{t("storage.statistics.metrics.deals.desc")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <Card className="dark:bg-zinc-900 dark:border-zinc-800 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary-600 dark:text-zinc-400" />
                <CardTitle className="dark:text-zinc-100">{t("storage.statistics.sections.top_selling")}</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  navigate("/clinic/storage/statistics/top-selling", {
                    state: { timeRange, customStartDate, customEndDate },
                  })
                }
                className="text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/30 dark:hover:text-blue-300"
              >
                {t("storage.statistics.actions.view_all")}
                <ArrowRight className="h-4 w-4 mr-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {metrics.topSellingProducts?.length > 0 ? (
              <div className="space-y-4">
                {metrics.topSellingProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center gap-4 p-1 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-zinc-800 text-primary-600 dark:text-zinc-400 border dark:border-zinc-700 flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-zinc-200 truncate">{product.name}</p>
                      <p className="text-sm text-gray-600 dark:text-zinc-500">{product.categoryName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary-600 dark:text-zinc-100">{product.totalSold}</p>
                      <p className="text-xs text-gray-600 dark:text-zinc-500">{t("storage.statistics.labels.unit")}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-zinc-600">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>{t("storage.statistics.empty.no_sales")}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Profitable Products */}
        <Card className="dark:bg-zinc-900 dark:border-zinc-800 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-zinc-400" />
                <CardTitle className="dark:text-zinc-100">{t("storage.statistics.sections.top_profitable")}</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  navigate("/clinic/storage/statistics/top-profitable", {
                    state: { timeRange, customStartDate, customEndDate },
                  })
                }
                className="text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/30 dark:hover:text-blue-300"
              >
                {t("storage.statistics.actions.view_all")}
                <ArrowRight className="h-4 w-4 mr-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {metrics.topProfitableProducts?.length > 0 ? (
              <div className="space-y-4">
                {metrics.topProfitableProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center gap-4 p-1 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-zinc-800 text-green-600 dark:text-zinc-400 border dark:border-zinc-700 flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-zinc-200 truncate">{product.name}</p>
                      <p className="text-sm text-gray-600 dark:text-zinc-500">
                        {t("storage.statistics.labels.profit_margin")}: {product.profitMargin.toFixed(2)}%
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600 dark:text-emerald-500">
                        {formatNumberWithThousands(product.totalProfit.toFixed(2))}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-zinc-500">{CURRENCY.SHORT_NAME}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-zinc-600">
                <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>{t("storage.statistics.empty.no_profit")}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      <Card className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/50 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-500" />
            <CardTitle className="text-red-900 dark:text-red-200">
              {t("storage.statistics.sections.low_stock")}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {metrics.lowStockVariants?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {metrics.lowStockVariants.map((variant) => (
                <div
                  key={variant.variantId}
                  onClick={() => navigate(`/clinic/storage/products/${variant.productId}`)}
                  className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-red-200 dark:border-red-900/40 cursor-pointer hover:shadow-md dark:hover:bg-zinc-800 transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-zinc-100 truncate group-hover:text-red-600 dark:group-hover:text-red-400">{variant.productName}</p>
                      <p className="text-sm text-gray-600 dark:text-zinc-400">{variant.variantName}</p>
                    </div>
                    <span className="flex-shrink-0 px-2 py-1 text-xs font-bold bg-red-100 dark:bg-red-500/10 text-red-800 dark:text-red-400 border dark:border-red-500/20 rounded">
                      {variant.currentStock} {t("storage.statistics.labels.remaining")}
                    </span>
                  </div>
                  <div className="mt-3 text-xs text-gray-500 dark:text-zinc-500 flex justify-between">
                    <span>{variant.categoryName}</span>
                    <span className="dark:text-zinc-400">{t("storage.statistics.labels.min_level")}: {variant.minStockLevel}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-600 dark:text-zinc-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>{t("storage.statistics.empty.safe_level")}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Deals */}
      <Card className="dark:bg-zinc-900 dark:border-zinc-800 shadow-sm overflow-hidden">
        <CardHeader className="dark:border-b dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary-600 dark:text-zinc-400" />
            <CardTitle className="dark:text-zinc-100">{t("storage.statistics.sections.recent_deals")}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {metrics.recentDeals?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-gray-50 dark:bg-zinc-950">
                  <tr>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-zinc-500">{t("storage.statistics.table.deal_number")}</th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-zinc-500">{t("storage.statistics.table.supplier")}</th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-zinc-500">{t("storage.statistics.table.date")}</th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-zinc-500">{t("storage.statistics.table.items_count")}</th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-zinc-500">{t("storage.statistics.table.cost")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                  {metrics.recentDeals.map((deal) => (
                    <tr
                      key={deal.id}
                      className="hover:bg-gray-50 dark:hover:bg-zinc-800/40 cursor-pointer transition-colors"
                      onClick={() => navigate(`/clinic/storage/deals/${deal.id}`)}
                    >
                      <td className="px-4 py-3 text-sm font-medium text-primary-600 dark:text-blue-400">{deal.dealNumber}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-zinc-300">{deal.supplierName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-zinc-500">
                        {new Date(deal.dealDate).toLocaleDateString("en-SA")}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-zinc-400">{deal.itemCount}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-green-600 dark:text-emerald-500">
                        {formatNumberWithThousands(deal.totalCost)} {CURRENCY.SHORT_NAME}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-zinc-600 p-6">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>{t("storage.statistics.empty.no_deals")}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
