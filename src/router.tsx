// router.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom'
import GeneralError from './pages/errors/general-error'
import NotFoundError from './pages/errors/not-found-error'
import MaintenanceError from './pages/errors/maintenance-error'
import UnauthorisedError from './pages/errors/unauthorised-error'
import { checkAuth } from './auth-service'

// Fonction pour limiter l'accès basé sur le rôle
const roleGuard = (Component, allowedRoles) => async () => {
  const authStatus = await checkAuth()

  // Vérifier si l'utilisateur est authentifié et si son rôle est autorisé
  if (authStatus.authenticated && allowedRoles.includes(authStatus.role)) {
    return { Component }
  } else if (authStatus.authenticated) {
    return { Component: UnauthorisedError } // Rediriger vers une page non autorisée
  } else {
    return { Component: () => <Navigate to='/401' /> } // Rediriger vers la page non autorisée
  }
}

// Fonction pour afficher différents dashboards selon le rôle
const dashboardGuard = async () => {
  const authStatus = await checkAuth()

  // Vérifier le rôle et retourner le bon composant de dashboard
  if (authStatus.authenticated) {
    if (authStatus.role === 'admin') {
      return {
        Component: (await import('./pages/dashboard/index')).default,
      }
    } else if (authStatus.role === 'student') {
      return {
        Component: (await import('./pages/dashboard/student/dashboard-student'))
          .default,
      }
    } else {
      return { Component: UnauthorisedError } // Si le rôle n'est ni admin ni student
    }
  } else {
    return { Component: () => <Navigate to='/401' /> } // Rediriger vers la page non autorisée
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
        lazy: dashboardGuard, // Utiliser la fonction pour afficher le bon dashboard
      },
      {
        path: 'tasks',
        lazy: roleGuard(
          (await import('./pages/tasks')).default,
          ['admin'] // Seuls les admins et managers peuvent accéder à cette route
        ),
      },
      {
        path: 'chats',
        lazy: roleGuard(
          (await import('./pages/chats')).default,
          ['student'] // Accès pour plusieurs rôles
        ),
      },
      {
        path: 'apps',
        lazy: roleGuard(
          (await import('./pages/apps')).default,
          ['student', 'admin'] // Accès pour admins et développeurs
        ),
      },
      {
        path: 'users',
        lazy: roleGuard(
          (await import('./components/coming-soon')).default,
          ['admin'] // Accès réservé aux admins uniquement
        ),
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
    ],
  },

  // Error routes
  { path: '/500', Component: GeneralError },
  { path: '/404', Component: NotFoundError },
  { path: '/503', Component: MaintenanceError },
  { path: '/401', Component: UnauthorisedError },

  // Fallback 404 route
  { path: '*', Component: NotFoundError },
])

export default router
