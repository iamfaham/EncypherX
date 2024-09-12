'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PasswordStrengthMeter from './PasswordStrengthMeter'

interface Password {
  id: string
  title: string
  username: string
  password: string
  url?: string
}

interface EditPasswordFormProps {
  password: Password
  onUpdate: (updatedPassword: Password) => void
  onCancel: () => void
}

export default function EditPasswordForm({ password, onUpdate, onCancel }: EditPasswordFormProps) {
  const [title, setTitle] = useState(password.title)
  const [username, setUsername] = useState(password.username)
  const [newPassword, setNewPassword] = useState('')
  const [url, setUrl] = useState(password.url || '')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPassword = async () => {
      try {
        const response = await fetch(`/api/passwords/${password.id}`)
        if (response.ok) {
          const data = await response.json()
          setNewPassword(data.password)
        } else {
          setError('Failed to fetch current password')
        }
      } catch (error) {
        console.error('Error fetching password:', error)
        setError('An error occurred while fetching the password')
      }
    }

    fetchPassword()
  }, [password.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title || !username || !newPassword) {
      setError('All fields are required')
      return
    }

    try {
      const response = await fetch(`/api/passwords/${password.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, username, password: newPassword, url }),
      })

      if (response.ok) {
        const updatedPassword = await response.json()
        onUpdate(updatedPassword)
      } else {
        const data = await response.json()
        setError(data.message || 'Failed to update password')
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
        <Input
          id="password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <PasswordStrengthMeter password={newPassword} />
      </div>
      <div>
        <Label htmlFor="url">URL (optional)</Label>
        <Input
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Update Password</Button>
      </div>
    </form>
  )
}