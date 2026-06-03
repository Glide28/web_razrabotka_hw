import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loadCart } from '../features/cart/cartSlice'
import { createOrder } from '../features/orders/ordersSlice'

function CheckoutPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { items, totalAmount, loading: cartLoading } = useSelector(
    (state) => state.cart,
  )
  const { loading: orderLoading, error } = useSelector((state) => state.orders)

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    comment: '',
  })

  useEffect(() => {
    dispatch(loadCart())
  }, [dispatch])

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const result = await dispatch(createOrder(form))

    if (createOrder.fulfilled.match(result)) {
      navigate('/success')
    }
  }

  if (cartLoading) {
    return (
      <section className="section">
        <div className="container">
          <p className="info-message">Загрузка корзины...</p>
        </div>
      </section>
    )
  }

  if (items.length === 0) {
    return (
      <section className="section">
        <div className="container">
          <div className="empty-cart">
            <h1>Корзина пуста</h1>
            <p>Перед оформлением заказа добавьте товары в корзину.</p>
            <Link to="/catalog" className="btn btn-primary">
              Перейти в каталог
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <div>
            <p className="eyebrow">Оформление заказа</p>
            <h1>Данные покупателя</h1>
            <p className="muted">
              После отправки формы заказ будет создан в backend-микросервисе.
            </p>
          </div>
        </div>

        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={handleSubmit}>
            {error && <p className="error-message">{error}</p>}

            <label>
              ФИО
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                minLength="2"
                placeholder="Иванов Иван Иванович"
              />
            </label>

            <label>
              Телефон
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                minLength="5"
                placeholder="+7 999 123-45-67"
              />
            </label>

            <label>
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="ivanov@example.com"
              />
            </label>

            <label>
              Адрес доставки
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                minLength="5"
                placeholder="г. Москва, ул. Пример, д. 1"
              />
            </label>

            <label>
              Комментарий
              <textarea
                name="comment"
                value={form.comment}
                onChange={handleChange}
                rows="4"
                placeholder="Комментарий к заказу"
              />
            </label>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={orderLoading}
            >
              {orderLoading ? 'Создание заказа...' : 'Подтвердить заказ'}
            </button>
          </form>

          <aside className="cart-summary">
            <h2>Состав заказа</h2>

            <div className="summary-list">
              {items.map((item) => (
                <div key={item.id} className="summary-item">
                  <span>
                    {item.product_name} × {item.quantity}
                  </span>
                  <strong>
                    {Number(item.line_total).toLocaleString('ru-RU')} ₽
                  </strong>
                </div>
              ))}
            </div>

            <p className="summary-total">
              {Number(totalAmount).toLocaleString('ru-RU')} ₽
            </p>
          </aside>
        </div>
      </div>
    </section>
  )
}

export default CheckoutPage