import { NavLink, Link } from 'react-router-dom'

function Header({ cartCount }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="logo">
          <span className="logo-icon">💡</span>
          <span>Завод лампочек</span>
        </Link>

        <nav className="nav">
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