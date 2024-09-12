'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SharePasswordFormProps {
  passwordId: string
  onShare: () => void
}

export default function SharePasswordForm({ passwordId, onShare }: SharePasswordFormProps) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/passwords/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passwordId, email }),
      })

      if (response.ok) {
        setSuccess('Password shared successfully')
        setEmail('')
        onShare()
      } else {
        const data = await response.json()
        setError(data.message || 'Failed to share password')
      }
    } catch (error) {
      setError('An error occurred while sharing the password')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Share with (email)</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <Button type="submit">Share Password</Button>
    </form>
  )
}