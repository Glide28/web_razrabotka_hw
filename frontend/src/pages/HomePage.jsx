import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import ProductCard from '../components/ProductCard'
import { loadProducts } from '../features/products/productsSlice'

function HomePage() {
  const dispatch = useDispatch()
  const { items, loading, error } = useSelector((state) => state.products)

  useEffect(() => {
    dispatch(loadProducts({ size: 100, sortBy: 'id', sortDir: 'asc' }))
  }, [dispatch])

  const popularProducts = items.slice(0, 4)

  return (
    <>
      <section className="hero">
        <div className="container hero-content">
          <div>
            <p className="eyebrow">Интернет-магазин завода лампочек</p>
            <h1>Лампочки для дома, офиса и производства</h1>
            <p className="hero-text">
              Светодиодные, промышленные, декоративные и бытовые лампы с удобным
              выбором, корзиной и оформлением заказа.
            </p>

            <div className="hero-actions">
              <Link to="/catalog" className="btn btn-primary">
                Перейти в каталог
              </Link>
              <Link to="/cart" className="btn btn-secondary">
                Открыть корзину
              </Link>
            </div>
          </div>

          <div className="hero-card">
            <span className="hero-icon">💡</span>
            <h2>20+ товарных позиций</h2>
            <p>Каталог загружается из backend-микросервиса товаров.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="eyebrow">Популярные товары</p>
              <h2>Рекомендуем к покупке</h2>
            </div>
            <Link to="/catalog" className="text-link">
              Смотреть весь каталог
            </Link>
          </div>

          {loading && <p className="info-message">Загрузка товаров...</p>}
          {error && <p className="error-message">{error}</p>}

          {!loading && !error && (
            <div className="product-grid">
              {popularProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default HomePage