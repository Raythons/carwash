"use client";

import { useTranslation } from "react-i18next";
import { User, Calendar, Weight, DollarSign, Stethoscope, Heart } from 'lucide-react';
import CURRENCY from '@/constants/currency';

export function ViewBasicInformationSection({ data }) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "ar" ? "ar-SA" : "en-US";

  const formatDate = (dateString) => {
    if (!dateString) return t("examinations.basic.not_specified");
    return new Date(dateString).toLocaleDateString(locale);
  }

  const formatValue = (value) => {
    if (value === null || value === undefined || value === "") return t("examinations.basic.not_specified");
    return value;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
          <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <span className="text-xl font-bold text-gray-900 dark:text-zinc-100">{t("examinations.basic.title")}</span>
      </div>
      
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/10 dark:to-blue-950/10 border border-indigo-200 dark:border-indigo-900/30 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 border border-indigo-100 dark:border-zinc-700">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                <label className="text-sm font-medium text-indigo-700 dark:text-indigo-300">{t("examinations.basic.animal_name")}</label>
              </div>
              <p className="text-gray-900 dark:text-zinc-100 font-semibold">{formatValue(data?.animalName)}</p>
            </div>
            
            <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 border border-indigo-100 dark:border-zinc-700">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="w-4 h-4 text-pink-500 dark:text-pink-400" />
                <label className="text-sm font-medium text-pink-700 dark:text-pink-300">{t("examinations.basic.animal_type")}</label>
              </div>
              <p className="text-gray-900 dark:text-zinc-100 font-semibold">{formatValue(data?.species || data?.animalType)}</p>
            </div>
            
            <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 border border-indigo-100 dark:border-zinc-700">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                <label className="text-sm font-medium text-purple-700 dark:text-purple-300">{t("examinations.basic.animal_breed")}</label>
              </div>
              <p className="text-gray-900 dark:text-zinc-100 font-semibold">{formatValue(data?.animalBreed)}</p>
            </div>
            
            <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 border border-indigo-100 dark:border-zinc-700">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-green-500 dark:text-green-400" />
                <label className="text-sm font-medium text-green-700 dark:text-green-300">{t("examinations.basic.visit_date")}</label>
              </div>
              <p className="text-gray-900 dark:text-zinc-100 font-semibold">{formatDate(data?.date)}</p>
            </div>
            
            <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 border border-indigo-100 dark:border-zinc-700">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                <label className="text-sm font-medium text-blue-700 dark:text-blue-300">{t("examinations.basic.gender")}</label>
              </div>
              <p className="text-gray-900 dark:text-zinc-100 font-semibold">{formatValue(data?.gender)}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 border border-indigo-100 dark:border-zinc-700">
              <div className="flex items-center gap-2 mb-3">
                <Weight className="w-4 h-4 text-orange-500 dark:text-orange-400" />
                <label className="text-sm font-medium text-orange-700 dark:text-orange-300">{t("examinations.basic.weight")}</label>
              </div>
              <p className="text-gray-900 dark:text-zinc-100 font-semibold">{formatValue(data?.weight)}</p>
            </div>
            
            <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 border border-indigo-100 dark:border-zinc-700">
              <div className="flex items-center gap-2 mb-3">
                <Stethoscope className="w-4 h-4 text-teal-500 dark:text-teal-400" />
                <label className="text-sm font-medium text-teal-700 dark:text-teal-300">{t("examinations.basic.bcs")}</label>
              </div>
              <p className="text-gray-900 dark:text-zinc-100 font-semibold">{formatValue(data?.bcs)}</p>
            </div>
            
            <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 border border-indigo-100 dark:border-zinc-700">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                <label className="text-sm font-medium text-cyan-700 dark:text-cyan-300">{t("examinations.basic.birth_date")}</label>
              </div>
              <p className="text-gray-900 dark:text-zinc-100 font-semibold">{formatDate(data?.birthDate || data?.animalDateOfBirth)}</p>
            </div>
            
            <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 border border-indigo-100 dark:border-zinc-700">
              <div className="flex items-center gap-2 mb-3">
                <Stethoscope className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                <label className="text-sm font-medium text-indigo-700 dark:text-indigo-300">{t("examinations.basic.doctor_id")}</label>
              </div>
              <p className="text-gray-900 dark:text-zinc-100 font-semibold">{formatValue(data?.doctorId)}</p>
            </div>
          </div>
          
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 border border-indigo-100 dark:border-zinc-700">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-4 h-4 text-green-500 dark:text-green-400" />
                <label className="text-sm font-medium text-green-700 dark:text-green-300">{t("examinations.basic.amount")}</label>
              </div>
              <p className="text-gray-900 dark:text-zinc-100 font-semibold">{formatValue(data?.amount)} {CURRENCY.SHORT_NAME}</p>
            </div>
            
            <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 border border-indigo-100 dark:border-zinc-700">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                <label className="text-sm font-medium text-blue-700 dark:text-blue-300">{t("examinations.basic.received_amount")}</label>
              </div>
              <p className="text-gray-900 dark:text-zinc-100 font-semibold">{formatValue(data?.receivedAmount)} {CURRENCY.SHORT_NAME}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
