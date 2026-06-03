import { Navigate } from 'react-router-dom'
import { isAdminAuthenticated } from '../../api/adminClient'

function AdminProtectedRoute({ children }) {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminProtectedRoute
