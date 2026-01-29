'use client'

import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-xl shadow-lg p-6 sm:p-8">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  )
}
