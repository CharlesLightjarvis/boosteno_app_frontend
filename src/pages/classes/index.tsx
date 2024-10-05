import { useEffect } from 'react'
import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { DataTable } from './components/data-table'
import { columns } from './components/columns'
import { LoadingSpinner } from '../../components/custom/loadingspinner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import RolesPermissions from '../roles/roles-permissions'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../store/store' // Adapter les bons chemins
import { fetchClasses } from '../../store/classesSlice' // Action Redux pour récupérer les classes

export default function Classes() {
  const dispatch = useDispatch<AppDispatch>()
  const { data: classes, status } = useSelector(
    (state: RootState) => state.classes
  )

  // Utilisation de useEffect pour charger les données dès que le composant est monté
  useEffect(() => {
    dispatch(fetchClasses()) // Dispatch de l'action pour récupérer les classes
  }, [dispatch])

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
          defaultValue='classes'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='classes'>Classes</TabsTrigger>
              <TabsTrigger value='roles'>Demandes</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='classes' className='space-y-4'>
            <div className='mb-2 flex items-center justify-between space-y-2'>
              <div>
                <p className='text-muted-foreground'>
                  Ici vous pouvez gérer les classes!
                </p>
              </div>
            </div>

            {status === 'loading' ? (
              <div className='flex h-screen items-center justify-center'>
                <LoadingSpinner className='h-10 w-10 text-blue-500' />
              </div>
            ) : (
              <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
                {classes.length === 0 ? (
                  <div>Aucune Classe trouvée.</div>
                ) : (
                  <DataTable data={classes} columns={columns} />
                )}
              </div>
            )}
          </TabsContent>
          <TabsContent value='roles' className='space-y-4'>
            <RolesPermissions />
          </TabsContent>
        </Tabs>
      </Layout.Body>
    </Layout>
  )
}
