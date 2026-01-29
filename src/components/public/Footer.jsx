import React from 'react';
import { useTranslation } from 'react-i18next';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export const Footer = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const socialLinks = [
    { icon: Facebook, label: 'Facebook' },
    { icon: Twitter, label: 'Twitter' },
    { icon: Instagram, label: 'Instagram' },
    { icon: Linkedin, label: 'LinkedIn' },
  ];

  const quickLinks = [
    { label: t('public.navbar.home'), href: '#home' },
    { label: t('public.navbar.about'), href: '#about' },
    { label: t('public.navbar.services'), href: '#services' },
    { label: t('public.navbar.plans'), href: '#plans' },
  ];

  return (
    <footer className={`bg-secondary text-secondary-foreground ${isArabic ? 'rtl' : 'ltr'}`}>
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-primary mb-4">AutoCare</h3>
            <p className="text-secondary-foreground/80 text-xs sm:text-sm">
              Your trusted partner for premium vehicle care solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-base sm:text-lg mb-4">
              {t('public.footer.quick_links')}
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-secondary-foreground/80 hover:text-primary transition-colors text-xs sm:text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-base sm:text-lg mb-4">
              {t('public.footer.support')}
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-secondary-foreground/80 hover:text-primary transition-colors text-xs sm:text-sm">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-foreground/80 hover:text-primary transition-colors text-xs sm:text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-foreground/80 hover:text-primary transition-colors text-xs sm:text-sm">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-foreground/80 hover:text-primary transition-colors text-xs sm:text-sm">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-bold text-base sm:text-lg mb-4">
              {t('public.footer.follow')}
            </h4>
            <div className="flex gap-3 sm:gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href="#"
                    className="bg-primary hover:bg-primary/80 p-2 rounded-lg transition-colors"
                    aria-label={social.label}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-secondary-foreground/20 py-6 sm:py-8">
          <p className="text-center text-secondary-foreground/70 text-xs sm:text-sm">
            {t('public.footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};
