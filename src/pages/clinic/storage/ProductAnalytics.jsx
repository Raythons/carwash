"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import {
  TrendingUp,
  CalendarIcon,
  Search,
  Package,
  DollarSign,
  ShoppingCart,
  BarChart3,
  AlertCircle,
  X,
  Percent,
} from "lucide-react"
import { formatNumberWithThousands } from "@/utilities/number"
import { CURRENCY } from "@/constants/currency"
import storageApi from "@/api/storage"

import { getProductVariantSalesAnalytics, getProductVariantSalesSummary } from "@/api/sales"
import { toDateOnly } from "@/utilities/date"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js"
import { Bar } from "react-chartjs-2"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement)

export default function ProductAnalytics() {
  const { t, i18n } = useTranslation()
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [startDateOpen, setStartDateOpen] = useState(false)
  const [endDateOpen, setEndDateOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [productSearchTerm, setProductSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")

  // Reset dates when changing variant
  useEffect(() => {
    setStartDate(null)
    setEndDate(null)
  }, [selectedVariant])

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(productSearchTerm)
    }, 500)
    return () => clearTimeout(timer)
  }, [productSearchTerm])

  // Fetch products only when searching
  const { data: productsData } = useQuery({
    queryKey: ["products-analytics", debouncedSearchTerm],
    queryFn: () => storageApi.getProducts({ searchTerm: debouncedSearchTerm, pageSize: 20 }),
    enabled: debouncedSearchTerm.length > 1,
  })

  const products = productsData?.data?.items || productsData?.data || []

  // Fetch product variants for selected product
  const { data: variantsData } = useQuery({
    queryKey: ["variants-analytics", selectedProduct?.id],
    queryFn: () => storageApi.getProductVariants({ productId: selectedProduct.id }),
    enabled: !!selectedProduct?.id,
  })

  const variants = variantsData?.data?.items || variantsData?.data || []

  // Fetch analytics directly from backend stored procedures (date-sensitive)
  const { data: analyticsResponse, isLoading: loadingAnalytics } = useQuery({
    queryKey: ["variant-sales-analytics", selectedVariant?.id, startDate || null, endDate || null],
    queryFn: () =>
      getProductVariantSalesAnalytics(selectedVariant.id, {
        startDate,
        endDate,
      }),
    enabled: !!selectedVariant?.id,
  })

  const { data: summaryResponse, isLoading: loadingSummary } = useQuery({
    queryKey: ["variant-sales-summary", selectedVariant?.id, startDate || null, endDate || null],
    queryFn: () =>
      getProductVariantSalesSummary(selectedVariant.id, {
        startDate,
        endDate,
      }),
    enabled: !!selectedVariant?.id,
  })

  // Use analytics list for charts and table, and summary for headline KPIs when available
  const analyticsData = analyticsResponse?.data || []

  // Prefer summary KPIs if present; fallback to compute from analytics list
  const totalQuantitySold =
    summaryResponse?.data?.totalQuantitySold ?? analyticsData.reduce((sum, item) => sum + (item.quantity || 0), 0)
  const totalRevenue =
    summaryResponse?.data?.totalRevenue ?? analyticsData.reduce((sum, item) => sum + Number(item.totalRevenue || 0), 0)
  // Use ActualTotalProfit from analytics rows; fallback to computed if needed
  const computedTotalProfit = analyticsData.reduce(
    (sum, item) => sum + Number(item.actualTotalProfit ?? item.totalProfit ?? 0),
    0,
  )
  const totalProfit = summaryResponse?.data?.totalActualProfit ?? computedTotalProfit
  const profitMargin = totalRevenue > 0 ? (Number(totalProfit) / Number(totalRevenue)) * 100 : 0
  const averageSellPrice = totalQuantitySold > 0 ? Number(totalRevenue) / Number(totalQuantitySold) : 0
  const averageProfitPerUnit = totalQuantitySold > 0 ? Number(totalProfit) / Number(totalQuantitySold) : 0

  // Group analytics by MONTH for cleaner visualization
  const groupedByMonth = analyticsData.reduce((acc, item) => {
    const date = new Date(item.saleDate)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    const monthName = date.toLocaleDateString(i18n.language === "ar" ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "short",
    })

    if (!acc[monthKey]) {
      acc[monthKey] = { date: monthKey, monthName, totalRevenue: 0, totalProfit: 0, count: 0 }
    }
    acc[monthKey].totalRevenue += Number(item.totalRevenue || 0)
    acc[monthKey].totalProfit += Number(item.actualTotalProfit ?? item.totalProfit ?? 0)
    acc[monthKey].count += 1
    return acc
  }, {})

  const chartData = Object.values(groupedByMonth).sort((a, b) => a.date.localeCompare(b.date))

  // Remove earnings API call as endpoint doesn't exist
  const earnings = null

  const formatDate = (date) => {
    if (!date) return ""
    return new Date(date).toLocaleDateString(i18n.language === "ar" ? "ar-EG" : "en-US")
  }

  const formatCurrency = (amount) => {
    return `${formatNumberWithThousands(Number(amount).toFixed(2))} ${CURRENCY.SHORT_NAME}`
  }

  return (
    <div className="space-y-6" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">{t("storage.product_analytics.title")}</h1>
        <p className="text-gray-600 dark:text-zinc-400 mt-1">{t("storage.product_analytics.subtitle")}</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Product Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>{t("storage.product_analytics.filters.product_label")}</Label>
                <div className="mt-1">
                  <div className="relative">
                    <Search
                      className={`${i18n.language === "ar" ? "absolute right-3" : "absolute left-3"} top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-zinc-500`}
                    />
                    <Input
                      placeholder={t("storage.product_analytics.filters.product_placeholder")}
                      value={productSearchTerm}
                      onChange={(e) => setProductSearchTerm(e.target.value)}
                      className={i18n.language === "ar" ? "pr-9" : "pl-9"}
                    />
                  </div>
                  {debouncedSearchTerm.length > 1 && products.length > 0 && (
                    <div className="mt-2 max-h-60 overflow-y-auto border dark:border-zinc-700 rounded-lg dark:bg-zinc-900">
                      {products.map((product) => (
                        <div
                          key={product.id}
                          className={`p-3 hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer border-b last:border-b-0 dark:border-zinc-700 transition-colors ${
                            selectedProduct?.id === product.id ? "bg-blue-50 dark:bg-blue-900/30" : ""
                          }`}
                          onClick={() => {
                            setSelectedProduct(product)
                            setSelectedVariant(null)
                            setProductSearchTerm("")
                            setDebouncedSearchTerm("")
                          }}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <Package className="h-4 w-4 text-gray-500 dark:text-zinc-500 flex-shrink-0" />
                              <span className="font-medium dark:text-zinc-100 truncate">{product.name}</span>
                            </div>
                            <Badge variant="secondary" className="flex-shrink-0">
                              {product.totalStock || 0}
                            </Badge>
                          </div>
                          {product.categoryName && (
                            <span className="text-xs text-gray-500 dark:text-zinc-400 mr-6 block mt-1">
                              {product.categoryName}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {selectedProduct && (
                    <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                        <span className="font-medium text-blue-900 dark:text-blue-300">{selectedProduct.name}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedProduct(null)
                          setSelectedVariant(null)
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {selectedProduct && variants.length > 0 && (
                <div>
                  <Label>{t("storage.product_analytics.filters.variant_label")}</Label>
                  <Select
                    value={selectedVariant?.id?.toString() || ""}
                    onValueChange={(value) => {
                      const variant = variants.find((v) => v.id.toString() === value)
                      setSelectedVariant(variant)
                    }}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder={t("storage.product_analytics.filters.variant_placeholder")} />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {variants.map((variant) => (
                        <SelectItem key={variant.id} value={variant.id.toString()}>
                          <div className="flex items-center justify-between gap-3 w-full">
                            <span className="flex-1 truncate">{variant.variantName}</span>
                            <Badge
                              variant={
                                (variant.totalStock || variant.currentStock || 0) > 5 ? "secondary" : "destructive"
                              }
                              className="flex-shrink-0"
                            >
                              {variant.totalStock || variant.currentStock || 0}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{t("storage.product_analytics.filters.date_range_tip")}</span>
              </div>
              <div className="flex flex-wrap gap-4">
                <div>
                  <Label>{t("storage.product_analytics.filters.from_date")}</Label>
                  <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-48 justify-between font-normal mt-1 bg-transparent">
                        {startDate ? formatDate(startDate) : t("storage.product_analytics.filters.select_date")}
                        <CalendarIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate ? new Date(startDate) : undefined}
                        onSelect={(date) => {
                          if (date) setStartDate(toDateOnly(date))
                          setStartDateOpen(false)
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>{t("storage.product_analytics.filters.to_date")}</Label>
                  <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-48 justify-between font-normal mt-1 bg-transparent">
                        {endDate ? formatDate(endDate) : t("storage.product_analytics.filters.select_date")}
                        <CalendarIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate ? new Date(endDate) : undefined}
                        onSelect={(date) => {
                          if (date) setEndDate(toDateOnly(date))
                          setEndDateOpen(false)
                        }}
                        disabled={(date) => startDate && date < new Date(startDate)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {(startDate || endDate) && (
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setStartDate(null)
                        setEndDate(null)
                      }}
                    >
                      {t("storage.product_analytics.filters.clear_dates")}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      {selectedVariant && (
        <div className="flex gap-2 border-b">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === "all"
                ? "border-primary-500 text-primary-600 dark:text-primary-400"
                : "border-transparent text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span>{t("storage.product_analytics.tabs.all_analytics")}</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("sales")}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === "sales"
                ? "border-primary-500 text-primary-600 dark:text-primary-400"
                : "border-transparent text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              <span>{t("storage.product_analytics.tabs.sales_history")}</span>
            </div>
          </button>
        </div>
      )}

      {/* All Analytics Tab */}
      {selectedVariant && activeTab === "all" && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center text-center gap-3 p-8">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-2">
                    <Package className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-zinc-400">
                      {t("storage.product_analytics.metrics.total_quantity_sold")}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-zinc-100">
                      {formatNumberWithThousands(totalQuantitySold.toFixed(0))}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center text-center gap-3 p-8">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg mb-2">
                    <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-zinc-400">
                      {t("storage.product_analytics.metrics.total_revenue")}
                    </p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(totalRevenue)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center text-center gap-3 p-8">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-2">
                    <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-zinc-400">
                      {t("storage.product_analytics.metrics.total_profit")}
                    </p>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(totalProfit)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center text-center gap-3 p-8">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Percent className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">
                      {t("storage.product_analytics.metrics.profit_margin")}
                    </p>
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      {profitMargin.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart - Single Full Width */}
          {analyticsData.length > 0 && (
            <div>
              {/* Revenue vs Profit Chart - Monthly */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("storage.product_analytics.charts.monthly_revenue_profit")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ height: "400px" }}>
                    <Bar
                      data={{
                        labels: chartData.map((item) => item.monthName),
                        datasets: [
                          {
                            label: t("storage.product_analytics.charts.revenue_label"),
                            data: chartData.map((item) => Number(item.totalRevenue).toFixed(2)),
                            backgroundColor: "rgba(16, 185, 129, 0.8)",
                            borderColor: "#10b981",
                            borderWidth: 2,
                          },
                          {
                            label: t("storage.product_analytics.charts.profit_label"),
                            data: chartData.map((item) => Number(item.totalProfit).toFixed(2)),
                            backgroundColor: "rgba(59, 130, 246, 0.8)",
                            borderColor: "#3b82f6",
                            borderWidth: 2,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "top",
                            labels: {
                              font: { size: 12 },
                              usePointStyle: true,
                              color: "currentColor",
                            },
                          },
                          tooltip: {
                            backgroundColor: "rgba(0, 0, 0, 0.8)",
                            titleColor: "#fff",
                            bodyColor: "#fff",
                            borderColor: "rgba(255, 255, 255, 0.1)",
                            borderWidth: 1,
                            cornerRadius: 8,
                          },
                        },
                        scales: {
                          x: {
                            grid: { display: false },
                            ticks: {
                              font: { size: 11 },
                              maxRotation: 45,
                              minRotation: 45,
                              color: "currentColor",
                            },
                          },
                          y: {
                            grid: { color: "rgba(156, 163, 175, 0.1)" },
                            ticks: {
                              font: { size: 11 },
                              callback: (value) => formatNumberWithThousands(value),
                              color: "currentColor",
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">
                    {t("storage.product_analytics.metrics.avg_sell_price")}
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-zinc-100">
                    {formatCurrency(averageSellPrice)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">
                    {t("storage.product_analytics.metrics.avg_profit_per_unit")}
                  </p>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(averageProfitPerUnit)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">
                    {t("storage.product_analytics.metrics.sales_count")}
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-zinc-100">{analyticsData.length}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {!analyticsData.length && (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-400 dark:text-zinc-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-100 mb-2">
                  {t("storage.product_analytics.empty_states.no_data")}
                </h3>
                <p className="text-gray-600 dark:text-zinc-400">
                  {t("storage.product_analytics.empty_states.no_sales_found")}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Sales History Tab */}
      {selectedVariant && activeTab === "sales" && (
        <Card>
          <CardHeader>
            <CardTitle>{t("storage.product_analytics.sales_table.customer_sales_history")}</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingAnalytics ? (
              <div className="text-center py-8 text-gray-500 dark:text-zinc-400">
                {t("storage.product_analytics.sales_table.loading")}
              </div>
            ) : analyticsData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-gray-50 dark:bg-zinc-800">
                    <tr>
                      <th className="px-3 py-2 text-start text-xs font-semibold whitespace-nowrap dark:text-zinc-400">
                        {t("storage.product_analytics.sales_table.invoice_number")}
                      </th>
                      <th className="px-3 py-2 text-start text-xs font-semibold whitespace-nowrap dark:text-zinc-400">
                        {t("storage.product_analytics.sales_table.date")}
                      </th>
                      <th className="px-3 py-2 text-start text-xs font-semibold whitespace-nowrap dark:text-zinc-400">
                        {t("storage.product_analytics.sales_table.customer")}
                      </th>
                      <th className="px-3 py-2 text-start text-xs font-semibold whitespace-nowrap dark:text-zinc-400">
                        {t("storage.product_analytics.sales_table.quantity")}
                      </th>
                      <th className="px-3 py-2 text-start text-xs font-semibold whitespace-nowrap dark:text-zinc-400">
                        {t("storage.product_analytics.sales_table.sell_price")}
                      </th>
                      <th className="px-3 py-2 text-start text-xs font-semibold whitespace-nowrap dark:text-zinc-400">
                        {t("storage.product_analytics.sales_table.revenue")}
                      </th>
                      <th className="px-3 py-2 text-start text-xs font-semibold whitespace-nowrap dark:text-zinc-400">
                        {t("storage.product_analytics.sales_table.profit")}
                      </th>
                      <th className="px-3 py-2 text-start text-xs font-semibold whitespace-nowrap dark:text-zinc-400">
                        {t("storage.product_analytics.sales_table.payment_status")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-zinc-700">
                    {analyticsData.map((item) => (
                      <tr key={item.saleItemId} className="hover:bg-gray-50 dark:hover:bg-zinc-800">
                        <td className="px-3 py-2 font-medium text-sm">
                          <Link
                            to={`/clinic/storage/sales/${item.saleId}`}
                            className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 hover:underline font-medium"
                          >
                            {item.saleNumber}
                          </Link>
                        </td>
                        <td className="px-3 py-2 text-sm whitespace-nowrap dark:text-zinc-100">
                          {formatDate(item.saleDate)}
                        </td>
                        <td className="px-3 py-2 text-sm dark:text-zinc-100">{item.customerName}</td>
                        <td className="px-3 py-2 text-sm">
                          <Badge variant="secondary">{item.quantity}</Badge>
                        </td>
                        <td className="px-3 py-2 text-sm whitespace-nowrap dark:text-zinc-100">
                          {formatCurrency(item.unitSellPrice)}
                        </td>
                        <td className="px-3 py-2 font-semibold text-green-600 dark:text-green-400 text-sm whitespace-nowrap">
                          {formatCurrency(item.totalRevenue)}
                        </td>
                        <td className="px-3 py-2 font-bold text-blue-600 dark:text-blue-400 text-sm whitespace-nowrap">
                          {formatCurrency(item.actualTotalProfit ?? item.totalProfit ?? 0)}
                        </td>
                        <td className="px-3 py-2">
                          {(() => {
                            const statusMap = {
                              مدفوع: { variant: "success", key: "paid" },
                              "مدفوع جزئياً": { variant: "warning", key: "partially_paid" },
                              "غير مدفوع": { variant: "destructive", key: "unpaid" },
                            }
                            const status = statusMap[item.paymentStatus] || { variant: "destructive", key: "unpaid" }
                            return (
                              <Badge variant={status.variant}>
                                {t(`storage.sales.payment_statuses.${status.key}`)}
                              </Badge>
                            )
                          })()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-zinc-400">
                <DollarSign className="h-12 w-12 mx-auto mb-3 text-gray-400 dark:text-zinc-500" />
                <p>{t("storage.product_analytics.empty_states.no_sales_history")}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!selectedProduct && !selectedVariant && (
        <Card className="border-dashed bg-gray-50/50 dark:bg-zinc-900/50">
          <CardContent className="py-20 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-zinc-800 mb-6">
              <BarChart3 className="h-10 w-10 text-gray-400 dark:text-zinc-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {t("storage.product_analytics.empty_states.select_product")}
            </h3>
            <p className="text-gray-600 dark:text-zinc-400 max-w-sm mx-auto">
              {t("storage.product_analytics.empty_states.select_product_desc")}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
