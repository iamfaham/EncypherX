'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from 'lucide-react'

interface Password {
  id: string
  title: string
  username: string
  password: string
  url?: string
  tags: { id: string; name: string }[]
  isShared: boolean
  sharedBy?: {
    id: string
    email: string
  }
}

interface EditPasswordFormProps {
  password: Password
  onUpdate: (updatedPassword: Password) => void
  onCancel: () => void
}

export default function EditPasswordForm({ password, onUpdate, onCancel }: EditPasswordFormProps) {
  const [title, setTitle] = useState(password.title)
  const [username, setUsername] = useState(password.username)
  const [passwordValue, setPasswordValue] = useState(password.password)
  const [url, setUrl] = useState(password.url || '')
  const [showPassword, setShowPassword] = useState(true)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
  
    try {
      const response = await fetch(`/api/passwords/${password.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, username, password: passwordValue, url }),
      })
  
      if (response.ok) {
        const updatedPassword = await response.json()
        onUpdate(updatedPassword)
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to update password')
      }
    } catch (error) {
      console.error('Error updating password:', error)
      setError('An error occurred while updating the password')
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            // value={passwordValue}
            value={''}
            onChange={(e) => setPasswordValue(e.target.value)}
            required
            className="flex-grow"
          />
          <Button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            size="sm"
            variant="outline"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      <div>
        <Label htmlFor="url">URL (optional)</Label>
        <Input
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex justify-end space-x-2">
        <Button type="button" onClick={onCancel} variant="outline">
          Cancel
        </Button>
        <Button type="submit">
          Save Changes
        </Button>
      </div>
    </form>
  )
}