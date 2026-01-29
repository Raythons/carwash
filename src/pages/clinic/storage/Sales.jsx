"use client";

import { useMemo, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, Edit, Trash2, Plus } from "lucide-react";
import { toast } from "react-toastify";
import GenericSearchComponent from "@/components/common/GenericSearchComponent";
import GenericTable from "@/components/common/GenericTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getSales, deleteSale } from "@/api/sales";
import { formatNumberWithThousands } from "@/utilities/number";
import { CURRENCY } from "@/constants/currency";
import { useTranslation } from "react-i18next";

export default function Sales() {
  const { t, i18n } = useTranslation();
  const [urlSearchParams, setUrlSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const searchColumns = [
    { value: "customerName", label: t("storage.sales.table.search_columns.customer_name") },
    { value: "saleNumber", label: t("storage.sales.table.search_columns.invoice_number") },
  ];

  const orderByColumns = [
    { value: "saleDate", label: t("storage.sales.table.order_columns.date") },
    { value: "customerName", label: t("storage.sales.table.order_columns.customer_name") },
    { value: "totalAmount", label: t("storage.sales.table.order_columns.total_amount") },
  ];

  const currentPage = useMemo(() => {
    const pageParam = urlSearchParams.get("page");
    const pageNum = pageParam ? Number.parseInt(pageParam, 10) : 1;
    return pageNum > 0 ? pageNum : 1;
  }, [urlSearchParams]);

  const searchTerm = urlSearchParams.get("search") || "";
  const searchColumn = urlSearchParams.get("searchColumn") || "customerName";
  const orderBy = urlSearchParams.get("orderBy") || "saleDate";
  const sortOrder = urlSearchParams.get("sortOrder") || "desc";

  const queryParams = useMemo(() => ({
    page: currentPage,
    pageSize: 15,
    ...(searchTerm && { searchTerm: searchTerm.trim() }),
    ...(searchColumn && searchColumn !== "all" && { searchBy: searchColumn }),
    ...(orderBy && { sortBy: orderBy, sortOrder }),
  }), [currentPage, searchTerm, searchColumn, orderBy, sortOrder]);

  const { data: salesData, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["sales", queryParams],
    queryFn: () => getSales(queryParams),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSale,
    onSuccess: () => {
      toast.success(t("storage.sales.messages.delete_success"));
      queryClient.invalidateQueries(["sales"]);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || t("storage.sales.messages.delete_error"));
    },
  });

  // Extract sales data - handle different response structures
  const salesArray = salesData?.data?.items || salesData?.items || salesData?.data || [];
  const sales = Array.isArray(salesArray) ? salesArray.map((s) => ({
    id: s.id,
    saleNumber: s.saleNumber,
    saleDate: s.saleDate,
    customerName: s.customerName || t("storage.sales.direct_customer"),
    totalAmount: s.totalAmount || s.finalAmount || 0,
    amountPaid: s.amountPaid || 0,
    paymentStatus: s.paymentStatus || t("storage.sales.payment_statuses.unpaid"),
    itemsCount: s.itemCount || s.saleItems?.length || 0,
  })) : [];

  const pageSize = salesData?.data?.pageSize || salesData?.pageSize || 15;
  const totalCount = salesData?.data?.totalCount || salesData?.totalCount || 0;
  const lastPage = salesData?.data?.lastPage || salesData?.lastPage || Math.max(1, Math.ceil((totalCount || 0) / (pageSize || 1)));
  const hasNextPage = salesData?.data?.hasNextPage ?? salesData?.hasNextPage ?? (currentPage < lastPage);
  const hasPreviousPage = salesData?.data?.hasPreviousPage ?? salesData?.hasPreviousPage ?? (currentPage > 1);

  const handlePageChange = useCallback(
    (newPage) => {
      if (newPage === currentPage || newPage < 1) return;
      const params = new URLSearchParams(urlSearchParams);
      params.set("page", newPage.toString());
      setUrlSearchParams(params);
    },
    [currentPage, urlSearchParams, setUrlSearchParams]
  );

  const handleSearchChange = useCallback(
    (params) => {
      const newParams = new URLSearchParams();
      const term = params.searchTerm?.trim() || "";
      const col = params.searchColumn || "";
      const ord = params.orderBy || "";
      const order = params.sortOrder || "desc";
      if (term) newParams.set("search", term);
      if (col && col !== "all") newParams.set("searchColumn", col);
      if (ord) newParams.set("orderBy", ord);
      if (order) newParams.set("sortOrder", order);
      newParams.set("page", "1");
      setUrlSearchParams(newParams);
    },
    [setUrlSearchParams]
  );

  const handleDelete = useCallback((saleId) => {
    if (window.confirm(t("storage.sales.delete_confirm"))) {
      deleteMutation.mutate(saleId);
    }
  }, [deleteMutation]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(i18n.language === "ar" ? "ar-EG" : "en-US");
  };

  const saleColumns = useMemo(
    () => [
      {
        header: t("storage.sales.table.invoice_number"),
        accessor: "saleNumber",
        cellClassName: "font-medium text-primary-900",
        render: (s) => (
          <Link 
            to={`/clinic/storage/sales/${s.id}`}
            className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 hover:underline font-medium"
          >
            {s.saleNumber}
          </Link>
        ),
      },
      {
        header: t("storage.sales.table.date"),
        accessor: "saleDate",
        cellClassName: "text-base",
        render: (s) => formatDate(s.saleDate),
      },
      {
        header: t("storage.sales.table.customer_name"),
        accessor: "customerName",
        cellClassName: "text-base",
      },
      {
        header: t("storage.sales.table.items_count"),
        accessor: "itemsCount",
        cellClassName: "text-center",
        headerClassName: "text-center",
        render: (s) => (
          <Badge variant="secondary">{s.itemsCount}</Badge>
        ),
      },
      {
        header: t("storage.sales.table.total_amount"),
        accessor: "totalAmount",
        cellClassName: "font-semibold text-green-600 dark:text-green-400",
        render: (s) => `${formatNumberWithThousands(Number(s.totalAmount).toFixed(2))} ${CURRENCY.SHORT_NAME}`,
      },
      {
        header: t("storage.sales.table.amount_paid"),
        accessor: "amountPaid",
        cellClassName: "font-semibold text-blue-600 dark:text-blue-400",
        render: (s) => `${formatNumberWithThousands(Number(s.amountPaid).toFixed(2))} ${CURRENCY.SHORT_NAME}`,
      },
      {
        header: t("storage.sales.table.payment_status"),
        accessor: "paymentStatus",
        cellClassName: "text-center",
        headerClassName: "text-center",
        render: (s) => {
          const statusMap = {
            "مدفوع": { variant: "success", key: "paid" },
            "مدفوع جزئياً": { variant: "warning", key: "partially_paid" },
            "غير مدفوع": { variant: "destructive", key: "unpaid" },
          };
          const status = statusMap[s.paymentStatus] || { variant: "destructive", key: "unpaid" };
          return (
            <Badge variant={status.variant}>
              {t(`storage.sales.payment_statuses.${status.key}`)}
            </Badge>
          );
        },
      },
    ],
    [t]
  );

  const renderSaleActions = useCallback((sale) => (
    <div className="flex gap-2 justify-end">
      <Button 
        asChild 
        variant="outline" 
        size="icon" 
        title={t("storage.sales.actions.view")}
        className="text-blue-600 border-blue-300 dark:border-blue-900 hover:bg-blue-50 dark:hover:bg-blue-950/30 bg-transparent"
      >
        <Link to={`/clinic/storage/sales/${sale.id}`}>
          <Eye className="w-5 h-5" />
        </Link>
      </Button>
      <Button
        asChild
        variant="outline"
        size="icon"
        className="text-amber-600 border-amber-300 dark:border-amber-900 hover:bg-amber-50 dark:hover:bg-amber-950/30 bg-transparent"
        title={t("storage.sales.actions.edit")}
      >
        <Link to={`/clinic/storage/sales/edit/${sale.id}`}>
          <Edit className="w-5 h-5" />
        </Link>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="text-red-600 border-red-300 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950/30 bg-transparent"
        title={t("storage.sales.actions.delete")}
        onClick={() => handleDelete(sale.id)}
        disabled={deleteMutation.isPending}
      >
        <Trash2 className="w-5 h-5" />
      </Button>
    </div>
  ), [handleDelete, deleteMutation.isPending]);

  const pagination = {
    page: currentPage,
    pageSize,
    totalCount,
    lastPage,
    hasNextPage,
    hasPreviousPage,
  };

  return (
    <div className="w-full max-w-full" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-primary-800 dark:text-zinc-100">{t("storage.sales.title")}</h1>
        <Link
          to="/clinic/storage/pos"
          className="bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors duration-300 text-base font-medium font-medium shadow-md"
        >
          <span>{t("storage.sales.new_invoice")}</span>
          <Plus className="w-5 h-5" />
        </Link>
      </div>

      {/* Search */}
      <GenericSearchComponent
        searchColumns={searchColumns}
        orderByColumns={orderByColumns}
        onSearchChange={handleSearchChange}
        totalCount={totalCount}
        defaultSearchTerm={searchTerm}
        defaultSearchColumn={searchColumn}
        defaultOrderBy={orderBy}
        defaultSortOrder={sortOrder}
        isRTL={i18n.language === "ar"}
        debounceMs={300}
      />

      {/* Sales Table */}
      <GenericTable
        columns={saleColumns}
        data={sales}
        pagination={pagination}
        onPageChange={handlePageChange}
        renderActions={renderSaleActions}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        error={error}
        tableContainerClasses="border-primary-200 dark:border-zinc-800"
        tableHeaderClasses="bg-primary-50 dark:bg-zinc-800/50 text-primary-700 dark:text-zinc-200"
        tableRowClasses="bg-white dark:bg-zinc-900 hover:bg-primary-50 dark:hover:bg-zinc-800/50 transition-colors duration-200"
        tableCellClasses="text-primary-700 dark:text-zinc-300 text-base"
        emptyMessage={t("storage.sales.empty_message")}
      />
    </div>
  );
}
