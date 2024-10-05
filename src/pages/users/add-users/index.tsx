import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import { Separator } from '@/components/ui/separator'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import { CalendarIcon } from '@radix-ui/react-icons'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Textarea } from '@/components/ui/textarea'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import axios from '../../../../src/axios'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

// Schéma de validation Zod pour l'utilisateur
const userSchema = z.object({
  cni: z.string().min(5, 'CNI is required and should be valid'),
  name: z.string().min(1, 'Name is required'),
  surname: z.string().min(1, 'Surname is required'),
  email: z.string().email('Invalid email'),
  phone_number: z.string().min(8, 'Phone number is required and must be valid'),
  address: z.string().min(5, 'Address is required'),
  photo: z.any().optional(),
  role: z.string().min(1, 'Role is required'),
  joinedDate: z.date().nullable(),
})

// Fonction de récupération des cookies, y compris le X-XSRF-TOKEN
const getCookie = (name: string) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift()
}

export default function AddUserComponent() {
  const [date, setDate] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null) // Ajout d'un état pour le fichier photo
  const navigate = useNavigate()

  const [roles, setRoles] = useState([])

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get('/api/v1/admin/roles') // Remplacez l'URL par celle appropriée
        setRoles(response.data.data) // Stockez les rôles dans l'état
      } catch (error) {
        console.error('Erreur lors de la récupération des rôles:', error)
        toast.error('Erreur lors de la récupération des rôles')
      }
    }

    fetchRoles()
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    setError,
    clearErrors,
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      cni: '',
      name: '',
      surname: '',
      email: '',
      phone_number: '',
      address: '',
      photo: undefined,
      role: '',
      joinedDate: undefined,
    },
  })

  // Fonction soumise du formulaire avec Axios et redirection
  const onSubmit = async (data: any) => {
    setIsLoading(true)

    if (!date) {
      setError('joinedDate', {
        type: 'manual',
        message: 'Please select a date',
      })
      return
    }

    const formattedDate = format(date, 'yyyy-MM-dd')
    data.joinedDate = formattedDate

    try {
      // Créer un objet FormData
      const formData = new FormData()
      formData.append('cni', data.cni)
      formData.append('name', data.name)
      formData.append('surname', data.surname)
      formData.append('email', data.email)
      formData.append('phone_number', data.phone_number)
      formData.append('address', data.address)
      formData.append('role', data.role)
      formData.append('joinedDate', data.joinedDate || '')

      if (photoFile) {
        formData.append('photo', photoFile) // Ajout du fichier photo si sélectionné
      }

      const xsrfToken = getCookie('XSRF-TOKEN')
      const response = await axios.post('/api/v1/admin/users', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important pour gérer les fichiers
          'X-XSRF-TOKEN': xsrfToken ? decodeURIComponent(xsrfToken) : '',
        },
      })

      console.log(response.data)

      console.log('Utilisateur ajouté, redirection en cours...')
      reset() // Réinitialiser le formulaire
      navigate('/users') // Redirection vers la page des utilisateurs
      toast.success('Utilisateur ajouté avec succès')
    } catch (error: any) {
      // Affiche des détails d'erreur dans la console pour débogage
      if (error.response) {
        // Erreur de réponse du serveur
        console.error('Erreur de réponse:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        })
      } else if (error.request) {
        // Aucune réponse reçue du serveur (par exemple, problème réseau)
        console.error('Aucune réponse du serveur:', error.request)
      } else {
        // Autre erreur (avant la requête)
        console.error('Erreur de requête:', error.message)
      }

      toast.error("Une erreur est survenue lors de l'ajout")
      setError('submit', {
        type: 'manual',
        message: 'Failed to submit form',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Gestion du fichier photo
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file) // Mise à jour de l'état avec le fichier sélectionné
    }
  }

  return (
    <Layout>
      <Layout.Header sticky>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      <Layout.Body>
        <div className='space-y-0.5'>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
            Ajout Utilisateur
          </h1>
          <p className='text-muted-foreground'>
            Renseignez les champs nécessaires pour ajouter un utilisateur
          </p>
        </div>
        <Separator className='my-4 lg:my-6' />

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          {/* Grid pour deux colonnes */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            {/* Colonne 1 */}
            <div>
              <Label>CNI</Label>
              <Input {...register('cni')} placeholder='123456789' />
              {errors.cni && (
                <p className='text-sm text-red-500'>{errors.cni.message}</p>
              )}
            </div>

            <div>
              <Label>Nom</Label>
              <Input {...register('name')} placeholder='Nom' />
              {errors.name && (
                <p className='text-sm text-red-500'>{errors.name.message}</p>
              )}
            </div>

            {/* Colonne 2 */}
            <div>
              <Label>Prénom</Label>
              <Input {...register('surname')} placeholder='Prénom' />
              {errors.surname && (
                <p className='text-sm text-red-500'>{errors.surname.message}</p>
              )}
            </div>

            <div>
              <Label>Email</Label>
              <Input {...register('email')} placeholder='name@example.com' />
              {errors.email && (
                <p className='text-sm text-red-500'>{errors.email.message}</p>
              )}
            </div>

            {/* Autres champs */}
            <div>
              <Label>Téléphone</Label>
              <Input {...register('phone_number')} placeholder='1234567890' />
              {errors.phone_number && (
                <p className='text-sm text-red-500'>
                  {errors.phone_number.message}
                </p>
              )}
            </div>

            <div>
              <Label>Date d'adhésion</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className='mr-1 h-3 w-3' />
                    {date ? (
                      format(date, 'PPP')
                    ) : (
                      <span>Choisissez une Date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={date}
                    onSelect={(selectedDate) => {
                      setDate(selectedDate)
                      clearErrors('joinedDate')
                      setValue('joinedDate', selectedDate)
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.joinedDate && (
                <p className='text-sm text-red-500'>
                  {errors.joinedDate.message}
                </p>
              )}
            </div>

            <div>
              <Label>Adresse</Label>
              <Textarea {...register('address')} placeholder='Adresse' />
              {errors.address && (
                <p className='text-sm text-red-500'>{errors.address.message}</p>
              )}
            </div>

            <div>
              <Label>Attribution</Label>
              <Select onValueChange={(value) => setValue('role', value)}>
                <SelectTrigger>
                  <SelectValue placeholder='Selectionnez une attribution' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {roles.length > 0 ? (
                      roles.map((role) => (
                        <SelectItem key={role.id} value={role.name}>
                          {role.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled>Aucun rôle disponible</SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className='text-sm text-red-500'>{errors.role.message}</p>
              )}
            </div>

            <div className='md:col-span-2'>
              <Label>Photo (Fichier)</Label>
              <Input
                type='file'
                accept='image/*'
                onChange={handlePhotoChange} // Gestion du fichier photo
              />
              {errors.photo && (
                <p className='text-sm text-red-500'>{errors.photo.message}</p>
              )}
            </div>
          </div>

          {/* Bouton soumettre */}
          <Button type='submit' className='w-full' loading={isLoading}>
            Ajouter Utilisateur
          </Button>
        </form>
      </Layout.Body>
    </Layout>
  )
}
