import { Layout } from '@/components/custom/layout'
import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { CalendarIcon, CaretSortIcon } from '@radix-ui/react-icons'
import axios from '../../../axios'
import { useNavigate } from 'react-router-dom'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { Search } from '@/components/search'
import { Separator } from '@/components/ui/separator'

// Fonction pour récupérer le cookie XSRF-TOKEN
const getCookie = (name: string) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift()
}

// Schéma de validation Zod pour la classe
const classeSchema = z.object({
  start_date: z
    .string()
    .refine((date) => date !== '', 'La date de début est requise'),
  end_date: z
    .string()
    .refine((date) => date !== '', 'La date de fin est requise'),
  number_session: z
    .number()
    .min(1, 'Le nombre de sessions doit être au moins 1'),
  presential: z.boolean(), // Modification pour accepter un booléen
  status: z.enum(['ongoing', 'completed', 'suspended']),
  user_id: z.number().min(1, "L'ID de l'enseignant est requis"),
  levels: z.array(z.number()).min(1, 'Au moins un niveau est requis'),
})

export default function AddNewClasseComponent() {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [teachers, setTeachers] = useState([]) // Pour stocker les enseignants
  const [levels, setLevels] = useState([]) // Pour stocker les niveaux
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get('/api/v1/admin/teachers')
        setTeachers(response.data.data)
      } catch (error) {
        console.error('Erreur lors de la récupération des enseignants:', error)
        toast.error('Erreur lors de la récupération des enseignants')
      }
    }

    const fetchLevels = async () => {
      try {
        const response = await axios.get('/api/v1/admin/levels')
        setLevels(response.data.data)
      } catch (error) {
        console.error('Erreur lors de la récupération des niveaux:', error)
        toast.error('Erreur lors de la récupération des niveaux')
      }
    }

    fetchTeachers()
    fetchLevels()
  }, [])

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(classeSchema),
    defaultValues: {
      start_date: '',
      end_date: '',
      number_session: 1,
      presential: true, // Par défaut en booléen
      status: 'ongoing',
      user_id: null,
      levels: [],
    },
  })

  // Fonction soumise du formulaire avec Axios et redirection
  const onSubmit = async (data: any) => {
    setIsLoading(true)

    if (!startDate || !endDate) {
      setError('start_date', { message: 'La date de début est requise' })
      setError('end_date', { message: 'La date de fin est requise' })
      setIsLoading(false)
      return
    }

    data.start_date = format(startDate, 'yyyy-MM-dd')
    data.end_date = format(endDate, 'yyyy-MM-dd')

    try {
      const xsrfToken = getCookie('XSRF-TOKEN')

      const response = await axios.post(
        '/api/v1/admin/classes',
        {
          ...data,
          presential: data.presential === 'true', // Conversion en booléen avant soumission
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': xsrfToken ? decodeURIComponent(xsrfToken) : '',
          },
        }
      )

      console.log('Classe ajoutée avec succès', response.data)
      reset()
      navigate('/classes')
      toast.success('Classe ajoutée avec succès')
    } catch (error) {
      console.error("Erreur lors de l'ajout de la classe:", error)
      toast.error("Une erreur est survenue lors de l'ajout")
    } finally {
      setIsLoading(false)
    }
  }

  // Utilisation de `setValue` pour mettre à jour les champs de date dans le formulaire
  useEffect(() => {
    if (startDate) {
      setValue('start_date', format(startDate, 'yyyy-MM-dd'))
    }
  }, [startDate, setValue])

  useEffect(() => {
    if (endDate) {
      setValue('end_date', format(endDate, 'yyyy-MM-dd'))
    }
  }, [endDate, setValue])

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
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Ajout Classe!</h2>
            <p className='text-muted-foreground'>
              Renseignez les champs nécessaires pour ajouter une classe!
            </p>
          </div>
        </div>
        <Separator className='my-4 lg:my-6' />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='grid grid-cols-2 gap-4'
        >
          {/* Date de début */}
          <div>
            <Label>Date de début</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className={cn(
                    'w-full justify-start text-left',
                    !startDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {startDate ? format(startDate, 'PPP') : 'Choisissez une date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0'>
                <Calendar
                  mode='single'
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.start_date && (
              <p className='text-sm text-red-500'>
                {errors.start_date.message}
              </p>
            )}
          </div>

          {/* Date de fin */}
          <div>
            <Label>Date de fin</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className={cn(
                    'w-full justify-start text-left',
                    !endDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {endDate ? format(endDate, 'PPP') : 'Choisissez une date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0'>
                <Calendar
                  mode='single'
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.end_date && (
              <p className='text-sm text-red-500'>{errors.end_date.message}</p>
            )}
          </div>

          {/* Nombre de sessions */}
          <div>
            <Label>Nombre de sessions</Label>
            <Input
              type='number'
              {...register('number_session', { valueAsNumber: true })}
              placeholder='10'
            />
            {errors.number_session && (
              <p className='text-sm text-red-500'>
                {errors.number_session.message}
              </p>
            )}
          </div>

          {/* Présentiel */}
          <div>
            <Label>Présentiel</Label>
            <Select
              onValueChange={(value) =>
                setValue('presential', value === 'true')
              }
              defaultValue='true'
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Présentiel' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='true'>Oui</SelectItem>
                <SelectItem value='false'>Non</SelectItem>
              </SelectContent>
            </Select>
            {errors.presential && (
              <p className='text-sm text-red-500'>
                {errors.presential.message}
              </p>
            )}
          </div>

          {/* Statut */}
          <div>
            <Label>Statut</Label>
            <Select
              onValueChange={(value) => setValue('status', value)}
              defaultValue='ongoing'
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Sélectionnez le statut' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='ongoing'>En cours</SelectItem>
                <SelectItem value='completed'>Terminé</SelectItem>
                <SelectItem value='suspended'>Suspendu</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className='text-sm text-red-500'>{errors.status.message}</p>
            )}
          </div>

          {/* Sélection du professeur */}
          <div>
            <Label>Professeur</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className={cn('w-full justify-between')}
                >
                  {selectedTeacher ? selectedTeacher : 'Sélectionnez'}
                  <CaretSortIcon className='ml-2 h-4 w-4 opacity-50' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-full p-0'>
                <Command>
                  <CommandInput placeholder='Rechercher un professeur...' />
                  <CommandList>
                    <CommandEmpty>Aucun professeur trouvé.</CommandEmpty>
                    <CommandGroup>
                      {teachers.map((teacher: any) => (
                        <CommandItem
                          key={teacher.id}
                          onSelect={() => {
                            setSelectedTeacher(
                              `${teacher.name} ${teacher.surname}`
                            )
                            setValue('user_id', teacher.id)
                          }}
                        >
                          {teacher.name} {teacher.surname}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.user_id && (
              <p className='text-sm text-red-500'>{errors.user_id.message}</p>
            )}
          </div>

          {/* Sélection des niveaux */}
          <div>
            <Label>Niveaux</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className={cn('w-full justify-between')}
                >
                  {selectedLevel ? selectedLevel : 'Sélectionnez un niveau'}
                  <CaretSortIcon className='ml-2 h-4 w-4 opacity-50' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-full p-0'>
                <Command>
                  <CommandInput placeholder='Rechercher un niveau...' />
                  <CommandList>
                    <CommandEmpty>Aucun niveau trouvé.</CommandEmpty>
                    <CommandGroup>
                      {levels.map((level: any) => (
                        <CommandItem
                          key={level.id}
                          onSelect={() => {
                            setSelectedLevel(level.name)
                            setValue('levels', [level.id])
                          }}
                        >
                          {level.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.levels && (
              <p className='text-sm text-red-500'>{errors.levels.message}</p>
            )}
          </div>

          {/* Bouton de soumission */}
          <Button
            type='submit'
            className='col-span-2 w-full'
            disabled={isLoading}
          >
            {isLoading ? 'Ajout en cours...' : 'Ajouter Classe'}
          </Button>
        </form>
      </Layout.Body>
    </Layout>
  )
}
