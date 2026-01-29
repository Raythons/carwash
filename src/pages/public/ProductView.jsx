import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Package, Tag, DollarSign } from "lucide-react";
import api from "@/api";
import { CURRENCY } from "@/constants/currency";
import { formatNumberWithThousands } from "@/utilities/number";

export default function ProductView() {
  const { qrCode } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/public/product/${qrCode}`);
        setProduct(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "المنتج غير موجود");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [qrCode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <Package className="w-20 h-20 mx-auto mb-4 text-gray-400" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">عذراً</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
            <Package className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {product.productName}
          </h1>
          <p className="text-xl text-gray-600">{product.variantName}</p>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          {/* Price */}
          <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
            <div className="flex items-center justify-center w-14 h-14 bg-green-200 rounded-lg">
              <DollarSign className="w-8 h-8 text-green-700" />
            </div>
            <div>
              <p className="text-sm text-green-700 font-medium">السعر</p>
              <p className="text-4xl font-bold text-green-600">
                {formatNumberWithThousands(product.sellPrice)} <span className="text-2xl">{CURRENCY.SHORT_NAME}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            للاستفسار عن هذا المنتج، يرجى التواصل مع العيادة
          </p>
        </div>
      </div>
    </div>
  );
}
