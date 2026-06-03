import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

function SuccessPage() {
  const lastOrder = useSelector((state) => state.orders.lastOrder)

  return (
    <section className="section">
      <div className="container">
        <div className="success-card">
          <div className="success-icon">✓</div>

          <p className="eyebrow">Заказ оформлен</p>
          <h1>Спасибо за покупку!</h1>

          {lastOrder ? (
            <>
              <p>
                Ваш заказ успешно создан в backend-микросервисе заказов.
              </p>

              <div className="order-info">
                <div>
                  <span>Номер заказа</span>
                  <strong>{lastOrder.order_number}</strong>
                </div>
                <div>
                  <span>Статус</span>
                  <strong>{lastOrder.status}</strong>
                </div>
                <div>
                  <span>ID заказа</span>
                  <strong>{lastOrder.id}</strong>
                </div>
              </div>
            </>
          ) : (
            <p>
              Данные последнего заказа не найдены. Возможно, страница была
              обновлена после оформления.
            </p>
          )}

          <div className="hero-actions">
            <Link to="/catalog" className="btn btn-primary">
              Вернуться в каталог
            </Link>
            <Link to="/" className="btn btn-secondary">
              На главную
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SuccessPage