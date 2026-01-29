import { useState } from "react"
import { Button } from "../ui/Button"
import { User, X, LogIn } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"

const testUsers = [
  {
    email: "admin@vcsms.com",
    password: "Admin123!",
    name: "System Owner",
    color: "bg-purple-600 hover:bg-purple-700",
    icon: "👑",
    description: "Full access to all features"
  },
  {
    email: "animals@test.com",
    password: "Test123!",
    name: "Animals Manager",
    color: "bg-green-600 hover:bg-green-700",
    icon: "🐾",
    description: "Animals CRUD only"
  },
  {
    email: "employees@test.com",
    password: "Test123!",
    name: "Employees Manager",
    color: "bg-blue-600 hover:bg-blue-700",
    icon: "👥",
    description: "Employees management only"
  },
  {
    email: "residences@test.com",
    password: "Test123!",
    name: "Residences Manager",
    color: "bg-orange-600 hover:bg-orange-700",
    icon: "🏠",
    description: "Residences management only"
  },
  {
    email: "surgeries@test.com",
    password: "Test123!",
    name: "Surgeries Manager",
    color: "bg-red-600 hover:bg-red-700",
    icon: "⚕️",
    description: "Surgeries management only"
  },
  {
    email: "examinations@test.com",
    password: "Test123!",
    name: "Examinations Manager",
    color: "bg-cyan-600 hover:bg-cyan-700",
    icon: "🔬",
    description: "Examinations management only"
  },
  {
    email: "vet@test.com",
    password: "Test123!",
    name: "Veterinarian",
    color: "bg-teal-600 hover:bg-teal-700",
    icon: "👨‍⚕️",
    description: "Examinations + Animals CRUD"
  },
  {
    email: "storage@test.com",
    password: "Test123!",
    name: "Storage Manager",
    color: "bg-yellow-600 hover:bg-yellow-700",
    icon: "📦",
    description: "Storage management only"
  },
  {
    email: "reception@test.com",
    password: "Test123!",
    name: "Reception Desk",
    color: "bg-pink-600 hover:bg-pink-700",
    icon: "📞",
    description: "Appointments & basic access"
  }
]

export default function QuickLogin() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(null)
  const { login } = useAuth()

  const handleQuickLogin = async (user) => {
    setLoading(user.email)
    try {
      await login({ email: user.email, password: user.password })
      setIsOpen(false)
    } catch (error) {
      console.error("Quick login failed:", error)
    } finally {
      setLoading(null)
    }
  }

  // Only show in development
  if (import.meta.env.PROD) {
    return null
  }

  return (
    <>
      {/* Quick Login Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 z-50 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-all"
        title="Quick Login (Dev Only)"
      >
        <User className="w-5 h-5" />
      </button>

      {/* Quick Login Panel */}
      {isOpen && (
        <div className="fixed bottom-20 left-4 z-50 bg-white rounded-lg shadow-2xl border border-gray-200 w-80 max-h-96 overflow-y-auto">
          <div className="sticky top-0 bg-gray-800 text-white p-3 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <h3 className="font-semibold">Quick Login</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-gray-700 rounded p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3 space-y-2">
            <p className="text-xs text-gray-600 mb-3">
              Development only: Quick login as test users
            </p>

            {testUsers.map((user) => (
              <button
                key={user.email}
                onClick={() => handleQuickLogin(user)}
                disabled={loading === user.email}
                className={`w-full text-left p-3 rounded-lg ${user.color} text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{user.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{user.name}</div>
                    <div className="text-xs opacity-90 truncate">
                      {user.email}
                    </div>
                    <div className="text-xs opacity-75 mt-1">
                      {user.description}
                    </div>
                  </div>
                  {loading === user.email ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : (
                    <LogIn className="w-4 h-4" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="p-3 bg-gray-50 rounded-b-lg border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              🔐 All passwords: <code className="bg-gray-200 px-1 rounded">Test123!</code>
            </p>
          </div>
        </div>
      )}
    </>
  )
}
