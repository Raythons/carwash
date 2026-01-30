'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Checkbox } from '../ui/Checkbox'
import { Eye, EyeOff, Mail, Lock, Sparkles } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/Dialog'

export default function LoginPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false)
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false)
  
  const isArabic = i18n.language === 'ar'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      console.log('[v0] Login attempt:', { email, password, rememberMe })
      setTimeout(() => {
        setIsLoading(false)
        navigate('/dashboard')
      }, 1000)
    } catch (err) {
      setError(t('auth.login.login_failed'))
      setIsLoading(false)
    }
  }

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault()
    setForgotPasswordLoading(true)

    try {
      console.log('[v0] Forgot password request:', { forgotPasswordEmail })
      setTimeout(() => {
        setForgotPasswordSuccess(true)
        setForgotPasswordLoading(false)
      }, 1000)
    } catch (err) {
      setForgotPasswordLoading(false)
    }
  }

  const handleCloseForgotPasswordModal = () => {
    setIsForgotPasswordOpen(false)
    setForgotPasswordEmail('')
    setForgotPasswordSuccess(false)
  }

  return (
    <div className={`min-h-screen flex ${isArabic ? 'rtl' : 'ltr'}`}>
      {/* Left Side - Animated Background */}
      <div className="hidden lg:flex lg:w-1/2 bg-secondary relative overflow-hidden items-center justify-center">
        {/* Animated Water Bubbles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-primary/20 animate-float"
              style={{
                width: `${Math.random() * 60 + 20}px`,
                height: `${Math.random() * 60 + 20}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 10}s`,
              }}
            />
          ))}
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/95 to-primary/20" />
        
        {/* Content */}
        <div className="relative z-10 text-center px-12">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/30 animate-pulse-slow">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            {isArabic ? 'مرحباً بعودتك' : 'Welcome Back'}
          </h2>
          <p className="text-white/70 text-lg max-w-md">
            {isArabic 
              ? 'سجل دخولك للوصول إلى لوحة التحكم وإدارة خدمات سيارتك'
              : 'Sign in to access your dashboard and manage your vehicle services'
            }
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-background px-4 sm:px-6 lg:px-12 py-12">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">AutoCare</h1>
          </div>

          <div className="space-y-6">
            <div className="space-y-2 text-center lg:text-start">
              <h1 className="text-3xl font-bold text-foreground">{t('auth.login.title')}</h1>
              <p className="text-muted-foreground">{t('auth.login.subtitle')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive text-destructive rounded-lg text-sm animate-shake">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {t('auth.login.email_label')}
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    type="email"
                    placeholder={t('auth.login.email_placeholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                    className="pl-10 h-12 bg-muted/50 border-border focus:bg-background transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">
                    {t('auth.login.password_label')}
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(true)}
                    className="text-xs text-primary hover:text-primary/80 hover:underline transition-colors"
                  >
                    {t('auth.login.forgot_password')}
                  </button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('auth.login.password_placeholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    className="pl-10 pr-10 h-12 bg-muted/50 border-border focus:bg-background transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={setRememberMe}
                  disabled={isLoading}
                  className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  {t('auth.login.remember_me')}
                </label>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-base font-semibold"
                size="lg"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t('auth.login.loading')}
                  </div>
                ) : (
                  t('auth.login.sign_in_button')
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-background text-muted-foreground">
                  {t('auth.login.no_account')}
                </span>
              </div>
            </div>

            <Link to="/auth/register">
              <Button variant="outline" className="w-full h-12 text-base font-semibold hover:bg-secondary/10 hover:border-secondary bg-transparent" size="lg">
                {t('auth.login.create_account')}
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

      {/* Forgot Password Modal */}
      <Dialog open={isForgotPasswordOpen} onOpenChange={handleCloseForgotPasswordModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('auth.forgot_password.title')}</DialogTitle>
            <DialogDescription>
              {t('auth.forgot_password.subtitle')}
            </DialogDescription>
          </DialogHeader>

          {forgotPasswordSuccess ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 text-center">
                  {t('auth.forgot_password.success')}
                </p>
              </div>
              <Button
                onClick={handleCloseForgotPasswordModal}
                className="w-full"
              >
                {t('common.back')}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {t('auth.forgot_password.email_label')}
                </label>
                <Input
                  type="email"
                  placeholder={t('auth.forgot_password.email_placeholder')}
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  disabled={forgotPasswordLoading}
                  required
                  className="bg-muted/50 border-border"
                />
              </div>

              <div className="flex gap-2 flex-col sm:flex-row">
                <Button
                  type="submit"
                  disabled={forgotPasswordLoading}
                  className="flex-1"
                >
                  {forgotPasswordLoading
                    ? t('auth.forgot_password.loading')
                    : t('auth.forgot_password.send_button')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseForgotPasswordModal}
                  className="flex-1 bg-transparent"
                  disabled={forgotPasswordLoading}
                >
                  {t('auth.forgot_password.back_to_login')}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
