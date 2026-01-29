'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const isArabic = i18n.language === 'ar';

  const toggleLanguage = () => {
    i18n.changeLanguage(isArabic ? 'en' : 'ar');
  };

  const navItems = [
    { label: t('public.navbar.home'), href: '#home' },
    { label: t('public.navbar.about'), href: '#about' },
    { label: t('public.navbar.services'), href: '#services' },
    { label: t('public.navbar.plans'), href: '#plans' },
    { label: t('public.navbar.extras'), href: '#extras' },
    { label: t('public.navbar.contact'), href: '#contact' },
  ];

  return (
    <nav className={`fixed w-full bg-background border-b border-border shadow-sm z-50 transition-all ${isArabic ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-primary">AutoCare</h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right Side - Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 bg-secondary text-secondary-foreground rounded-lg text-sm font-semibold hover:bg-secondary/80 transition-colors"
            >
              {isArabic ? 'EN' : 'العربية'}
            </button>

            <Button variant="outline" size="sm">
              {t('public.navbar.login')}
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};
