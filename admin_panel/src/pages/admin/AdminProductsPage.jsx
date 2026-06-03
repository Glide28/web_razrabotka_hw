import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  createAdminProductApi,
  deleteAdminProductApi,
  fetchAdminProductsApi,
  removeAdminToken,
  updateAdminProductApi,
} from '../../api/adminClient'

const emptyForm = {
  name: '',
  sku: '',
  categoryId: 1,
  description: '',
  baseType: 'E27',
  powerWatts: 10,
  colorTemperature: 4000,
  voltage: 220,
  price: 100,
  stockQuantity: 10,
  imageUrl: '',
  isActive: true,
}

function AdminProductsPage() {
  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const loadProducts = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await fetchAdminProductsApi()
      setProducts(data)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleLogout = () => {
    removeAdminToken()
    navigate('/')
  }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setForm((currentForm) => ({
      ...currentForm,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const normalizeProductPayload = () => ({
    name: form.name,
    sku: form.sku,
    categoryId: Number(form.categoryId),
    description: form.description,
    baseType: form.baseType,
    powerWatts: Number(form.powerWatts),
    colorTemperature: Number(form.colorTemperature),
    voltage: Number(form.voltage),
    price: Number(form.price),
    stockQuantity: Number(form.stockQuantity),
    imageUrl: form.imageUrl || null,
    isActive: Boolean(form.isActive),
  })

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      const payload = normalizeProductPayload()

      if (editingId) {
        await updateAdminProductApi(editingId, payload)
      } else {
        await createAdminProductApi(payload)
      }

      setForm(emptyForm)
      setEditingId(null)
      await loadProducts()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (product) => {
    setEditingId(product.id)

    setForm({
      name: product.name || '',
      sku: product.sku || '',
      categoryId: product.categoryId || 1,
      description: product.description || '',
      baseType: product.baseType || 'E27',
      powerWatts: product.powerWatts || 10,
      colorTemperature: product.colorTemperature || 4000,
      voltage: product.voltage || 220,
      price: Number(product.price) || 100,
      stockQuantity: product.stockQuantity || 10,
      imageUrl: product.imageUrl || '',
      isActive: Boolean(product.isActive),
    })

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (productId) => {
    const confirmed = window.confirm('Деактивировать товар?')

    if (!confirmed) {
      return
    }

    setError('')

    try {
      await deleteAdminProductApi(productId)
      await loadProducts()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setForm(emptyForm)
  }

  return (
    <section className="section admin-section">
      <div className="container">
        <div className="admin-topbar">
          <div>
            <p className="eyebrow">Админ-панель</p>
            <h1>Управление товарами</h1>
          </div>

          <div className="admin-actions">
            <Link to="/orders" className="btn btn-secondary">
                Заказы
            </Link>

            <a href="http://localhost:5173/" className="btn btn-secondary">
                Магазин
            </a>

            <button type="button" className="btn btn-secondary" onClick={handleLogout}>
                Выйти
            </button>
            </div>
        </div>

        <div className="admin-grid">
          <form className="admin-form admin-product-form" onSubmit={handleSubmit}>
            <h2>{editingId ? 'Редактирование товара' : 'Добавление товара'}</h2>

            {error && <p className="error-message">{error}</p>}

            <label>
              Название
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                minLength="2"
              />
            </label>

            <label>
              Артикул
              <input
                name="sku"
                value={form.sku}
                onChange={handleChange}
                required
                minLength="2"
              />
            </label>

            <label>
              Категория ID
              <input
                type="number"
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                min="1"
                required
              />
            </label>

            <label>
              Описание
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="3"
              />
            </label>

            <div className="admin-form-row">
              <label>
                Цоколь
                <input
                  name="baseType"
                  value={form.baseType}
                  onChange={handleChange}
                />
              </label>

              <label>
                Мощность, Вт
                <input
                  type="number"
                  name="powerWatts"
                  value={form.powerWatts}
                  onChange={handleChange}
                  min="0"
                />
              </label>
            </div>

            <div className="admin-form-row">
              <label>
                Цветовая температура
                <input
                  type="number"
                  name="colorTemperature"
                  value={form.colorTemperature}
                  onChange={handleChange}
                  min="0"
                />
              </label>

              <label>
                Напряжение
                <input
                  type="number"
                  name="voltage"
                  value={form.voltage}
                  onChange={handleChange}
                  min="0"
                />
              </label>
            </div>

            <div className="admin-form-row">
              <label>
                Цена
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  min="1"
                  step="0.01"
                  required
                />
              </label>

              <label>
                Остаток
                <input
                  type="number"
                  name="stockQuantity"
                  value={form.stockQuantity}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </label>
            </div>

            <label>
              URL изображения
              <input
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="/images/example.jpg"
              />
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
              />
              Активный товар
            </label>

            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving
                ? 'Сохранение...'
                : editingId
                  ? 'Сохранить изменения'
                  : 'Добавить товар'}
            </button>

            {editingId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancelEdit}
              >
                Отменить редактирование
              </button>
            )}
          </form>

          <div className="admin-table-card">
            <h2>Список товаров</h2>

            {loading && <p className="info-message">Загрузка товаров...</p>}

            {!loading && (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Название</th>
                      <th>Артикул</th>
                      <th>Цена</th>
                      <th>Остаток</th>
                      <th>Активен</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>{product.name}</td>
                        <td>{product.sku}</td>
                        <td>{Number(product.price).toLocaleString('ru-RU')} ₽</td>
                        <td>{product.stockQuantity}</td>
                        <td>{product.isActive ? 'Да' : 'Нет'}</td>
                        <td>
                          <div className="table-actions">
                            <button
                              type="button"
                              className="small-button"
                              onClick={() => handleEdit(product)}
                            >
                              Изменить
                            </button>
                            <button
                              type="button"
                              className="small-button danger-small-button"
                              onClick={() => handleDelete(product.id)}
                            >
                              Удалить
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AdminProductsPage
