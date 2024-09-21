import axios from 'axios'
import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { PlusCircledIcon, CalendarIcon } from '@radix-ui/react-icons'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Textarea } from '@/components/ui/textarea'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner' // Assurez-vous que le composant Toast est bien importé

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

const getCookie = (name: string) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift()
}

export function AddUserDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [date, setDate] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(false)

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

  const onSubmit = async (data: any) => {
    if (!date) {
      setError('joinedDate', {
        type: 'manual',
        message: 'Please select a date',
      })
      return
    }

    clearErrors('joinedDate')

    // Convertir la date au format YYYY-MM-DD avant de l'envoyer
    const formattedDate = format(date, 'yyyy-MM-dd') // Utiliser 'date-fns' pour formater sans UTC

    data.joinedDate = formattedDate // Assignation directe du format de date

    try {
      const csrfToken = getCookie('XSRF-TOKEN')

      // Utilisation de FormData pour gérer l'upload de fichier
      const formData = new FormData()
      formData.append('cni', data.cni)
      formData.append('name', data.name)
      formData.append('surname', data.surname)
      formData.append('email', data.email)
      formData.append('phone_number', data.phone_number)
      formData.append('address', data.address)
      formData.append('role', data.role)
      formData.append('joinedDate', data.joinedDate) // Utilise directement la date formatée ici

      // Ajouter la photo dans FormData (si elle existe)
      if (data.photo[0]) {
        formData.append('photo', data.photo[0]) // data.photo[0] est le fichier sélectionné
      }

      // Afficher les données de FormData dans la console
      console.log('FormData values:')
      formData.forEach((value, key) => {
        console.log(`${key}:`, value)
      })

      setIsLoading(true)
      // Envoyer les données avec axios (commenté pour le moment)
      await axios.post('/api/v1/admin/users', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important pour gérer les fichiers
          'X-XSRF-TOKEN': csrfToken ? decodeURIComponent(csrfToken) : '',
        },
      })
      setIsLoading(false)
      // Afficher un toast de succès
      toast('Utilisateur ajouté avec succès !', {
        description: formattedDate,
        action: {
          label: 'Supprimer',
          onClick: () => console.log('Undo'),
        },
      })
      setIsOpen(false)
    } catch (error) {
      console.error('Error adding user:', error)
      toast.error("Erreur lors de l'ajout de l'utilisateur.")
    }
  }

  useEffect(() => {
    if (!isOpen) {
      reset()
      setDate(null)
    }
  }, [isOpen, reset])

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className='mr-2'>
          <PlusCircledIcon className='mr-2 h-4 w-4' /> Nouvel Utilisateur
        </Button>
      </SheetTrigger>
      <SheetContent side='bottom' className='max-h-[600px] overflow-y-auto'>
        <SheetHeader>
          <SheetTitle>Ajouter un Nouvel Utilisateur</SheetTitle>
          <SheetDescription>
            Renseignez les champs nécessaires puis validez
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label>CNI</label>
              <Input {...register('cni')} placeholder='123456789' />
              {errors.cni && (
                <p className='text-sm text-red-500'>{errors.cni.message}</p>
              )}
            </div>
            <div>
              <label>Nom</label>
              <Input {...register('name')} placeholder='Nom' />
              {errors.name && (
                <p className='text-sm text-red-500'>{errors.name.message}</p>
              )}
            </div>
            <div>
              <label>Prénom</label>
              <Input {...register('surname')} placeholder='Prénom' />
              {errors.surname && (
                <p className='text-sm text-red-500'>{errors.surname.message}</p>
              )}
            </div>
            <div>
              <label>Email</label>
              <Input {...register('email')} placeholder='name@example.com' />
              {errors.email && (
                <p className='text-sm text-red-500'>{errors.email.message}</p>
              )}
            </div>
            <div>
              <label>Téléphone</label>
              <Input {...register('phone_number')} placeholder='1234567890' />
              {errors.phone_number && (
                <p className='text-sm text-red-500'>
                  {errors.phone_number.message}
                </p>
              )}
            </div>
            <div>
              <label>Adhésion</label>
              <br />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-auto justify-start text-left font-normal',
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
              <label>Adresse</label>
              <Textarea {...register('address')} placeholder='Adresse' />
              {errors.address && (
                <p className='text-sm text-red-500'>{errors.address.message}</p>
              )}
            </div>
            <div>
              <label>Attribution</label>
              <Select onValueChange={(value) => setValue('role', value)}>
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
            <div className='col-span-2'>
              <label>Photo (URL)</label>
              <Input {...register('photo')} type='file' />
              {errors.photo && (
                <p className='text-sm text-red-500'>{errors.photo.message}</p>
              )}
            </div>
          </div>
          <Button type='submit' className='w-full' loading={isLoading}>
            Ajouter Utilisateur
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
