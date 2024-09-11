'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import AddPasswordForm from '@/app/components/AddPasswordForm'
import ViewPassword from '@/app/components/ViewPassword'
import EditPasswordForm from '@/app/components/EditPasswordForm'

interface Password {
  id: string
  title: string
  username: string
  password: string
  url?: string
}

export default function Dashboard() {
  const [passwords, setPasswords] = useState<Password[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    fetchPasswords()
  }, [])

  const fetchPasswords = async () => {
    try {
      const response = await fetch('/api/passwords')
      if (response.ok) {
        const data = await response.json()
        setPasswords(data)
      }
    } catch (error) {
      console.error('Failed to fetch passwords:', error)
    }
  }

  const handleDelete = (id: string) => {
    setPasswords(passwords.filter(p => p.id !== id))
  }

  const handleUpdate = (updatedPassword: Password) => {
    setPasswords(passwords.map(p => p.id === updatedPassword.id ? updatedPassword : p))
    setEditingId(null)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Password Manager Dashboard</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Passwords</h2>
        {passwords.length > 0 ? (
          <div className="space-y-4">
            {passwords.map((password) => (
              <div key={password.id} className="border p-4 rounded-lg">
                {editingId === password.id ? (
                  <EditPasswordForm
                    password={password}
                    onUpdate={handleUpdate}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <>
                    <ViewPassword password={password} onDelete={handleDelete} />
                    <Button onClick={() => setEditingId(password.id)} className="mt-2">
                      Edit
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>You haven&apos;t added any passwords yet.</p>
        )}
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Add New Password</h2>
        <AddPasswordForm onAdd={fetchPasswords} />
      </div>
    </div>
  )
}