import { Link } from 'react-router-dom'

function CartPage({ cartItems, cartTotal, updateQuantity, removeFromCart }) {
  if (cartItems.length === 0) {
    return (
      <section className="section">
        <div className="container empty-state">
          <h1>Корзина пуста</h1>
          <p>Добавьте товары из каталога, чтобы оформить заказ.</p>
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
        <p className="eyebrow">Корзина</p>
        <h1>Выбранные товары</h1>
      </div>

      <div className="container cart-layout">
        <div className="cart-list">
          {cartItems.map((item) => (
            <article key={item.productId} className="cart-item">
              <div className="cart-item-image">{item.product.icon}</div>

              <div className="cart-item-info">
                <p className="product-article">{item.product.article}</p>
                <h3>{item.product.name}</h3>
                <p>{item.product.price.toLocaleString('ru-RU')} ₽ за шт.</p>
              </div>

              <div className="quantity-control">
                <label>
                  Количество
                  <input
                    type="number"
                    min="1"
                    max={item.product.stock}
                    value={item.quantity}
                    onChange={(event) =>
                      updateQuantity(item.productId, event.target.value)
                    }
                  />
                </label>
              </div>

              <strong>
                {(item.product.price * item.quantity).toLocaleString('ru-RU')} ₽
              </strong>

              <button
                type="button"
                className="danger-button"
                onClick={() => removeFromCart(item.productId)}
              >
                Удалить
              </button>
            </article>
          ))}
        </div>

        <aside className="order-summary">
          <h2>Итого</h2>
          <div className="summary-row">
            <span>Товаров</span>
            <strong>{cartItems.length}</strong>
          </div>
          <div className="summary-row">
            <span>Сумма заказа</span>
            <strong>{cartTotal.toLocaleString('ru-RU')} ₽</strong>
          </div>
          <Link to="/checkout" className="primary-link full-width">
            Перейти к оформлению
          </Link>
        </aside>
      </div>
    </section>
  )
}

export default CartPage