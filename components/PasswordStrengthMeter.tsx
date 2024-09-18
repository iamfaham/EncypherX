import { useEffect, useState } from 'react'

type StrengthLevel = 'weak' | 'medium' | 'strong' | 'very strong'

function calculatePasswordStrength(password: string): StrengthLevel {
  const length = password.length
  const hasLowercase = /[a-z]/.test(password)
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  const varietyCount = [hasLowercase, hasUppercase, hasNumbers, hasSpecialChars].filter(Boolean).length

  if (length < 8) return 'weak'
  if (length < 12) return varietyCount >= 3 ? 'medium' : 'weak'
  if (length < 16) return varietyCount >= 3 ? 'strong' : 'medium'
  return varietyCount >= 3 ? 'very strong' : 'strong'
}

export default function PasswordStrengthMeter({ password }: { password: string }) {
  const [strength, setStrength] = useState<StrengthLevel>('weak')

  useEffect(() => {
    setStrength(calculatePasswordStrength(password))
  }, [password])

  const getColor = () => {
    switch (strength) {
      case 'weak': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'strong': return 'bg-green-500'
      case 'very strong': return 'bg-blue-500'
    }
  }

  const getWidth = () => {
    switch (strength) {
      case 'weak': return 'w-1/4'
      case 'medium': return 'w-2/4'
      case 'strong': return 'w-3/4'
      case 'very strong': return 'w-full'
    }
  }

  return (
    <div className="mt-2">
      <div className="h-2 w-full bg-gray-200 rounded-full">
        <div className={`h-full ${getColor()} ${getWidth()} rounded-full transition-all duration-300 ease-in-out`}></div>
      </div>
      <p className="text-sm mt-1 text-gray-600 capitalize">{strength}</p>
    </div>
  )
}