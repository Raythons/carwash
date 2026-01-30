'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isArabic ? 'rtl' : 'ltr'} ${
      scrolled 
        ? 'bg-background border-b border-border shadow-sm' 
        : 'bg-primary/80 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className={`text-2xl font-bold transition-colors ${
              scrolled ? 'text-primary' : 'text-white'
            }`}>
              AutoCare
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`font-medium transition-colors ${
                  scrolled 
                    ? 'text-foreground hover:text-primary' 
                    : 'text-white hover:text-white/80'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right Side - Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login">
              <Button 
                variant={scrolled ? "outline" : "secondary"} 
                size="sm"
                className={scrolled ? "" : "bg-white text-primary hover:bg-white/90"}
              >
                {t('public.navbar.login')}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(true)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled 
                ? 'text-foreground hover:bg-accent' 
                : 'text-white hover:bg-white/20'
            }`}
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Sheet Menu */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side={isArabic ? "right" : "left"} className="w-[300px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold text-primary">AutoCare</SheetTitle>
          </SheetHeader>
          
          <div className="flex flex-col gap-6 mt-8">
            {/* Navigation Links */}
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="px-4 py-3 text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg font-medium transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Divider */}
            <div className="border-t border-border"></div>

            {/* Language Switcher */}
            <div className="px-4">
              <button
                onClick={() => {
                  toggleLanguage();
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/80 transition-colors"
              >
                <Globe size={20} />
                <span>{isArabic ? 'English' : 'العربية'}</span>
              </button>
            </div>

            {/* Login Button */}
            <div className="px-4">
              <Link to="/login" className="block">
                <Button className="w-full" onClick={() => setIsOpen(false)}>
                  {t('public.navbar.login')}
                </Button>
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
};
