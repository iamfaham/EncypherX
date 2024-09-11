'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PasswordGenerator from './PasswordGenerator'
import PasswordStrengthMeter from './PasswordStrengthMeter'

interface AddPasswordFormProps {
  onAdd: () => Promise<void>;
}

export default function AddPasswordForm({ onAdd }: AddPasswordFormProps) {
  const [title, setTitle] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [url, setUrl] = useState('')
  const [message, setMessage] = useState('')
  const [showGenerator, setShowGenerator] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/passwords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, username, password, url }),
      })
      if (response.ok) {
        setMessage('Password added successfully!')
        setTitle('')
        setUsername('')
        setPassword('')
        setUrl('')
        setShowGenerator(false)
        await onAdd()  // Call the onAdd function after successful addition
      } else {
        const data = await response.json()
        setMessage(data.message || 'An error occurred')
      }
    } catch (error) {
      setMessage('An error occurred')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mt-8">
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
        <div className="flex space-x-2">
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="button" onClick={() => setShowGenerator(!showGenerator)}>
            {showGenerator ? 'Hide' : 'Generate'}
          </Button>
        </div>
        <PasswordStrengthMeter password={password} />
      </div>
      {showGenerator && (
        <PasswordGenerator onGenerate={(generatedPassword:any) => setPassword(generatedPassword)} />
      )}
      <div>
        <Label htmlFor="url">URL (optional)</Label>
        <Input
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      <Button type="submit" className="w-full">Add Password</Button>
      {message && <p className="text-center mt-4">{message}</p>}
    </form>
  )
}