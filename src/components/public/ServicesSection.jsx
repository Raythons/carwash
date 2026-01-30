import React from 'react';
import { useTranslation } from 'react-i18next';

export const ServicesSection = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const services = [
    {
      id: 1,
      titleKey: 'public.services.maintenance.title',
      descKey: 'public.services.maintenance.desc',
      image: '/Screenshot 2025-10-04 162645.webp',
    },
    {
      id: 2,
      titleKey: 'public.services.repair.title',
      descKey: 'public.services.repair.desc',
      image: '/Screenshot 2025-10-04 162857.webp',
    },
    {
      id: 3,
      titleKey: 'public.services.cleaning.title',
      descKey: 'public.services.cleaning.desc',
      image: '/Screenshot 2025-10-04 163855.webp',
    },
    {
      id: 4,
      titleKey: 'public.services.inspection.title',
      descKey: 'public.services.inspection.desc',
      image: '/Screenshot 2025-10-04 171706.webp',
    },
  ];

  return (
    <section 
      id="services" 
      className={`py-16 sm:py-24 px-2 sm:px-6 lg:px-8 bg-secondary/10 ${isArabic ? 'rtl' : 'ltr'}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-12 sm:mb-16 px-4 ${isArabic ? 'ar' : ''}`}>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t('public.services.title')}
          </h2>
          <div className="w-16 sm:w-20 h-1 bg-secondary mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {services.map((service) => {
            return (
              <div
                key={service.id}
                className="bg-background rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] border border-border group"
              >
                <div className="relative h-48 overflow-hidden bg-secondary/20">
                  <img 
                    src={service.image || "/placeholder.svg"} 
                    alt={t(service.titleKey)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-foreground mb-2">
                    {t(service.titleKey)}
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    {t(service.descKey)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
