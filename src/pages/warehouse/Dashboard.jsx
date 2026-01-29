"use client"

import { useState, useEffect } from "react"
import { DashboardSkeleton } from "../../components/ui/Skeleton"

export function WarehouseDashboard() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate 5 second loading for demonstration
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-primary-900 mb-4">لوحة تحكم المستودع</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-primary-200">
          <h3 className="text-lg font-semibold text-primary-800 mb-2">إجمالي المنتجات</h3>
          <p className="text-3xl font-bold text-primary-600">1,234</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-primary-200">
          <h3 className="text-lg font-semibold text-primary-800 mb-2">الطلبات المعلقة</h3>
          <p className="text-3xl font-bold text-orange-600">56</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-primary-200">
          <h3 className="text-lg font-semibold text-primary-800 mb-2">المخزون المنخفض</h3>
          <p className="text-3xl font-bold text-red-600">12</p>
        </div>
      </div>
    </>
  )
}
