'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Copy, Trash2, Share2, UserMinus, Tag as TagIcon } from 'lucide-react'
import SharePasswordForm from '@/components/SharePasswordForm'

interface SharedWith {
  id: string
  email: string
  userId: string
}

interface Tag {
  id: string
  name: string
}

interface Password {
  id: string
  title: string
  username: string
  password: string
  url?: string
  sharedWith?: SharedWith[]
  tags?: Tag[]
  isShared: boolean
  sharedBy?: {
    id: string
    email: string
  }
}

interface ViewPasswordProps {
  password: Password
  onDelete: (id: string) => void
  onUpdate: (updatedPassword: Password) => void
}

export default function ViewPassword({ password, onDelete, onUpdate }: ViewPasswordProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [passwordValue, setPasswordValue] = useState('')
  const [error, setError] = useState('')
  const [showShareForm, setShowShareForm] = useState(false)
  const [sharedWith, setSharedWith] = useState<SharedWith[]>(password.sharedWith || [])
  const [tags, setTags] = useState<Tag[]>(password.tags || [])
  const [newTag, setNewTag] = useState('')
  
  useEffect(() => {
    setSharedWith(password.sharedWith || [])
    setTags(password.tags || [])
  }, [password.sharedWith, password.tags])
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
      console.error('Error viewing password:', error)
      setError('An error occurred while retrieving the password')
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        // You could set a state here to show a "Copied!" message
      })
      .catch((error) => {
        console.error('Error copying text:', error)
        setError('Failed to copy text')
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
        console.error('Error deleting password:', error)
        setError('An error occurred while deleting the password')
      }
    }
  }

  const handleAddTag = async () => {
    if (!newTag.trim()) return

    try {
      const response = await fetch(`/api/passwords/${password.id}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTag.trim() }),
      })

      if (response.ok) {
        const data = await response.json()
        const updatedTags = [...tags, data.tag]
        setTags(updatedTags)
        setNewTag('')
        onUpdate({ ...password, tags: updatedTags })  // Call onUpdate with the updated password
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to add tag')
      }
    } catch (error) {
      console.error('Error adding tag:', error)
      setError('An error occurred while adding the tag')
    }
  }

  const handleRemoveTag = async (tagId: string) => {
    try {
      const response = await fetch(`/api/passwords/${password.id}/tags/${tagId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        const updatedTags = tags.filter(tag => tag.id !== tagId)
        setTags(updatedTags)
        onUpdate({ ...password, tags: updatedTags })  // Call onUpdate with the updated password
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to remove tag')
      }
    } catch (error) {
      console.error('Error removing tag:', error)
      setError('An error occurred while removing the tag')
    }
  }

  const handleRevokeShare = async (sharedWithUserId: string) => {
    try {
      const response = await fetch('/api/passwords/revoke-share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passwordId: password.id, sharedWithUserId }),
      })

      if (response.ok) {
        const updatedSharedWith = sharedWith.filter(user => user.userId !== sharedWithUserId)
        setSharedWith(updatedSharedWith)
        onUpdate({ ...password, sharedWith: updatedSharedWith })  // Call onUpdate with the updated password
      } else {
        const data = await response.json()
        setError(data.message || 'Failed to revoke sharing')
      }
    } catch (error) {
      console.error('Error revoking share:', error)
      setError('An error occurred while revoking sharing')
    }
  }

  const handleShare = async (email: string) => {
    try {
      const response = await fetch('/api/passwords/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passwordId: password.id, email }),
      })

      if (response.ok) {
        const data = await response.json()
        const updatedSharedWith = [...sharedWith, { id: data.sharedPassword.userId, email, userId: data.userId }]
        setSharedWith(updatedSharedWith)
        setShowShareForm(false)
        onUpdate({ ...password, sharedWith: updatedSharedWith })  // Call onUpdate with the updated password
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to share password')
      }
    } catch (error) {
      console.error('Error sharing password:', error)
      setError('An error occurred while sharing the password')
    }
  }

  return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">{password.title}</h3>
          <div className="space-x-2">
            {!password.isShared && (
              <Button onClick={() => setShowShareForm(!showShareForm)} size="sm" variant="ghost">
                <Share2 className="h-4 w-4" />
              </Button>
            )}
            {!password.isShared && (
              <Button onClick={() => handleDeletePassword()} size="sm" variant="ghost" className="text-red-500">
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`username-${password.id}`}>Username</Label>
          <div className="flex items-center space-x-2">
            <Input
              id={`username-${password.id}`}
              value={password.username}
              readOnly
              className="flex-grow"
            />
            <Button onClick={() => handleCopy(password.username)} size="sm" variant="outline">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
  
        <div className="space-y-2">
          <Label htmlFor={`password-${password.id}`}>Password</Label>
          <div className="flex items-center space-x-2">
            <Input
              id={`password-${password.id}`}
              type={showPassword ? "text" : "password"}
              value={showPassword ? passwordValue : '••••••••'}
              readOnly
              className="flex-grow"
            />
            <Button onClick={showPassword ? () => setShowPassword(false) : handleViewPassword} size="sm" variant="outline">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            {showPassword && (
              <Button onClick={() => handleCopy(passwordValue)} size="sm" variant="outline">
                <Copy className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
  
        {password.url && (
          <div className="space-y-2">
            <Label htmlFor={`url-${password.id}`}>URL</Label>
            <div className="flex items-center space-x-2">
              <Input
                id={`url-${password.id}`}
                value={password.url}
                readOnly
                className="flex-grow"
              />
              <Button onClick={() => window.open(password.url, '_blank')} size="sm" variant="outline">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
  
        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        {!password.isShared && (
          <div className="space-y-4">
            <Button onClick={() => setShowShareForm(!showShareForm)} className="w-full">
              {showShareForm ? 'Cancel Sharing' : 'Share Password'}
            </Button>
            
            {showShareForm && (
              <SharePasswordForm 
                passwordId={password.id} 
                onShare={handleShare}
              />
            )}
            
            {sharedWith.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Shared with:</h4>
                <ul className="space-y-2">
                  {sharedWith.map((user) => (
                    <li key={user.id} className="flex items-center justify-between py-1">
                      <span>{user.email}</span>
                      <Button onClick={() => handleRevokeShare(user.userId)} size="sm" variant="ghost" className="text-red-500">
                        <UserMinus className="h-4 w-4" />
                        <span className="sr-only">Revoke</span>
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
  
        <div className="space-y-2">
          <Label htmlFor={`tags-${password.id}`}>Tags</Label>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <div key={tag.id} className="flex items-center bg-primary text-primary-foreground px-2 py-1 rounded">
                <span>{tag.name}</span>
                {!password.isShared && (
                  <Button onClick={() => handleRemoveTag(tag.id)} size="sm" variant="ghost" className="ml-1 p-0">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          {!password.isShared && (
            <div className="flex items-center space-x-2">
              <Input
                id={`tags-${password.id}`}
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a new tag"
                className="flex-grow"
              />
              <Button onClick={handleAddTag} size="sm" variant="outline">
                <TagIcon className="h-4 w-4 mr-2" />
                Add Tag
              </Button>
            </div>
          )}
        </div>
      </div>
  )
}