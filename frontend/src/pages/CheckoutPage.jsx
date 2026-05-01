import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function CheckoutPage({ cartItems, cartTotal, clearCart, setLastOrder }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    comment: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`

    setLastOrder({
      orderNumber,
      customer: form,
      items: cartItems,
      total: cartTotal,
      status: 'NEW',
    })

    clearCart()
    navigate('/success')
  }

  if (cartItems.length === 0) {
    return (
      <section className="section">
        <div className="container empty-state">
          <h1>Нельзя оформить пустой заказ</h1>
          <Link to="/catalog" className="primary-link">
            Перейти в каталог
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="section">
      <div className="container page-title">
        <p className="eyebrow">Оформление заказа</p>
        <h1>Контактные данные</h1>
      </div>

      <div className="container checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <label>
            ФИО
            <input
              name="fullName"
              type="text"
              required
              value={form.fullName}
              onChange={handleChange}
              placeholder="Иванов Иван Иванович"
            />
          </label>

          <label>
            Телефон
            <input
              name="phone"
              type="tel"
              required
              value={form.phone}
              onChange={handleChange}
              placeholder="+7 999 123-45-67"
            />
          </label>

          <label>
            Email
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="email@example.ru"
            />
          </label>

          <label>
            Адрес доставки
            <input
              name="address"
              type="text"
              required
              value={form.address}
              onChange={handleChange}
              placeholder="Город, улица, дом, квартира"
            />
          </label>

          <label>
            Комментарий к заказу
            <textarea
              name="comment"
              value={form.comment}
              onChange={handleChange}
              placeholder="Например: доставка после 18:00"
            />
          </label>

          <button type="submit" className="primary-button">
            Подтвердить заказ
          </button>
        </form>

        <aside className="order-summary">
          <h2>Состав заказа</h2>
          {cartItems.map((item) => (
            <div key={item.productId} className="summary-row">
              <span>
                {item.product.name} × {item.quantity}
              </span>
              <strong>
                {(item.product.price * item.quantity).toLocaleString('ru-RU')} ₽
              </strong>
            </div>
          ))}
          <div className="summary-total">
            <span>Итого</span>
            <strong>{cartTotal.toLocaleString('ru-RU')} ₽</strong>
          </div>
        </aside>
      </div>
    </section>
  )
}

export default CheckoutPage