'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'

export function RegisterForm() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    terms: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

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

    // Validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill all required fields')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.register.passwords_not_match'))
      return
    }

    if (!formData.terms) {
      setError('Please accept terms and conditions')
      return
    }

    setIsLoading(true)

    try {
      // API call would go here
      console.log('[v0] Register attempt:', formData)
      setSuccess(true)
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        terms: false,
      })
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    } catch (err) {
      setError(t('auth.register.register_failed'))
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-foreground">{t('auth.register.title')}</h1>
          <p className="text-muted-foreground">{t('auth.register.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive text-destructive rounded-lg text-sm">
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
            <Input
              type="text"
              name="fullName"
              placeholder={t('auth.register.full_name_placeholder')}
              value={formData.fullName}
              onChange={handleChange}
              disabled={isLoading}
              required
              className="bg-input border-border"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t('auth.register.email_label')}
            </label>
            <Input
              type="email"
              name="email"
              placeholder={t('auth.register.email_placeholder')}
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              required
              className="bg-input border-border"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t('auth.register.phone_label')}
            </label>
            <Input
              type="tel"
              name="phone"
              placeholder={t('auth.register.phone_placeholder')}
              value={formData.phone}
              onChange={handleChange}
              disabled={isLoading}
              className="bg-input border-border"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t('auth.register.password_label')}
            </label>
            <Input
              type="password"
              name="password"
              placeholder={t('auth.register.password_placeholder')}
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              required
              className="bg-input border-border"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t('auth.register.confirm_password_label')}
            </label>
            <Input
              type="password"
              name="confirmPassword"
              placeholder={t('auth.register.confirm_password_placeholder')}
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
              required
              className="bg-input border-border"
            />
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              name="terms"
              checked={formData.terms}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, terms: checked }))
              }
              disabled={isLoading}
              className="mt-1"
            />
            <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
              {t('auth.register.terms')}{' '}
              <a href="#" className="text-primary hover:underline">
                {t('auth.register.privacy')}
              </a>
            </label>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? t('auth.register.loading') : t('auth.register.create_account_button')}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background text-muted-foreground">
              {t('auth.register.already_account')}
            </span>
          </div>
        </div>

        <Link to="/login" className="block">
          <Button variant="outline" className="w-full bg-transparent" size="lg">
            {t('auth.register.sign_in')}
          </Button>
        </Link>
      </div>
    </div>
  )
}
