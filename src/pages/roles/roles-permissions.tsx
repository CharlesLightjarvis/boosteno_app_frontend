import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '../../components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import axios from 'axios'
import {
  Search,
  MoreHorizontal,
  Plus,
  Edit,
  Trash2,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'

// Fonction pour récupérer le token CSRF à partir des cookies
const getCookie = (name: string) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift()
}

interface Permission {
  id: number
  name: string
  description: string
}

interface Role {
  id: number
  name: string
  permissions: Permission[]
}

export default function RolesPermissions() {
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [isCreatingRole, setIsCreatingRole] = useState(false)
  const [isEditingRole, setIsEditingRole] = useState(false)
  const [isDeletingRole, setIsDeletingRole] = useState(false)
  const [currentRole, setCurrentRole] = useState<Role | null>(null)
  const [newRoleName, setNewRoleName] = useState('')
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortColumn, setSortColumn] = useState<'name' | 'permissions'>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    fetchRoles()
    fetchPermissions()
  }, [])

  async function fetchRoles() {
    try {
      const response = await axios.get('/api/v1/admin/roles')
      setRoles(response.data.data)
    } catch (error) {
      toast.error('Erreur lors de la récupération des rôles')
    }
  }

  async function fetchPermissions() {
    try {
      const response = await axios.get('/api/v1/admin/permissions')
      setPermissions(response.data.data)
    } catch (error) {
      toast.error('Erreur lors de la récupération des permissions')
    }
  }

  const handleCreateRole = async () => {
    if (!newRoleName || selectedPermissions.length === 0) {
      toast.error('Veuillez remplir le nom et sélectionner des permissions.')
      return
    }

    try {
      const xsrfToken = getCookie('XSRF-TOKEN')
      const response = await axios.post(
        '/api/v1/admin/roles',
        { name: newRoleName, permissions: selectedPermissions },
        {
          headers: {
            'X-XSRF-TOKEN': xsrfToken ? decodeURIComponent(xsrfToken) : '',
          },
        }
      )
      const createdRole = response.data.data
      setRoles([...roles, createdRole])
      toast.success('Rôle créé et permissions assignées avec succès')
      resetForm()
    } catch (error) {
      toast.error('Erreur lors de la création du rôle')
    }
  }

  const handleEditRole = async () => {
    if (!newRoleName || selectedPermissions.length === 0 || !currentRole) {
      toast.error('Veuillez remplir le nom et sélectionner des permissions.')
      return
    }

    try {
      const xsrfToken = getCookie('XSRF-TOKEN')
      const response = await axios.put(
        `/api/v1/admin/roles/${currentRole.id}`,
        { name: newRoleName, permissions: selectedPermissions },
        {
          headers: {
            'X-XSRF-TOKEN': xsrfToken ? decodeURIComponent(xsrfToken) : '',
          },
        }
      )
      const updatedRole = response.data.data
      const updatedRoles = roles.map((role) =>
        role.id === currentRole.id ? updatedRole : role
      )
      setRoles(updatedRoles)
      toast.success('Rôle et permissions modifiés avec succès')
      resetForm()
    } catch (error) {
      toast.error('Erreur lors de la modification du rôle')
    }
  }

  const handleDeleteRole = async () => {
    if (!currentRole) return

    try {
      const xsrfToken = getCookie('XSRF-TOKEN')
      await axios.delete(`/api/v1/admin/roles/${currentRole.id}`, {
        headers: {
          'X-XSRF-TOKEN': xsrfToken ? decodeURIComponent(xsrfToken) : '',
        },
      })
      setRoles(roles.filter((role) => role.id !== currentRole.id))
      toast.success('Rôle supprimé avec succès')
      setIsDeletingRole(false)
    } catch (error) {
      toast.error('Erreur lors de la suppression du rôle')
    }
  }

  const handlePermissionChange = (id: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    )
  }

  const resetForm = () => {
    setNewRoleName('')
    setSelectedPermissions([])
    setCurrentRole(null)
    setIsCreatingRole(false)
    setIsEditingRole(false)
  }

  const startEditingRole = (role: Role) => {
    setCurrentRole(role)
    setNewRoleName(role.name)
    setSelectedPermissions(role.permissions.map((permission) => permission.id))
    setIsEditingRole(true)
  }

  const startDeletingRole = (role: Role) => {
    setCurrentRole(role)
    setIsDeletingRole(true)
  }

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedRoles = [...filteredRoles].sort((a, b) => {
    if (sortColumn === 'name') {
      return sortDirection === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    } else {
      return sortDirection === 'asc'
        ? a.permissions.length - b.permissions.length
        : b.permissions.length - a.permissions.length
    }
  })

  const toggleSort = (column: 'name' | 'permissions') => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  return (
    <div className='container mx-auto px-4'>
      <div className='mb-8'>
        <p className='mt-2 text-gray-600'>
          Gérez efficacement les rôles et les permissions de votre application
        </p>
      </div>

      <div className='mb-6 flex items-center justify-between'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
          <Input
            type='text'
            placeholder='Rechercher un rôle...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='pl-10'
          />
        </div>
        <Button
          onClick={() => setIsCreatingRole(true)}
          className='bg-blue-600 text-white hover:bg-blue-700'
        >
          <Plus className='mr-2 h-4 w-4' />
          Nouveau Rôle
        </Button>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[300px]'>
                <button
                  className='flex items-center'
                  onClick={() => toggleSort('name')}
                >
                  Nom du Rôle
                  {sortColumn === 'name' &&
                    (sortDirection === 'asc' ? (
                      <ChevronUp className='ml-2 h-4 w-4' />
                    ) : (
                      <ChevronDown className='ml-2 h-4 w-4' />
                    ))}
                </button>
              </TableHead>
              <TableHead>
                <button
                  className='flex items-center'
                  onClick={() => toggleSort('permissions')}
                >
                  Permissions
                  {sortColumn === 'permissions' &&
                    (sortDirection === 'asc' ? (
                      <ChevronUp className='ml-2 h-4 w-4' />
                    ) : (
                      <ChevronDown className='ml-2 h-4 w-4' />
                    ))}
                </button>
              </TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRoles.map((role) => (
              <TableRow key={role.id}>
                <TableCell className='font-medium'>{role.name}</TableCell>
                <TableCell>
                  <div className='flex flex-wrap gap-1'>
                    {role.permissions.slice(0, 3).map((permission) => (
                      <Badge key={permission.id} variant='secondary'>
                        {permission.name}
                      </Badge>
                    ))}
                    {role.permissions.length > 3 && (
                      <Badge variant='secondary'>
                        +{role.permissions.length - 3}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className='text-right'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' className='h-8 w-8 p-0'>
                        <span className='sr-only'>Ouvrir le menu</span>
                        <MoreHorizontal className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem onClick={() => startEditingRole(role)}>
                        <Edit className='mr-2 h-4 w-4' />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => startDeletingRole(role)}>
                        <Trash2 className='mr-2 h-4 w-4' />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isCreatingRole} onOpenChange={setIsCreatingRole}>
        <DialogContent className='sm:max-w-[555px]'>
          <DialogHeader>
            <DialogTitle>Créer un Nouveau Rôle</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <label htmlFor='name' className='text-right'>
                Nom
              </label>
              <Input
                id='name'
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-start gap-4'>
              <label className='text-right'>Permissions</label>
              <ScrollArea className='max-h-[200px] w-[240px] overflow-y-auto rounded-md border p-4 sm:w-[380px]'>
                <div className='space-y-4'>
                  {permissions.map((permission) => (
                    <div
                      key={permission.id}
                      className='flex items-start space-x-2'
                    >
                      <Checkbox
                        id={`permission-${permission.id}`}
                        checked={selectedPermissions.includes(permission.id)}
                        onCheckedChange={() =>
                          handlePermissionChange(permission.id)
                        }
                      />
                      <div className='grid gap-1.5 leading-none'>
                        <label
                          htmlFor={`permission-${permission.id}`}
                          className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                        >
                          {permission.name}
                        </label>
                        <p className='text-sm text-muted-foreground'>
                          {permission.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={resetForm}>
              Annuler
            </Button>
            <Button onClick={handleCreateRole}>Créer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditingRole} onOpenChange={setIsEditingRole}>
        <DialogContent className='sm:max-w-[555px]'>
          <DialogHeader>
            <DialogTitle>Modifier le Rôle</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <label htmlFor='name' className='text-right'>
                Nom
              </label>
              <Input
                id='name'
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-start gap-4'>
              <label className='text-right'>Permissions</label>
              <ScrollArea className='max-h-[200px] w-[240px] overflow-y-auto rounded-md border p-4 sm:w-[380px]'>
                <div className='space-y-4'>
                  {permissions.map((permission) => (
                    <div
                      key={permission.id}
                      className='flex items-start space-x-2'
                    >
                      <Checkbox
                        id={`permission-${permission.id}`}
                        checked={selectedPermissions.includes(permission.id)}
                        onCheckedChange={() =>
                          handlePermissionChange(permission.id)
                        }
                      />
                      <div className='grid gap-1.5 leading-none'>
                        <label
                          htmlFor={`permission-${permission.id}`}
                          className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                        >
                          {permission.name}
                        </label>
                        <p className='text-sm text-muted-foreground'>
                          {permission.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={resetForm}>
              Annuler
            </Button>
            <Button onClick={handleEditRole}>Sauvegarder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeletingRole} onOpenChange={setIsDeletingRole}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le Rôle</DialogTitle>
          </DialogHeader>
          <p>
            Êtes-vous sûr de vouloir supprimer ce rôle ? Cette action est
            irréversible.
          </p>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsDeletingRole(false)}>
              Annuler
            </Button>
            <Button variant='destructive' onClick={handleDeleteRole}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
