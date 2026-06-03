import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginAdminApi, saveAdminToken } from '../../api/adminClient'

function AdminLoginPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    username: 'admin',
    password: 'admin123',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const data = await loginAdminApi(form.username, form.password)
      saveAdminToken(data.accessToken)
      navigate('/products')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="section admin-login-section">
      <div className="container">
        <div className="admin-login-card">
          <p className="eyebrow">Панель управления</p>
          <h1>Вход администратора</h1>
          <p className="muted">
            Войдите в личный кабинет администратора для управления товарами и
            заказами.
          </p>

          <form className="admin-form" onSubmit={handleSubmit}>
            {error && <p className="error-message">{error}</p>}

            <label>
              Логин
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Пароль
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </label>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>

          <Link to="/" className="text-link">
            ← Вернуться в магазин
          </Link>
        </div>
      </div>
    </section>
  )
}

export default AdminLoginPage
