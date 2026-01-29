import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  FileText, 
  Calendar as CalendarIcon,
  Search,
  Eye,
  Download,
  CreditCard,
  User,
  Phone,
  Package,
  X
} from "lucide-react";
import { formatNumberWithThousands } from "@/utilities/number";
import { CURRENCY } from "@/constants/currency";
import { getSales, getSaleById } from "@/api/sales";
import { toDateOnly } from "@/utilities/date";
import GenericTable from "@/components/common/GenericTable";
import { Dialog, DialogContent } from "@/components/ui/Dialog";

export default function SalesHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Fetch sales
  const { data: salesData, isLoading, refetch } = useQuery({
    queryKey: ["sales", searchTerm, startDate, endDate],
    queryFn: () => getSales({
      search: searchTerm,
      startDate: startDate,
      endDate: endDate,
      pageSize: 50
    }),
  });

  // Fetch sale details
  const { data: saleDetails } = useQuery({
    queryKey: ["sale-details", selectedSale?.id],
    queryFn: () => getSaleById(selectedSale.id),
    enabled: !!selectedSale?.id && showDetails
  });

  const sales = salesData?.data?.items || salesData?.data || [];

  // Table columns
  const columns = [
    {
      header: "رقم الفاتورة",
      accessor: "saleNumber",
      render: (sale) => (
        <span className="font-semibold text-primary">{sale.saleNumber}</span>
      )
    },
    {
      header: "التاريخ",
      accessor: "saleDate",
      render: (sale) => new Date(sale.saleDate).toLocaleDateString("ar-EG")
    },
    {
      header: "العميل",
      accessor: "customerName",
      render: (sale) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-400" />
          <span>{sale.customerName || "عميل نقدي"}</span>
        </div>
      )
    },
    {
      header: "عدد الأصناف",
      accessor: "itemCount",
      render: (sale) => (
        <Badge variant="secondary">{sale.itemCount || sale.saleItems?.length || 0}</Badge>
      )
    },
    {
      header: "المبلغ الإجمالي",
      accessor: "totalAmount",
      render: (sale) => (
        <span className="font-bold text-green-600">
          {formatNumberWithThousands(sale.totalAmount || sale.finalAmount || 0)} {CURRENCY.SHORT_NAME}
        </span>
      )
    },
    {
      header: "حالة الدفع",
      accessor: "paymentStatus",
      render: (sale) => {
        const status = sale.paymentStatus || (sale.isPaid ? "مدفوع" : "غير مدفوع");
        const variant = status === "مدفوع" ? "success" : 
                       status === "مدفوع جزئياً" ? "warning" : 
                       "destructive";
        return <Badge variant={variant}>{status}</Badge>;
      }
    },
  ];

  const renderActions = useCallback(
    (sale) => (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setSelectedSale(sale);
          setShowDetails(true);
        }}
        title="عرض التفاصيل"
      >
        <Eye className="h-4 w-4" />
      </Button>
    ),
    []
  );

  // Calculate summary statistics
  const calculateSummary = () => {
    if (!sales.length) return { total: 0, paid: 0, unpaid: 0, count: 0 };
    
    return sales.reduce((acc, sale) => {
      const amount = sale.totalAmount || sale.finalAmount || 0;
      acc.total += amount;
      
      const status = sale.paymentStatus || (sale.isPaid ? "مدفوع" : "غير مدفوع");
      if (status === "مدفوع") {
        acc.paid += amount;
      } else {
        acc.unpaid += amount;
      }
      acc.count++;
      return acc;
    }, { total: 0, paid: 0, unpaid: 0, count: 0 });
  };

  const summary = calculateSummary();

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">سجل المبيعات</h1>
        <p className="text-gray-600 mt-1">عرض وإدارة جميع عمليات البيع</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900">عدد المبيعات</p>
                <p className="text-2xl font-bold text-blue-900">{summary.count}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-900">إجمالي المبيعات</p>
                <p className="text-2xl font-bold text-green-900">
                  {formatNumberWithThousands(summary.total)}
                </p>
                <p className="text-xs text-green-700">{CURRENCY.SHORT_NAME}</p>
              </div>
              <Package className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-900">المدفوع</p>
                <p className="text-2xl font-bold text-emerald-900">
                  {formatNumberWithThousands(summary.paid)}
                </p>
                <p className="text-xs text-emerald-700">{CURRENCY.SHORT_NAME}</p>
              </div>
              <CreditCard className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-900">الآجل</p>
                <p className="text-2xl font-bold text-orange-900">
                  {formatNumberWithThousands(summary.unpaid)}
                </p>
                <p className="text-xs text-orange-700">{CURRENCY.SHORT_NAME}</p>
              </div>
              <CalendarIcon className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-end">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <label className="text-sm font-medium mb-1 block">البحث</label>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="ابحث برقم الفاتورة أو اسم العميل..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-9"
                />
              </div>
            </div>

            {/* Start Date */}
            <div>
              <label className="text-sm font-medium mb-1 block">من تاريخ</label>
              <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-48 justify-between font-normal"
                  >
                    {startDate ? new Date(startDate).toLocaleDateString("ar-EG") : "اختر التاريخ"}
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate ? new Date(startDate) : undefined}
                    onSelect={(date) => {
                      if (date) setStartDate(toDateOnly(date));
                      setStartDateOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End Date */}
            <div>
              <label className="text-sm font-medium mb-1 block">إلى تا��يخ</label>
              <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-48 justify-between font-normal"
                  >
                    {endDate ? new Date(endDate).toLocaleDateString("ar-EG") : "اختر التاريخ"}
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate ? new Date(endDate) : undefined}
                    onSelect={(date) => {
                      if (date) setEndDate(toDateOnly(date));
                      setEndDateOpen(false);
                    }}
                    disabled={(date) => startDate && date < new Date(startDate)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Clear Filters */}
            {(searchTerm || startDate || endDate) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setStartDate(null);
                  setEndDate(null);
                }}
              >
                مسح الفلاتر
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة المبيعات</CardTitle>
        </CardHeader>
        <CardContent>
          <GenericTable
            data={sales}
            columns={columns}
            renderActions={renderActions}
            isLoading={isLoading}
            isFetching={false}
            isError={false}
            pagination={{
              page: 1,
              pageSize: 50,
              totalCount: sales.length,
              lastPage: 1,
              hasNextPage: false,
              hasPreviousPage: false
            }}
            onPageChange={() => {}}
            emptyMessage="لا توجد مبيعات"
          />
        </CardContent>
      </Card>

      {/* Sale Details Modal */}
      <Dialog open={showDetails} onOpenChange={(open) => {
        setShowDetails(open);
        if (!open) setSelectedSale(null);
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
          {selectedSale && (
          <div className="space-y-6">
              {/* Header */}
              <div className="border-b pb-4">
                <h2 className="text-xl font-bold text-gray-900">تفاصيل الفاتورة</h2>
                <p className="text-sm text-gray-600 mt-1">#{selectedSale.saleNumber}</p>
              </div>

              {/* Sale Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">التاريخ</p>
                  <p className="font-semibold">
                    {new Date(selectedSale.saleDate).toLocaleDateString("ar-EG")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">العميل</p>
                  <p className="font-semibold flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {selectedSale.customerName || "عميل مباشر"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">حالة الدفع</p>
                  <Badge variant={
                    (selectedSale.paymentStatus === "مدفوع" || selectedSale.isPaid) ? "success" : 
                    selectedSale.paymentStatus === "مدفوع جزئياً" ? "warning" : 
                    "destructive"
                  }>
                    {selectedSale.paymentStatus || (selectedSale.isPaid ? "مدفوع" : "غير مدفوع")}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">عدد الأصناف</p>
                  <p className="font-semibold">{selectedSale.itemCount || 0}</p>
                </div>
              </div>

              {/* Items */}
              {saleDetails?.saleItems && (
                <div>
                  <h3 className="font-semibold mb-3">الأصناف</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-right text-sm font-semibold">المنتج</th>
                          <th className="px-4 py-3 text-right text-sm font-semibold">الكمية</th>
                          <th className="px-4 py-3 text-right text-sm font-semibold">السعر</th>
                          <th className="px-4 py-3 text-right text-sm font-semibold">المجموع</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {saleDetails.saleItems.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3">
                              <div>
                                <p className="font-medium">{item.productName}</p>
                                <p className="text-sm text-gray-600">{item.variantName}</p>
                              </div>
                            </td>
                            <td className="px-4 py-3">{item.quantity}</td>
                            <td className="px-4 py-3">
                              {formatNumberWithThousands(item.unitSellPrice)} {CURRENCY.SHORT_NAME}
                            </td>
                            <td className="px-4 py-3 font-semibold">
                              {formatNumberWithThousands(item.totalPrice)} {CURRENCY.SHORT_NAME}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Summary */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>الإجمالي:</span>
                  <span className="text-primary">
                    {formatNumberWithThousands(selectedSale.totalAmount || selectedSale.finalAmount || 0)} {CURRENCY.SHORT_NAME}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Download className="h-4 w-4 ml-2" />
                  طباعة الفاتورة
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDetails(false);
                    setSelectedSale(null);
                  }}
                >
                  إغلاق
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
