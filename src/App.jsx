"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ClinicProvider } from "./contexts/ClinicContext";
import { StorageProvider } from "./contexts/StorageContext";
import { Layout } from "./components/Layout";
import LoginPage from "./components/auth/LoginPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import usePermissions, { PERMISSIONS, ROLES } from "./hooks/usePermissions";
import { StorageStatistics } from "./pages/clinic/StorageStatistics";
import { TopSellingProducts } from "./pages/clinic/storage/TopSellingProducts";
import { TopProfitableProducts } from "./pages/clinic/storage/TopProfitableProducts";
import CategoriesTable from "./components/storage/CategoriesTable";
import SuppliersTable from "./components/storage/SuppliersTable";
import ProductsTable from "./components/storage/ProductsTable";
import DealsTable from "./components/storage/DealsTable";
import { AddEditCategory } from "./components/storage/AddEditCategory";
import { AddEditSupplier } from "./components/storage/AddEditSupplier";
import { AddEditProduct } from "./components/storage/AddEditProduct";
import { AddEditDeal } from "./components/storage/AddEditDeal";
import { AddEditProductVariant } from "./components/storage/AddEditProductVariant";
import { ViewProduct } from "./components/storage/ViewProduct";
import { ViewDeal } from "./components/storage/ViewDeal";
import PointOfSale from "./pages/clinic/storage/PointOfSale";
import ProductAnalytics from "./pages/clinic/storage/ProductAnalytics";
import Sales from "./pages/clinic/storage/Sales";
import ViewSale from "./pages/clinic/storage/ViewSale";
import EditSale from "./pages/clinic/storage/EditSale";
import { ClinicReports } from "./pages/clinic/Reports";
import "./index.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import ScrollToTop from "./components/common/ScrollToTop";

import { Statistics } from "./pages/clinic/Statistics";
import { Goals } from "./pages/clinic/Goals";

import NotFound from "./pages/NotFound";
import ProductView from "./pages/public/ProductView";
import SuperAdminDashboard from "./pages/admin/SuperAdminDashboard";
import CreateOrganization from "./pages/admin/CreateOrganization";
import Home from "./pages/public/Home";

// Redirect components for old employee URLs
function EmployeeEditRedirect() {
  const { id } = useParams();
  return <Navigate to={`/dashboard/clinic/employees/edit/${id}`} replace />;
}

function EmployeeViewRedirect() {
  const { id } = useParams();
  return <Navigate to={`/dashboard/clinic/employees/${id}`} replace />;
}

function RootRedirect() {
  const { PERMISSIONS, hasPermission } = usePermissions();
  
  if (hasPermission(PERMISSIONS.SUPER_ADMIN)) {
    return <Navigate to="admin/dashboard" replace />;
  }
  
  return <Navigate to="dashboard" replace />;
}

function App() {
  // Create a stable QueryClient instance
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            cacheTime: 10 * 60 * 1000, // 10 minutes
            refetchOnWindowFocus: false,
            retry: process.env.NODE_ENV === 'production' ? 1 : false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ClinicProvider>
          <StorageProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <ScrollToTop />
            <ToastContainer 
              position="top-right" 
              theme="colored"
              limit={5}
            />
            <Routes>
              {/* Public Routes */}
              <Route path="" element={<Home />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="product/:qrCode" element={<ProductView />} />
              
              {/* Redirect old employee URLs to new format */}
              <Route path="employees/:id/edit" element={<EmployeeEditRedirect />} />
              <Route path="employees/:id" element={<EmployeeViewRedirect />} />
              <Route path="employees/add" element={<Navigate to="dashboard/clinic/employees/add" replace />} />
              <Route path="employees" element={<Navigate to="dashboard/clinic/employees" replace />} />
              
              {/* Protected Routes */}
              <Route path="dashboard" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
            {/* Redirect dashboard root based on role */}
            <Route
              index
              element={
                <ProtectedRoute>
                  <RootRedirect />
                </ProtectedRoute>
              }
            />
            {/* Warehouse Routes - Commented out */}
            {/* <Route
              path="warehouse/dashboard"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.WAREHOUSE_DASHBOARD}>
                  <WarehouseDashboard />
                </ProtectedRoute>
              }
            /> */}
            {/* <Route path="warehouse/products" element={
              <ProtectedRoute requiredPermission={PERMISSIONS.WAREHOUSE_PRODUCTS}>
                <WarehouseProducts />
              </ProtectedRoute>
            } /> */}
            {/* <Route
              path="warehouse/inventory"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.WAREHOUSE_INVENTORY}>
                  <WarehouseInventory />
                </ProtectedRoute>
              }
            /> */}
            {/* <Route path="warehouse/orders" element={
              <ProtectedRoute requiredPermission={PERMISSIONS.WAREHOUSE_ORDERS}>
                <WarehouseOrders />
              </ProtectedRoute>
            } /> */}
            {/* <Route
              path="warehouse/suppliers"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.WAREHOUSE_SUPPLIERS}>
                  <WarehouseSuppliers />
                </ProtectedRoute>
              }
            /> */}
            {/* <Route path="warehouse/reports" element={
              <ProtectedRoute requiredPermission={PERMISSIONS.WAREHOUSE_REPORTS}>
                <WarehouseReports />
              </ProtectedRoute>
            } /> */}
            {/* <Route path="warehouse/settings" element={
              <ProtectedRoute requiredPermission={PERMISSIONS.WAREHOUSE_SETTINGS}>
                <WarehouseSettings />
              </ProtectedRoute>
            } /> */}
            {/* Clinic Routes */}
           
           
            <Route path="clinic/statistics" element={
              <ProtectedRoute requiredPermission={PERMISSIONS.STATISTICS_VIEW}>
                <Statistics />
              </ProtectedRoute>
            } />
            <Route path="clinic/goals" element={
              <ProtectedRoute requiredPermission={PERMISSIONS.GOALS_VIEW}>
                <Goals />
              </ProtectedRoute>
            } />
          
        
            {/* <Route
              path="clinic/appointments"
              element={<AppointmentsTable />}
            /> */}
          

       
            {/* Storage Routes */}
            <Route
              path="clinic/storage/statistics"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.STORAGE_VIEW}>
                  <StorageStatistics />
                </ProtectedRoute>
              }
            />
            <Route
              path="clinic/storage/statistics/top-selling"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.STORAGE_VIEW}>
                  <TopSellingProducts />
                </ProtectedRoute>
              }
            />
            <Route
              path="clinic/storage/statistics/top-profitable"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.STORAGE_VIEW}>
                  <TopProfitableProducts />
                </ProtectedRoute>
              }
            />
            <Route
              path="clinic/storage/categories"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.STORAGE_VIEW}>
                  <CategoriesTable />
                </ProtectedRoute>
              }
            />
            <Route
              path="clinic/storage/categories/add"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.STORAGE_ADD}>
                  <AddEditCategory />
                </ProtectedRoute>
              }
            />
            <Route
              path="clinic/storage/categories/edit/:id"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.STORAGE_EDIT}>
                  <AddEditCategory />
                </ProtectedRoute>
              }
            />
            <Route
              path="clinic/storage/suppliers"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.STORAGE_VIEW}>
                  <SuppliersTable />
                </ProtectedRoute>
              }
            />
            <Route
              path="clinic/storage/suppliers/add"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.STORAGE_ADD}>
                  <AddEditSupplier />
                </ProtectedRoute>
              }
            />
            <Route
              path="clinic/storage/suppliers/edit/:id"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.STORAGE_EDIT}>
                  <AddEditSupplier />
                </ProtectedRoute>
              }
            />
            <Route
              path="clinic/storage/products"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.STORAGE_VIEW}>
                  <ProductsTable />
                </ProtectedRoute>
              }
            />
            <Route
              path="clinic/storage/products/add"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.STORAGE_ADD}>
                  <AddEditProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="clinic/storage/products/edit/:id"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.STORAGE_EDIT}>
                  <AddEditProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="clinic/storage/products/:id"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.STORAGE_VIEW}>
                  <ViewProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="clinic/storage/products/:productId/variants/add"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.STORAGE_ADD}>
                  <AddEditProductVariant />
                </ProtectedRoute>
              }
            />
            <Route
              path="clinic/storage/products/:productId/variants/edit/:variantId"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.STORAGE_EDIT}>
                  <AddEditProductVariant />
                </ProtectedRoute>
              }
            />
            <Route
              path="clinic/storage/deals"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.STORAGE_VIEW}>
                  <DealsTable />
                </ProtectedRoute>
              }
            />
            <Route
              path="clinic/storage/deals/add"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.STORAGE_ADD}>
                  <AddEditDeal />
                </ProtectedRoute>
              }
            />
            <Route
              path="clinic/storage/deals/edit/:id"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.STORAGE_EDIT}>
                  <AddEditDeal />
                </ProtectedRoute>
              }
            />
            <Route
              path="clinic/storage/deals/:id"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.STORAGE_VIEW}>
                  <ViewDeal />
                </ProtectedRoute>
              }
            />
            
            {/* Sales Routes */}
            <Route
              path="clinic/storage/pos"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.STORAGE_VIEW}>
                  <PointOfSale />
                </ProtectedRoute>
              }
            />
            <Route
              path="clinic/storage/sales"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.STORAGE_VIEW}>
                  <Sales />
                </ProtectedRoute>
              }
            />
            <Route
              path="clinic/storage/sales/:id"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.STORAGE_VIEW}>
                  <ViewSale />
                </ProtectedRoute>
              }
            />
            <Route
              path="clinic/storage/sales/edit/:id"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.STORAGE_EDIT}>
                  <EditSale />
                </ProtectedRoute>
              }
            />
            <Route
              path="clinic/storage/analytics"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.STORAGE_VIEW}>
                  <ProductAnalytics />
                </ProtectedRoute>
              }
            />

            {/* Residence Routes */}
           
      
            
        

              {/* Super Admin Routes */}
              <Route
                path="admin/dashboard"
                element={
                  <ProtectedRoute requiredPermission={PERMISSIONS.SUPER_ADMIN}>
                    <SuperAdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/organizations/create"
                element={
                  <ProtectedRoute requiredPermission={PERMISSIONS.SUPER_ADMIN}>
                    <CreateOrganization />
                  </ProtectedRoute>
                }
              />

                {/* Catch all - 404 */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
            </Router>
          </StorageProvider>
        </ClinicProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
