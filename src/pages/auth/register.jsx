'use client'

import { RegisterForm } from '@/components/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-xl shadow-lg p-6 sm:p-8">
          <RegisterForm />
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {/* Footer text optional */}
        </p>
      </div>
    </div>
  )
}
