'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin } from 'lucide-react';

export const ContactSection = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 3000);
  };

  return (
    <section 
      id="contact" 
      className={`py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-background ${isArabic ? 'rtl' : 'ltr'}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-12 sm:mb-16 ${isArabic ? 'ar' : ''}`}>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t('public.contact.title')}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-4">
            {t('public.contact.subtitle')}
          </p>
          <div className="w-16 sm:w-20 h-1 bg-primary mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 mb-8 sm:mb-12">
          {/* Contact Info */}
          <div className="space-y-6 sm:space-y-8">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 rounded-lg p-3 mt-1 border border-primary/20">
                <Mail className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1">Email</h3>
                <p className="text-muted-foreground text-sm sm:text-base">info@autocare.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary/10 rounded-lg p-3 mt-1 border border-primary/20">
                <Phone className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1">{t('common.phone')}</h3>
                <p className="text-muted-foreground text-sm sm:text-base">+966 50 123 4567</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary/10 rounded-lg p-3 mt-1 border border-primary/20">
                <MapPin className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1">{t('common.location')}</h3>
                <p className="text-muted-foreground text-sm sm:text-base">Riyadh, Saudi Arabia</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">
                    {t('public.contact.name')}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t('public.contact.name')}
                    className="w-full px-3 sm:px-4 py-2 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">
                    {t('public.contact.email')}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('public.contact.email')}
                    className="w-full px-3 sm:px-4 py-2 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">
                  {t('public.contact.phone')}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t('public.contact.phone')}
                  className="w-full px-3 sm:px-4 py-2 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">
                  {t('public.contact.message')}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t('public.contact.message')}
                  rows={4}
                  className="w-full px-3 sm:px-4 py-2 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all"
                  required
                />
              </div>

              <Button type="submit" variant="default" className="w-full">
                {t('public.contact.send')}
              </Button>

              {submitted && (
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                  <p className="text-primary font-medium text-sm sm:text-base">
                    {t('public.contact.success')}
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
