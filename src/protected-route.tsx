import { Navigate, Outlet } from 'react-router-dom'

const PrivateRoute = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  return isAuthenticated ? <Outlet /> : <Navigate to='/sign-in' replace />
}

export default PrivateRoute
