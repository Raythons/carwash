import React from 'react';
import { useTranslation } from 'react-i18next';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: '#' },
    { icon: Twitter, label: 'Twitter', href: '#' },
    { icon: Instagram, label: 'Instagram', href: '#' },
    { icon: Linkedin, label: 'LinkedIn', href: '#' },
  ];

  const quickLinks = [
    { label: t('public.navbar.home'), href: '#home' },
    { label: t('public.navbar.about'), href: '#about' },
    { label: t('public.navbar.services'), href: '#services' },
    { label: t('public.navbar.plans'), href: '#plans' },
    { label: t('public.navbar.extras'), href: '#extras' },
    { label: t('public.navbar.contact'), href: '#contact' },
  ];

  const supportLinks = [
    { label: isArabic ? 'مركز المساعدة' : 'Help Center', href: '#' },
    { label: isArabic ? 'سياسة الخصوصية' : 'Privacy Policy', href: '#' },
    { label: isArabic ? 'شروط الخدمة' : 'Terms of Service', href: '#' },
    { label: isArabic ? 'الأسئلة الشائعة' : 'FAQ', href: '#' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={`bg-secondary text-secondary-foreground ${isArabic ? 'rtl' : 'ltr'}`}>
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <h3 className="text-2xl font-bold text-white">AutoCare</h3>
            </div>
            <p className="text-secondary-foreground/70 text-sm leading-relaxed mb-6">
              {isArabic 
                ? 'شريكك الموثوق لحلول العناية بالسيارات المتميزة. نقدم خدمات احترافية بأعلى معايير الجودة.'
                : 'Your trusted partner for premium vehicle care solutions. We deliver professional services with the highest quality standards.'
              }
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 bg-white/10 hover:bg-primary rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg text-white mb-6">
              {t('public.footer.quick_links')}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-secondary-foreground/70 hover:text-primary transition-colors text-sm inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-lg text-white mb-6">
              {t('public.footer.support')}
            </h4>
            <ul className="space-y-3">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-secondary-foreground/70 hover:text-primary transition-colors text-sm inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-lg text-white mb-6">
              {isArabic ? 'تواصل معنا' : 'Contact Us'}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-secondary-foreground/70 text-sm">info@autocare.com</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-secondary-foreground/70 text-sm">+966 50 123 4567</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-secondary-foreground/70 text-sm break-words">
                    {isArabic ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia'}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-secondary-foreground/60 text-sm text-center sm:text-start">
            {t('public.footer.rights')}
          </p>
          
          {/* Back to Top Button */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-secondary-foreground/60 hover:text-primary transition-colors text-sm group"
          >
            <span>{isArabic ? 'العودة للأعلى' : 'Back to Top'}</span>
            <div className="w-8 h-8 bg-white/10 group-hover:bg-primary rounded-lg flex items-center justify-center transition-all">
              <ArrowUp className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
};
