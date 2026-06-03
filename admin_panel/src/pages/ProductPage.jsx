import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  clearSelectedProduct,
  loadProductById,
} from '../features/products/productsSlice'
import { addItemToCart } from '../features/cart/cartSlice'

function ProductPage() {
  const { id } = useParams()
  const dispatch = useDispatch()

  const { selectedProduct, selectedLoading, error } = useSelector(
    (state) => state.products,
  )
  const actionLoading = useSelector((state) => state.cart.actionLoading)

  useEffect(() => {
    dispatch(loadProductById(id))

    return () => {
      dispatch(clearSelectedProduct())
    }
  }, [dispatch, id])

  const handleAddToCart = () => {
    dispatch(addItemToCart({ productId: selectedProduct.id, quantity: 1 }))
  }

  if (selectedLoading) {
    return (
      <section className="section">
        <div className="container">
          <p className="info-message">Загрузка товара...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="section">
        <div className="container">
          <p className="error-message">{error}</p>
          <Link to="/catalog" className="btn btn-secondary">
            Вернуться в каталог
          </Link>
        </div>
      </section>
    )
  }

  if (!selectedProduct) {
    return null
  }

  return (
    <section className="section">
      <div className="container">
        <Link to="/catalog" className="text-link">
          ← Назад в каталог
        </Link>

        <div className="product-details">
          <div className="product-details-image">
            <span>💡</span>
          </div>

          <div className="product-details-content">
            <p className="product-article">Артикул: {selectedProduct.sku}</p>
            <h1>{selectedProduct.name}</h1>

            {selectedProduct.description && (
              <p className="muted">{selectedProduct.description}</p>
            )}

            <p className="product-details-price">
              {Number(selectedProduct.price).toLocaleString('ru-RU')} ₽
            </p>

            <div className="spec-list">
              <div>
                <span>Категория ID</span>
                <strong>{selectedProduct.categoryId}</strong>
              </div>
              <div>
                <span>Цоколь</span>
                <strong>{selectedProduct.baseType || 'Не указан'}</strong>
              </div>
              <div>
                <span>Мощность</span>
                <strong>
                  {selectedProduct.powerWatts
                    ? `${selectedProduct.powerWatts} Вт`
                    : 'Не указана'}
                </strong>
              </div>
              <div>
                <span>Цветовая температура</span>
                <strong>
                  {selectedProduct.colorTemperature
                    ? `${selectedProduct.colorTemperature}K`
                    : 'Не указана'}
                </strong>
              </div>
              <div>
                <span>Остаток</span>
                <strong>{selectedProduct.stockQuantity} шт.</strong>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddToCart}
              disabled={actionLoading || selectedProduct.stockQuantity <= 0}
            >
              {selectedProduct.stockQuantity > 0
                ? 'Добавить в корзину'
                : 'Нет в наличии'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductPage