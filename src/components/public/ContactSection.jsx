'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Send, Clock, CheckCircle } from 'lucide-react';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', phone: '', message: '' });
      }, 3000);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: isArabic ? 'البريد الإلكتروني' : 'Email',
      value: 'info@autocare.com',
      description: isArabic ? 'راسلنا في أي وقت' : 'Send us an email anytime',
    },
    {
      icon: Phone,
      title: isArabic ? 'الهاتف' : 'Phone',
      value: '+966 50 123 4567',
      description: isArabic ? 'اتصل بنا للاستفسارات' : 'Call us for inquiries',
    },
    {
      icon: MapPin,
      title: isArabic ? 'الموقع' : 'Location',
      value: isArabic ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia',
      description: isArabic ? 'زورونا في موقعنا' : 'Visit us at our location',
    },
    {
      icon: Clock,
      title: isArabic ? 'ساعات العمل' : 'Working Hours',
      value: isArabic ? '8 ص - 10 م' : '8 AM - 10 PM',
      description: isArabic ? 'السبت - الخميس' : 'Saturday - Thursday',
    },
  ];

  return (
    <section 
      id="contact" 
      className={`py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-background ${isArabic ? 'rtl' : 'ltr'}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            {isArabic ? 'تواصل معنا' : 'Get In Touch'}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            {t('public.contact.title')}
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto text-pretty">
            {t('public.contact.subtitle')}
          </p>
          <div className="w-20 h-1.5 bg-gradient-to-r from-primary to-primary/50 mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Contact Info Cards */}
          <div className="lg:col-span-2 space-y-6">
            {contactInfo.map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={index}
                  className="group flex items-start gap-4 p-5 bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                    <p className="text-foreground font-medium text-sm sm:text-base break-words">{item.value}</p>
                    <p className="text-muted-foreground text-xs sm:text-sm mt-1">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-card rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm border border-border">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
                {isArabic ? 'أرسل لنا رسالة' : 'Send us a Message'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t('public.contact.name')} <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={isArabic ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                      className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t('public.contact.email')} <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={isArabic ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                      className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('public.contact.phone')}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={isArabic ? 'أدخل رقم هاتفك' : 'Enter your phone number'}
                    className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('public.contact.message')} <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={isArabic ? 'اكتب رسالتك هنا...' : 'Write your message here...'}
                    rows={5}
                    className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none transition-all"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg"
                  className="w-full py-6 text-base font-semibold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {isArabic ? 'جاري الإرسال...' : 'Sending...'}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-5 h-5" />
                      {t('public.contact.send')}
                    </span>
                  )}
                </Button>

                {submitted && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <p className="text-emerald-600 font-medium text-sm sm:text-base">
                      {t('public.contact.success')}
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
