"use client"

import { useState, useEffect, useRef } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "react-toastify"
import { useTranslation } from "react-i18next"
import { ShoppingCart, Search, Plus, Minus, Trash2, CreditCard, DollarSign, Package, User } from "lucide-react"
import { formatNumberWithThousands } from "@/utilities/number"
import { CURRENCY } from "@/constants/currency"
import storageApi from "@/api/storage"
import { useCreateSale } from "@/hooks/queries/useStorageQueries"
import { toDateOnly } from "@/utilities/date"

export default function PointOfSale() {
  const { t, i18n } = useTranslation()
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [cart, setCart] = useState([])
  const [showCheckout, setShowCheckout] = useState(false)
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [amountPaid, setAmountPaid] = useState(0)
  const searchInputRef = useRef(null)

  // Focus on search input on mount
  useEffect(() => {
    searchInputRef.current?.focus()
  }, [])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // Fetch product variants for search
  const { data: productVariants = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ["product-variants-pos", debouncedSearchTerm],
    queryFn: () =>
      storageApi.getProductVariants({
        searchTerm: debouncedSearchTerm,
        pageSize: 20,
      }),
    enabled: debouncedSearchTerm.length >= 1,
    select: (response) => response?.data?.items || response?.data || response || [],
  })

  // Create sale mutation using centralized hook
  const createSaleMutation = useCreateSale()

  const handleSaleSuccess = () => {
    toast.success(t("pos.sale_success"))
    // Reset everything
    setCart([])
    setCustomerName("")
    setCustomerPhone("")
    setPaymentMethod("cash")
    setAmountPaid(0)
    setShowCheckout(false)
    setSearchTerm("")
    searchInputRef.current?.focus()
  }

  // Add item to cart
  const addToCart = (variant) => {
    const stock = variant.totalStock || variant.currentStock || 0
    const existingItem = cart.find((item) => item.variantId === variant.id)

    if (existingItem) {
      // Check stock
      if (existingItem.quantity >= stock) {
        toast.error(t("pos.stock_error", { stock }))
        return
      }
      // Update quantity
      setCart(cart.map((item) => (item.variantId === variant.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      // Check stock
      if (stock < 1) {
        toast.error(t("pos.not_in_stock"))
        return
      }
      // Add new item
      setCart([
        ...cart,
        {
          variantId: variant.id,
          productId: variant.productId,
          productName: variant.productName,
          variantName: variant.variantName,
          unitPrice: variant.currentSellPrice,
          quantity: 1,
          maxStock: stock,
          barcode: variant.barcode,
        },
      ])
    }

    // Don't clear search - keep it for adding more items
  }

  // Update quantity
  const updateQuantity = (variantId, delta) => {
    setCart(
      cart
        .map((item) => {
          if (item.variantId === variantId) {
            const newQuantity = item.quantity + delta
            if (newQuantity <= 0) return null
            if (newQuantity > item.maxStock) {
              toast.error(t("pos.stock_error", { stock: item.maxStock }))
              return item
            }
            return { ...item, quantity: newQuantity }
          }
          return item
        })
        .filter(Boolean),
    )
  }

  // Set quantity directly
  const setQuantity = (variantId, value) => {
    const quantity = Number.parseInt(value) || 0

    setCart(
      cart.map((item) => {
        if (item.variantId === variantId) {
          if (quantity <= 0) {
            toast.error(t("pos.quantity_error"))
            return item
          }
          if (quantity > item.maxStock) {
            toast.error(t("pos.stock_error", { stock: item.maxStock }))
            return { ...item, quantity: item.maxStock }
          }
          return { ...item, quantity }
        }
        return item
      }),
    )
  }

  // Remove from cart
  const removeFromCart = (variantId) => {
    setCart(cart.filter((item) => item.variantId !== variantId))
  }

  // Calculate totals
  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  }

  const calculateItemCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0)
  }

  // Handle checkout
  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error(t("pos.cart_empty"))
      return
    }
    setShowCheckout(true)
    setAmountPaid(calculateTotal())
  }

  // Process sale
  const processSale = () => {
    const total = calculateTotal()

    if (paymentMethod === "cash" && amountPaid < total) {
      toast.error(t("pos.amount_error"))
      return
    }

    const saleData = {
      saleDate: toDateOnly(new Date()),
      customerName: customerName || null,
      customerPhone: customerPhone || null,
      totalAmount: total,
      discountAmount: 0,
      finalAmount: total,
      paymentMethod: paymentMethod,
      isPaid: paymentMethod === "cash",
      notes: null,
      saleItems: cart.map((item) => ({
        productVariantId: item.variantId,
        quantity: item.quantity,
        unitSellPrice: item.unitPrice,
        totalPrice: item.unitPrice * item.quantity,
      })),
    }

    createSaleMutation.mutate(saleData, {
      onSuccess: handleSaleSuccess,
    })
  }

  // Calculate change
  const calculateChange = () => {
    const total = calculateTotal()
    return paymentMethod === "cash" ? Math.max(0, amountPaid - total) : 0
  }

  // Handle barcode scan simulation (for future implementation)
  const handleBarcodeInput = (e) => {
    if (e.key === "Enter" && searchTerm.startsWith("BC-")) {
      // Simulate barcode scan
      const variant = productVariants.find((v) => v.barcode === searchTerm)
      if (variant) {
        addToCart(variant)
      } else {
        toast.error(t("pos.barcode_not_found"))
      }
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-zinc-900" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="bg-white dark:bg-zinc-800 border-b dark:border-zinc-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">{t("pos.title")}</h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-zinc-400">
            <span>
              {t("pos.receipt_date")}: {new Date().toLocaleDateString(i18n.language === "ar" ? "en-SA" : "en-GB")}
            </span>
            <span>
              {t("pos.receipt_time")}:{" "}
              {new Date().toLocaleTimeString(i18n.language === "ar" ? "en-SA" : "en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left side - Products */}
        <div className="flex-1 flex flex-col p-3 sm:p-4 lg:p-6 min-h-0">
          {/* Search */}
          <div className="mb-4 sm:mb-6 flex-shrink-0">
            <div className="relative">
              <Search
                className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-zinc-600 ${i18n.language === "ar" ? "right-3" : "left-3"}`}
              />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder={t("pos.search_placeholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleBarcodeInput}
                className={`h-10 sm:h-12 text-base sm:text-lg ${i18n.language === "ar" ? "pr-9 sm:pr-10" : "pl-9 sm:pl-10"}`}
              />
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
            {isLoadingProducts ? (
              <div className="text-center py-8 text-gray-500 dark:text-zinc-500">{t("pos.searching")}</div>
            ) : debouncedSearchTerm && productVariants.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {productVariants.map((variant) => {
                  const stock = variant.totalStock || variant.currentStock || 0
                  return (
                    <Card
                      key={variant.id}
                      className={`group relative transition-shadow hover:shadow-xl cursor-pointer border-2 ${
                        stock === 0
                          ? "opacity-60 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20"
                          : stock < 5
                            ? "border-orange-200 dark:border-orange-900 hover:border-orange-400 dark:hover:border-orange-500"
                            : "border-gray-200 dark:border-zinc-700 hover:border-primary dark:hover:border-primary"
                      }`}
                      onClick={() => stock > 0 && addToCart(variant)}
                    >
                      {stock === 0 && (
                        <div className="absolute inset-0 bg-red-500/20 rounded-lg flex items-center justify-center z-10">
                          <span className="text-red-700 dark:text-red-300 font-bold text-sm sm:text-base rotate-12 px-2 py-1 bg-white/90 dark:bg-zinc-900/90 rounded">
                            {t("pos.out_of_stock")}
                          </span>
                        </div>
                      )}
                      <CardContent className="p-2 sm:p-3">
                        <div className="flex flex-col min-h-[160px]">
                          {/* Product Info */}
                          <div className="mb-2">
                            <h3 className="font-bold text-gray-900 dark:text-zinc-100 text-xs sm:text-sm mb-0.5 line-clamp-2 text-center leading-tight">
                              {variant.productName}
                            </h3>
                            <p className="text-[10px] sm:text-xs text-gray-600 dark:text-zinc-400 text-center leading-relaxed mt-1">
                              {variant.variantName}
                            </p>
                          </div>

                          {/* Stock Badge */}
                          <div
                            className={`flex items-center justify-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold mb-2 ${
                              stock === 0
                                ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
                                : stock < 5
                                  ? "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300"
                                  : "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                            }`}
                          >
                            <Package className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                            <span className="truncate">{formatNumberWithThousands(stock)}</span>
                          </div>

                          {/* Price */}
                          <div className="border-t pt-1.5 mb-2">
                            <div className="flex items-center justify-center gap-0.5">
                              <span className="text-sm sm:text-base font-bold text-primary">
                                {formatNumberWithThousands(variant.currentSellPrice.toFixed(2))}
                              </span>
                              <span className="text-[10px] text-gray-500 dark:text-zinc-400">
                                {CURRENCY.SHORT_NAME}
                              </span>
                            </div>
                          </div>

                          {/* Quick Add Button */}
                          <Button
                            size="sm"
                            className="w-full mt-auto text-xs h-7"
                            disabled={stock === 0}
                            onClick={(e) => {
                              e.stopPropagation()
                              addToCart(variant)
                            }}
                          >
                            <Plus className={`h-3 w-3 ${i18n.language === "ar" ? "ml-1" : "mr-1"}`} />
                            {t("pos.add")}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : debouncedSearchTerm ? (
              <div className="text-center py-8 text-gray-500 dark:text-zinc-500">{t("common.no_results_found")}</div>
            ) : (
              <div className="text-center py-8 text-gray-400 dark:text-zinc-500">
                <Package className="h-16 w-16 mx-auto mb-4 dark:text-zinc-600" />
                <p className="text-lg">{t("pos.start_search_message")}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right side - Cart */}
        <div
          className={`w-full lg:w-96 bg-white dark:bg-zinc-800 border-t dark:border-zinc-700 lg:border-t-0 flex flex-col max-h-[50vh] lg:max-h-none ${i18n.language === "ar" ? "lg:border-l dark:lg:border-zinc-700" : "lg:border-r dark:lg:border-zinc-700"}`}
        >
          {/* Cart Header */}
          <div className="p-3 sm:p-4 border-b dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-semibold dark:text-zinc-100">{t("pos.cart_title")}</h2>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-zinc-400">
                <ShoppingCart className="h-4 w-4" />
                <span>
                  {calculateItemCount()} {t("pos.item_count")}
                </span>
              </div>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4">
            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-400 dark:text-zinc-500">
                <ShoppingCart className="h-12 w-12 mx-auto mb-3 dark:text-zinc-600" />
                <p>{t("pos.cart_empty")}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <Card key={item.variantId} className="p-3 dark:bg-zinc-900 dark:border-zinc-700">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-zinc-100 text-sm">{item.productName}</h4>
                        <p className="text-xs text-gray-600 dark:text-zinc-400">{item.variantName}</p>
                        <p className="text-sm font-semibold text-primary mt-1">
                          {formatNumberWithThousands(item.unitPrice.toFixed(2))} {CURRENCY.SHORT_NAME}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7 flex-shrink-0 bg-transparent"
                          onClick={() => updateQuantity(item.variantId, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          max={item.maxStock}
                          value={item.quantity}
                          onChange={(e) => setQuantity(item.variantId, e.target.value)}
                          className="w-14 h-7 text-center p-1 text-sm font-semibold"
                        />
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7 flex-shrink-0 bg-transparent"
                          onClick={() => updateQuantity(item.variantId, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          className="h-7 w-7 flex-shrink-0"
                          onClick={() => removeFromCart(item.variantId)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-zinc-400">{t("pos.total_price")}:</span>
                      <span className="font-bold dark:text-zinc-100">
                        {formatNumberWithThousands((item.unitPrice * item.quantity).toFixed(2))} {CURRENCY.SHORT_NAME}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          <div className="border-t dark:border-zinc-700 p-3 sm:p-4 space-y-2 sm:space-y-3 bg-gray-50 dark:bg-zinc-900">
            <div className="flex justify-between text-base sm:text-lg font-bold dark:text-zinc-100">
              <span>{t("pos.total")}:</span>
              <span className="text-primary dark:text-zinc-100">
                {formatNumberWithThousands(calculateTotal().toFixed(2))} {CURRENCY.SHORT_NAME}
              </span>
            </div>
            <Button
              className="w-full h-10 sm:h-12 text-sm sm:text-base"
              onClick={handleCheckout}
              disabled={cart.length === 0}
            >
              <CreditCard className={`h-4 w-4 sm:h-5 sm:w-5 ${i18n.language === "ar" ? "ml-2" : "mr-2"}`} />
              {t("pos.proceed_checkout")}
            </Button>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="max-w-2xl" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
          <DialogHeader>
            <DialogTitle>{t("pos.checkout_title")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Customer Info */}
            <div className="space-y-3">
              <div>
                <Label htmlFor="customerName">{t("pos.customer_name")}</Label>
                <div className="relative mt-1">
                  <User
                    className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-zinc-600 ${i18n.language === "ar" ? "right-3" : "left-3"}`}
                  />
                  <Input
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={t("pos.customer_placeholder")}
                    className={i18n.language === "ar" ? "pr-9" : "pl-9"}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="customerPhone">{t("pos.customer_phone")}</Label>
                <Input
                  id="customerPhone"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder={t("pos.phone_placeholder")}
                  dir="ltr"
                  className={i18n.language === "ar" ? "text-right" : "text-left"}
                />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <Label>{t("pos.payment_method")}</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant={paymentMethod === "cash" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("cash")}
                >
                  {t("pos.cash")}
                </Button>
                <Button
                  variant={paymentMethod === "credit" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("credit")}
                >
                  {t("pos.credit")}
                </Button>
              </div>
            </div>

            {/* Amount Paid (for cash) */}
            {paymentMethod === "cash" && (
              <div>
                <Label htmlFor="amountPaid">{t("pos.amount_paid")}</Label>
                <div className="relative mt-1">
                  <DollarSign
                    className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-zinc-600 ${i18n.language === "ar" ? "right-3" : "left-3"}`}
                  />
                  <Input
                    id="amountPaid"
                    type="number"
                    value={amountPaid.toFixed(2)}
                    onChange={(e) => setAmountPaid(Number.parseFloat(e.target.value) || 0)}
                    className={i18n.language === "ar" ? "pr-9 text-left" : "pl-9 text-left"}
                    dir="ltr"
                  />
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="space-y-2 p-3 bg-gray-50 dark:bg-zinc-900 rounded-lg">
              <div className="flex justify-between">
                <span>{t("pos.total")}:</span>
                <span className="font-semibold dark:text-zinc-100">
                  {formatNumberWithThousands(calculateTotal().toFixed(2))} {CURRENCY.SHORT_NAME}
                </span>
              </div>
              {paymentMethod === "cash" && (
                <>
                  <div className="flex justify-between">
                    <span>{t("pos.paid_amount")}:</span>
                    <span>
                      {formatNumberWithThousands(amountPaid.toFixed(2))} {CURRENCY.SHORT_NAME}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-primary dark:text-zinc-100">
                    <span>{t("pos.remaining_amount")}:</span>
                    <span>
                      {formatNumberWithThousands(calculateChange().toFixed(2))} {CURRENCY.SHORT_NAME}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowCheckout(false)}>
                {t("pos.cancel")}
              </Button>
              <Button className="flex-1" onClick={processSale} disabled={createSaleMutation.isPending}>
                {createSaleMutation.isPending ? t("common.saving") : t("pos.confirm_sale")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
