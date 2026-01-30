'use client';

import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff, Lock, Mail, LogIn, AlertCircle } from "lucide-react";
import BubbleBackground from "../BubbleBackground"; // Import BubbleBackground component
import { PublicLayout } from "../public/PublicLayout";

const LoginPage = () => {
  const { login } = useAuth(); // Remove loading from useAuth
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    // COMPLETELY prevent form submission
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Don't allow multiple submissions
    if (isSubmitting) return;

    setError("");
    setIsSubmitting(true);

    // Basic validation
    if (!formData.email || !formData.password) {
      setError(t("auth.fill_all_fields"));
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await login(formData.email, formData.password);

      if (!result || !result.success) {
        const errorMsg =
          result?.error || t("auth.login_failed");
        setError(errorMsg);
        // Don't show toast - error is already displayed in the error box
      } else {
        // Login successful
        toast.success(t("auth.login_success"));
        
        // Fetch permissions and user info to decide where to go
        const authData = JSON.parse(localStorage.getItem('userPermissions') || '[]');
        const isSuperAdmin = authData.includes("SuperAdmin");

        // Navigate based on role
        if (isSuperAdmin) {
          navigate("/admin/dashboard");
        } else {
          navigate("/clinic/clinics");
        }
      }
    } catch (err) {
      const errorMsg = t("auth.login_error_template", { message: err.message || t("auth.try_again") });
      setError(errorMsg);
      // Don't show toast - error is already displayed in the error box
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick login buttons for testing
  const quickLogin = (email, password) => {
    setFormData({ email, password });
  };

  // Remove the global loading screen - we'll show loading only on the button

  return (
    <PublicLayout>
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/10 to-primary/5">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-secondary/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-md p-4">
          {/* Login Card */}
          <div className="bg-background/95 backdrop-blur-md rounded-2xl shadow-2xl border border-border p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mb-4 shadow-lg">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {t("auth.welcome_back")}
              </h1>
              <p className="text-muted-foreground">{t("auth.system_name")}</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/50 rounded-lg flex items-center gap-3 text-destructive">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Login Form */}
            <div className="space-y-6">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  {t("auth.email_label")}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 bg-background text-foreground placeholder:text-muted-foreground"
                    placeholder={t("auth.placeholder_email")}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  {t("auth.password_label")}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 bg-background text-foreground placeholder:text-muted-foreground"
                    placeholder={t("auth.placeholder_password")}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground py-3 px-4 rounded-lg hover:opacity-90 focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <LogIn className="h-5 w-5" />
                    {t("auth.login_button")}
                  </>
                )}
              </button>
            </div>

            {/* Quick Login Section for Testing */}
            {/* <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center mb-4">تسجيل دخول سريع (للاختبار)</p>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    quickLogin('admin@vcsms.com', 'Password123');
                  }}
                  className="p-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors font-medium"
                >
                  👑 مدير النظام - Full Access
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    quickLogin('owner@vcsms.com', 'Password123');
                  }}
                  className="p-2 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
                >
                  👤 Owner - Full Access
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    quickLogin('doctor1@vcsms.com', 'Password123');
                  }}
                  className="p-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  👨‍⚕️ Doctor 1 - Clinic 1
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    quickLogin('doctor2@vcsms.com', 'Password123');
                  }}
                  className="p-2 bg-cyan-100 text-cyan-700 rounded hover:bg-cyan-200 transition-colors"
                >
                  👨‍⚕️ Doctor 2 - Clinic 2
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    quickLogin('reception1@vcsms.com', 'Password123');
                  }}
                  className="p-2 bg-pink-100 text-pink-700 rounded hover:bg-pink-200 transition-colors"
                >
                  📞 Reception 1 - Clinic 1
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    quickLogin('reception2@vcsms.com', 'Password123');
                  }}
                  className="p-2 bg-rose-100 text-rose-700 rounded hover:bg-rose-200 transition-colors"
                >
                  📞 Reception 2 - Clinic 2
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    quickLogin('animals@test.com', 'Password123');
                  }}
                  className="p-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors text-[10px]"
                >
                  🐾 Animals Only (Test User)
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    quickLogin('residences@test.com', 'Password123');
                  }}
                  className="p-2 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors text-[10px]"
                >
                  🏠 Residences Only (Test User)
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    quickLogin('vet@test.com', 'Password123');
                  }}
                  className="p-2 bg-teal-100 text-teal-700 rounded hover:bg-teal-200 transition-colors text-[10px]"
                >
                  👨‍⚕️ Vet - Exams+Animals (Test User)
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    quickLogin('clinic1only@test.com', 'Password123');
                  }}
                  className="p-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-[10px] font-semibold"
                >
                  🏥 Clinic 1 ONLY (Test Selector)
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    quickLogin('clinic2only@test.com', 'Password123');
                  }}
                  className="p-2 bg-cyan-100 text-cyan-700 rounded hover:bg-cyan-200 transition-colors text-[10px] font-semibold"
                >
                  🏥 Clinic 2 ONLY (Test Selector)
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    quickLogin('bothclinics@test.com', 'Password123');
                  }}
                  className="p-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors text-[10px] font-semibold"
                >
                  🏥🏥 Both Clinics (Test Selector)
                </button>
              </div>
            </div> */}
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-muted-foreground text-sm">
              {t("auth.footer_rights")}
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default LoginPage;
