import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
// import { Toaster } from '@/components/ui/toaster'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'
import router from '@/router'
import '@/index.css'
// import { AuthProvider } from './auth-context'
import { Provider } from 'react-redux'
import { store } from './store/store'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
        {/* <AuthProvider> */}
        <RouterProvider router={router} /> {/* Utilisez RouterProvider ici */}
        <Toaster />
        {/* </AuthProvider> */}
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
)
