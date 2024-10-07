import { configureStore } from '@reduxjs/toolkit'
import usersReducer from './userSlice'
import classesReducer from './classesSlice'
import studentsReducer from './studentsSlice'

export const store = configureStore({
  reducer: {
    users: usersReducer,
    classes: classesReducer, // Assurez-vous que le slice "classes" est ajouté ici
    students: studentsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
