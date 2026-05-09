import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ProductCard from '../components/ProductCard'
import {
  loadCategories,
  loadProducts,
} from '../features/products/productsSlice'

function CatalogPage() {
  const dispatch = useDispatch()
  const { items, categories, total, loading, error } = useSelector(
    (state) => state.products,
  )

  const [filters, setFilters] = useState({
    search: '',
    categoryId: '',
    baseType: '',
    maxPrice: '',
    sort: 'id-asc',
  })

  useEffect(() => {
    dispatch(loadCategories())
  }, [dispatch])

  useEffect(() => {
    const [sortBy, sortDir] = filters.sort.split('-')

    dispatch(
      loadProducts({
        size: 100,
        search: filters.search,
        categoryId: filters.categoryId,
        baseType: filters.baseType,
        maxPrice: filters.maxPrice,
        sortBy,
        sortDir,
      }),
    )
  }, [dispatch, filters])

  const baseTypes = useMemo(() => {
    const values = items
      .map((product) => product.baseType)
      .filter(Boolean)

    return [...new Set(values)]
  }, [items])

  const handleChange = (event) => {
    const { name, value } = event.target

    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }))
  }

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <div>
            <p className="eyebrow">Каталог</p>
            <h1>Каталог лампочек</h1>
            <p className="muted">
              Товары загружаются из backend-микросервиса товаров через fetch.
            </p>
          </div>
          <p className="result-count">Найдено товаров: {total}</p>
        </div>

        <div className="filters-panel">
          <label>
            Поиск
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Название или артикул"
            />
          </label>

          <label>
            Категория
            <select
              name="categoryId"
              value={filters.categoryId}
              onChange={handleChange}
            >
              <option value="">Все категории</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Тип цоколя
            <select
              name="baseType"
              value={filters.baseType}
              onChange={handleChange}
            >
              <option value="">Все типы</option>
              {baseTypes.map((baseType) => (
                <option key={baseType} value={baseType}>
                  {baseType}
                </option>
              ))}
            </select>
          </label>

          <label>
            Цена до, ₽
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleChange}
              min="0"
              placeholder="Например, 500"
            />
          </label>

          <label>
            Сортировка
            <select name="sort" value={filters.sort} onChange={handleChange}>
              <option value="id-asc">По умолчанию</option>
              <option value="price-asc">Сначала дешевле</option>
              <option value="price-desc">Сначала дороже</option>
              <option value="name-asc">По названию А-Я</option>
              <option value="name-desc">По названию Я-А</option>
            </select>
          </label>
        </div>

        {loading && <p className="info-message">Загрузка каталога...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && items.length === 0 && (
          <p className="empty-message">Товары не найдены.</p>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="product-grid">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default CatalogPage