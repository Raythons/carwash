import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredPermission, requiredPermissions, requiredRole, requiredRoles, fallback }) => {
  const { isAuthenticated, loading, hasPermission, hasAnyPermission, user, permissions } = useAuth();

  // CRITICAL: Show loading spinner while checking authentication OR while permissions are loading
  // This prevents ANY component mounting until permissions are fully verified
  if (loading || (isAuthenticated && permissions.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // AGGRESSIVE permission/role checks - COMPLETELY PREVENT component mounting
  // This ensures NO API calls are made by unauthorized users
  
  // Check single role - IMMEDIATE BLOCK
  if (requiredRole && user?.userType !== requiredRole) {
    return fallback || <AccessDenied />;
  }

  // Check multiple roles (user needs at least one) - IMMEDIATE BLOCK
  if (requiredRoles && !requiredRoles.includes(user?.userType)) {
    return fallback || <AccessDenied />;
  }

  // Check single permission - IMMEDIATE BLOCK
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return fallback || <AccessDenied />;
  }

  // Check multiple permissions (user needs at least one) - IMMEDIATE BLOCK
  if (requiredPermissions && !hasAnyPermission(requiredPermissions)) {
    return fallback || <AccessDenied />;
  }

  // All checks passed - ONLY NOW allow component mounting
  return children;
};

// Access Denied Component
const AccessDenied = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-lg w-full mx-4">
        {/* Main Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          {/* Header with Icon */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-8 text-center relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
            </div>
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/30">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">غير مصرح لك بالدخول</h2>
              <p className="text-white/90 text-lg font-medium">
                ليس لديك الصلاحية للوصول إلى هذه الصفحة
              </p>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-8">
            {/* User Info Card */}
            <div className="bg-gradient-to-r from-slate-50 to-indigo-50 rounded-xl p-6 mb-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600 font-medium">المستخدم الحالي</p>
                    <p className="text-lg font-bold text-slate-800">{user?.name || user?.email || 'غير محدد'}</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-sm text-slate-600 font-medium">الدور</p>
                  <span className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 border border-indigo-200">
                    {user?.userType || 'مستخدم'}
                  </span>
                </div>
              </div>
              
              {/* Security Message */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <p className="text-sm text-orange-800 font-semibold">
                    تحتاج إلى صلاحيات إضافية للوصول إلى هذا المحتوى
                  </p>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => window.history.back()}
                className="flex-1 bg-gradient-to-r from-slate-600 to-slate-700 text-white px-6 py-3 rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all duration-300 flex items-center justify-center space-x-2 rtl:space-x-reverse font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>العودة للخلف</span>
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2 rtl:space-x-reverse font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>الصفحة الرئيسية</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-slate-500 text-sm font-medium">
            إذا كنت تعتقد أن هذا خطأ، يرجى التواصل مع مدير النظام
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute;
