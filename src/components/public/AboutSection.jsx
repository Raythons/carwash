import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2 } from 'lucide-react';

export const AboutSection = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  return (
    <section 
      id="about" 
      className={`py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-background ${isArabic ? 'rtl' : 'ltr'}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Image */}
          <div className={`order-2 ${isArabic ? 'lg:order-1' : 'lg:order-1'}`}>
            <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden shadow-xl">
              <img
                src="/images/images.jpg"
                alt="Vehicle Care"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className={`order-1 space-y-6 sm:space-y-8 ${isArabic ? 'lg:order-2' : 'lg:order-2'}`}>
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                {t('public.about.title')}
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                {t('public.about.description')}
              </p>
            </div>

            {/* Mission & Vision Cards */}
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-primary/10 rounded-xl p-4 sm:p-6 border-l-4 border-primary">
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 flex items-center gap-3">
                  <CheckCircle2 className="text-primary flex-shrink-0" size={24} />
                  {t('public.about.mission')}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {t('public.about.mission_desc')}
                </p>
              </div>

              <div className="bg-secondary/20 rounded-xl p-4 sm:p-6 border-l-4 border-secondary">
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 flex items-center gap-3">
                  <CheckCircle2 className="text-secondary flex-shrink-0" size={24} />
                  {t('public.about.vision')}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {t('public.about.vision_desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
