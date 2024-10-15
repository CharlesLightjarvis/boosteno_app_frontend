// router.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom'
import GeneralError from './pages/errors/general-error'
import NotFoundError from './pages/errors/not-found-error'
import MaintenanceError from './pages/errors/maintenance-error'
import UnauthorisedError from './pages/errors/unauthorised-error'
import { checkAuth } from './auth-service' // Service d'authentification

// Fonction pour limiter l'accès et retourner différents composants selon le rôle
const roleGuardWithDifferentComponents =
  (
    roleComponentMap // Un objet contenant le mapping rôle => composant
  ) =>
  async () => {
    const authStatus = await checkAuth()

    if (authStatus.authenticated) {
      const userRole = authStatus.role

      // Si le rôle de l'utilisateur est autorisé, retourne le composant spécifique
      if (roleComponentMap[userRole]) {
        return { Component: roleComponentMap[userRole] }
      } else {
        return { Component: UnauthorisedError } // Si non autorisé
      }
    } else {
      return { Component: () => <Navigate to='/401' /> } // Redirection si non authentifié
    }
  }

// Fonction pour gérer le dashboard selon le rôle
const dashboardGuard = async () => {
  const authStatus = await checkAuth()

  if (authStatus.authenticated) {
    if (authStatus.role === 'admin') {
      return {
        Component: (await import('./pages/dashboard')).default,
      }
    } else if (authStatus.role === 'student') {
      return {
        Component: (await import('./pages/dashboard/student')).default,
      }
    } else {
      return { Component: UnauthorisedError }
    }
  } else {
    return { Component: () => <Navigate to='/401' /> }
  }
}

const router = createBrowserRouter([
  // Routes d'authentification
  {
    path: '/sign-in',
    lazy: async () => ({
      Component: (await import('./pages/auth/sign-in')).default,
    }),
  },
  {
    path: '/sign-up',
    lazy: async () => ({
      Component: (await import('./pages/auth/sign-up')).default,
    }),
  },
  {
    path: '/forgot-password',
    lazy: async () => ({
      Component: (await import('./pages/auth/forgot-password')).default,
    }),
  },
  {
    path: '/otp',
    lazy: async () => ({
      Component: (await import('./pages/auth/otp')).default,
    }),
  },
  // Routes protégées avec vérification de l'authentification et des rôles
  {
    path: '/',
    lazy: async () => {
      const authStatus = await checkAuth()
      return {
        Component: authStatus.authenticated
          ? (await import('./components/app-shell')).default
          : () => <Navigate to='/sign-in' />, // Redirige si non authentifié
      }
    },
    errorElement: <GeneralError />,
    children: [
      {
        index: true,
        lazy: dashboardGuard, // Affiche le bon dashboard selon le rôle
      },
      {
        path: 'chats',
        lazy: roleGuardWithDifferentComponents({
          admin: (await import('./pages/chats')).default, // Composant pour admin
          student: (await import('./pages/chats/student')).default, // Composant pour student
        }),
      },
      {
        path: 'apps',
        lazy: roleGuardWithDifferentComponents({
          admin: (await import('./pages/apps')).default, // Composant pour admin
          student: (await import('./pages/apps/student')).default, // Composant pour student
        }),
      },
      {
        path: 'users',
        lazy: roleGuardWithDifferentComponents({
          admin: (await import('./pages/users')).default, // Composant pour admin
        }),
      },
      {
        path: 'classes',
        lazy: roleGuardWithDifferentComponents({
          admin: (await import('./pages/classes')).default, // Composant pour admin
        }),
      },
      {
        path: 'users/addNewUser',
        lazy: roleGuardWithDifferentComponents({
          admin: (await import('./pages/users/add-users')).default, // Composant pour admin
        }),
      },
      {
        path: 'classes/addNewClasse',
        lazy: roleGuardWithDifferentComponents({
          admin: (await import('./pages/classes/add-classes')).default,
        }),
      },
      {
        path: 'users/edit/:id',
        lazy: roleGuardWithDifferentComponents(
          (await import('./pages/users/edit-users')).default
        ),
      },
      {
        path: 'classes/edit/:id',
        lazy: roleGuardWithDifferentComponents({
          admin: (await import('./pages/classes/edit-classes')).default,
        }),
      },
      {
        path: 'classes/show/:id',
        lazy: roleGuardWithDifferentComponents({
          admin: (await import('./pages/classes/show-classes')).default,
        }),
      },
      {
        path: 'settings',
        lazy: async () => ({
          Component: (await import('./pages/settings')).default,
        }),
        errorElement: <GeneralError />,
        children: [
          {
            index: true,
            lazy: async () => ({
              Component: (await import('./pages/settings/profile')).default,
            }),
          },
          {
            path: 'account',
            lazy: async () => ({
              Component: (await import('./pages/settings/account')).default,
            }),
          },
          {
            path: 'appearance',
            lazy: async () => ({
              Component: (await import('./pages/settings/appearance')).default,
            }),
          },
          {
            path: 'notifications',
            lazy: async () => ({
              Component: (await import('./pages/settings/notifications'))
                .default,
            }),
          },
          {
            path: 'display',
            lazy: async () => ({
              Component: (await import('./pages/settings/display')).default,
            }),
          },
          {
            path: 'error-example',
            lazy: async () => ({
              Component: (await import('./pages/settings/error-example'))
                .default,
            }),
            errorElement: <GeneralError className='h-[50svh]' minimal />,
          },
        ],
      },
      // Autres routes protégées...
    ],
  },
  // Error routes
  { path: '/500', Component: GeneralError },
  { path: '/404', Component: NotFoundError },
  { path: '/503', Component: MaintenanceError },
  { path: '/401', Component: UnauthorisedError },
  // Route fallback 404
  { path: '*', Component: NotFoundError },
])

export default router
