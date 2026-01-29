import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { useEmployee, useUpdateEmployee } from '../../../hooks/queries/useEmployeeQueries';
import { ArrowLeft, Save, User, Mail, Phone, Building2, DollarSign } from 'lucide-react';
import { CURRENCY } from '../../../constants/currency';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utilities/cn';

export default function EditEmployee() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: employee, isLoading } = useEmployee(id);
  const updateEmployeeMutation = useUpdateEmployee();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    userType: 'Doctor',
    salary: '',
    clinicId: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        phoneNumber: employee.phoneNumber || '',
        userType: employee.userType || 'Doctor',
        salary: employee.salary ? employee.salary.toString() : '',
        clinicId: employee.clinicId ? employee.clinicId.toString() : '',
      });
    }
  }, [employee]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t("employees.validation.name_required");
    }

    if (!formData.email.trim()) {
      newErrors.email = t("employees.validation.email_required");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("employees.validation.email_invalid");
    }

    if (!formData.userType.trim()) {
      newErrors.userType = t("employees.validation.user_type_required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const submitData = {
        ...formData,
        salary: formData.salary ? parseFloat(formData.salary) : null,
        clinicId: formData.clinicId ? parseInt(formData.clinicId) : null,
      };

      await updateEmployeeMutation.mutateAsync({ id: parseInt(id), data: submitData });
      navigate(`/clinic/employees/${id}`);
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  const userTypes = [
    { value: 'Doctor', label: t("employees.types.Doctor") },
    { value: 'Nurse', label: t("employees.types.Nurse") },
    { value: 'Receptionist', label: t("employees.types.Receptionist") },
    { value: 'Technician', label: t("employees.types.Technician") },
    { value: 'Manager', label: t("employees.types.Manager") },
    { value: 'Assistant', label: t("employees.types.Assistant") },
  ];


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">{t("employees.not_found")}</h2>
        <Button onClick={() => navigate('/clinic/employees')} className="mt-4">
          {t("employees.back_to_list")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className={cn("flex items-center space-x-4", isRTL && "space-x-reverse")}>
          <Button
            variant="outline"
            onClick={() => navigate(`/clinic/employees/${id}`)}
            className={cn("flex items-center space-x-2", isRTL && "space-x-reverse")}
          >
            <ArrowLeft className={cn("w-4 h-4", isRTL && "rotate-180")} />
            <span>{t("common.back")}</span>
          </Button>
          <div className={isRTL ? "text-right" : "text-left"}>
            <h1 className="text-2xl font-bold text-gray-900">{t("employees.edit_employee")}</h1>
            <p className="text-gray-600">{employee.name}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className={cn("p-6 border-b border-gray-200", isRTL ? "text-right" : "text-left")}>
          <h2 className={cn("text-lg font-semibold text-gray-900 flex items-center space-x-2", isRTL && "space-x-reverse")}>
            <User className="w-5 h-5 text-indigo-600" />
            <span>{t("employees.edit_employee")}</span>
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className={cn("block text-sm font-medium text-gray-700 mb-2", isRTL ? "text-right" : "text-left")}>
                {t("common.name")} *
              </label>
              <div className="relative">
                <User className={cn("absolute top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400", isRTL ? "right-3" : "left-3")} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={cn(
                    "w-full py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all",
                    isRTL ? "pr-10 pl-4 text-right" : "pl-10 pr-4 text-left",
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  )}
                  placeholder={t("employees.placeholder_name")}
                />
              </div>
              {errors.name && (
                <p className={cn("mt-1 text-sm text-red-600", isRTL ? "text-right" : "text-left")}>{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className={cn("block text-sm font-medium text-gray-700 mb-2", isRTL ? "text-right" : "text-left")}>
                {t("common.email")} *
              </label>
              <div className="relative">
                <Mail className={cn("absolute top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400", isRTL ? "right-3" : "left-3")} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={cn(
                    "w-full py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all",
                    isRTL ? "pr-10 pl-4 text-right" : "pl-10 pr-4 text-left",
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  )}
                  placeholder={t("employees.placeholder_email")}
                />
              </div>
              {errors.email && (
                <p className={cn("mt-1 text-sm text-red-600", isRTL ? "text-right" : "text-left")}>{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className={cn("block text-sm font-medium text-gray-700 mb-2", isRTL ? "text-right" : "text-left")}>
                {t("common.phone")}
              </label>
              <div className="relative">
                <Phone className={cn("absolute top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400", isRTL ? "right-3" : "left-3")} />
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className={cn(
                    "w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all",
                    isRTL ? "pr-10 pl-4 text-right" : "pl-10 pr-4 text-left"
                  )}
                  placeholder={t("employees.placeholder_phone")}
                />
              </div>
            </div>

            {/* User Type */}
            <div>
              <label className={cn("block text-sm font-medium text-gray-700 mb-2", isRTL ? "text-right" : "text-left")}>
                {t("employees.user_type")} *
              </label>
              <select
                name="userType"
                value={formData.userType}
                onChange={handleInputChange}
                className={cn(
                  "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all",
                  isRTL ? "text-right" : "text-left",
                  errors.userType ? 'border-red-500' : 'border-gray-300'
                )}
              >
                {userTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.userType && (
                <p className={cn("mt-1 text-sm text-red-600", isRTL ? "text-right" : "text-left")}>{errors.userType}</p>
              )}
            </div>

            {/* Salary */}
            <div className="md:col-span-2">
              <label className={cn("block text-sm font-medium text-gray-700 mb-2", isRTL ? "text-right" : "text-left")}>
                {t("employees.salary")} ({CURRENCY.SHORT_NAME})
              </label>
              <div className="relative">
                <DollarSign className={cn("absolute top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400", isRTL ? "right-3" : "left-3")} />
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  className={cn(
                    "w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all",
                    isRTL ? "pr-10 pl-4 text-right" : "pl-10 pr-4 text-left"
                  )}
                  placeholder={t("employees.placeholder_salary")}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className={cn("flex justify-end space-x-4 pt-6 border-t border-gray-200", isRTL && "space-x-reverse")}>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/clinic/employees/${id}`)}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              disabled={updateEmployeeMutation.isPending}
            >
              {updateEmployeeMutation.isPending ? (
                <div className={cn("flex items-center space-x-2", isRTL && "space-x-reverse")}>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{t("common.saving")}</span>
                </div>
              ) : (
                <div className={cn("flex items-center space-x-2", isRTL && "space-x-reverse")}>
                  <Save className="w-4 h-4" />
                  <span>{t("common.save_changes")}</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
