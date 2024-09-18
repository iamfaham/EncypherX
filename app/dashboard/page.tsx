'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import AddPasswordForm from '@/components/AddPasswordForm'
import ViewPassword from '@/components/ViewPassword'
import EditPasswordForm from '@/components/EditPasswordForm'
import { Search } from 'lucide-react'
import PasswordList from '@/components/PasswordList'

interface Password {
  id: string
  title: string
  username: string
  password: string
  url?: string
  tags: Tag[]
  isShared: boolean
  sharedBy?: {
    id: string
    email: string
  }
}

export interface Tag {
  id: string;
  name: string;
}

export default function Dashboard() {
  const [passwords, setPasswords] = useState<Password[]>([])
  const [filteredPasswords, setFilteredPasswords] = useState<Password[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPasswords()
  }, [])

  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase()
    const filtered = passwords.filter(password => 
      password.title.toLowerCase().includes(lowercasedSearchTerm) ||
      password.username.toLowerCase().includes(lowercasedSearchTerm) ||
      (password.url && password.url.toLowerCase().includes(lowercasedSearchTerm))
    )
    setFilteredPasswords(filtered)
  }, [searchTerm, passwords])

  const fetchPasswords = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/passwords')
      if (!response.ok) {
        throw new Error('Failed to fetch passwords')
      }
      const data = await response.json()
      if (Array.isArray(data)) {
        setPasswords(data)
        setFilteredPasswords(data)
      } else if (data.passwords && Array.isArray(data.passwords)) {
        setPasswords(data.passwords)
        setFilteredPasswords(data.passwords)
      } else {
        throw new Error('Invalid data format received')
      }
    } catch (error) {
      console.error('Error fetching passwords:', error)
      setError('An error occurred while fetching passwords')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/passwords/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setPasswords(prevPasswords => prevPasswords.filter(p => p.id !== id))
      } else {
        setError('Failed to delete password')
      }
    } catch (error) {
      console.error('Error deleting password:', error)
      setError('An error occurred while deleting the password')
    }
  }

  const handleUpdate = (updatedPassword: Password) => {
    setPasswords(prevPasswords => prevPasswords.map(p => p.id === updatedPassword.id ? updatedPassword : p))
    setEditingId(null)
  }

  if (loading) {
    return <div>Loading passwords...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Password Manager Dashboard</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search passwords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>
      <div className="mb-8">
        {/* {/* <h2 className="text-xl font-semibold mb-4">Shared Passwords</h2> */}
        <PasswordList />
        <h2 className="text-xl font-semibold mb-4">Your Passwords</h2>
        {filteredPasswords.length > 0 ? (
          <div className="space-y-4">
            {filteredPasswords.map((password) => (
              <div key={password.id} className="border p-4 rounded-lg">
                {editingId === password.id ? (
                  <EditPasswordForm
                    password={password}
                    onUpdate={handleUpdate}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <>
                    <ViewPassword password={password} onDelete={handleDelete} onUpdate={fetchPasswords}/>
                    <Button onClick={() => setEditingId(password.id)} className="mt-2">
                      Edit
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>{searchTerm ? 'No passwords match your search.' : 'You haven\'t added any passwords yet.'}</p>
        )}
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Add New Password</h2>
        <AddPasswordForm onPasswordAdded={fetchPasswords} />
      </div>
    </div>
  )
}