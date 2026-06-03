import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addItemToCart } from '../features/cart/cartSlice'

function ProductCard({ product }) {
  const dispatch = useDispatch()
  const actionLoading = useSelector((state) => state.cart.actionLoading)

  const handleAddToCart = () => {
    dispatch(addItemToCart({ productId: product.id, quantity: 1 }))
  }

  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-link">
        <div className="product-image">
          <span>💡</span>
        </div>

        <div className="product-body">
          <p className="product-article">Артикул: {product.sku}</p>
          <h3>{product.name}</h3>

          <div className="product-meta">
            {product.baseType && <span>Цоколь: {product.baseType}</span>}
            <span>Остаток: {product.stockQuantity} шт.</span>
          </div>

          <p className="product-price">{Number(product.price).toLocaleString('ru-RU')} ₽</p>
        </div>
      </Link>

      <button
        type="button"
        className="btn btn-primary full-width"
        onClick={handleAddToCart}
        disabled={actionLoading || product.stockQuantity <= 0}
      >
        {product.stockQuantity > 0 ? 'В корзину' : 'Нет в наличии'}
      </button>
    </article>
  )
}

export default ProductCard