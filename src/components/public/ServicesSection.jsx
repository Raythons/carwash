import React from 'react';
import { useTranslation } from 'react-i18next';
import { Wrench, ShieldCheck, Sparkles, Search, ArrowRight } from 'lucide-react';

export const ServicesSection = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const services = [
    {
      id: 1,
      icon: Wrench,
      titleKey: 'public.services.maintenance.title',
      descKey: 'public.services.maintenance.desc',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/10 to-cyan-500/10',
    },
    {
      id: 2,
      icon: ShieldCheck,
      titleKey: 'public.services.repair.title',
      descKey: 'public.services.repair.desc',
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-500/10 to-red-500/10',
    },
    {
      id: 3,
      icon: Sparkles,
      titleKey: 'public.services.cleaning.title',
      descKey: 'public.services.cleaning.desc',
      gradient: 'from-primary to-cyan-400',
      bgGradient: 'from-primary/10 to-cyan-400/10',
    },
    {
      id: 4,
      icon: Search,
      titleKey: 'public.services.inspection.title',
      descKey: 'public.services.inspection.desc',
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-500/10 to-teal-500/10',
    },
  ];

  return (
    <section 
      id="services" 
      className={`py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-muted/50 ${isArabic ? 'rtl' : 'ltr'}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            {isArabic ? 'ماذا نقدم' : 'What We Offer'}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            {t('public.services.title')}
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto text-pretty">
            {isArabic 
              ? 'نقدم مجموعة شاملة من خدمات العناية بالسيارات لتلبية جميع احتياجاتك'
              : 'We offer a comprehensive range of vehicle care services to meet all your needs'
            }
          </p>
          <div className="w-20 h-1.5 bg-gradient-to-r from-primary to-primary/50 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="group relative bg-card rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-border overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors break-words">
                    {t(service.titleKey)}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-4 break-words">
                    {t(service.descKey)}
                  </p>
                  
                  {/* Learn More Link */}
                  <a 
                    href="#contact" 
                    className="inline-flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all"
                  >
                    {isArabic ? 'اعرف المزيد' : 'Learn More'}
                    <ArrowRight className={`w-4 h-4 ${isArabic ? 'rotate-180' : ''}`} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
