import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const PricingSection = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const plans = [
    { key: 'basic', featured: false },
    { key: 'professional', featured: true },
    { key: 'premium', featured: false },
  ];

  return (
    <section 
      id="plans" 
      className={`py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-background ${isArabic ? 'rtl' : 'ltr'}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-12 sm:mb-16 ${isArabic ? 'ar' : ''}`}>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t('public.plans.title')}
          </h2>
          <div className="w-16 sm:w-20 h-1 bg-primary mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => {
            const planData = t(`public.plans.${plan.key}`);
            console.log(planData);
            
            return (
              <div
                key={plan.key}
                className={`relative rounded-2xl transition-all duration-300 ${
                  plan.featured
                    ? 'md:scale-105 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-lg'
                    : 'bg-card border border-border text-foreground hover:border-primary/50'
                }`}
              >
                {plan.featured && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-accent text-accent-foreground px-4 py-1 rounded-full text-xs sm:text-sm font-bold">
                      {t('common.popular') || 'Popular'}
                    </span>
                  </div>
                )}

                <div className="p-6 sm:p-8">
                  <h3 className="text-xl sm:text-2xl font-bold mb-3">
                    {planData.name}
                  </h3>
                  
                  <div className="mb-6">
                    <span className="text-3xl sm:text-4xl font-bold">
                      {planData.price}
                    </span>
                    <span className={`ml-2 text-sm sm:text-base ${plan.featured ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                      {planData.period}
                    </span>
                  </div>

                  <Button
                    variant={plan.featured ? 'default' : 'outline'}
                    className="w-full mb-8"
                  >
                    {t('public.hero.cta_button')}
                  </Button>

                  {/* <div className="space-y-3 sm:space-y-4">
                    {planData.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Check className={`flex-shrink-0 ${plan.featured ? 'text-accent' : 'text-primary'}`} size={20} />
                        <span className={`text-sm sm:text-base ${plan.featured ? 'text-primary-foreground/90' : 'text-muted-foreground'}`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div> */}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
