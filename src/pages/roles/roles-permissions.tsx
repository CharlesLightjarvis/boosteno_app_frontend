import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/custom/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  DotsHorizontalIcon,
  Pencil1Icon,
  TrashIcon,
  PlusIcon,
} from '@radix-ui/react-icons'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import axios from 'axios'

// Fonction pour récupérer le token CSRF à partir des cookies
const getCookie = (name) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift()
}

function RolesPermissions() {
  const [roles, setRoles] = useState([]) // Stocker les rôles
  const [permissions, setPermissions] = useState([]) // Stocker les permissions
  const [isCreatingRole, setIsCreatingRole] = useState(false) // Modal pour créer
  const [isEditingRole, setIsEditingRole] = useState(false) // Modal pour éditer
  const [isDeletingRole, setIsDeletingRole] = useState(false) // Modal pour suppression
  const [currentRole, setCurrentRole] = useState(null) // Rôle en cours d'édition/suppression
  const [newRoleName, setNewRoleName] = useState('') // Nom de rôle ou modifié
  const [selectedPermissions, setSelectedPermissions] = useState([]) // Permissions sélectionnées

  // Récupération des rôles et permissions
  useEffect(() => {
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

    fetchRoles()
    fetchPermissions()
  }, [])

  // Création d'un nouveau rôle avec assignation des permissions
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

  // Édition d'un rôle existant avec assignation des nouvelles permissions
  const handleEditRole = async () => {
    if (!newRoleName || selectedPermissions.length === 0) {
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

  // Suppression d'un rôle avec confirmation
  const handleDeleteRole = async () => {
    try {
      const xsrfToken = getCookie('XSRF-TOKEN')
      await axios.delete(`/api/v1/admin/roles/${currentRole.id}`, {
        headers: {
          'X-XSRF-TOKEN': xsrfToken ? decodeURIComponent(xsrfToken) : '',
        },
      })
      setRoles(roles.filter((role) => role.id !== currentRole.id))
      toast.success('Rôle supprimé avec succès')
      setIsDeletingRole(false) // Fermer le modal après suppression
    } catch (error) {
      toast.error('Erreur lors de la suppression du rôle')
    }
  }

  // Gestion des permissions via le Switch
  const handlePermissionChange = (id) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    )
  }

  // Réinitialisation du formulaire
  const resetForm = () => {
    setNewRoleName('')
    setSelectedPermissions([])
    setCurrentRole(null)
    setIsCreatingRole(false)
    setIsEditingRole(false)
  }

  // Initialisation de l'édition d'un rôle
  const startEditingRole = (role) => {
    setCurrentRole(role)
    setNewRoleName(role.name)
    setSelectedPermissions(role.permissions.map((permission) => permission.id))
    setIsEditingRole(true)
  }

  // Initialisation de la suppression d'un rôle
  const startDeletingRole = (role) => {
    setCurrentRole(role)
    setIsDeletingRole(true)
  }

  return (
    <div>
      <div className='mb-2 flex items-center justify-between space-y-2'>
        <div>
          {/* <h2 className='text-2xl font-bold tracking-tight'>Bienvenue!</h2> */}
          <p className='text-muted-foreground'>
            Ici vous pouvez gérer les rôles et les permissions!
          </p>
        </div>
      </div>
      <div className='flex justify-between'>
        <div className='mt-3 flex w-full justify-end'>
          <Button
            onClick={() => setIsCreatingRole(true)}
            className='flex items-center bg-blue-500 text-white'
          >
            <PlusIcon className='mr-2 h-4 w-4' />
            Nouveau
          </Button>
        </div>
      </div>

      {/* Rôles et Permissions avec Accordéon (Affichage 2 colonnes sur grand écran) */}
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        {roles.map((role, index) => (
          <Accordion key={index} type='single' collapsible>
            <AccordionItem value={`role-${role.id}`}>
              <AccordionTrigger>
                <div className='flex w-full items-center justify-between'>
                  <h3 className='ml-4'>{role.name}</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' className='mr-4 text-gray-500'>
                        <DotsHorizontalIcon className='h-5 w-5' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => startEditingRole(role)}>
                        <Pencil1Icon className='mr-2 h-4 w-4' />
                        Éditer
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => startDeletingRole(role)}>
                        <TrashIcon className='mr-2 h-4 w-4' />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className='ml-4 space-y-2'>
                  {role.permissions.map((permission, permIndex) => (
                    <Badge key={permIndex} variant='outline' className='mr-2'>
                      {permission.name}: {permission.description}
                    </Badge>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>

      {/* Modal pour créer un rôle */}
      <Dialog open={isCreatingRole} onOpenChange={setIsCreatingRole}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer un Nouveau Rôle</DialogTitle>
          </DialogHeader>
          <Input
            placeholder='Nom du Rôle'
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
          />
          <div className='mt-4 space-y-4'>
            {permissions.map((permission) => (
              <div
                key={permission.id}
                className='flex items-center justify-between'
              >
                <div>
                  <h3 className='font-medium'>{permission.name}</h3>
                  <p className='text-sm text-gray-500'>
                    {permission.description}
                  </p>
                </div>
                <Switch
                  checked={selectedPermissions.includes(permission.id)}
                  onCheckedChange={() => handlePermissionChange(permission.id)}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant='ghost' onClick={resetForm}>
              Annuler
            </Button>
            <Button onClick={handleCreateRole}>Créer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal pour éditer un rôle */}
      <Dialog open={isEditingRole} onOpenChange={setIsEditingRole}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le Rôle</DialogTitle>
          </DialogHeader>
          <Input
            placeholder='Nom du Rôle'
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
          />
          <div className='mt-4 space-y-4'>
            {permissions.map((permission) => (
              <div
                key={permission.id}
                className='flex items-center justify-between'
              >
                <div>
                  <h3 className='font-medium'>{permission.name}</h3>
                  <p className='text-sm text-gray-500'>
                    {permission.description}
                  </p>
                </div>
                <Switch
                  checked={selectedPermissions.includes(permission.id)}
                  onCheckedChange={() => handlePermissionChange(permission.id)}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant='ghost' onClick={resetForm}>
              Annuler
            </Button>
            <Button onClick={handleEditRole}>Sauvegarder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal pour confirmer la suppression */}
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
            <Button variant='ghost' onClick={() => setIsDeletingRole(false)}>
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

export default RolesPermissions
