import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Sparkles, Crown, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const PricingSection = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const plans = useMemo(() => [
    { key: 'basic', featured: false, icon: Star },
    { key: 'professional', featured: true, icon: Sparkles },
    { key: 'premium', featured: false, icon: Crown },
  ], []);

  // Safe data loading with fallbacks - ensures 100% load success
  const getPlanData = (planKey) => {
    const rawData = t(`public.plans.${planKey}`, { returnObjects: true });
    
    // Fallback data structure in case translation is missing or malformed
    const fallbackData = {
      basic: {
        name: isArabic ? 'الأساسية' : 'Basic',
        price: '29',
        period: isArabic ? 'ريال شهرياً' : 'SAR / month',
        features: isArabic 
          ? ['تبديل الزيت الدوري', 'استبدال المرشحات', 'فحص أساسي']
          : ['Regular oil change', 'Filter replacement', 'Basic inspection']
      },
      professional: {
        name: isArabic ? 'الاحترافية' : 'Professional',
        price: '79',
        period: isArabic ? 'ريال شهرياً' : 'SAR / month',
        features: isArabic 
          ? ['جميع ميزات الخطة الأساسية', 'ملء السوائل', 'دوران الإطارات', 'فحص الفرامل']
          : ['All Basic features', 'Fluid top-up', 'Tire rotation', 'Brake inspection']
      },
      premium: {
        name: isArabic ? 'الممتازة' : 'Premium',
        price: '149',
        period: isArabic ? 'ريال شهرياً' : 'SAR / month',
        features: isArabic 
          ? ['جميع ميزات الخطة الاحترافية', 'دعم الطريق على مدار الساعة', 'خدمة الأولوية', 'تنظيف عميق سنوي']
          : ['All Professional features', '24/7 roadside assistance', 'Priority service', 'Annual deep cleaning']
      }
    };

    // Validate that we have a proper object with required fields
    if (rawData && typeof rawData === 'object' && rawData.name && rawData.price) {
      return {
        name: rawData.name || fallbackData[planKey].name,
        price: rawData.price || fallbackData[planKey].price,
        period: rawData.period || fallbackData[planKey].period,
        features: Array.isArray(rawData.features) ? rawData.features : fallbackData[planKey].features
      };
    }
    
    return fallbackData[planKey];
  };

  return (
    <section 
      id="plans" 
      className={`py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-accent/30 ${isArabic ? 'rtl' : 'ltr'}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            {isArabic ? 'اختر خطتك' : 'Choose Your Plan'}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            {t('public.plans.title')}
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto text-pretty">
            {isArabic 
              ? 'اختر الخطة المناسبة لاحتياجات سيارتك واستمتع بخدمات متميزة'
              : 'Select the plan that fits your vehicle needs and enjoy premium services'
            }
          </p>
          <div className="w-20 h-1.5 bg-gradient-to-r from-primary to-primary/50 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const planData = getPlanData(plan.key);
            const Icon = plan.icon;
            
            return (
              <div
                key={plan.key}
                className={`relative rounded-3xl transition-all duration-500 overflow-hidden group ${
                  plan.featured
                    ? 'md:scale-105 md:-translate-y-2 bg-secondary text-secondary-foreground shadow-2xl ring-2 ring-primary/30'
                    : 'bg-card border-2 border-border text-foreground hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5'
                }`}
              >
                {/* Popular Badge */}
                {plan.featured && (
                  <div className="absolute top-0 inset-x-0 flex justify-center">
                    <span className="bg-primary text-white px-6 py-1.5 rounded-b-xl text-xs sm:text-sm font-bold shadow-lg">
                      {isArabic ? 'الأكثر شيوعاً' : 'Most Popular'}
                    </span>
                  </div>
                )}

                {/* Card Content */}
                <div className="p-6 sm:p-8 lg:p-10">
                  {/* Plan Icon & Name */}
                  <div className={`flex items-center gap-3 mb-6 ${plan.featured ? 'mt-4' : ''}`}>
                    <div className={`p-2.5 rounded-xl ${plan.featured ? 'bg-primary/20' : 'bg-primary/10'}`}>
                      <Icon className={`w-6 h-6 ${plan.featured ? 'text-primary' : 'text-primary'}`} />
                    </div>
                    <h3 className={`text-xl sm:text-2xl font-bold break-words ${plan.featured ? 'text-white' : ''}`}>
                      {planData.name}
                    </h3>
                  </div>
                  
                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-1 flex-wrap">
                      <span className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${plan.featured ? 'text-primary' : ''}`}>
                        {planData.price}
                      </span>
                      <span className={`text-sm sm:text-base font-medium ${plan.featured ? 'text-white/70' : 'text-muted-foreground'}`}>
                        {planData.period}
                      </span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link to="/auth/register" className="block">
                    <Button
                      variant={plan.featured ? 'default' : 'default'}
                      size="lg"
                      className={`w-full mb-8 text-base font-semibold transition-all duration-300 ${
                        plan.featured 
                          ? 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/30' 
                          : 'hover:scale-[1.02]'
                      }`}
                    >
                      {t('public.hero.cta_button')}
                    </Button>
                  </Link>

                  {/* Features List */}
                  <div className="space-y-4">
                    <p className={`text-sm font-medium ${plan.featured ? 'text-white/70' : 'text-muted-foreground'}`}>
                      {isArabic ? 'يشمل:' : 'Includes:'}
                    </p>
                    {planData.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className={`flex-shrink-0 mt-0.5 p-1 rounded-full ${plan.featured ? 'bg-primary/20' : 'bg-primary/10'}`}>
                          <Check className={`w-3.5 h-3.5 ${plan.featured ? 'text-primary' : 'text-primary'}`} />
                        </div>
                        <span className={`text-sm sm:text-base leading-relaxed break-words ${plan.featured ? 'text-white/80' : 'text-muted-foreground'}`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Decorative Elements */}
                {plan.featured && (
                  <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 sm:mt-20">
          <p className="text-muted-foreground text-sm sm:text-base mb-4 text-pretty">
            {isArabic 
              ? 'هل تحتاج إلى خطة مخصصة؟ تواصل معنا لمناقشة احتياجاتك'
              : 'Need a custom plan? Contact us to discuss your requirements'
            }
          </p>
          <a 
            href="#contact" 
            className="text-primary hover:text-primary/80 font-medium transition-colors inline-flex items-center gap-2"
          >
            {isArabic ? 'تواصل معنا' : 'Contact Us'}
            <span className={isArabic ? 'rotate-180' : ''}>→</span>
          </a>
        </div>
      </div>
    </section>
  );
};
