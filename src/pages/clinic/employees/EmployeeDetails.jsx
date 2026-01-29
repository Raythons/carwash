import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { useEmployee, useEmployeeVacations, useAddEmployeeVacation, useVacationTypes } from '../../../hooks/queries/useEmployeeQueries';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utilities/cn';
import { 
  ArrowLeft, 
  Edit, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  DollarSign, 
  Calendar,
  Plus,
  Clock,
  FileText,
  Plane
} from 'lucide-react';

export default function EmployeeDetails() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAddVacation, setShowAddVacation] = useState(false);

  const { data: employee, isLoading: employeeLoading } = useEmployee(id);
  const { data: vacations, isLoading: vacationsLoading } = useEmployeeVacations(id);
  const { data: vacationTypes } = useVacationTypes();
  const addVacationMutation = useAddEmployeeVacation();

  const [vacationForm, setVacationForm] = useState({
    vacationTypeId: '',
    reason: '',
    startDate: '',
    endDate: '',
  });

  const handleAddVacation = async (e) => {
    e.preventDefault();
    
    try {
      const submitData = {
        vacationTypeId: parseInt(vacationForm.vacationTypeId),
        reason: vacationForm.reason || null,
        startDate: vacationForm.startDate,
        endDate: vacationForm.endDate || null,
      };

      await addVacationMutation.mutateAsync({ id: parseInt(id), data: submitData });
      setShowAddVacation(false);
      setVacationForm({
        vacationTypeId: '',
        reason: '',
        startDate: '',
        endDate: '',
      });
    } catch (error) {
      console.error('Error adding vacation:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return t('employees.not_specified');
    return new Date(dateString).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US');
  };

  if (employeeLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-zinc-100">{t('employees.not_found')}</h2>
        <Button onClick={() => navigate('/clinic/employees')} className="mt-4">
          {t('employees.back_to_list')}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className={cn("flex items-center space-x-4", isRTL && "space-x-reverse")}>
          <Button
            variant="outline"
            onClick={() => navigate('/clinic/employees')}
            className={cn("flex items-center space-x-2 bg-white dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100", isRTL && "space-x-reverse")}
          >
            <ArrowLeft className={cn("w-4 h-4", isRTL && "rotate-180")} />
            <span>{t('common.back')}</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">{t('employees.employee_details')}</h1>
            <p className="text-gray-600 dark:text-zinc-400">{employee.name}</p>
          </div>
        </div>
        <Link to={`/clinic/employees/edit/${id}`}>
          <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 dark:from-green-600 dark:to-emerald-600 dark:hover:from-green-500 dark:hover:to-emerald-500">
            <Edit className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
            {t('employees.edit_employee')}
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employee Information */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-800 transition-all duration-300">
            <div className="p-6 border-b border-gray-200 dark:border-zinc-800">
              <h2 className={cn("text-lg font-semibold text-gray-900 dark:text-zinc-100 flex items-center space-x-2", isRTL && "space-x-reverse")}>
                <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>{t('employees.personal_info')}</span>
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={cn("flex items-center space-x-3", isRTL && "space-x-reverse")}>
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 rounded-xl flex items-center justify-center shadow-sm">
                    <User className="w-6 h-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-zinc-400">{t('employees.fields.name')}</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-zinc-100">{employee.name}</p>
                  </div>
                </div>

                <div className={cn("flex items-center space-x-3", isRTL && "space-x-reverse")}>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 dark:from-blue-600 dark:to-cyan-700 rounded-xl flex items-center justify-center shadow-sm">
                    <Mail className="w-6 h-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-zinc-400">{t('employees.fields.email')}</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-zinc-100">{employee.email}</p>
                  </div>
                </div>

                {employee.phoneNumber && (
                  <div className={cn("flex items-center space-x-3", isRTL && "space-x-reverse")}>
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 rounded-xl flex items-center justify-center shadow-sm">
                      <Phone className="w-6 h-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-zinc-400">{t('employees.fields.phone')}</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-zinc-100">{employee.phoneNumber}</p>
                    </div>
                  </div>
                )}

                <div className={cn("flex items-center space-x-3", isRTL && "space-x-reverse")}>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 dark:from-purple-600 dark:to-pink-700 rounded-xl flex items-center justify-center shadow-sm">
                    <Building2 className="w-6 h-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-zinc-400">{t('employees.fields.type')}</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-zinc-100">{employee.userType}</p>
                  </div>
                </div>

                <div className={cn("flex items-center space-x-3", isRTL && "space-x-reverse")}>
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 dark:from-orange-600 dark:to-red-700 rounded-xl flex items-center justify-center shadow-sm">
                    <Calendar className="w-6 h-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-zinc-400">{t('employees.fields.joinDate')}</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-zinc-100">{formatDate(employee.joinDate)}</p>
                  </div>
                </div>

                {employee.salary && (
                  <div className={cn("flex items-center space-x-3", isRTL && "space-x-reverse")}>
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 dark:from-yellow-600 dark:to-orange-700 rounded-xl flex items-center justify-center shadow-sm">
                      <DollarSign className="w-6 h-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-zinc-400">{t('employees.fields.salary')}</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-zinc-100">
                        {employee.salary.toLocaleString()} {t('common.syrian_pound', { defaultValue: 'ل.س' })}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {employee.clinicName && (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-indigo-200 dark:border-indigo-800/50 transition-colors">
                  <div className={cn("flex items-center space-x-3", isRTL && "space-x-reverse")}>
                    <Building2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    <div>
                      <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">{t('employees.fields.clinic')}</p>
                      <p className="text-lg font-semibold text-indigo-900 dark:text-indigo-300">{employee.clinicName}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Vacations */}
        <div>
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-800 transition-all duration-300">
            <div className="p-6 border-b border-gray-200 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <h2 className={cn("text-lg font-semibold text-gray-900 dark:text-zinc-100 flex items-center space-x-2", isRTL && "space-x-reverse")}>
                  <Plane className="w-5 h-5 text-indigo-600 dark:text-indigo-400 drop-shadow-[0_0_8px_rgba(79,70,229,0.3)]" />
                  <span>{t('employees.vacations')}</span>
                </h2>
                <Button
                  size="sm"
                  onClick={() => setShowAddVacation(true)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-600 dark:to-purple-600 dark:hover:from-indigo-500 dark:hover:to-purple-500"
                >
                  <Plus className={cn("w-4 h-4", isRTL ? "ml-1" : "mr-1")} />
                  {t('employees.add_vacation')}
                </Button>
              </div>
            </div>

            <div className="p-6">
              {vacationsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
                </div>
              ) : vacations && vacations.length > 0 ? (
                <div className="space-y-4">
                  {vacations.map((vacation) => (
                    <div key={vacation.id} className="bg-gray-50 dark:bg-zinc-800/40 rounded-lg p-4 border border-gray-200 dark:border-zinc-700/50 hover:border-indigo-300 dark:hover:border-indigo-600/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 border dark:border-indigo-500/20">
                          {vacation.vacationTypeName}
                        </span>
                        <div className={cn("flex items-center space-x-2 text-sm text-gray-600 dark:text-zinc-400", isRTL && "space-x-reverse")}>
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(vacation.startDate)}</span>
                          {vacation.endDate && (
                            <>
                              <span>-</span>
                              <span>{formatDate(vacation.endDate)}</span>
                            </>
                          )}
                        </div>
                      </div>
                      {vacation.reason && (
                        <div className={cn("flex items-start space-x-2", isRTL && "space-x-reverse")}>
                          <FileText className="w-4 h-4 text-gray-400 dark:text-zinc-500 mt-0.5" />
                          <p className="text-sm text-gray-700 dark:text-zinc-300">{vacation.reason}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 dark:text-zinc-600 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-zinc-400">{t('employees.no_vacations')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Vacation Modal */}
      {showAddVacation && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl max-w-md w-full mx-4 border dark:border-zinc-800">
            <div className="p-6 border-b border-gray-200 dark:border-zinc-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-100">{t('employees.add_vacation')}</h3>
            </div>
            
            <form onSubmit={handleAddVacation} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                  {t('employees.fields.vacationType')} *
                </label>
                <select
                  value={vacationForm.vacationTypeId}
                  onChange={(e) => setVacationForm(prev => ({ ...prev, vacationTypeId: e.target.value }))}
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent dark:text-zinc-100 transition-all"
                  required
                >
                  <option value="">{t('employees.select_vacation_type')}</option>
                  {vacationTypes?.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                  {t('employees.fields.startDate')} *
                </label>
                <input
                  type="date"
                  value={vacationForm.startDate}
                  onChange={(e) => setVacationForm(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent dark:text-zinc-100 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                  {t('employees.fields.endDate')}
                </label>
                <input
                  type="date"
                  value={vacationForm.endDate}
                  onChange={(e) => setVacationForm(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent dark:text-zinc-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                  {t('employees.fields.reason')}
                </label>
                <textarea
                  value={vacationForm.reason}
                  onChange={(e) => setVacationForm(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent dark:text-zinc-100 transition-all"
                  rows="3"
                  placeholder={t('employees.placeholder_reason')}
                />
              </div>

              <div className={cn("flex justify-end space-x-4 pt-4", isRTL && "space-x-reverse")}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddVacation(false)}
                  className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-700"
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  type="submit"
                  disabled={addVacationMutation.isPending}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-600 dark:to-purple-600 dark:hover:from-indigo-500 dark:hover:to-purple-500"
                >
                  {addVacationMutation.isPending ? t('common.saving') : t('employees.save_vacation')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
