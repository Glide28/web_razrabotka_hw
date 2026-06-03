import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  loadCart,
  removeCartItem,
  updateCartItemQuantity,
} from '../features/cart/cartSlice'

function CartPage() {
  const dispatch = useDispatch()
  const { items, totalAmount, loading, actionLoading, error } = useSelector(
    (state) => state.cart,
  )

  useEffect(() => {
    dispatch(loadCart())
  }, [dispatch])

  const handleQuantityChange = (cartItemId, quantity) => {
    const safeQuantity = Math.max(1, Number(quantity) || 1)

    dispatch(
      updateCartItemQuantity({
        cartItemId,
        quantity: safeQuantity,
      }),
    )
  }

  const handleRemove = (cartItemId) => {
    dispatch(removeCartItem(cartItemId))
  }

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <p className="info-message">Загрузка корзины...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <div>
            <p className="eyebrow">Корзина</p>
            <h1>Ваш заказ</h1>
            <p className="muted">
              Корзина загружается из backend-микросервиса заказов.
            </p>
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        {items.length === 0 ? (
          <div className="empty-cart">
            <h2>Корзина пуста</h2>
            <p>Добавьте товары из каталога, чтобы оформить заказ.</p>
            <Link to="/catalog" className="btn btn-primary">
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-list">
              {items.map((item) => (
                <article key={item.id} className="cart-item">
                  <div>
                    <p className="product-article">ID товара: {item.product_id}</p>
                    <h3>{item.product_name}</h3>
                    <p className="muted">
                      Цена: {Number(item.price).toLocaleString('ru-RU')} ₽
                    </p>
                  </div>

                  <div className="cart-controls">
                    <label>
                      Количество
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        disabled={actionLoading}
                        onChange={(event) =>
                          handleQuantityChange(item.id, event.target.value)
                        }
                      />
                    </label>

                    <strong>
                      {Number(item.line_total).toLocaleString('ru-RU')} ₽
                    </strong>

                    <button
                      type="button"
                      className="btn btn-secondary"
                      disabled={actionLoading}
                      onClick={() => handleRemove(item.id)}
                    >
                      Удалить
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <aside className="cart-summary">
              <h2>Итого</h2>
              <p className="summary-total">
                {Number(totalAmount).toLocaleString('ru-RU')} ₽
              </p>

              <Link to="/checkout" className="btn btn-primary full-width-summary">
                Оформить заказ
              </Link>
            </aside>
          </div>
        )}
      </div>
    </section>
  )
}

export default CartPage