import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Home, ArrowLeft, Search, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4" dir="rtl">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="mx-auto w-32 h-32 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-16 h-16 text-red-500" />
          </div>
        </div>

        {/* Error Code */}
        <div className="mb-6">
          <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500 mb-2">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            الصفحة غير موجودة
          </h2>
          <p className="text-gray-600 text-lg">
            عذراً، لا يمكن العثور على الصفحة التي تبحث عنها
          </p>
        </div>

        {/* Description */}
        <div className="mb-8">
          <p className="text-gray-500 leading-relaxed">
            قد تكون الصفحة قد تم نقلها أو حذفها، أو ربما أخطأت في كتابة الرابط
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3"
            >
              <Link to="/" className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                <Home className="w-5 h-5" />
                <span>العودة للرئيسية</span>
              </Link>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="flex items-center justify-center space-x-2 rtl:space-x-reverse px-6 py-3"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>العودة للخلف</span>
            </Button>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            إذا كنت تعتقد أن هذا خطأ، يرجى التواصل مع فريق الدعم
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-100 rounded-full opacity-20"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-indigo-100 rounded-full opacity-20"></div>
        <div className="absolute top-1/2 left-4 w-12 h-12 bg-pink-100 rounded-full opacity-20"></div>
      </div>
    </div>
  );
}
