'use client'

import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { ChevronDown, Sparkles, Shield, Clock } from 'lucide-react'

export function HeroSection() {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  const features = [
    { icon: Sparkles, label: isArabic ? 'خدمة متميزة' : 'Premium Service' },
    { icon: Shield, label: isArabic ? 'ضمان الجودة' : 'Quality Guaranteed' },
    { icon: Clock, label: isArabic ? 'دعم 24/7' : '24/7 Support' },
  ]

  return (
    <section
      id="home"
      className={`relative w-full min-h-screen flex items-center justify-center overflow-hidden ${isArabic ? 'rtl' : 'ltr'}`}
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/hero-carwash.jpeg)',
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/70 via-secondary/60 to-secondary/80" />
      
      {/* Animated Accent */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center space-y-8">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-white/90 text-sm font-medium">
                {isArabic ? 'خدمات عناية السيارات الاحترافية' : 'Professional Vehicle Care Services'}
              </span>
            </div>
            
            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white text-balance leading-[1.1] text-center">
              {t('public.hero.title')}
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl lg:text-2xl text-white/80 max-w-2xl mx-auto text-pretty text-center leading-relaxed">
              {t('public.hero.subtitle')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Link to="/auth/register">
                <Button
                  size="lg"
                  className="text-base sm:text-lg px-8 sm:px-10 py-6 rounded-xl font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 hover:scale-105"
                >
                  {t('public.hero.cta_button')}
                </Button>
              </Link>
              <a href="#services">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-base sm:text-lg px-8 sm:px-10 py-6 rounded-xl font-semibold bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-300"
                >
                  {isArabic ? 'اكتشف خدماتنا' : 'Explore Services'}
                </Button>
              </a>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-4 pt-8">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div 
                    key={index}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full"
                  >
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="text-white/80 text-sm font-medium whitespace-nowrap">
                      {feature.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <a href="#about" className="flex flex-col items-center gap-2 text-white/60 hover:text-white transition-colors">
            <span className="text-xs font-medium">{isArabic ? 'اكتشف المزيد' : 'Scroll Down'}</span>
            <ChevronDown className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  )
}
