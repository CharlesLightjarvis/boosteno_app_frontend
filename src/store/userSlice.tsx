import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../axios'

// Asynchrone pour récupérer les utilisateurs
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await axios.get('/api/v1/admin/users')
  return response.data.data // Assuming `data.data` is the structure
})

// Asynchrone pour supprimer un utilisateur
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId: string, { dispatch }) => {
    const xsrfToken = getCookie('XSRF-TOKEN') // Remplacez cela par votre méthode de récupération du token CSRF
    await axios.delete(`/api/v1/admin/users/${userId}`, {
      headers: {
        'X-XSRF-TOKEN': xsrfToken ? decodeURIComponent(xsrfToken) : '',
      },
    })
    // Après la suppression, rechargez les utilisateurs
    dispatch(fetchUsers())
  }
)

// Fonction de récupération des cookies
const getCookie = (name: string) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift()
}

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Gérer l'état lors de la récupération des utilisateurs
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.data = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      // Gérer la suppression de l'utilisateur
      .addCase(deleteUser.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.status = 'succeeded'
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export default usersSlice.reducer
