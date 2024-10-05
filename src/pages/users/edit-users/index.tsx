import { useEffect, useState } from 'react'
import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import { Separator } from '@/components/ui/separator'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import { CalendarIcon } from '@radix-ui/react-icons'
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
import axios from '../../../axios'
import { useNavigate, useParams } from 'react-router-dom'

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
const BASE_URL = 'http://boostlearn.test/storage/' // Remplacez par l'URL de votre serveur

export default function EditUserComponent() {
  const [date, setDate] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoURL, setPhotoURL] = useState<string | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const navigate = useNavigate()
  const { id } = useParams()

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

  // Récupérer les informations de l'utilisateur lors du montage
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const xsrfToken = getCookie('XSRF-TOKEN')

        const response = await axios.get(`/api/v1/admin/users/${id}`, {
          headers: {
            'X-XSRF-TOKEN': xsrfToken ? decodeURIComponent(xsrfToken) : '',
          },
        })

        const userData = response.data.data

        reset({
          cni: userData.cni,
          name: userData.name,
          surname: userData.surname,
          email: userData.email,
          phone_number: userData.phone_number,
          address: userData.address,
          role: userData.role,
          joinedDate: new Date(userData.joinedDate),
        })

        setPhotoURL(userData.photo) // Prévisualiser la photo si elle existe
        setRole(userData.role) // Mettre à jour le rôle pour Select
        setDate(new Date(userData.joinedDate)) // Mettre à jour la date
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur:", error)
      }
    }

    fetchUser()
  }, [id, reset])

  // Fonction soumise du formulaire avec Axios et redirection
  const onSubmit = async (data: any) => {
    setIsLoading(true)

    // Vérification des données du formulaire
    console.log('Données soumises par le formulaire:', data)

    if (!date) {
      setError('joinedDate', {
        type: 'manual',
        message: 'Please select a date',
      })
      setIsLoading(false)
      return
    }

    const formattedDate = format(date, 'yyyy-MM-dd')
    data.joinedDate = formattedDate

    try {
      // Créer un objet FormData pour envoyer les données et les fichiers
      const formData = new FormData()
      formData.append('cni', data.cni || '')
      formData.append('name', data.name || '')
      formData.append('surname', data.surname || '')
      formData.append('email', data.email || '')
      formData.append('phone_number', data.phone_number || '')
      formData.append('address', data.address || '')
      formData.append('role', data.role || '')
      formData.append('joinedDate', data.joinedDate || '')

      // Si une photo est sélectionnée, on l'ajoute
      if (photoFile) {
        formData.append('photo', photoFile)
      }

      // Vérifiez les données envoyées dans formData
      for (let [key, value] of formData.entries()) {
        console.log(`FormData key: ${key}, value: ${value}`)
      }

      // Récupérer le token XSRF
      const xsrfToken = getCookie('XSRF-TOKEN')

      if (!xsrfToken) {
        throw new Error('XSRF token is missing')
      }

      // Envoi de la requête
      const response = await axios.patch(
        `/api/v1/admin/users/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-XSRF-TOKEN': decodeURIComponent(xsrfToken),
          },
        }
      )

      if (response.status === 200) {
        // Réinitialisation du formulaire et redirection
        reset()
        navigate('/users')
        toast.success('Utilisateur modifié avec succès')
      } else {
        throw new Error('Failed to update user')
      }
    } catch (error: any) {
      console.error('Error during submission:', error)
      toast.error('Une erreur est survenue lors de la modification')
      setError('submit', {
        type: 'manual',
        message: error.message || 'Failed to submit form',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
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
            Modifier Utilisateur
          </h1>
          <p className='text-muted-foreground'>
            Modifiez les informations nécessaires de l'utilisateur
          </p>
        </div>
        <Separator className='my-4 lg:my-6' />

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
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
              <Select
                value={role || ''}
                onValueChange={(value) => {
                  setRole(value)
                  setValue('role', value) // Mettre à jour le formulaire
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Selectionnez une attribution' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value='admin'>Administrateur</SelectItem>
                    <SelectItem value='student'>Etudiant</SelectItem>
                    <SelectItem value='teacher'>Professeur</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className='text-sm text-red-500'>{errors.role.message}</p>
              )}
            </div>

            <div className='md:col-span-2'>
              <Label>Photo (Fichier)</Label>
              {photoURL && (
                <img
                  src={`${BASE_URL}${photoURL}`}
                  alt='Photo utilisateur'
                  className='mb-4 h-20 w-20 rounded-full object-cover'
                />
              )}
              <Input
                type='file'
                accept='image/*'
                onChange={handlePhotoChange}
              />
              {errors.photo && (
                <p className='text-sm text-red-500'>{errors.photo.message}</p>
              )}
            </div>
          </div>

          <Button type='submit' className='w-full' loading={isLoading}>
            Modifier Utilisateur
          </Button>
        </form>
      </Layout.Body>
    </Layout>
  )
}
