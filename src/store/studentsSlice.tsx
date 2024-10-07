import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../axios' // Use your axios instance

// Async thunk to fetch students
export const fetchStudents = createAsyncThunk(
  'students/fetchStudents',
  async (classId: string) => {
    const response = await axios.get(`/api/v1/admin/classes/${classId}`)
    return response.data.data.students
  }
)

export const fetchAvailableStudents = createAsyncThunk(
  'students/fetchAvailableStudents',
  async (idLevel) => {
    const response = await axios.get(
      `/api/v1/admin/classes/${idLevel}/students/available`
    )
    return response.data
  }
)

const getCookie = (name: string) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift()
}

// Async thunk to remove a student
export const removeStudent = createAsyncThunk(
  'students/removeStudent',
  async ({ classeId, studentId }: { classeId: string; studentId: number }) => {
    const csrfToken = getCookie('XSRF-TOKEN') // Assuming getCookie function is defined
    await axios.delete(`/api/v1/admin/classes/students/remove`, {
      data: {
        classe_id: classeId,
        student_ids: [studentId],
      },
      headers: {
        'X-XSRF-TOKEN': decodeURIComponent(csrfToken || ''),
      },
    })
    return studentId
  }
)

const studentsSlice = createSlice({
  name: 'students',
  initialState: {
    students: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Handle fetchStudents
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.students = action.payload
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      // Handle removeStudent
      .addCase(removeStudent.fulfilled, (state, action) => {
        state.students = state.students.filter(
          (student) => student.id !== action.payload
        )
      })
  },
})

export default studentsSlice.reducer
