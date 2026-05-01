import { Link } from 'react-router-dom'

function SuccessPage({ lastOrder }) {
  return (
    <section className="section">
      <div className="container success-card">
        <div className="success-icon">✅</div>
        <p className="eyebrow">Заказ оформлен</p>
        <h1>Спасибо за покупку!</h1>

        {lastOrder ? (
          <>
            <p>
              Номер заказа: <strong>{lastOrder.orderNumber}</strong>
            </p>
            <p>
              Статус заказа: <strong>{lastOrder.status}</strong>
            </p>
            <p>
              Сумма заказа:{' '}
              <strong>{lastOrder.total.toLocaleString('ru-RU')} ₽</strong>
            </p>
          </>
        ) : (
          <p>Заказ успешно создан.</p>
        )}

        <div className="hero-actions center-actions">
          <Link to="/catalog" className="primary-link">
            Вернуться в каталог
          </Link>
          <Link to="/" className="secondary-link">
            На главную
          </Link>
        </div>
      </div>
    </section>
  )
}

export default SuccessPage