'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, Globe, Home, Info, Settings, Package, Sparkles, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';

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
    { label: t('public.navbar.home'), href: '#home', icon: Home },
    { label: t('public.navbar.about'), href: '#about', icon: Info },
    { label: t('public.navbar.services'), href: '#services', icon: Settings },
    { label: t('public.navbar.plans'), href: '#plans', icon: Package },
    { label: t('public.navbar.extras'), href: '#extras', icon: Sparkles },
    { label: t('public.navbar.contact'), href: '#contact', icon: Phone },
  ];

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-500 ${isArabic ? 'rtl' : 'ltr'} ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm' 
          : 'bg-primary/20 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#home" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <h1 className={`text-xl sm:text-2xl font-bold transition-colors duration-300 ${isScrolled ? 'text-foreground' : 'text-white'}`}>
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
            {/* Language Toggle - Desktop Only */}
            <button
              onClick={toggleLanguage}
              className={`hidden sm:flex px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 items-center gap-1.5 ${
                isScrolled 
                  ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' 
                  : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
              }`}
            >
              <Globe className="w-4 h-4" />
              {isArabic ? 'EN' : 'ع'}
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
              onClick={() => setIsOpen(true)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                isScrolled 
                  ? 'hover:bg-muted text-foreground' 
                  : 'hover:bg-white/10 text-white'
              }`}
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent 
          side={isArabic ? 'right' : 'left'} 
          className="w-[300px] sm:w-[350px] bg-secondary text-secondary-foreground border-secondary"
        >
          <SheetHeader className="border-b border-white/10 pb-6 mb-6">
            <SheetTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-white text-xl font-bold">AutoCare</span>
            </SheetTitle>
          </SheetHeader>
          
          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <SheetClose asChild key={item.href}>
                  <a
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium"
                  >
                    <Icon className="w-5 h-5 text-primary" />
                    {item.label}
                  </a>
                </SheetClose>
              );
            })}
          </nav>

          {/* Language Toggle in Mobile */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium"
            >
              <Globe className="w-5 h-5 text-primary" />
              {isArabic ? 'English' : 'العربية'}
            </button>
          </div>

          {/* Auth Buttons */}
          <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
            <SheetClose asChild>
              <Link to="/auth/login" className="block">
                <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                  {t('public.navbar.login')}
                </Button>
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link to="/auth/register" className="block">
                <Button className="w-full">
                  {t('public.navbar.register')}
                </Button>
              </Link>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
};
