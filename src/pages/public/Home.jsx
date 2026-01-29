'use client'

import { useEffect } from 'react'
import { Navbar } from '@/components/public/Navbar'
import { HeroSection } from '@/components/public/HeroSection'
import { AboutSection } from '@/components/public/AboutSection'
import { ServicesSection } from '@/components/public/ServicesSection'
import { PricingSection } from '@/components/public/PricingSection'
import { ExtrasSection } from '@/components/public/ExtrasSection'
import { ContactSection } from '@/components/public/ContactSection'
import { Footer } from '@/components/public/Footer'
import { useTranslation } from 'react-i18next'

export function PublicHome() {
  const { i18n } = useTranslation()

  useEffect(() => {
    // Set document direction based on language
    const htmlElement = document.documentElement
    htmlElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr'
    htmlElement.lang = i18n.language
  }, [i18n.language])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <PricingSection />
        <ExtrasSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}

export default PublicHome
