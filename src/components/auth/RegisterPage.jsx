'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, EyeOff, Mail, Lock, User, Phone, Shield, Sparkles } from 'lucide-react'

export default function RegisterPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    terms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const isArabic = i18n.language === 'ar'

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError(isArabic ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.register.passwords_not_match'))
      return
    }

    if (!formData.terms) {
      setError(isArabic ? 'يرجى الموافقة على الشروط والأحكام' : 'Please accept terms and conditions')
      return
    }

    setIsLoading(true)

    try {
      console.log('[v0] Register attempt:', formData)
      setSuccess(true)
      setTimeout(() => {
        setIsLoading(false)
        navigate('/auth/login')
      }, 1500)
    } catch (err) {
      setError(t('auth.register.register_failed'))
      setIsLoading(false)
    }
  }

  return (
    <div className={`min-h-screen flex ${isArabic ? 'rtl' : 'ltr'}`}>
      {/* Left Side - Animated Background */}
      <div className="hidden lg:flex lg:w-1/2 bg-secondary relative overflow-hidden items-center justify-center">
        {/* Animated Water Waves */}
        <div className="absolute inset-0">
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-primary/20 to-transparent animate-wave" />
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-primary/15 animate-float"
              style={{
                width: `${Math.random() * 80 + 30}px`,
                height: `${Math.random() * 80 + 30}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 15 + 10}s`,
              }}
            />
          ))}
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/95 to-primary/20" />
        
        {/* Content */}
        <div className="relative z-10 text-center px-12">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/30 animate-bounce-slow">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            {isArabic ? 'انضم إلينا اليوم' : 'Join Us Today'}
          </h2>
          <p className="text-white/70 text-lg max-w-md">
            {isArabic 
              ? 'أنشئ حسابك واستمتع بخدمات العناية بالسيارات المتميزة'
              : 'Create your account and enjoy premium vehicle care services'
            }
          </p>
          
          {/* Features */}
          <div className="mt-10 space-y-4">
            {[
              { icon: Sparkles, text: isArabic ? 'خدمات احترافية' : 'Professional Services' },
              { icon: Shield, text: isArabic ? 'ضمان الجودة' : 'Quality Guaranteed' },
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 justify-center text-white/80">
                <feature.icon className="w-5 h-5 text-primary" />
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-background px-4 sm:px-6 lg:px-12 py-8 lg:py-12 overflow-y-auto">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">AutoCare</h1>
          </div>

          <div className="space-y-5">
            <div className="space-y-2 text-center lg:text-start">
              <h1 className="text-3xl font-bold text-foreground">{t('auth.register.title')}</h1>
              <p className="text-muted-foreground">{t('auth.register.subtitle')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive text-destructive rounded-lg text-sm animate-shake">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 bg-green-500/10 border border-green-500 text-green-600 rounded-lg text-sm">
                  {t('auth.register.register_success')}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {t('auth.register.full_name_label')}
                </label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    type="text"
                    name="fullName"
                    placeholder={t('auth.register.full_name_placeholder')}
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                    className="pl-10 h-11 bg-muted/50 border-border focus:bg-background transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {t('auth.register.email_label')}
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    type="email"
                    name="email"
                    placeholder={t('auth.register.email_placeholder')}
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                    className="pl-10 h-11 bg-muted/50 border-border focus:bg-background transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {t('auth.register.phone_label')}
                </label>
                <div className="relative group">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    type="tel"
                    name="phone"
                    placeholder={t('auth.register.phone_placeholder')}
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="pl-10 h-11 bg-muted/50 border-border focus:bg-background transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    {t('auth.register.password_label')}
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="********"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isLoading}
                      required
                      className="pl-10 pr-10 h-11 bg-muted/50 border-border focus:bg-background transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    {t('auth.register.confirm_password_label')}
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="********"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={isLoading}
                      required
                      className="pl-10 pr-10 h-11 bg-muted/50 border-border focus:bg-background transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-2 rtl:space-x-reverse">
                <Checkbox
                  id="terms"
                  name="terms"
                  checked={formData.terms}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, terms: checked }))
                  }
                  disabled={isLoading}
                  className="mt-0.5 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
                  {t('auth.register.terms')}{' '}
                  <a href="#" className="text-primary hover:underline">
                    {t('auth.register.privacy')}
                  </a>
                </label>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 text-base font-semibold"
                size="lg"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t('auth.register.loading')}
                  </div>
                ) : (
                  t('auth.register.create_account_button')
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-background text-muted-foreground">
                  {t('auth.register.already_account')}
                </span>
              </div>
            </div>

            <Link to="/auth/login">
              <Button variant="outline" className="w-full h-11 text-base font-semibold hover:bg-secondary/10 hover:border-secondary bg-transparent" size="lg">
                {t('auth.register.sign_in')}
              </Button>
            </Link>

            {/* Back to Home */}
            <div className="text-center">
              <Link 
                to="/" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
              >
                {isArabic ? '← العودة للصفحة الرئيسية' : '← Back to Home'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
