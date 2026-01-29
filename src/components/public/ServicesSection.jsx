import React from 'react';
import { useTranslation } from 'react-i18next';
import { Wrench, AlertCircle, Sparkles, CheckCircle } from 'lucide-react';

export const ServicesSection = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const services = [
    {
      id: 1,
      icon: Wrench,
      titleKey: 'public.services.maintenance.title',
      descKey: 'public.services.maintenance.desc',
      color: 'blue',
    },
    {
      id: 2,
      icon: AlertCircle,
      titleKey: 'public.services.repair.title',
      descKey: 'public.services.repair.desc',
      color: 'red',
    },
    {
      id: 3,
      icon: Sparkles,
      titleKey: 'public.services.cleaning.title',
      descKey: 'public.services.cleaning.desc',
      color: 'purple',
    },
    {
      id: 4,
      icon: CheckCircle,
      titleKey: 'public.services.inspection.title',
      descKey: 'public.services.inspection.desc',
      color: 'green',
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    green: 'bg-green-50 text-green-600 border-green-200',
  };

  return (
    <section 
      id="services" 
      className={`py-16 sm:py-24 px-2 sm:px-6 lg:px-8 bg-accent/50 ${isArabic ? 'rtl' : 'ltr'}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-12 sm:mb-16 px-4 ${isArabic ? 'ar' : ''}`}>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t('public.services.title')}
          </h2>
          <div className="w-16 sm:w-20 h-1 bg-primary mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="bg-background rounded-xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] border border-border"
              >
                <div className="bg-primary/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4 border border-primary/20">
                  <Icon size={28} className="text-primary" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-foreground mb-2">
                  {t(service.titleKey)}
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base">
                  {t(service.descKey)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
