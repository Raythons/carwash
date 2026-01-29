import React from 'react';
import { useTranslation } from 'react-i18next';
import { Disc, Battery, Wind, Shield, Sofa, Cog, ArrowRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const ExtrasSection = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const services = [
    { key: 'service1', icon: Disc },
    { key: 'service2', icon: Battery },
    { key: 'service3', icon: Wind },
    { key: 'service4', icon: Shield },
    { key: 'service5', icon: Sofa },
    { key: 'service6', icon: Cog },
  ];

  return (
    <section 
      id="extras" 
      className={`py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-muted/50 ${isArabic ? 'rtl' : 'ltr'}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            {isArabic ? 'المزيد من الخدمات' : 'More Services'}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            {t('public.extras.title')}
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto text-pretty">
            {t('public.extras.available')}
          </p>
          <div className="w-20 h-1.5 bg-gradient-to-r from-primary to-primary/50 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="group bg-card rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-border relative overflow-hidden"
              >
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
                
                <div className="relative z-10">
                  {/* Icon & Title Row */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                      <Icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors break-words flex-1">
                      {t(`public.extras.${service.key}`)}
                    </h3>
                  </div>
                  
                  {/* Description */}
                  <p className="text-muted-foreground text-sm sm:text-base mb-5 leading-relaxed">
                    {isArabic 
                      ? 'خدمة متميزة للعناية المثلى وصيانة سيارتك'
                      : 'Premium service for optimal care and maintenance of your vehicle'
                    }
                  </p>

                  {/* Action Link */}
                  <a 
                    href="#contact" 
                    className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:gap-3 transition-all"
                  >
                    {isArabic ? 'احجز الآن' : 'Book Now'}
                    <ArrowRight className={`w-4 h-4 ${isArabic ? 'rotate-180' : ''}`} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-secondary via-secondary to-secondary/90 rounded-3xl p-8 sm:p-12 lg:p-16">
          {/* Background Decorations */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-2xl" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-start max-w-2xl">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 text-balance">
                {isArabic ? 'هل تحتاج إلى خدمة مخصصة؟' : 'Need a Custom Service Package?'}
              </h3>
              <p className="text-white/80 text-base sm:text-lg text-pretty">
                {isArabic 
                  ? 'تواصل معنا للحصول على باقات خدمات مخصصة تناسب احتياجاتك'
                  : 'Contact us for custom service packages tailored to your specific needs'
                }
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#contact">
                <Button 
                  size="lg" 
                  className="bg-white text-secondary hover:bg-white/90 shadow-lg px-8 py-6 text-base font-semibold"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  {t('public.navbar.contact')}
                </Button>
              </a>
              <Link to="/auth/register">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-base font-semibold"
                >
                  {t('public.hero.cta_button')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
