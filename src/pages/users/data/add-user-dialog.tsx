// import axios from 'axios'
import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import { CalendarIcon, PlusIcon } from '@radix-ui/react-icons'
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
import { useDispatch } from 'react-redux'
import { createUser } from '../../../store/userSlice'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { Label } from '@/components/ui/label'

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

// const getCookie = (name: string) => {
//   const value = `; ${document.cookie}`
//   const parts = value.split(`; ${name}=`)
//   if (parts.length === 2) return parts.pop()?.split(';').shift()
// }

export function AddUserDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [date, setDate] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()

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

    const formattedDate = format(date, 'yyyy-MM-dd')
    data.joinedDate = formattedDate

    try {
      setIsLoading(true)
      await dispatch(createUser(data))
      setIsLoading(false)

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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='secondary' className='mr-2'>
          <PlusIcon className='mr-2 h-4 w-4' /> Nouveau
        </Button>
      </DialogTrigger>
      <DialogContent className='max-h-[80vh] overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400 scrollbar-thumb-rounded sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Ajout Utilisateur</DialogTitle>
          <DialogDescription>
            Renseignez les champs nécessaires pour ajouter un utilisateur
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className=''>
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
              <Label>Adhésion</Label>
              <br />
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
              <Label>Photo (URL)</Label>
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
      </DialogContent>
    </Dialog>
  )
}
