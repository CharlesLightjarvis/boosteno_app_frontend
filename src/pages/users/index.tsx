import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../store/store'
import { fetchUsers } from '../../store/userSlice'
import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { DataTable } from './components/data-table'
import { columns } from './components/columns'
import { LoadingSpinner } from '../../components/custom/loadingspinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import RolesPermissions from '../roles/roles-permissions'

export default function Users() {
  const dispatch = useDispatch<AppDispatch>()
  const { data: users, status } = useSelector((state: RootState) => state.users)

  useEffect(() => {
    dispatch(fetchUsers())
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
          defaultValue='utilisateurs'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='utilisateurs'>Utilisateurs</TabsTrigger>
              <TabsTrigger value='roles'>Roles & Permissions</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='utilisateurs' className='space-y-4'>
            <div className='mb-2 flex items-center justify-between space-y-2'>
              <div>
                {/* <h2 className='text-2xl font-bold tracking-tight'>
                  Bienvenue!
                </h2> */}
                <p className='text-muted-foreground'>
                  Ici vous pouvez gérer la liste des utilisateurs!
                </p>
              </div>
            </div>

            {status === 'loading' ? (
              <div className='flex h-screen items-center justify-center'>
                <LoadingSpinner className='h-10 w-10 text-blue-500' />
              </div>
            ) : (
              <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
                {users.length === 0 ? (
                  <div>Aucun utilisateur trouvé.</div>
                ) : (
                  <DataTable data={users} columns={columns} />
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
