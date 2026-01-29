"use client"
import { Button } from "../ui/Button"
import GenericTable from "../common/GenericTable"
import ProgressBar from "../ui/ProgressBar"
import { formatNumberWithThousands } from "../../utilities/number"
import { CURRENCY } from "../../constants/currency"
import { useTranslation } from "react-i18next"

export function GoalsTable({ goals, monthsWithGoals, currentYear, isLoading, onEdit, onDelete }) {
  const { t } = useTranslation()

  const getMonthName = (month) => {
    return t(`goals.form.months.${month}`)
  }

  const formatCurrency = (amount) => {
    return `${formatNumberWithThousands(amount)} ${CURRENCY.SHORT_NAME}`
  }

  // Define columns for the generic table
  const columns = [
    {
      header: t("goals.header.month"),
      accessor: "month",
      render: (item) => getMonthName(item.month),
      cellClassName: "text-sm font-medium text-gray-900 dark:text-zinc-100",
    },
    {
      header: t("goals.header.start_date"),
      accessor: "startDate",
      render: (item) => (item.hasGoal ? new Date(item.goal.startDate).toLocaleDateString("en-US") : "-"),
      cellClassName: "text-sm text-gray-500 dark:text-zinc-400",
    },
    {
      header: t("goals.header.end_date"),
      accessor: "endDate",
      render: (item) => (item.hasGoal ? new Date(item.goal.endDate).toLocaleDateString("en-US") : "-"),
      cellClassName: "text-sm text-gray-500 dark:text-zinc-400",
    },
    {
      header: t("goals.header.financial_goal"),
      accessor: "totalClinicProfit",
      render: (item) => (item.hasGoal ? formatCurrency(item.goal.totalClinicProfit) : "-"),
      cellClassName: "text-sm text-gray-500 dark:text-zinc-400",
    },
    {
      header: t("goals.header.current_profit"),
      accessor: "profitSoFar",
      render: (item) => (item.hasGoal ? formatCurrency(item.goal.profitSoFar || 0) : "-"),
      cellClassName: "text-sm text-gray-500 dark:text-zinc-400",
    },
    {
      header: t("goals.header.progress"),
      accessor: "progress",
      render: (item) => {
        if (!item.hasGoal) return "-"

        return (
          <ProgressBar
            current={item.goal.profitSoFar || 0}
            target={item.goal.totalClinicProfit}
            outstanding={item.goal.outstandingAmounts || 0}
            showPercentage={true}
            showTooltip={true}
            className="min-w-32"
          />
        )
      },
      cellClassName: "text-sm",
    },
    {
      header: t("goals.header.status"),
      accessor: "status",
      render: (item) =>
        item.hasGoal ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            {t("goals.status.set")}
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            {t("goals.status.not_set")}
          </span>
        ),
    },
  ]

  // Render actions for each row
  const renderActions = (item) => {
    if (!item.hasGoal) {
      return <span className="text-gray-400 dark:text-zinc-500 text-sm">{t("goals.actions.none")}</span>
    }

    return (
      <>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(item.goal)}
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 dark:border-blue-700 dark:hover:bg-blue-900/30"
        >
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          {t("goals.actions.edit")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(item.goal)}
          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 dark:border-red-700 dark:hover:bg-red-900/30"
        >
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          {t("goals.actions.delete")}
        </Button>
      </>
    )
  }

  // Mock pagination for the generic table (since goals don't use pagination)
  const mockPagination = {
    page: 1,
    pageSize: monthsWithGoals.length,
    totalCount: monthsWithGoals.length,
    lastPage: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  }

  return (
    <GenericTable
      title={`${t("goals.title")} ${currentYear}`}
      columns={columns}
      data={monthsWithGoals}
      pagination={mockPagination}
      onPageChange={() => {}} // No pagination needed
      renderActions={renderActions}
      isLoading={isLoading}
      isFetching={false}
      isError={false}
      emptyMessage={t("goals.empty_message")}
      tableRowClasses={(item) => (item.hasGoal ? "bg-white dark:bg-zinc-900" : "bg-gray-50 dark:bg-zinc-800/30")}
      tableContainerClasses="border-primary-200 dark:border-zinc-800"
      tableHeaderClasses="bg-primary-50 dark:bg-zinc-800/50 text-primary-700 dark:text-zinc-200"
      tableCellClasses="text-primary-700 dark:text-zinc-300"
    />
  )
}
