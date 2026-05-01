import { useMemo, useState } from 'react'
import ProductCard from '../components/ProductCard.jsx'

function CatalogPage({ products, addToCart }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Все')
  const [baseType, setBaseType] = useState('Все')
  const [maxPrice, setMaxPrice] = useState('2000')
  const [sort, setSort] = useState('name-asc')

  const categories = ['Все', ...new Set(products.map((product) => product.category))]
  const baseTypes = ['Все', ...new Set(products.map((product) => product.baseType))]

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase()

    return products
      .filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(query) ||
          product.article.toLowerCase().includes(query)

        const matchesCategory = category === 'Все' || product.category === category
        const matchesBase = baseType === 'Все' || product.baseType === baseType
        const matchesPrice = product.price <= Number(maxPrice)

        return matchesSearch && matchesCategory && matchesBase && matchesPrice
      })
      .sort((a, b) => {
        if (sort === 'price-asc') return a.price - b.price
        if (sort === 'price-desc') return b.price - a.price
        if (sort === 'name-desc') return b.name.localeCompare(a.name, 'ru')
        return a.name.localeCompare(b.name, 'ru')
      })
  }, [products, search, category, baseType, maxPrice, sort])

  return (
    <section className="section">
      <div className="container page-title">
        <p className="eyebrow">Каталог</p>
        <h1>Каталог лампочек</h1>
        <p>
          Используйте поиск, фильтрацию по категории, цоколю и цене, а также
          сортировку по цене или названию.
        </p>
      </div>

      <div className="container catalog-layout">
        <aside className="filters">
          <label>
            Поиск по названию или артикулу
            <input
              type="text"
              placeholder="Например: E27 или RGB"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <label>
            Категория
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            Тип цоколя
            <select value={baseType} onChange={(event) => setBaseType(event.target.value)}>
              {baseTypes.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            Максимальная цена: {Number(maxPrice).toLocaleString('ru-RU')} ₽
            <input
              type="range"
              min="50"
              max="2000"
              step="50"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
            />
          </label>

          <label>
            Сортировка
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="name-asc">По названию А–Я</option>
              <option value="name-desc">По названию Я–А</option>
              <option value="price-asc">Сначала дешевле</option>
              <option value="price-desc">Сначала дороже</option>
            </select>
          </label>
        </aside>

        <div>
          <div className="catalog-summary">
            Найдено товаров: <strong>{filteredProducts.length}</strong>
          </div>

          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CatalogPage