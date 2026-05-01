import { useMemo, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import HomePage from './pages/HomePage.jsx'
import CatalogPage from './pages/CatalogPage.jsx'
import ProductPage from './pages/ProductPage.jsx'
import CartPage from './pages/CartPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import SuccessPage from './pages/SuccessPage.jsx'
import { products } from './data/products.js'

function App() {
  const [cart, setCart] = useState([])
  const [lastOrder, setLastOrder] = useState(null)

  const addToCart = (productId) => {
    const product = products.find((item) => item.id === Number(productId))

    if (!product || product.stock <= 0) {
      return
    }

    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.productId === product.id)

      if (existingItem) {
        return currentCart.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: Math.min(item.quantity + 1, product.stock),
              }
            : item,
        )
      }

      return [...currentCart, { productId: product.id, quantity: 1 }]
    })
  }

  const updateQuantity = (productId, quantity) => {
    const product = products.find((item) => item.id === Number(productId))
    const safeQuantity = Math.max(1, Math.min(Number(quantity), product?.stock || 1))

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.productId === Number(productId)
          ? { ...item, quantity: safeQuantity }
          : item,
      ),
    )
  }

  const removeFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.productId !== Number(productId)),
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const cartItems = useMemo(() => {
    return cart
      .map((item) => {
        const product = products.find((productItem) => productItem.id === item.productId)
        return product ? { ...item, product } : null
      })
      .filter(Boolean)
  }, [cart])

  const cartTotal = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    )
  }, [cartItems])

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0)
  }, [cart])

  return (
    <Routes>
      <Route element={<Layout cartCount={cartCount} />}>
        <Route
          path="/"
          element={<HomePage products={products} addToCart={addToCart} />}
        />
        <Route
          path="/catalog"
          element={<CatalogPage products={products} addToCart={addToCart} />}
        />
        <Route
          path="/products/:id"
          element={<ProductPage products={products} addToCart={addToCart} />}
        />
        <Route
          path="/cart"
          element={
            <CartPage
              cartItems={cartItems}
              cartTotal={cartTotal}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
            />
          }
        />
        <Route
          path="/checkout"
          element={
            <CheckoutPage
              cartItems={cartItems}
              cartTotal={cartTotal}
              clearCart={clearCart}
              setLastOrder={setLastOrder}
            />
          }
        />
        <Route path="/success" element={<SuccessPage lastOrder={lastOrder} />} />
      </Route>
    </Routes>
  )
}

export default App