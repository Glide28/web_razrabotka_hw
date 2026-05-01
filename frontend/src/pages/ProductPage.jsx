import { Link, useParams } from 'react-router-dom'

function ProductPage({ products, addToCart }) {
  const { id } = useParams()
  const product = products.find((item) => item.id === Number(id))

  if (!product) {
    return (
      <section className="section">
        <div className="container empty-state">
          <h1>Товар не найден</h1>
          <Link to="/catalog" className="primary-link">
            Вернуться в каталог
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="section">
      <div className="container product-detail">
        <div className="detail-image">
          <span>{product.icon}</span>
        </div>

        <div className="detail-info">
          <p className="product-article">{product.article}</p>
          <h1>{product.name}</h1>
          <p>{product.description}</p>

          <div className="price-large">
            {product.price.toLocaleString('ru-RU')} ₽
          </div>

          <div className="specs">
            <div>
              <span>Категория</span>
              <strong>{product.category}</strong>
            </div>
            <div>
              <span>Цоколь</span>
              <strong>{product.baseType}</strong>
            </div>
            <div>
              <span>Мощность</span>
              <strong>{product.power}</strong>
            </div>
            <div>
              <span>Цветовая температура</span>
              <strong>{product.temperature}</strong>
            </div>
            <div>
              <span>Остаток на складе</span>
              <strong>{product.stock} шт.</strong>
            </div>
          </div>

          <div className="detail-actions">
            <button type="button" onClick={() => addToCart(product.id)}>
              Добавить в корзину
            </button>
            <Link to="/catalog" className="secondary-link">
              Назад в каталог
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductPage