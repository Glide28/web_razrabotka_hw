import { Link } from 'react-router-dom'

function ProductCard({ product, addToCart }) {
  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-image">
        <span>{product.icon}</span>
      </Link>

      <div className="product-body">
        <p className="product-article">{product.article}</p>
        <h3>
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="product-description">{product.description}</p>

        <div className="product-meta">
          <span>{product.category}</span>
          <span>{product.baseType}</span>
          <span>{product.power}</span>
        </div>

        <div className="product-bottom">
          <strong>{product.price.toLocaleString('ru-RU')} ₽</strong>
          <button type="button" onClick={() => addToCart(product.id)}>
            В корзину
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard