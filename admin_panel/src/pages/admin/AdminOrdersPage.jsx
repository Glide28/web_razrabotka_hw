import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  fetchAdminOrdersApi,
  removeAdminToken,
  updateAdminOrderStatusApi,
} from '../../api/adminClient'

const STATUSES = [
  'NEW',
  'CONFIRMED',
  'IN_PROGRESS',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
]

function AdminOrdersPage() {
  const navigate = useNavigate()

  const [orders, setOrders] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [savingId, setSavingId] = useState(null)
  const [error, setError] = useState('')

  const loadOrders = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await fetchAdminOrdersApi()
      setOrders(data.items || [])
      setTotal(data.total || 0)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const handleLogout = () => {
    removeAdminToken()
    navigate('/')
  }

  const handleStatusChange = async (orderId, status) => {
    setSavingId(orderId)
    setError('')

    try {
      await updateAdminOrderStatusApi(orderId, status)
      await loadOrders()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSavingId(null)
    }
  }

  return (
    <section className="section admin-section">
      <div className="container">
        <div className="admin-topbar">
          <div>
            <p className="eyebrow">Админ-панель</p>
            <h1>Управление заказами</h1>
            <p className="muted">Всего заказов: {total}</p>
          </div>

          <div className="admin-actions">
            <Link to="/products" className="btn btn-secondary">
              Товары
            </Link>
            <a href="http://localhost:5173/" className="btn btn-secondary">
                Магазин
                </a>
            <button type="button" className="btn btn-secondary" onClick={handleLogout}>
              Выйти
            </button>
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}
        {loading && <p className="info-message">Загрузка заказов...</p>}

        {!loading && (
          <div className="admin-table-card">
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Номер заказа</th>
                    <th>Покупатель</th>
                    <th>Статус</th>
                    <th>Сумма</th>
                    <th>Дата</th>
                    <th>Изменить статус</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.order_number}</td>
                      <td>{order.customer_name}</td>
                      <td>{order.status}</td>
                      <td>
                        {Number(order.total_amount).toLocaleString('ru-RU')} ₽
                      </td>
                      <td>
                        {order.created_at
                          ? new Date(order.created_at).toLocaleString('ru-RU')
                          : '—'}
                      </td>
                      <td>
                        <select
                          value={order.status}
                          disabled={savingId === order.id}
                          onChange={(event) =>
                            handleStatusChange(order.id, event.target.value)
                          }
                        >
                          {STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}

                  {orders.length === 0 && (
                    <tr>
                      <td colSpan="7">Заказы не найдены.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default AdminOrdersPage
