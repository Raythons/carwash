"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useLocation, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Skeleton } from "@/components/ui/Skeleton"
import { TrendingUp, ArrowLeft, CalendarIcon } from "lucide-react"
import { formatNumberWithThousands } from "@/utilities/number"
import { CURRENCY } from "@/constants/currency"
import storageApi from "@/api/storage"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toDateOnly } from "@/utilities/date"

export function TopProfitableProducts() {
  const navigate = useNavigate()
  const location = useLocation()
  const observerTarget = useRef(null)

  // Get initial filters from navigation state
  const [timeRange, setTimeRange] = useState(location.state?.timeRange || "all")
  const [customStartDate, setCustomStartDate] = useState(location.state?.customStartDate || null)
  const [customEndDate, setCustomEndDate] = useState(location.state?.customEndDate || null)
  const [startDateOpen, setStartDateOpen] = useState(false)
  const [endDateOpen, setEndDateOpen] = useState(false)

  // Fetch products with infinite scroll
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch } = useInfiniteQuery({
    queryKey: ["top-profitable-products", timeRange, customStartDate, customEndDate],
    queryFn: ({ pageParam = 1 }) =>
      storageApi.getTopProfitableProducts(pageParam, 20, timeRange, customStartDate, customEndDate),
    getNextPageParam: (lastPage) => {
      if (lastPage.hasNextPage) {
        return lastPage.page + 1
      }
      return undefined
    },
    initialPageParam: 1,
  })

  // Intersection Observer for infinite scroll
  const handleObserver = useCallback(
    (entries) => {
      const [target] = entries
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  )

  useEffect(() => {
    const element = observerTarget.current
    const option = { threshold: 0 }
    const observer = new IntersectionObserver(handleObserver, option)
    if (element) observer.observe(element)
    return () => {
      if (element) observer.unobserve(element)
    }
  }, [handleObserver])

  // Refetch when filters change
  useEffect(() => {
    refetch()
  }, [timeRange, customStartDate, customEndDate, refetch])

  const allProducts = data?.pages.flatMap((page) => page.items) || []
  const totalCount = data?.pages[0]?.totalCount || 0

  if (isLoading) {
    return (
      <div className="space-y-6" dir="rtl">
        <Skeleton className="h-8 w-64" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/clinic/storage/statistics")}
            className="hover:bg-green-50"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              المنتجات الأكثر ربحاً
            </h1>
            <p className="text-gray-600 dark:text-zinc-400 mt-1">إجمالي {formatNumberWithThousands(totalCount)} منتج</p>
          </div>
        </div>

        {/* Time Range Filter */}
        <div className="flex flex-col gap-3">
          <div className="flex gap-2 bg-white dark:bg-zinc-800 rounded-lg p-1 border border-gray-200 dark:border-zinc-700 flex-wrap">
            <button
              onClick={() => setTimeRange("week")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                timeRange === "week"
                  ? "bg-green-500 text-white"
                  : "text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700"
              }`}
            >
              هذا الأسبوع
            </button>
            <button
              onClick={() => setTimeRange("month")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                timeRange === "month"
                  ? "bg-green-500 text-white"
                  : "text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700"
              }`}
            >
              هذا الشهر
            </button>
            <button
              onClick={() => setTimeRange("year")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                timeRange === "year"
                  ? "bg-green-500 text-white"
                  : "text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700"
              }`}
            >
              هذه السنة
            </button>
            <button
              onClick={() => setTimeRange("all")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                timeRange === "all"
                  ? "bg-green-500 text-white"
                  : "text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700"
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setTimeRange("custom")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                timeRange === "custom"
                  ? "bg-green-500 text-white"
                  : "text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700"
              }`}
            >
              تخصيص
            </button>
          </div>

          {/* Custom Date Range Picker */}
          {timeRange === "custom" && (
            <div className="flex gap-3 items-center bg-white dark:bg-zinc-800 rounded-lg p-3 border border-gray-200 dark:border-zinc-700">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">من تاريخ</label>
                <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[200px] justify-between font-normal bg-transparent">
                      {customStartDate ? new Date(customStartDate).toLocaleDateString("en-SA") : "اختر تاريخ البداية"}
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
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
                <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">إلى تاريخ</label>
                <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[200px] justify-between font-normal bg-transparent">
                      {customEndDate ? new Date(customEndDate).toLocaleDateString("en-SA") : "اختر تاريخ النهاية"}
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
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

      {/* Products List */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة المنتجات</CardTitle>
        </CardHeader>
        <CardContent>
          {allProducts.length > 0 ? (
            <div className="space-y-3">
              {allProducts.map((product, index) => (
                <div
                  key={`${product.id}-${index}`}
                  className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-zinc-100 text-lg truncate">{product.name}</p>
                    <p className="text-sm text-gray-600 dark:text-zinc-400">
                      هامش ربح: {product.profitMargin.toFixed(2)}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600 dark:text-green-400 text-xl">
                      {formatNumberWithThousands(product.totalProfit.toFixed(2))} {CURRENCY.SHORT_NAME}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-zinc-400">ربح</p>
                  </div>
                </div>
              ))}

              {/* Loading indicator for next page */}
              {isFetchingNextPage && (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20" />
                  ))}
                </div>
              )}

              {/* Intersection observer target */}
              <div ref={observerTarget} className="h-4" />

              {/* End of list message */}
              {!hasNextPage && allProducts.length > 0 && (
                <p className="text-center text-gray-500 dark:text-zinc-400 py-4">
                  تم عرض جميع المنتجات ({formatNumberWithThousands(totalCount)})
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-zinc-400">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-zinc-600" />
              <p className="text-lg">لا توجد بيانات ربحية حتى الآن</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
