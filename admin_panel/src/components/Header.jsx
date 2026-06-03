import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Header() {
  const cartCount = useSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0),
  )

  return (
    <header className="site-header">
      <div className="container header-content">
        <NavLink to="/" className="logo">
          <span className="logo-mark">💡</span>
          <span>
            <strong>Завод лампочек</strong>
            <small>интернет-магазин</small>
          </span>
        </NavLink>

        <nav className="main-nav">
          <NavLink to="/">Главная</NavLink>
          <NavLink to="/catalog">Каталог</NavLink>
          <NavLink to="/cart" className="cart-link">
            Корзина
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Header