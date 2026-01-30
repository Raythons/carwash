'use client'

import { RegisterForm } from '@/components/auth/RegisterForm'
import { PublicLayout } from '@/components/public/PublicLayout'

export default function RegisterPage() {
  return (
    <PublicLayout>
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/10 to-primary/5">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-secondary/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-md p-4">
          <div className="bg-background/95 backdrop-blur-md rounded-2xl shadow-2xl border border-border p-6 sm:p-8">
            <RegisterForm />
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
