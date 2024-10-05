import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../axios'

// Fonction pour récupérer le token CSRF ou tout autre token nécessaire
const getCookie = (name: string) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift()
}

// Action asynchrone pour récupérer les classes avec le token dans les en-têtes
export const fetchClasses = createAsyncThunk(
  'classes/fetchClasses',
  async () => {
    const xsrfToken = getCookie('XSRF-TOKEN') // Remplace par ton propre mécanisme de token
    const response = await axios.get('/api/v1/admin/classes', {
      headers: {
        'X-XSRF-TOKEN': xsrfToken ? decodeURIComponent(xsrfToken) : '',
      },
    })
    return response.data.data // Assurez-vous que c'est bien la structure de la réponse
  }
)

// Action asynchrone pour supprimer une classe (en cas de besoin)
export const deleteClass = createAsyncThunk(
  'classes/deleteClass',
  async (classId: string) => {
    const xsrfToken = getCookie('XSRF-TOKEN')
    await axios.delete(`/api/v1/admin/classes/${classId}`, {
      headers: {
        'X-XSRF-TOKEN': xsrfToken ? decodeURIComponent(xsrfToken) : '',
      },
    })
    return classId
  }
)

// Slice Redux pour la gestion des classes
const classesSlice = createSlice({
  name: 'classes',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClasses.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.data = action.payload
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(deleteClass.fulfilled, (state, action) => {
        // Supprimer la classe du state après suppression réussie
        state.data = state.data.filter((classe) => classe.id !== action.payload)
      })
  },
})

export default classesSlice.reducer
