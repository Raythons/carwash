'use client'

import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export function HeroSection() {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  return (
    <section
      id="home"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-secondary via-secondary/90 to-secondary/80"
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto max-w-3xl">
        <div className={`flex flex-col items-center justify-center space-y-6 sm:space-y-8 ${isArabic ? 'text-right' : 'text-left'}`}>
          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white text-balance leading-tight text-center drop-shadow-lg">
            {t('public.hero.title')}
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto text-pretty text-center drop-shadow-md">
            {t('public.hero.subtitle')}
          </p>

          {/* CTA Button */}
          <Link to="/login" className="pt-4">
            <Button
              size="lg"
              className="text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 bg-white text-primary hover:bg-white/90"
            >
              {t('public.hero.cta_button')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
