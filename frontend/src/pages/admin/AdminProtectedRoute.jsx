import { Navigate } from 'react-router-dom'
import { isAdminAuthenticated } from '../../api/adminClient'

function AdminProtectedRoute({ children }) {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export default AdminProtectedRoute