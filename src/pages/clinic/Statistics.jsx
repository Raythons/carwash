import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { ContentContainer } from "../../components/ContentContainer";
import {
  usePaymentStatistics,
  useMonthlyRevenue,
  usePaymentTypeBreakdown,
  useGoalComparison,
  useAnimalTypeDistribution,
  useExaminationsMonthly,
  useSurgeriesMonthly,
} from "../../hooks/queries/useStatisticsQueries";
import { useClinic } from "../../contexts/ClinicContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  TrendingUp,
  DollarSign,
  Target,
  CheckCircle,
  XCircle,
  Calendar,
  Filter,
} from "lucide-react";
import { formatNumberWithThousands } from "../../utilities/number";
import { CURRENCY } from "../../constants/currency";
import StringConverter from "../../utils/StringConverter";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

export function Statistics() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [viewMode, setViewMode] = useState("all"); // 'all', 'paid', 'unpaid'

  const { selectedClinicId } = useClinic();
  const { t, i18n } = useTranslation();

  // Single API call for all dashboard data
  const { data: dashboardData, isLoading: dashboardLoading } =
    usePaymentStatistics({
      year: selectedYear,
      month: selectedMonth,
      isPaid: viewMode === "all" ? null : viewMode === "paid" ? true : false,
    });

  // Fetch animal-type distribution early so hooks order is consistent across renders
  const useAnimalTypeDistributionResult = useAnimalTypeDistribution();
  const examinationsMonthlyResult = useExaminationsMonthly(selectedYear);
  const surgeriesMonthlyResult = useSurgeriesMonthly(selectedYear);
  console.log(useAnimalTypeDistributionResult);

  // Keep a safe, normalized array for the UI. Default to empty so we never reference an undefined variable.
  const animalTypes =
    (useAnimalTypeDistributionResult?.data?.data ||
      useAnimalTypeDistributionResult?.data) ??
    [];

  const formatCurrency = (value) =>
    `${formatNumberWithThousands(value)} ${CURRENCY.SHORT_NAME}`;

  const formatNumber = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  // Monthly counts coming from server (one entry per month)
  const examinationsMonthly =
    (examinationsMonthlyResult?.data?.data ||
      examinationsMonthlyResult?.data) ??
    [];

  const surgeriesMonthly =
    (surgeriesMonthlyResult?.data?.data || surgeriesMonthlyResult?.data) ?? [];

  // Helper function to get payment status in Arabic
  const getPaymentStatus = (totalAmount, receivedAmount) => {
    if (receivedAmount === 0) return t("statistics.payment_status.unpaid");
    if (receivedAmount >= totalAmount) return t("statistics.payment_status.paid");
    return t("statistics.payment_status.partially_paid");
  };

  // Helper function to get remaining amount
  const getRemainingAmount = (totalAmount, receivedAmount) => {
    const remaining = totalAmount - receivedAmount;
    return remaining > 0 ? remaining : 0;
  };

  // Helper function to convert English month names to Arabic
  const getLocalizedMonthName = (monthName) => {
    // If monthName is already in the current language, return it as is
    if (!monthName) return "";
    
    // Map of Arabic month names to English keys
    const arabicToEnglish = {
      "يناير": "January",
      "فبراير": "February",
      "مارس": "March",
      "أبريل": "April",
      "مايو": "May",
      "يونيو": "June",
      "يوليو": "July",
      "أغسطس": "August",
      "سبتمبر": "September",
      "أكتوبر": "October",
      "نوفمبر": "November",
      "ديسمبر": "December"
    };
    
    // If the month name is in Arabic, convert to English key first
    const englishKey = arabicToEnglish[monthName] || monthName;
    
    // Now translate using the English key
    return t(`statistics.months.${englishKey}`) || monthName;
  };

  const months = [
    { value: null, label: t("statistics.all_months") },
    { value: 1, label: t("statistics.months.January") },
    { value: 2, label: t("statistics.months.February") },
    { value: 3, label: t("statistics.months.March") },
    { value: 4, label: t("statistics.months.April") },
    { value: 5, label: t("statistics.months.May") },
    { value: 6, label: t("statistics.months.June") },
    { value: 7, label: t("statistics.months.July") },
    { value: 8, label: t("statistics.months.August") },
    { value: 9, label: t("statistics.months.September") },
    { value: 10, label: t("statistics.months.October") },
    { value: 11, label: t("statistics.months.November") },
    { value: 12, label: t("statistics.months.December") },
  ];

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  if (dashboardLoading) {
    return (
      <ContentContainer>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </ContentContainer>
    );
  }

  // Extract data from single API response
  const stats = dashboardData?.data || dashboardData;
  const revenue = stats?.monthlyRevenue || [];
  const types = stats?.paymentTypeBreakdown || [];
  const goals = stats?.goalComparisons || [];

  console.log("Processed dashboard data:", { stats, revenue, types, goals });

  return (
    <ContentContainer>
      <div className="space-y-6" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
        {/* Header */}
        <div className="flex flex-col gap-3 sm:gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-zinc-100">
            {t("statistics.title")}
          </h1>

          {/* Filter Bar */}
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 p-3 sm:p-4">
            <div className="flex flex-col gap-3">
              {/* Time Filters */}
              <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 w-full">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Calendar className="w-4 h-4 text-gray-500 dark:text-zinc-400 flex-shrink-0" />
                  <Select
                    value={selectedYear.toString()}
                    onValueChange={(value) => setSelectedYear(parseInt(value))}
                  >
                    <SelectTrigger className="w-full xs:w-28 sm:w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Select
                  value={selectedMonth ? selectedMonth.toString() : "all"}
                  onValueChange={(value) =>
                    setSelectedMonth(value === "all" ? null : parseInt(value))
                  }
                >
                  <SelectTrigger className="w-full xs:w-36 sm:w-40">
                    <SelectValue placeholder={t("statistics.select_month")} />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem
                        key={month.value || "all"}
                        value={month.value ? month.value.toString() : "all"}
                      >
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* View Mode Tabs */}
              <div className="flex gap-1.5 sm:gap-2 bg-gray-100 dark:bg-zinc-900 p-1 rounded-lg w-full">
                <button
                  onClick={() => setViewMode("all")}
                  className={`flex-1 px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                    viewMode === "all"
                      ? "bg-white dark:bg-zinc-700 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-gray-600 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-zinc-100"
                  }`}
                >
                  {t("statistics.view_all")}
                </button>
                <button
                  onClick={() => setViewMode("paid")}
                  className={`flex-1 px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                    viewMode === "paid"
                      ? "bg-white dark:bg-zinc-700 text-green-600 dark:text-green-400 shadow-sm"
                      : "text-gray-600 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-zinc-100"
                  }`}
                >
                  {t("statistics.view_paid")}
                </button>
                <button
                  onClick={() => setViewMode("unpaid")}
                  className={`flex-1 px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                    viewMode === "unpaid"
                      ? "bg-white dark:bg-zinc-700 text-red-600 dark:text-red-400 shadow-sm"
                      : "text-gray-600 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-zinc-100"
                  }`}
                >
                  {t("statistics.view_unpaid")}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Active Filter Indicator */}
        {(selectedMonth || viewMode !== "all") && stats && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h3 className="text-xs sm:text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  {t("statistics.active_filters")}
                </h3>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {selectedMonth && (
                    <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-white dark:bg-zinc-700 rounded-full text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                      <Calendar className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">
                        {months.find((m) => m.value === selectedMonth)?.label}
                      </span>
                    </span>
                  )}
                  {viewMode === "paid" && (
                    <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-white dark:bg-zinc-700 rounded-full text-xs sm:text-sm font-medium text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700">
                      <CheckCircle className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{t("statistics.paid_only")}</span>
                    </span>
                  )}
                  {viewMode === "unpaid" && (
                    <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-white dark:bg-zinc-700 rounded-full text-xs sm:text-sm font-medium text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700">
                      <XCircle className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{t("statistics.unpaid_only")}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        {stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Total Revenue Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl shadow-sm border border-blue-200 dark:border-blue-700 p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center justify-center text-center mb-3 sm:mb-4 min-h-[120px]">
                <div className="p-2 sm:p-3 bg-blue-500 dark:bg-blue-600 rounded-lg mb-3">
                  <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                    {t("statistics.total_revenue")}
                  </p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-900 dark:text-blue-100">
                    {formatCurrency(stats.totalRevenue || 0)}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-blue-200 dark:border-blue-700">
                <span className="text-xs text-blue-600 dark:text-blue-300">{t("statistics.total_payments")}</span>
                <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                  {stats.totalPayments}
                </span>
              </div>
            </div>

            {/* Received Amount Card */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl shadow-sm border border-green-200 dark:border-green-700 p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center justify-center text-center mb-3 sm:mb-4 min-h-[120px]">
                <div className="p-2 sm:p-3 bg-green-500 dark:bg-green-600 rounded-lg mb-3">
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-green-700 dark:text-green-300 mb-1">
                    {t("statistics.received_amount")}
                  </p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-900 dark:text-green-100">
                    {formatCurrency(stats.totalReceived || 0)}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-green-200 dark:border-green-700">
                <span className="text-xs text-green-600 dark:text-green-300">{t("statistics.fully_paid_count")}</span>
                <span className="text-sm font-semibold text-green-900 dark:text-green-100">
                  {stats.paidPayments} {t("statistics.transaction")}
                </span>
              </div>
            </div>

            {/* Remaining Amount Card */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 rounded-xl shadow-sm border border-red-200 dark:border-red-700 p-4 sm:p-6 hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
              <div className="flex flex-col items-center justify-center text-center mb-3 sm:mb-4 min-h-[120px]">
                <div className="p-2 sm:p-3 bg-red-500 dark:bg-red-600 rounded-lg mb-3">
                  <XCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-red-700 dark:text-red-300 mb-1">
                    {t("statistics.remaining_amount")}
                  </p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-900 dark:text-red-100">
                    {formatCurrency(
                      getRemainingAmount(
                        stats.totalRevenue || 0,
                        stats.totalReceived || 0
                      )
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-red-200 dark:border-red-700">
                <span className="text-xs text-red-600 dark:text-red-300">{t("statistics.unpaid_count")}</span>
                <span className="text-sm font-semibold text-red-900 dark:text-red-100">
                  {stats.unpaidPayments} {t("statistics.transaction")}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-6 border dark:border-zinc-700">
            <div className="text-center py-12">
              <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-zinc-600" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-zinc-100 mb-2">
                {t("statistics.no_data")}
              </h3>
              <p className="text-gray-500 dark:text-zinc-400 mb-4">
                {t("statistics.no_data_desc")}
              </p>
              <p className="text-sm text-gray-400 dark:text-zinc-500">
                {t("statistics.no_data_tip")}
              </p>
            </div>
          </div>
        )}

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Monthly Revenue Chart */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow border dark:border-zinc-700 p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
              <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 dark:text-zinc-100">
                {t("statistics.monthly_revenue_chart")}
              </h2>
            </div>

            {revenue && revenue.length > 0 ? (
              <div className="w-full overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                <div
                  style={{ minWidth: "300px", height: "250px" }}
                  className="sm:h-[300px]"
                >
                  <Line
                    data={{
                      labels: revenue.map((item) =>
                        getLocalizedMonthName(item.monthName)
                      ),
                      datasets: [
                        {
                          label: t("statistics.received_amount"),
                          data: revenue.map((item) => item.receivedAmount),
                          borderColor: "#10b981",
                          backgroundColor: "rgba(16, 185, 129, 0.1)",
                          borderWidth: 3,
                          fill: false,
                          tension: 0.4,
                          pointBackgroundColor: "#10b981",
                          pointBorderColor: "#ffffff",
                          pointBorderWidth: 2,
                          pointRadius: 5,
                          pointHoverRadius: 8,
                        },
                        {
                          label: t("statistics.remaining_amount"),
                          data: revenue.map((item) =>
                            getRemainingAmount(
                              item.totalAmount,
                              item.receivedAmount
                            )
                          ),
                          borderColor: "#ef4444",
                          backgroundColor: "rgba(239, 68, 68, 0.1)",
                          borderWidth: 3,
                          fill: false,
                          tension: 0.4,
                          pointBackgroundColor: "#ef4444",
                          pointBorderColor: "#ffffff",
                          pointBorderWidth: 2,
                          pointRadius: 5,
                          pointHoverRadius: 8,
                        },
                        {
                          label: t("statistics.total_revenue"),
                          data: revenue.map((item) => item.totalAmount),
                          borderColor: "#3b82f6",
                          backgroundColor: "rgba(59, 130, 246, 0.1)",
                          borderWidth: 2,
                          fill: false,
                          tension: 0.4,
                          pointBackgroundColor: "#3b82f6",
                          pointBorderColor: "#ffffff",
                          pointBorderWidth: 2,
                          pointRadius: 4,
                          pointHoverRadius: 6,
                        },
                        {
                          label: t("statistics.goal"),
                          data: revenue.map((item) => item.goalAmount || 0),
                          borderColor: "#f59e0b",
                          backgroundColor: "rgba(245, 158, 11, 0.1)",
                          borderWidth: 3,
                          borderDash: [8, 4],
                          fill: false,
                          tension: 0.4,
                          pointBackgroundColor: "#f59e0b",
                          pointBorderColor: "#ffffff",
                          pointBorderWidth: 2,
                          pointRadius: 5,
                          pointHoverRadius: 8,
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
                            usePointStyle: true,
                            padding: 20,
                            font: {
                              size: 12,
                            },
                          },
                        },
                        tooltip: {
                          enabled: false, // Disable default tooltip
                          external: function (context) {
                            // Custom tooltip positioning below chart
                            const { chart, tooltip } = context;

                            // Get or create tooltip element
                            let tooltipEl =
                              chart.canvas.parentNode.querySelector(
                                ".chartjs-tooltip"
                              );
                            if (!tooltipEl) {
                              tooltipEl = document.createElement("div");
                              tooltipEl.className = "chartjs-tooltip";
                              tooltipEl.style.background =
                                "rgba(255, 255, 255, 0.98)";
                              tooltipEl.style.border = "2px solid #d1d5db";
                              tooltipEl.style.borderRadius = "12px";
                              tooltipEl.style.color = "#1f2937";
                              tooltipEl.style.opacity = "1";
                              tooltipEl.style.padding = "16px";
                              tooltipEl.style.pointerEvents = "none";
                              tooltipEl.style.position = "absolute";
                              tooltipEl.style.transform = "translate(-50%, 0)";
                              tooltipEl.style.transition = "all .1s ease";
                              tooltipEl.style.fontSize = "14px";
                              tooltipEl.style.fontWeight = "600";
                              tooltipEl.style.boxShadow =
                                "0 10px 25px rgba(0, 0, 0, 0.1)";
                              tooltipEl.style.zIndex = "1000";
                              chart.canvas.parentNode.appendChild(tooltipEl);
                            }

                            // Hide if no tooltip
                            if (tooltip.opacity === 0) {
                              tooltipEl.style.opacity = "0";
                              return;
                            }

                            // Set content
                            if (tooltip.body) {
                              const titleLines = tooltip.title || [];
                              const bodyLines = tooltip.body.map(
                                (b) => b.lines
                              );

                              let innerHtml = "<div>";

                              // Title
                              titleLines.forEach(function (title) {
                                innerHtml +=
                                  '<div style="font-size: 16px; font-weight: bold; margin-bottom: 8px; text-align: center;">';
                                innerHtml += t("statistics.month") + " " + title;
                                innerHtml += "</div>";
                              });

                              // Body
                              bodyLines.forEach(function (body, i) {
                                const colors = tooltip.labelColors[i];
                                let style =
                                  "background:" + colors.backgroundColor;
                                style += "; border-color:" + colors.borderColor;
                                style += "; border-width: 2px";
                                style += "; border-radius: 50%";
                                style += "; width: 12px; height: 12px";
                                style += "; display: inline-block";
                                style += "; margin-left: 8px";

                                innerHtml +=
                                  '<div style="display: flex; align-items: center; margin: 4px 0;">';
                                innerHtml +=
                                  '<span style="' + style + '"></span>';
                                innerHtml += body;
                                innerHtml += "</div>";
                              });

                              innerHtml += "</div>";
                              tooltipEl.innerHTML = innerHtml;
                            }

                            // Position tooltip below the chart
                            const position = chart.canvas.getBoundingClientRect();
                            const isRTL = i18n.language === "ar";

                            tooltipEl.style.opacity = "1";
                            // Position horizontally - shift left in LTR, center in RTL
                            tooltipEl.style.left =
                              position.left +
                              window.pageXOffset +
                              position.width / 2 +
                              (isRTL ? 0 : -300) + // Shift 100px left in English
                              "px";
                            // Position vertically below the chart
                            tooltipEl.style.top =
                              position.top +
                              window.pageYOffset +
                              chart.chartArea.bottom +
                              20 +
                              "px"; // 20px below chart
                          },
                        },
                      },
                      scales: {
                        x: {
                          grid: {
                            color: "#f3f4f6",
                            drawBorder: false,
                          },
                          ticks: {
                            color: "#94a3b8",
                            font: {
                              size: 14,
                              weight: "600",
                            },
                            maxRotation: 0,
                            minRotation: 0,
                          },
                        },
                        y: {
                          grid: {
                            color: "#f3f4f6",
                            drawBorder: false,
                          },
                          ticks: {
                            color: "#94a3b8",
                            font: {
                              size: 13,
                              weight: "500",
                            },
                            callback: function (value) {
                              return formatNumber(value);
                            },
                          },
                        },
                      },
                      interaction: {
                        intersect: false,
                        mode: "index",
                      },
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500 dark:text-zinc-400">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-zinc-600" />
                  <p>{t("statistics.no_revenue_data")}</p>
                  <p className="text-sm">
                    {t("statistics.revenue_tip")}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Payment Types Pie Chart */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow border dark:border-zinc-700 p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
              <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 dark:text-zinc-100">
                {t("statistics.payment_types_chart")}
              </h2>
            </div>

            {types && types.length > 0 ? (
              <>
                <div
                  style={{ height: "250px" }}
                  className="flex items-center justify-center sm:h-[300px]"
                >
                  <Doughnut
                    data={{
                      labels: types.map((type) => StringConverter.convert(type.paymentType, i18n.language)),
                      datasets: [
                        {
                          data: types.map((type) => type.totalAmount),
                          backgroundColor: [
                            "#3b82f6",
                            "#10b981",
                            "#f59e0b",
                            "#ef4444",
                            "#8b5cf6",
                            "#06b6d4",
                            "#84cc16",
                            "#f97316",
                          ],
                          borderWidth: 0,
                          hoverBorderWidth: 3,
                          hoverBorderColor: "#ffffff",
                          cutout: "60%",
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false, // We'll use custom legend below
                        },
                        tooltip: {
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          titleColor: "#374151",
                          bodyColor: "#374151",
                          borderColor: "#e5e7eb",
                          borderWidth: 1,
                          cornerRadius: 8,
                          displayColors: true,
                          callbacks: {
                            label: function (context) {
                              const percentage = (
                                (context.parsed /
                                  types.reduce(
                                    (sum, type) => sum + type.totalAmount,
                                    0
                                  )) *
                                100
                              ).toFixed(2);
                              return `${context.label}: ${formatCurrency(
                                context.parsed
                              )} (${percentage}%)`;
                            },
                          },
                        },
                      },
                      animation: {
                        animateRotate: true,
                        animateScale: true,
                        duration: 1000,
                      },
                      hover: {
                        animationDuration: 200,
                      },
                    }}
                  />
                </div>

                {/* Custom Legend */}
                <div className="mt-4 sm:mt-6 grid grid-cols-1 gap-3 sm:gap-4">
                  {types.map((type, index) => (
                    <div
                      key={type.paymentType}
                      className="flex items-center justify-between p-3 sm:p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors border border-gray-100 dark:border-zinc-700"
                    >
                      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                        <div
                          className="w-5 h-5 sm:w-6 sm:h-6 rounded-full shadow-md flex-shrink-0"
                          style={{
                            backgroundColor: [
                              "#3b82f6",
                              "#10b981",
                              "#f59e0b",
                              "#ef4444",
                              "#8b5cf6",
                              "#06b6d4",
                              "#84cc16",
                              "#f97316",
                            ][index % 8],
                          }}
                        />
                        <span className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 dark:text-zinc-200 truncate">
                          {StringConverter.convert(type.paymentType, i18n.language)}
                        </span>
                      </div>
                      <div className="text-right flex-shrink-0 mr-2">
                        <div className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-zinc-100 break-words">
                          {formatCurrency(type.totalAmount)}
                        </div>
                        <div className="text-sm sm:text-base lg:text-lg font-semibold text-blue-600 dark:text-blue-400">
                          {type.percentage.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500 dark:text-zinc-400">
                <div className="text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-zinc-600" />
                  <p>{t("statistics.no_payment_types")}</p>
                  <p className="text-sm">{t("statistics.payment_types_tip")}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Goals Achievement Table */}
        {goals.length > 0 && (
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow border dark:border-zinc-700 p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
              <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 dark:text-zinc-100">
                {t("statistics.goals_achievement")}
              </h2>
            </div>

            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table
                className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700"
                style={{ minWidth: "600px" }}
              >
                <thead className="bg-gray-50 dark:bg-zinc-900">
                  <tr>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 dark:text-zinc-200 uppercase tracking-wider">
                      {t("statistics.month")}
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 dark:text-zinc-200 uppercase tracking-wider">
                      {t("statistics.goal")}
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 dark:text-zinc-200 uppercase tracking-wider">
                      {t("statistics.achieved")}
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 dark:text-zinc-200 uppercase tracking-wider">
                      {t("statistics.difference")}
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 dark:text-zinc-200 uppercase tracking-wider">
                      {t("statistics.percentage")}
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 dark:text-zinc-200 uppercase tracking-wider">
                      {t("statistics.status")}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-zinc-700">
                  {goals.map((goal) => (
                    <tr key={`${goal.year}-${goal.month}`}>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900 dark:text-zinc-100">
                        {getLocalizedMonthName(goal.monthName)}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 dark:text-zinc-100">
                        {formatCurrency(goal.goalAmount)}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 dark:text-zinc-100">
                        {formatCurrency(goal.actualAmount)}
                      </td>
                      <td
                        className={`px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm ${
                          goal.difference >= 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {goal.difference >= 0 ? "+" : ""}
                        {formatCurrency(goal.difference)}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 dark:text-zinc-100">
                        {goal.achievementPercentage.toFixed(2)}%
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            goal.isAchieved
                              ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                              : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                          }`}
                        >
                          {goal.isAchieved
                            ? t("statistics.achieved_status")
                            : t("statistics.not_achieved_status")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Examinations Chart - Area Line Style */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-zinc-700">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex-shrink-0">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 dark:text-zinc-100">
                  {t("statistics.monthly_examinations")}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400">
                  {t("statistics.exams_and_followups")}
                </p>
              </div>
            </div>

            <div style={{ height: "250px" }} className="sm:h-[320px]">
              <Line
                data={{
                  labels: examinationsMonthly.map(
                    (item) =>
                      item.monthName || getLocalizedMonthName(item.monthName)
                  ),
                  datasets: [
                    {
                      label: t("statistics.exams_count"),
                      data: examinationsMonthly.map((item) => item.count),
                      borderColor: "#3b82f6",
                      backgroundColor: (context) => {
                        const ctx = context.chart.ctx;
                        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                        gradient.addColorStop(0, "rgba(59, 130, 246, 0.3)");
                        gradient.addColorStop(1, "rgba(59, 130, 246, 0.05)");
                        return gradient;
                      },
                      borderWidth: 3,
                      fill: true,
                      tension: 0.4,
                      pointBackgroundColor: "#3b82f6",
                      pointBorderColor: "#ffffff",
                      pointBorderWidth: 3,
                      pointRadius: 6,
                      pointHoverRadius: 8,
                      pointHoverBackgroundColor: "#1d4ed8",
                    },
                    // only examinations count is provided by the server
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top",
                      labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: { size: 13, weight: "600" },
                        color: "#94a3b8",
                      },
                    },
                    tooltip: {
                      backgroundColor: "rgba(255, 255, 255, 0.98)",
                      titleColor: "#1f2937",
                      bodyColor: "#1f2937",
                      borderColor: "#e5e7eb",
                      borderWidth: 1,
                      cornerRadius: 12,
                      padding: 16,
                      titleFont: { size: 15, weight: "bold" },
                      bodyFont: { size: 14, weight: "600" },
                      boxPadding: 8,
                      usePointStyle: true,
                      callbacks: {
                        title: function (context) {
                          return t("statistics.month") + " " + context[0].label;
                        },
                      },
                    },
                  },
                  scales: {
                    x: {
                      grid: {
                        display: false,
                      },
                      ticks: {
                        color: "#94a3b8",
                        font: { size: 12, weight: "600" },
                        padding: 10,
                      },
                    },
                    y: {
                      grid: {
                        color: "rgba(243, 244, 246, 0.8)",
                        drawBorder: false,
                      },
                      ticks: {
                        color: "#94a3b8",
                        font: { size: 12, weight: "500" },
                        padding: 10,
                      },
                    },
                  },
                  interaction: {
                    intersect: false,
                    mode: "index",
                  },
                }}
              />
            </div>
          </div>

          {/* Surgeries Chart */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6 border border-gray-100 dark:border-zinc-700">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <Target className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-zinc-100">
                  {t("statistics.monthly_surgeries")}
                </h2>
                <p className="text-sm text-gray-500 dark:text-zinc-400">{t("statistics.surgeries_and_followups")}</p>
              </div>
            </div>

            <div style={{ height: "320px" }}>
              <Line
                data={{
                  labels: surgeriesMonthly.map(
                    (item) =>
                      item.monthName || getLocalizedMonthName(item.monthName)
                  ),
                  datasets: [
                    {
                      label: t("statistics.surgeries_count"),
                      data: surgeriesMonthly.map((item) => item.count),
                      borderColor: "#ef4444",
                      backgroundColor: (context) => {
                        const ctx = context.chart.ctx;
                        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                        gradient.addColorStop(0, "rgba(239, 68, 68, 0.3)");
                        gradient.addColorStop(1, "rgba(239, 68, 68, 0.05)");
                        return gradient;
                      },
                      borderWidth: 3,
                      fill: true,
                      tension: 0.4,
                      pointBackgroundColor: "#ef4444",
                      pointBorderColor: "#ffffff",
                      pointBorderWidth: 3,
                      pointRadius: 6,
                      pointHoverRadius: 8,
                      pointHoverBackgroundColor: "#dc2626",
                    },
                    // follow-ups series removed — server returns surgeries per month
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top",
                      labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: { size: 13, weight: "600" },
                        color: "#94a3b8",
                      },
                    },
                    tooltip: {
                      backgroundColor: "rgba(255, 255, 255, 0.98)",
                      titleColor: "#1f2937",
                      bodyColor: "#1f2937",
                      borderColor: "#e5e7eb",
                      borderWidth: 1,
                      cornerRadius: 12,
                      padding: 16,
                      titleFont: { size: 15, weight: "bold" },
                      bodyFont: { size: 14, weight: "600" },
                      boxPadding: 8,
                      usePointStyle: true,
                      callbacks: {
                        title: function (context) {
                          return t("statistics.month") + " " + context[0].label;
                        },
                      },
                    },
                  },
                  scales: {
                    x: {
                      grid: {
                        display: false,
                      },
                      ticks: {
                        color: "#94a3b8",
                        font: { size: 12, weight: "600" },
                        padding: 10,
                      },
                    },
                    y: {
                      grid: {
                        color: "rgba(243, 244, 246, 0.8)",
                        drawBorder: false,
                      },
                      ticks: {
                        color: "#94a3b8",
                        font: { size: 12, weight: "500" },
                        padding: 10,
                      },
                    },
                  },
                  interaction: {
                    intersect: false,
                    mode: "index",
                  },
                }}
              />
            </div>
          </div>

          {/* Animal Types Chart - Polar Area Style */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6 border border-gray-100 dark:border-zinc-700">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-zinc-100">
                  {t("statistics.animal_types")}
                </h2>
                <p className="text-sm text-gray-500 dark:text-zinc-400">
                  {t("statistics.animal_types_distribution")}
                </p>
              </div>
            </div>

            <div
              style={{ height: "200px" }}
              className="flex items-center justify-center mb-4"
            >
              {
                // use real data from backend; fallback to placeholder if not available
              }
              <Doughnut
                data={{
                  labels: (function () {
                    const raw =
                      useAnimalTypeDistributionResult?.data?.data ||
                      useAnimalTypeDistributionResult?.data ||
                      animalTypes ||
                      [];
                    return raw.map(
                      (r) =>
                        StringConverter.convert(
                          r.animalType ||
                            r.AnimalType ||
                            r.AnimalTypeName,
                          i18n.language
                        ) || t("statistics.unknown")
                    );
                  })(),
                  datasets: [
                    {
                      data: (function () {
                        const raw =
                          useAnimalTypeDistributionResult?.data?.data ||
                          useAnimalTypeDistributionResult?.data ||
                          animalTypes ||
                          [];
                        return raw.map((r) => r.count || r.Count || 0);
                      })(),
                      backgroundColor: [
                        "rgba(59, 130, 246, 0.8)",
                        "rgba(16, 185, 129, 0.8)",
                        "rgba(245, 158, 11, 0.8)",
                        "rgba(239, 68, 68, 0.8)",
                        "rgba(139, 92, 246, 0.8)",
                        "rgba(6, 182, 212, 0.8)",
                        "rgba(132, 204, 22, 0.8)",
                        "rgba(249, 115, 22, 0.8)",
                      ],
                      borderWidth: 3,
                      borderColor: "#ffffff",
                      hoverBorderWidth: 4,
                      hoverBorderColor: "#ffffff",
                      hoverBackgroundColor: [
                        "rgba(59, 130, 246, 0.9)",
                        "rgba(16, 185, 129, 0.9)",
                        "rgba(245, 158, 11, 0.9)",
                        "rgba(239, 68, 68, 0.9)",
                        "rgba(139, 92, 246, 0.9)",
                      ],
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      backgroundColor: "rgba(255, 255, 255, 0.98)",
                      titleColor: "#1f2937",
                      bodyColor: "#1f2937",
                      borderColor: "#e5e7eb",
                      borderWidth: 2,
                      cornerRadius: 12,
                      padding: 16,
                      titleFont: { size: 15, weight: "bold" },
                      bodyFont: { size: 14, weight: "600" },
                      callbacks: {
                        label: function (context) {
                          const total = context.dataset.data.reduce(
                            (a, b) => a + b,
                            0
                          );
                          const percentage = (
                            (context.parsed / total) *
                            100
                          ).toFixed(2);
                          return `${context.label}: ${context.parsed} ${t("statistics.animal")} (${percentage}%)`;
                        },
                      },
                    },
                  },
                  animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 1200,
                  },
                  hover: {
                    animationDuration: 300,
                  },
                }}
              />
            </div>

            {/* Animal Types Legend */}
            <div className="space-y-3">
              {(
                useAnimalTypeDistributionResult?.data?.data ||
                useAnimalTypeDistributionResult?.data ||
                animalTypes ||
                []
              ).map((animal, index) => {
                const name =
                  animal.animalType ||
                  animal.AnimalType ||
                  animal.AnimalTypeName ||
                  t("statistics.unknown");
                const count = animal.count || animal.Count || 0;
                const total =
                  (
                    useAnimalTypeDistributionResult?.data?.data ||
                    useAnimalTypeDistributionResult?.data ||
                    animalTypes ||
                    []
                  ).reduce((s, x) => s + (x.count || x.Count || 0), 0) || 1;
                const percentage = ((count / total) * 100).toFixed(2);
                const color = [
                  "rgba(59, 130, 246, 0.8)",
                  "rgba(16, 185, 129, 0.8)",
                  "rgba(245, 158, 11, 0.8)",
                  "rgba(239, 68, 68, 0.8)",
                  "rgba(139, 92, 246, 0.8)",
                  "rgba(6, 182, 212, 0.8)",
                  "rgba(132, 204, 22, 0.8)",
                  "rgba(249, 115, 22, 0.8)",
                ][index % 8];

                return (
                  <div
                    key={`${name}-${index}`}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors border border-gray-100 dark:border-zinc-700"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-5 h-5 rounded-full shadow-md"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-sm font-semibold text-gray-700 dark:text-zinc-200 truncate">
                        {StringConverter.convert(name, i18n.language)}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 dark:text-zinc-100">
                        {count}
                      </div>
                      <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {percentage}%
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="pt-3 border-t-2 border-gray-200 dark:border-zinc-700">
                <div className="flex justify-between items-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="text-sm font-bold text-gray-700 dark:text-zinc-200">
                    {t("statistics.total_animals")}
                  </span>
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {(
                      useAnimalTypeDistributionResult?.data?.data ||
                      useAnimalTypeDistributionResult?.data ||
                      animalTypes ||
                      []
                    ).reduce((s, x) => s + (x.count || x.Count || 0), 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContentContainer>
  );
}
