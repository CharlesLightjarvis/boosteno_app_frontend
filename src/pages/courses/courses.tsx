import { useState, useEffect, ChangeEvent } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner' // Importation du composant Toast de Sonner
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Search,
  MoreVertical,
  Plus,
  Edit,
  Trash2,
  FileText,
} from 'lucide-react'
import { Tabs, TabsContent } from '@/components/ui/tabs'

interface Media {
  pdf?: string | null
}

interface Course {
  id: number
  name: string
  description: string
  media: Media
}

const getCookie = (name: string) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift()
  return null
}

export default function CourseManagement() {
  const { id } = useParams<{ id: string }>()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddingCourse, setIsAddingCourse] = useState(false)
  const [isEditingCourse, setIsEditingCourse] = useState(false)
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null)
  const [newCourse, setNewCourse] = useState({
    name: '',
    description: '',
    media: {
      pdf: null as File | null,
    },
  })

  useEffect(() => {
    fetchCourses()
  }, [id])

  const fetchCourses = async () => {
    try {
      const response = await axios.get(
        `http://boostlearn.test/api/v1/admin/classes/${id}/courses`,
        {
          headers: {
            'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') || '',
          },
        }
      )
      setCourses(response.data.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching courses:', error)
      toast.error('Erreur', {
        description: 'Impossible de récupérer les cours. Veuillez réessayer.',
      })
      setLoading(false)
    }
  }

  const handleAddCourse = async () => {
    const formData = new FormData()
    formData.append('name', newCourse.name)
    formData.append('description', newCourse.description)
    formData.append('class_ids[]', id!)

    if (newCourse.media.pdf) {
      formData.append('pdf', newCourse.media.pdf)
    }

    try {
      const response = await axios.post(
        'http://boostlearn.test/api/v1/admin/courses',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-XSRF-TOKEN': decodeURIComponent(getCookie('XSRF-TOKEN') || ''),
          },
        }
      )
      setCourses([...courses, response.data.data])
      setIsAddingCourse(false)
      resetForm()
      toast.success('Succès', {
        description: 'Cours ajouté avec succès',
      })
    } catch (error) {
      console.error('Error adding course:', error)
      toast.error('Erreur', {
        description: "Impossible d'ajouter le cours. Veuillez réessayer.",
      })
    }
  }

  const handleEditCourse = async () => {
    if (!currentCourse) return

    const formData = new FormData()
    formData.append('name', currentCourse.name)
    formData.append('description', currentCourse.description)
    formData.append('_method', 'PUT')

    // Ajout du fichier PDF uniquement s'il a été modifié
    if (newCourse.media.pdf) {
      formData.append('pdf', newCourse.media.pdf)
    }

    try {
      const response = await axios.post(
        `http://boostlearn.test/api/v1/admin/courses/${currentCourse.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-XSRF-TOKEN': decodeURIComponent(getCookie('XSRF-TOKEN') || ''),
          },
        }
      )
      setCourses(
        courses.map((course) =>
          course.id === currentCourse.id ? response.data.data : course
        )
      )
      setIsEditingCourse(false)
      resetForm()
      toast.success('Succès', {
        description: 'Cours mis à jour avec succès',
      })
    } catch (error) {
      console.error('Error updating course:', error)
      toast.error('Erreur', {
        description:
          'Impossible de mettre à jour le cours. Veuillez réessayer.',
      })
    }
  }

  const handleDeleteCourse = async (courseId: number) => {
    try {
      await axios.delete(
        `http://boostlearn.test/api/v1/admin/courses/${courseId}`,
        {
          headers: {
            'X-XSRF-TOKEN': decodeURIComponent(getCookie('XSRF-TOKEN') || ''),
          },
        }
      )
      setCourses(courses.filter((course) => course.id !== courseId))
      toast.success('Succès', {
        description: 'Cours supprimé avec succès',
      })
    } catch (error) {
      console.error('Error deleting course:', error)
      toast.error('Erreur', {
        description: 'Impossible de supprimer le cours. Veuillez réessayer.',
      })
    }
  }

  const resetForm = () => {
    setNewCourse({
      name: '',
      description: '',
      media: {
        pdf: null,
      },
    })
    setCurrentCourse(null)
  }

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
    type: 'pdf'
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      setNewCourse((prev) => ({
        ...prev,
        media: {
          ...prev.media,
          [type]: file,
        },
      }))
    }
  }

  // Fonction pour extraire le nom de fichier original
  const extractOriginalFileName = (path: string) => {
    const parts = path.split('/').pop()?.split('_') || []
    return parts.slice(0, -1).join('_') + '.' + path.split('.').pop()
  }

  // Fonction pour afficher la prévisualisation du PDF dans le navigateur
  const handleViewPDF = (pdfUrl: string) => {
    try {
      window.open(pdfUrl, '_blank') // Ouvre le PDF dans un nouvel onglet pour la prévisualisation
    } catch (error) {
      console.error('Erreur lors de la prévisualisation du PDF:', error)
      toast.error('Erreur', {
        description: 'Impossible de prévisualiser le PDF.',
      })
    }
  }

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className=' mx-auto'>
      <div className='mb-8 flex items-center justify-between'>
        <p className='mt-2 text-gray-600'>
          Ici vous pouvez gérer les Cours de la Classe
        </p>
        <div className='flex items-center space-x-4'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
            <Input
              type='text'
              placeholder='Rechercher des cours...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10'
            />
          </div>
          <Button onClick={() => setIsAddingCourse(true)}>
            <Plus className='mr-2 h-4 w-4' /> Ajouter un Cours
          </Button>
        </div>
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-2'>
        {filteredCourses.map((course) => (
          <div key={course.id} className='rounded-lg bg-white p-6 shadow-md'>
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-xl font-semibold'>{course.name}</h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' className='h-8 w-8 p-0'>
                    <span className='sr-only'>Ouvrir le menu</span>
                    <MoreVertical className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem
                    onClick={() => {
                      setCurrentCourse(course)
                      setIsEditingCourse(true)
                    }}
                  >
                    <Edit className='mr-2 h-4 w-4' />
                    Modifier
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDeleteCourse(course.id)}
                  >
                    <Trash2 className='mr-2 h-4 w-4' />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className='mb-4 text-gray-600'>{course.description}</p>
            <div className='flex space-x-2'>
              {course.media.pdf && (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handleViewPDF(course.media.pdf!)}
                >
                  <FileText className='mr-2 h-4 w-4' />
                  {extractOriginalFileName(course.media.pdf)}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isAddingCourse} onOpenChange={setIsAddingCourse}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Ajouter un Nouveau Cours</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='name' className='text-right'>
                Nom
              </Label>
              <Input
                id='name'
                value={newCourse.name}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, name: e.target.value })
                }
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='description' className='text-right'>
                Description
              </Label>
              <Textarea
                id='description'
                value={newCourse.description}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, description: e.target.value })
                }
                className='col-span-3'
              />
            </div>
            <Tabs defaultValue='pdf' className='w-full'>
              <TabsContent value='pdf'>
                <Input
                  type='file'
                  accept='.pdf'
                  onChange={(e) => handleFileChange(e, 'pdf')}
                />
              </TabsContent>
            </Tabs>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsAddingCourse(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddCourse}>Ajouter le Cours</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditingCourse} onOpenChange={setIsEditingCourse}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Modifier le Cours</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='edit-name' className='text-right'>
                Nom
              </Label>
              <Input
                id='edit-name'
                value={currentCourse?.name || ''}
                onChange={(e) =>
                  setCurrentCourse((curr) =>
                    curr ? { ...curr, name: e.target.value } : null
                  )
                }
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='edit-description' className='text-right'>
                Description
              </Label>
              <Textarea
                id='edit-description'
                value={currentCourse?.description || ''}
                onChange={(e) =>
                  setCurrentCourse((curr) =>
                    curr ? { ...curr, description: e.target.value } : null
                  )
                }
                className='col-span-3'
              />
            </div>
            <Tabs defaultValue='pdf' className='w-full'>
              <TabsContent value='pdf'>
                <Input
                  type='file'
                  accept='.pdf'
                  onChange={(e) => handleFileChange(e, 'pdf')}
                />
              </TabsContent>
            </Tabs>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsEditingCourse(false)}>
              Annuler
            </Button>
            <Button onClick={handleEditCourse}>
              Enregistrer les Modifications
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
