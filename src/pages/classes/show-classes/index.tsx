import { useState, useEffect } from 'react'
import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { DataTable } from './components/data-table'
import { columns } from './components/columns'
import { LoadingSpinner } from '../../../components/custom/loadingspinner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import RolesPermissions from '../../roles/roles-permissions'
import { useParams } from 'react-router-dom'
import axios from '../../../axios'
import { toast } from 'sonner'
import { Button } from '@/components/custom/button'
import { PlusIcon } from '@radix-ui/react-icons'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { DataTableRowActions } from './components/data-table-row-actions'
import { useDispatch, useSelector } from 'react-redux'
import { fetchStudents } from '../../../store/studentsSlice'
import { RootState, AppDispatch } from '../../../store/store'

export default function ShowClasseComponent() {
  const { id } = useParams() // Récupération de l'id de la classe à éditer
  const dispatch = useDispatch<AppDispatch>()

  const studentsState = useSelector((state: RootState) => state.students)
  const [classInfo, setClassInfo] = useState(null) // État pour les infos de la classe
  const [status, setStatus] = useState('loading') // État pour le statut de chargement
  const [availableStudents, setAvailableStudents] = useState([]) // Étudiants disponibles
  const [searchTerm, setSearchTerm] = useState('') // Recherche dynamique
  const [selectedStudents, setSelectedStudents] = useState([]) // Étudiants sélectionnés pour ajout
  const [idLevel, setIdLevel] = useState(null) // État pour les étudiants de la classe
  const [isDialogOpen, setIsDialogOpen] = useState(false) // État pour contrôler l'ouverture de la boîte de dialogue

  // Utilisation d'un useEffect pour récupérer les détails de la classe
  const fetchClasseDetails = async () => {
    try {
      const response = await axios.get(`/api/v1/admin/classes/${id}`)
      const data = response.data.data
      dispatch(fetchStudents(id)) // Fetch the students for this class from the API
      setIdLevel(data.levels[0]?.id) // Mettre à jour les étudiants
      setClassInfo({
        level: data.levels[0]?.name,
        teacher: `${data.teacher.name} ${data.teacher.surname}`,
        startDate: data.start_date,
        endDate: data.end_date,
        sessions: data.number_session,
        uuid: data.uuid,
        status: data.status,
      }) // Mettre à jour les informations importantes de la classe
      setStatus('success') // Changer le statut en succès
    } catch (error) {
      toast.error('Erreur lors de la récupération des détails de la classe')
      setStatus('error') // Changer le statut en erreur
    }
  }

  useEffect(() => {
    fetchClasseDetails() // Appeler la fonction pour récupérer les détails de la classe
  }, [id])

  // Utilisation d'un autre useEffect pour récupérer les étudiants disponibles lorsque idLevel est défini
  useEffect(() => {
    if (idLevel) {
      fetchAvailableStudents()
    }
  }, [idLevel])

  // Fonction pour récupérer les étudiants disponibles
  const fetchAvailableStudents = async () => {
    try {
      const response = await axios.get(
        `/api/v1/admin/classes/${idLevel}/students/available`
      )
      setAvailableStudents(response.data) // Assumer que la réponse contient les utilisateurs
    } catch (error) {
      toast.error('Erreur lors du chargement des étudiants disponibles')
    }
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const toggleStudentSelection = (studentId) => {
    setSelectedStudents(
      (prevSelected) =>
        prevSelected.includes(studentId)
          ? prevSelected.filter((id) => id !== studentId) // Désélectionner
          : [...prevSelected, studentId] // Sélectionner
    )
  }

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(';').shift()
  }

  const handleAddStudents = async () => {
    const csrfToken = getCookie('XSRF-TOKEN')

    try {
      await axios.post(
        '/api/v1/admin/classes/students/add',
        {
          classe_id: id,
          student_ids: selectedStudents,
        },
        {
          headers: { 'X-XSRF-TOKEN': decodeURIComponent(csrfToken) },
        }
      )
      toast.success('Étudiants ajoutés avec succès')

      // Filtre immédiatement les étudiants ajoutés des étudiants disponibles
      const updatedAvailableStudents = availableStudents.filter(
        (student) => !selectedStudents.includes(student.id)
      )

      setAvailableStudents(updatedAvailableStudents)
      dispatch(fetchStudents(id)) // Met à jour les étudiants dans la classe via Redux
      setSelectedStudents([])
      setIsDialogOpen(false)
    } catch (error) {
      toast.error("Erreur lors de l'ajout des étudiants à la classe")
    }
  }

  // Filtrer les étudiants en fonction du terme de recherche
  const filteredStudents = availableStudents.filter((student) =>
    `${student.name} ${student.surname}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )

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
        <Tabs
          orientation='vertical'
          defaultValue='Etudiants'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <div className='flex flex-col justify-between md:flex-row'>
              <TabsList>
                <TabsTrigger value='Etudiants'>Etudiants</TabsTrigger>
                <TabsTrigger value='Cours'>Cours</TabsTrigger>
                <TabsTrigger value='Demandes'>Demandes</TabsTrigger>
              </TabsList>

              {/* Section pour afficher les informations de la classe */}
              {classInfo && (
                <div className='mt-4 grid grid-cols-2 gap-4 text-xs text-gray-600 md:ml-4 md:mt-0'>
                  <p>
                    <strong>Niveau:</strong> {classInfo.level || 'N/A'}
                  </p>
                  <p>
                    <strong>Professeur:</strong> {classInfo.teacher || 'N/A'}
                  </p>
                  <p>
                    <strong>Uuid:</strong> {classInfo.uuid}
                  </p>
                  <p>
                    <strong>Statut:</strong> {classInfo.status}
                  </p>
                  <p>
                    <strong>Date de début:</strong> {classInfo.startDate}
                  </p>
                  <p>
                    <strong>Date de fin:</strong> {classInfo.endDate}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Contenu de l'onglet "Etudiants" */}
          <TabsContent value='Etudiants' className='space-y-4'>
            <div className='mb-2 flex items-center justify-between space-y-2'>
              <p className='text-muted-foreground'>
                Ici vous pouvez gérer les étudiants de la classe !
              </p>
              {/* Bouton pour ajouter des étudiants via le Dialog */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className='mr-2 bg-blue-500 text-white'>
                    <PlusIcon className='mr-2 h-4 w-4' /> Nouveau
                  </Button>
                </DialogTrigger>
                <DialogContent className='max-w-lg'>
                  <div className='mb-4'>
                    <Input
                      type='text'
                      placeholder='Rechercher par nom ou prénom'
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </div>
                  <div className='grid max-h-80 grid-cols-2 gap-4 overflow-y-auto md:grid-cols-3'>
                    {filteredStudents.map((student) => (
                      <div
                        key={student.id}
                        className='flex items-center justify-between'
                      >
                        <div>
                          <p>
                            {student.name} {student.surname}
                          </p>
                          <p className='text-xs text-gray-500'>
                            UUID: {student.uuid}
                          </p>
                          <p className='text-xs text-gray-500'>
                            CNI: {student.cni}
                          </p>
                        </div>
                        <Switch
                          checked={selectedStudents.includes(student.id)}
                          onCheckedChange={() =>
                            toggleStudentSelection(student.id)
                          }
                        />
                      </div>
                    ))}
                  </div>
                  <Button className='mt-4' onClick={handleAddStudents}>
                    Ajouter les étudiants sélectionnés
                  </Button>
                </DialogContent>
              </Dialog>
            </div>

            {status === 'loading' ? (
              <div className='flex h-screen items-center justify-center'>
                <LoadingSpinner className='h-10 w-10 text-blue-500' />
              </div>
            ) : (
              <div className='-mx-4 flex-1 overflow-auto px-2'>
                <DataTable
                  columns={columns}
                  data={studentsState.students} // Utilisation du Redux store pour les étudiants
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value='Cours'>
            <div className='text-center'>Contenu des cours à venir...</div>
          </TabsContent>

          <TabsContent value='Demandes'>
            <RolesPermissions />
          </TabsContent>
        </Tabs>
      </Layout.Body>
    </Layout>
  )
}
