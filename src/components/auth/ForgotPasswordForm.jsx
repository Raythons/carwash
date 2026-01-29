'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'

export function ForgotPasswordForm() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // API call would go here
      console.log('[v0] Forgot password attempt:', { email })
      setSubmitted(true)
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    } catch (err) {
      setIsLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="w-full max-w-md mx-auto text-center space-y-6">
        <div className="space-y-2">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            {t('auth.forgot_password.success')}
          </h2>
          <p className="text-muted-foreground">
            Check your email for the password reset link
          </p>
        </div>

        <Link href="/auth/login">
          <Button className="w-full" size="lg">
            {t('auth.forgot_password.back_to_login')}
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-foreground">
            {t('auth.forgot_password.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('auth.forgot_password.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t('auth.forgot_password.email_label')}
            </label>
            <Input
              type="email"
              placeholder={t('auth.forgot_password.email_placeholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
              className="bg-input border-border"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? t('auth.forgot_password.loading') : t('auth.forgot_password.send_button')}
          </Button>
        </form>

        <Link href="/auth/login">
          <Button
            variant="ghost"
            className="w-full gap-2"
          >
            <ArrowLeft size={18} />
            {t('auth.forgot_password.back_to_login')}
          </Button>
        </Link>
      </div>
    </div>
  )
}
