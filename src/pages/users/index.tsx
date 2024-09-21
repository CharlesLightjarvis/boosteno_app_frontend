import { useEffect, useState } from 'react'
import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { DataTable } from './components/data-table'
import { columns } from './components/columns'
import { users as fetchUsers } from './data/users' // Correction: renommé pour éviter les collisions de noms

export default function Users() {
  const [userData, setUserData] = useState([]) // Stocker les utilisateurs
  const [loading, setLoading] = useState(true) // État de chargement
  const [error, setError] = useState(null) // Gérer les erreurs

  // Fonction pour charger les utilisateurs au montage du composant
  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await fetchUsers() // Appel à l'API
        setUserData(data) // Mettre à jour les données des utilisateurs
      } catch (error) {
        setError('Erreur lors de la récupération des utilisateurs.') // Gérer les erreurs
      } finally {
        setLoading(false) // Arrêter le chargement
      }
    }
    loadUsers()
  }, [])

  console.log(userData)

  // Affichage du message de chargement ou d'erreur
  if (loading) {
    return <div>Chargement...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <Layout>
      {/* ===== Top Heading ===== */}
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
            <h2 className='text-2xl font-bold tracking-tight'>Bienvenue!</h2>
            <p className='text-muted-foreground'>
              {/* Here&apos;s a list of your tasks for this month! */}
              Ici vous pouvez gérer la liste des utilisateurs!
            </p>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {/* Passer les données récupérées au DataTable */}
          <DataTable data={userData} columns={columns} />
        </div>
      </Layout.Body>
    </Layout>
  )
}
