import { Navigate, Outlet } from 'react-router-dom'
import { isAuthenticated } from '../../../services/authService'
import './ProtectedRoute.css'

export default function ProtectedRoute() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="protected-route">
      <Outlet />
    </div>
  )
}