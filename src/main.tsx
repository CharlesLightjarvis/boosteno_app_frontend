import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
// import { Toaster } from '@/components/ui/toaster'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'
import router from '@/router'
import '@/index.css'
// import { AuthProvider } from './auth-context'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
      {/* <AuthProvider> */}
      <RouterProvider router={router} /> {/* Utilisez RouterProvider ici */}
      <Toaster />
      {/* </AuthProvider> */}
    </ThemeProvider>
  </React.StrictMode>
)
