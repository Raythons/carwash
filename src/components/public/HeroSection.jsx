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
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-20 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: 'url(/Gemini_Generated_Image_pxxmpjpxxmpjpxxm.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto max-w-3xl">
        <div className={`flex flex-col items-center justify-center space-y-6 sm:space-y-8 ${isArabic ? 'text-right' : 'text-left'}`}>
          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white text-balance leading-tight text-center">
            {t('public.hero.title')}
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-100 max-w-2xl mx-auto text-pretty text-center">
            {t('public.hero.subtitle')}
          </p>

          {/* CTA Button */}
          <Link href="/auth/register" className="pt-4">
            <Button
              size="lg"
              className="text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {t('public.hero.cta_button')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
