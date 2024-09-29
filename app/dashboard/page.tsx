'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AddPasswordForm from '@/components/AddPasswordForm'
import ViewPassword from '@/components/ViewPassword'
import EditPasswordForm from '@/components/EditPasswordForm'
import { Search, Plus, LogOut, Key, Share2, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import PasswordTable from '@/components/PasswordTable'
import { Cover } from '@/components/ui/cover'

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
  const [editingPassword, setEditingPassword] = useState<Password | null>(null)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'your' | 'shared'>('your')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [viewingPassword, setViewingPassword] = useState<Password | null>(null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  useEffect(() => {
    fetchPasswords()
  }, [])

  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase()
    const filtered = passwords.filter(password => 
      (activeTab === 'your' ? !password.isShared : password.isShared) &&
      (password.title.toLowerCase().includes(lowercasedSearchTerm) ||
      password.username.toLowerCase().includes(lowercasedSearchTerm) ||
      (password.url && password.url.toLowerCase().includes(lowercasedSearchTerm)))
    )
    setFilteredPasswords(filtered)
  }, [searchTerm, passwords, activeTab])

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
        setFilteredPasswords(data.filter(p => !p.isShared))
      } else if (data.passwords && Array.isArray(data.passwords)) {
        setPasswords(data.passwords)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setFilteredPasswords(data.passwords.filter((p:any) => !p.isShared))
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
    setEditingPassword(null)
  }

  const handleLogout = () => {
    // Implement logout functionality here
    console.log('Logout clicked')
  }

  const handleAddPassword = () => {
    fetchPasswords()
    setIsAddDialogOpen(false)
  }

  const handleViewPassword = (password: Password) => {
    setViewingPassword(password)
  }

  const handleEditPassword = (password: Password) => {
    setEditingPassword(password)
  }

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading passwords...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Bar */}
      <header className="bg-white shadow z-10">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white rounded-xl select-none cursor-default"><Cover>EncypherX</Cover></h1>
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild className='border-slate-300 border'>
                <Avatar className="cursor-pointer">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='bg-white'>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`bg-white shadow transition-all duration-300 ease-in-out relative ${isSidebarCollapsed ? 'w-16' : 'w-64'}`}>
          <nav className="py-4 px-3">
            <Button
              variant={activeTab === 'your' ? 'default' : 'ghost'}
              className={`w-full justify-start mb-2 rounded-full ${isSidebarCollapsed ? 'px-0' : ''} ${activeTab === 'your' ? 'bg-black text-white hover:text-black' : ''}`}
              onClick={() => setActiveTab('your')}
            >
              <Key className={`h-4 w-4 ${isSidebarCollapsed ? 'mx-auto' : 'mr-2'} `} />
              {!isSidebarCollapsed && <span>Your Passwords</span>}
            </Button>
            <Button
              variant={activeTab === 'shared' ? 'default' : 'ghost'}
              className={`w-full justify-start rounded-full ${isSidebarCollapsed ? 'px-0' : ''} ${activeTab === 'shared' ? 'bg-black text-white hover:text-black' : ''}`}
              onClick={() => setActiveTab('shared')}
            >
              <Share2 className={`h-4 w-4 ${isSidebarCollapsed ? 'mx-auto' : 'mr-2'}`} />
              {!isSidebarCollapsed && <span>Shared Passwords</span>}
            </Button>
          </nav>
          <Button
            variant="ghost"
            size="icon"
            className={`absolute ${ isSidebarCollapsed ? 'left-3':'right-3' } bottom-4 bg-white shadow-md rounded-full`}
            onClick={toggleSidebar}
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {error && <p className="text-red-500 mb-4">{error}</p>}
          
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Search passwords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-xl border border-slate-300 placeholder:text-slate-400 bg-white"
              />
            </div>
          </div>

          <Card className='rounded-xl bg-white'>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{activeTab === 'your' ? 'Your Passwords' : 'Shared Passwords'}</CardTitle>
                {activeTab === 'your' && (
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center rounded-xl border-slate-300">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Password
                      </Button>
                    </DialogTrigger>
                    <DialogContent className='bg-white'>
                      <DialogHeader>
                        <DialogTitle>Add New Password</DialogTitle>
                        <DialogDescription>
                          Enter the details for your new password entry.
                        </DialogDescription>
                      </DialogHeader>
                      <AddPasswordForm onPasswordAdded={handleAddPassword} />
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {filteredPasswords.length > 0 ? (
                <PasswordTable
                  passwords={filteredPasswords}
                  onView={handleViewPassword}
                  onEdit={handleEditPassword}
                  onDelete={handleDelete}
                  isSharedView={activeTab === 'shared'}
                />
              ) : (
                <p>{searchTerm ? 'No passwords match your search.' : `You don't have any ${activeTab === 'your' ? '' : 'shared '}passwords yet.`}</p>
              )}
            </CardContent>
          </Card>
          <Dialog open={!!viewingPassword} onOpenChange={() => setViewingPassword(null)}>
            <DialogContent className='bg-white'>
              <DialogHeader>
                <DialogTitle>View Password</DialogTitle>
              </DialogHeader>
              {viewingPassword && (
                <ViewPassword
                  password={viewingPassword}
                  onDelete={handleDelete}
                  onUpdate={fetchPasswords}
                />
              )}
            </DialogContent>
          </Dialog>
          <Dialog open={!!editingPassword} onOpenChange={() => setEditingPassword(null)}>
            <DialogContent className='bg-white'>
              <DialogHeader>
                <DialogTitle>Edit Password</DialogTitle>
              </DialogHeader>
              {editingPassword && (
                <EditPasswordForm
                  password={editingPassword}
                  onUpdate={handleUpdate}
                  onCancel={() => setEditingPassword(null)}
                />
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  )
}