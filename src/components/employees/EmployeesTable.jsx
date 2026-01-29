import React, { useMemo, useCallback, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "../ui/Button";
import {
  Users,
  Eye,
  Edit,
  Plus,
  Phone,
  Mail,
  Calendar,
  Trash2,
  Building2,
} from "lucide-react";
import GenericSearchComponent from "../common/GenericSearchComponent";
import GenericTable from "../common/GenericTable";
import ConfirmDialog from "../common/ConfirmDialog";
import { useEmployees, useDeleteEmployee } from "../../hooks/queries/useEmployeeQueries";
import { useTranslation } from "react-i18next";
import { cn } from "@/utilities/cn";

export default function EmployeesTable() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [urlSearchParams, setUrlSearchParams] = useSearchParams();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedToDelete, setSelectedToDelete] = useState(null);

  // Simple page extraction from URL
  const currentPage = useMemo(() => {
    const pageParam = urlSearchParams.get("page");
    const pageNum = pageParam ? Number.parseInt(pageParam, 10) : 1;
    return pageNum > 0 ? pageNum : 1;
  }, [urlSearchParams]);

  const searchTerm = urlSearchParams.get("search") || "";
  const searchColumn = urlSearchParams.get("searchColumn") || "name";
  const orderBy = urlSearchParams.get("orderBy") || "";

  // Build filters
  const searchByMap = {
    name: "name",
    email: "email",
    usertype: "usertype",
  };

  const listParams = {
    page: currentPage,
    pageSize: 15,
    ...(searchTerm && { searchTerm: searchTerm.trim() }),
    ...(searchColumn && searchColumn !== "all" && { searchBy: searchByMap[searchColumn] || searchColumn }),
    ...(orderBy && { orderBy: orderBy, orderDir: "asc" }),
  };

  const { data, isLoading, isError, error, isFetching } = useEmployees(listParams);
  const deleteEmployeeMutation = useDeleteEmployee();

  const formatDate = useCallback((dateString) => {
    if (!dateString) return t("employees.not_specified");
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : 'en-US', options);
  }, [i18n.language, t]);

  const formatServiceDuration = useCallback((employee) => {
    const { serviceYears: years, serviceMonths: months } = employee;

    if (years > 0 && months > 0) {
      return t("employees.duration.years_months", { years, months });
    } else if (years > 0) {
      return t("employees.duration.years", { count: years });
    } else if (months > 0) {
      return t("employees.duration.months", { count: months });
    } else {
      return t("employees.duration.less_than_month");
    }
  }, [t]);

  // Simple page change handler
  const handlePageChange = useCallback(
    (newPage) => {
      if (newPage === currentPage || newPage < 1 || (data?.totalPages && newPage > data.totalPages)) {
        return;
      }

      const newParams = new URLSearchParams(urlSearchParams);
      newParams.set("page", newPage.toString());
      setUrlSearchParams(newParams);
    },
    [currentPage, data?.totalPages, urlSearchParams, setUrlSearchParams]
  );

  // Search handler
  const handleSearchChange = useCallback(
    ({ searchTerm, searchColumn, orderBy }) => {
      const newParams = new URLSearchParams();
      if (searchTerm?.trim()) {
        newParams.set("search", searchTerm.trim());
        newParams.set("searchColumn", searchColumn || "name");
      }
      if (orderBy) {
        newParams.set("orderBy", orderBy);
      }
      newParams.set("page", "1");
      setUrlSearchParams(newParams);
    },
    [setUrlSearchParams]
  );

  // Sort handler
  const handleSort = useCallback(
    (column) => {
      console.log(`📊 EMPLOYEES SORT: ${column}`);
      const newParams = new URLSearchParams(urlSearchParams);
      newParams.set("orderBy", column);
      newParams.set("page", "1");
      setUrlSearchParams(newParams);
    },
    [urlSearchParams, setUrlSearchParams]
  );

  // Delete handlers
  const handleDeleteClick = (employee) => {
    setSelectedToDelete(employee);
    setConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedToDelete) {
      try {
        await deleteEmployeeMutation.mutateAsync(selectedToDelete.id);
        setConfirmOpen(false);
        setSelectedToDelete(null);
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  // Table columns configuration
  const columns = [
    {
      header: t("common.name"),
      accessor: 'name',
      render: (employee) => (
        <div className={cn("flex items-center space-x-3", isRTL && "space-x-reverse")}>
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className={isRTL ? "text-right" : "text-left"}>
            <div className="font-medium text-gray-900 dark:text-zinc-100">{employee.name}</div>
            <div className="text-sm text-gray-500 dark:text-zinc-500">{t(`employees.types.${employee.userType}`, { defaultValue: employee.userType })}</div>
          </div>
        </div>
      )
    },
    {
      header: t("common.email"),
      accessor: 'email',
      render: (employee) => (
        <div className={cn("flex items-center space-x-2", isRTL && "space-x-reverse")}>
          <Mail className="w-4 h-4 text-gray-400 dark:text-zinc-500" />
          <span className="text-gray-700 dark:text-zinc-300">{employee.email}</span>
        </div>
      )
    },
    {
      header: t("common.phone"),
      accessor: 'phoneNumber',
      render: (employee) => employee.phoneNumber ? (
        <div className={cn("flex items-center space-x-2", isRTL && "space-x-reverse")}>
          <Phone className="w-4 h-4 text-gray-400 dark:text-zinc-500" />
          <span className="text-gray-700 dark:text-zinc-300">{employee.phoneNumber}</span>
        </div>
      ) : <span className="text-gray-400">{t("employees.not_specified")}</span>
    },
    {
      header: t("clinics.title"),
      accessor: 'clinicName',
      render: (employee) => (
        <div className={cn("flex items-center space-x-2", isRTL && "space-x-reverse")}>
          <Building2 className="w-4 h-4 text-gray-400 dark:text-zinc-500" />
          <span className="text-gray-700 dark:text-zinc-300">{employee.clinicName || t("employees.not_specified")}</span>
        </div>
      )
    },
    {
      header: t("employees.join_date"),
      accessor: 'joinDate',
      render: (employee) => (
        <div className={cn("flex items-center space-x-2", isRTL && "space-x-reverse")}>
          <Calendar className="w-4 h-4 text-gray-400 dark:text-zinc-500" />
          <span className="text-gray-700 dark:text-zinc-300">{formatDate(employee.joinDate)}</span>
        </div>
      )
    },
    {
      header: t("employees.service_duration"),
      accessor: 'serviceDuration',
      render: (employee) => (
        <div className={cn("text-sm text-gray-600 dark:text-zinc-400", isRTL ? "text-right" : "text-left")}>
          {formatServiceDuration(employee)}
        </div>
      )
    }
  ];

  // Search options
  const searchOptions = [
    { value: "name", label: t("common.name") },
    { value: "email", label: t("common.email") },
    { value: "usertype", label: t("employees.user_type") },
  ];

  if (isError) {
    return (
      <div className="p-6 text-center" dir={isRTL ? "rtl" : "ltr"}>
        <div className="text-red-600 dark:text-red-400 mb-4 font-bold">{t("employees.error_loading")}</div>
        <div className="text-gray-600 dark:text-zinc-400">{error?.message}</div>
      </div>
    );
  }

  return (
    <div className="p-4" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary-800 dark:text-zinc-100">{t("employees.title")}</h1>
        <Link to="/clinic/employees/add" className="w-full sm:w-auto">
          <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white w-full shadow-md transition-all active:scale-95">
            <Plus className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
            {t("employees.add_new")}
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-4">
        <GenericSearchComponent
          searchColumns={[
            { value: "name", label: t("common.name") },
            { value: "email", label: t("common.email") },
            { value: "phoneNumber", label: t("common.phone") },
          ]}
          orderByColumns={[
            { value: "newest", label: t("common.newest") },
            { value: "oldest", label: t("common.oldest") },
          ]}
          onSearchChange={handleSearchChange}
          placeholder={t("employees.search_placeholder")}
          totalLabel={t("employees.total_label")}
          totalCount={data?.totalCount || 0}
          isRTL={isRTL}
          defaultSearchTerm={searchTerm}
          defaultSearchColumn={searchColumn}
          defaultOrderBy={orderBy}
          debounceMs={300}
        />
      </div>

      <GenericTable
        columns={columns}
        data={data?.data || []}
        pagination={{
          page: currentPage,
          pageSize: data?.pageSize || 10,
          totalCount: data?.totalCount || 0,
          lastPage: data?.totalPages || 1,
          hasNextPage: currentPage < (data?.totalPages || 1),
          hasPreviousPage: currentPage > 1
        }}
        onPageChange={handlePageChange}
        renderActions={(employee) => (
          <div className={cn("flex gap-2", isRTL ? "justify-start" : "justify-end")}>
            <Button 
              asChild 
              variant="outline" 
              size="icon" 
              className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-900/50 dark:hover:bg-blue-900/20 bg-transparent transition-all"
              title={t("common.view")}
            >
              <Link to={`/clinic/employees/${employee.id}`}>
                <Eye className="w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="icon"
              className="text-amber-600 border-amber-300 hover:bg-amber-50 dark:text-amber-400 dark:border-amber-900/50 dark:hover:bg-amber-900/20 bg-transparent transition-all"
              title={t("common.edit")}
            >
              <Link to={`/clinic/employees/edit/${employee.id}`}>
                <Edit className="w-5 h-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-900/50 dark:hover:bg-red-900/20 bg-transparent transition-all"
              onClick={() => handleDeleteClick(employee)}
              title={t("common.delete")}
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        )}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        tableContainerClasses="border-primary-200 dark:border-zinc-800 shadow-sm"
        tableHeaderClasses="bg-primary-50 dark:bg-zinc-800/50 text-primary-700 dark:text-zinc-200"
        tableRowClasses="bg-white dark:bg-zinc-900 hover:bg-primary-50 dark:hover:bg-zinc-800/50 transition-colors duration-200"
        tableCellClasses="text-primary-700 dark:text-zinc-300"
        emptyMessage={t("employees.empty_message")}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleDeleteConfirm}
        title={t("employees.delete_confirm", { name: selectedToDelete?.name || '' })}
        confirmLabel={t("common.delete")}
        cancelLabel={t("common.cancel")}
        isLoading={deleteEmployeeMutation.isPending}
      />
    </div>
  );
}
