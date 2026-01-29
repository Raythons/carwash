'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function LoginForm() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false)
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // API call would go here
      console.log('[v0] Login attempt:', { email, password, rememberMe })
      // Simulating successful login
      setTimeout(() => {
        setIsLoading(false)
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
      // Simulate API call
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
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-foreground">{t('auth.login.title')}</h1>
          <p className="text-muted-foreground">{t('auth.login.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive text-destructive rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t('auth.login.email_label')}
            </label>
            <Input
              type="email"
              placeholder={t('auth.login.email_placeholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
              className="bg-input border-border"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                {t('auth.login.password_label')}
              </label>
              <button
                type="button"
                onClick={() => setIsForgotPasswordOpen(true)}
                className="text-xs text-primary hover:underline"
              >
                {t('auth.login.forgot_password')}
              </button>
            </div>
            <Input
              type="password"
              placeholder={t('auth.login.password_placeholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              className="bg-input border-border"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={setRememberMe}
              disabled={isLoading}
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
            className="w-full"
            size="lg"
          >
            {isLoading ? t('auth.login.loading') : t('auth.login.sign_in_button')}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background text-muted-foreground">
              {t('auth.login.no_account')}
            </span>
          </div>
        </div>

        <Link href="/auth/register">
          <Button variant="outline" className="w-full bg-transparent" size="lg">
            {t('auth.login.create_account')}
          </Button>
        </Link>
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
                  className="bg-input border-border"
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
