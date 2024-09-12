'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Copy, Trash2, Share2 } from 'lucide-react'
import SharePasswordForm from './SharePasswordForm'

interface Password {
  id: string
  title: string
  username: string
  password: string
  url?: string
}

interface ViewPasswordProps {
  password: Password
  onDelete: (id: string) => void
}

export default function ViewPassword({ password, onDelete }: ViewPasswordProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [passwordValue, setPasswordValue] = useState('')
  const [error, setError] = useState('')
  const [showShareForm, setShowShareForm] = useState(false)

  const handleViewPassword = async () => {
    try {
      const response = await fetch(`/api/passwords/${password.id}`, {
        method: 'GET',
      })

      if (response.ok) {
        const data = await response.json()
        setPasswordValue(data.password)
        setShowPassword(true)
        setError('')
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to retrieve password')
      }
    } catch (error) {
      console.error('Error viewing password:', error);
      setError('An error occurred while retrieving the password')
    }
  }

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(passwordValue)
      .then(() => {
        // You could set a state here to show a "Copied!" message
      })
      .catch((error) => {
        console.error('Error copying password:', error);
        setError('Failed to copy password')
      })
  }

  const handleDeletePassword = async () => {
    if (confirm('Are you sure you want to delete this password?')) {
      try {
        const response = await fetch(`/api/passwords/${password.id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          onDelete(password.id)
        } else {
          const errorData = await response.json()
          setError(errorData.message || 'Failed to delete password')
        }
      } catch (error) {
        console.error('Error deleting password:', error);
        setError('An error occurred while deleting the password')
      }
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={`password-${password.id}`} className="font-bold">{password.title}</Label>
        <div className="space-x-2">
          {showPassword ? (
            <Button onClick={() => setShowPassword(false)} size="sm" variant="ghost">
              <EyeOff className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleViewPassword} size="sm" variant="ghost">
              <Eye className="h-4 w-4" />
            </Button>
          )}
          <Button onClick={() => setShowShareForm(!showShareForm)} size="sm" variant="ghost">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button onClick={handleDeletePassword} size="sm" variant="ghost" className="text-red-500">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Input
          id={`password-${password.id}`}
          type={showPassword ? "text" : "password"}
          value={showPassword ? passwordValue : '••••••••'}
          readOnly
          className="flex-grow"
        />
        {showPassword && (
          <Button onClick={handleCopyPassword} size="sm" variant="outline">
            <Copy className="h-4 w-4" />
          </Button>
        )}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {showShareForm && (
        <SharePasswordForm 
          passwordId={password.id} 
          onShare={() => setShowShareForm(false)} 
        />
      )}
    </div>
  )
}