import React from 'react';
import { useTranslation } from 'react-i18next';
import { Target, Eye, Users, Award } from 'lucide-react';

export const AboutSection = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const stats = [
    { value: '10K+', label: isArabic ? 'عميل سعيد' : 'Happy Clients' },
    { value: '15+', label: isArabic ? 'سنوات خبرة' : 'Years Experience' },
    { value: '50+', label: isArabic ? 'خدمة متاحة' : 'Services Available' },
    { value: '24/7', label: isArabic ? 'دعم متواصل' : 'Support' },
  ];

  return (
    <section 
      id="about" 
      className={`py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-background ${isArabic ? 'rtl' : 'ltr'}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Image Section */}
          <div className={`${isArabic ? 'lg:order-2' : 'lg:order-1'}`}>
            <div className="relative">
              {/* Main Image */}
              <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/images/images.jpg"
                  alt="Vehicle Care"
                  className="w-full h-full object-cover"
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 to-transparent" />
              </div>
              
              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -right-6 lg:-right-12 bg-card rounded-2xl p-4 sm:p-6 shadow-xl border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">15+</p>
                    <p className="text-sm text-muted-foreground">{isArabic ? 'سنوات خبرة' : 'Years Experience'}</p>
                  </div>
                </div>
              </div>
              
              {/* Decorative Element */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
            </div>
          </div>

          {/* Content Section */}
          <div className={`space-y-8 ${isArabic ? 'lg:order-1' : 'lg:order-2'}`}>
            {/* Section Label */}
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {isArabic ? 'من نحن' : 'About Us'}
            </span>
            
            {/* Title */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight text-balance">
              {t('public.about.title')}
            </h2>
            
            {/* Description */}
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty">
              {t('public.about.description')}
            </p>

            {/* Mission & Vision Cards */}
            <div className="space-y-4">
              {/* Mission */}
              <div className="group bg-gradient-to-r from-primary/5 to-transparent rounded-2xl p-5 sm:p-6 border border-primary/20 hover:border-primary/40 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                      {t('public.about.mission')}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed break-words">
                      {t('public.about.mission_desc')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Vision */}
              <div className="group bg-gradient-to-r from-secondary/10 to-transparent rounded-2xl p-5 sm:p-6 border border-secondary/20 hover:border-secondary/40 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/20 transition-colors">
                    <Eye className="w-6 h-6 text-secondary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                      {t('public.about.vision')}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed break-words">
                      {t('public.about.vision_desc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 pt-12 border-t border-border">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-primary mb-2">{stat.value}</p>
              <p className="text-sm sm:text-base text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
