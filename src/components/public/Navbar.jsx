'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isArabic = i18n.language === 'ar';

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${isArabic ? 'rtl' : 'ltr'} ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#home" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <h1 className={`text-xl sm:text-2xl font-bold ${isScrolled ? 'text-foreground' : 'text-white'}`}>
                AutoCare
              </h1>
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isScrolled 
                    ? 'text-foreground hover:text-primary hover:bg-primary/5' 
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right Side - Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1 ${
                isScrolled 
                  ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' 
                  : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
              }`}
            >
              {isArabic ? 'EN' : 'ع'}
              <ChevronDown className="w-3 h-3" />
            </button>

            {/* Login Button - Desktop */}
            <Link to="/auth/login" className="hidden sm:block">
              <Button 
                variant={isScrolled ? "outline" : "secondary"} 
                size="sm"
                className={!isScrolled ? 'bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm' : ''}
              >
                {t('public.navbar.login')}
              </Button>
            </Link>

            {/* Register Button - Desktop */}
            <Link to="/auth/register" className="hidden md:block">
              <Button size="sm">
                {t('public.navbar.register')}
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                isScrolled 
                  ? 'hover:bg-muted text-foreground' 
                  : 'hover:bg-white/10 text-white'
              }`}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className={`pb-4 space-y-1 ${isScrolled ? '' : 'bg-secondary/95 backdrop-blur-md rounded-xl mt-2 p-4'}`}>
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                  isScrolled 
                    ? 'text-foreground hover:bg-muted' 
                    : 'text-white hover:bg-white/10'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
            
            {/* Mobile Auth Buttons */}
            <div className="pt-4 space-y-2 border-t border-border/20 mt-4">
              <Link to="/auth/login" className="block" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full">
                  {t('public.navbar.login')}
                </Button>
              </Link>
              <Link to="/auth/register" className="block" onClick={() => setIsOpen(false)}>
                <Button className="w-full">
                  {t('public.navbar.register')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
