import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, Edit, Trash2 } from "lucide-react"
// import { Password } from "./dashboard" // Assuming you export the Password interface from dashboard.tsx

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


interface PasswordTableProps {
  passwords: Password[]
  onView: (password: Password) => void
  onEdit: (password: Password) => void
  onDelete: (id: string) => void
  isSharedView: boolean
}

export default function PasswordTable({ passwords, onView, onEdit, onDelete, isSharedView }: PasswordTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>URL</TableHead>
          <TableHead>Tags</TableHead>
          {isSharedView && <TableHead>Shared By</TableHead>}
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {passwords.map((password) => (
          <TableRow key={password.id}>
            <TableCell className="font-medium">{password.title}</TableCell>
            <TableCell>{password.username}</TableCell>
            <TableCell>{password.url || 'N/A'}</TableCell>
            <TableCell>{password.tags.map(tag => tag.name).join(', ')}</TableCell>
            {isSharedView && <TableCell>{password.sharedBy?.email || 'N/A'}</TableCell>}
            <TableCell className="text-right">
              <Button variant="ghost" size="icon" onClick={() => onView(password)}>
                <Eye className="h-4 w-4" />
              </Button>
              {!isSharedView && (
                <Button variant="ghost" size="icon" onClick={() => onEdit(password)} >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={() => onDelete(password.id)} disabled={isSharedView ? true : false}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}