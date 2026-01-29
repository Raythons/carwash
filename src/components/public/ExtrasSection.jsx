import React from 'react';
import { useTranslation } from 'react-i18next';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ExtrasSection = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const services = [
    'service1',
    'service2',
    'service3',
    'service4',
    'service5',
    'service6',
  ];

  return (
    <section 
      id="extras" 
      className={`py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-accent/50 ${isArabic ? 'rtl' : 'ltr'}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-12 sm:mb-16 ${isArabic ? 'ar' : ''}`}>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t('public.extras.title')}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-4">
            {t('public.extras.available')}
          </p>
          <div className="w-16 sm:w-20 h-1 bg-primary mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-card rounded-xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] border border-border"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-foreground">
                    {t(`public.extras.${service}`)}
                  </h3>
                </div>
                <Star className="text-primary group-hover:scale-125 transition-transform flex-shrink-0" size={20} />
              </div>
              
              <p className="text-muted-foreground text-sm sm:text-base mb-4">
                Premium service for optimal care and maintenance
              </p>

              <button className="text-primary hover:text-primary/80 font-medium text-sm">
                {t('common.view_details')} →
              </button>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 sm:p-8 lg:p-12 text-center text-primary-foreground">
          <h3 className="text-2xl sm:text-3xl font-bold mb-4">
            {t('public.extras.available')}
          </h3>
          <p className="text-primary-foreground/90 mb-6 sm:mb-8 text-base sm:text-lg">
            Contact us for custom service packages tailored to your needs
          </p>
          <Button variant="default" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
            {t('public.navbar.contact')}
          </Button>
        </div>
      </div>
    </section>
  );
};
