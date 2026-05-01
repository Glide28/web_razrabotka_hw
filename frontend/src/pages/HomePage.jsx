import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'

function HomePage({ products, addToCart }) {
  const popularProducts = products.filter((product) => product.isPopular).slice(0, 4)

  return (
    <>
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-content">
            <p className="eyebrow">Интернет-магазин завода лампочек</p>
            <h1>Лампочки для дома, офиса и производства</h1>
            <p>
              Подберите светодиодные, филаментные, промышленные и декоративные
              лампы. Каталог содержит 20 товарных позиций для учебного проекта.
            </p>
            <div className="hero-actions">
              <Link to="/catalog" className="primary-link">
                Перейти в каталог
              </Link>
              <Link to="/cart" className="secondary-link">
                Открыть корзину
              </Link>
            </div>
          </div>

          <div className="hero-card">
            <span>💡</span>
            <h2>Свет под любую задачу</h2>
            <p>Поиск, фильтры, карточки товаров и оформление заказа.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container section-header">
          <div>
            <p className="eyebrow">Популярные товары</p>
            <h2>Рекомендуемые лампы</h2>
          </div>
          <Link to="/catalog" className="text-link">
            Смотреть весь каталог →
          </Link>
        </div>

        <div className="container product-grid">
          {popularProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
            />
          ))}
        </div>
      </section>
    </>
  )
}

export default HomePage