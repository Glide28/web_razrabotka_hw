import { Navigate, Route, Routes } from 'react-router-dom'
import AdminLoginPage from './pages/admin/AdminLoginPage.jsx'
import AdminOrdersPage from './pages/admin/AdminOrdersPage.jsx'
import AdminProductsPage from './pages/admin/AdminProductsPage.jsx'
import AdminProtectedRoute from './pages/admin/AdminProtectedRoute.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminLoginPage />} />

      <Route
        path="/products"
        element={
          <AdminProtectedRoute>
            <AdminProductsPage />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <AdminProtectedRoute>
            <AdminOrdersPage />
          </AdminProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App