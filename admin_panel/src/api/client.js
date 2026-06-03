const PRODUCT_API_URL = 'http://localhost:8001'
const ORDER_API_URL = 'http://localhost:8002'

export const SESSION_ID = 'sess_hw04'

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  let data = null

  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    const message = data?.detail || data?.message || 'Ошибка HTTP-запроса'
    throw new Error(message)
  }

  return data
}

export function fetchProductsApi(params = {}) {
  const searchParams = new URLSearchParams({
    page: params.page || 1,
    size: params.size || 100,
    sortBy: params.sortBy || 'id',
    sortDir: params.sortDir || 'asc',
  })

  if (params.search) searchParams.set('search', params.search)
  if (params.categoryId) searchParams.set('categoryId', params.categoryId)
  if (params.minPrice) searchParams.set('minPrice', params.minPrice)
  if (params.maxPrice) searchParams.set('maxPrice', params.maxPrice)
  if (params.baseType) searchParams.set('baseType', params.baseType)

  return request(`${PRODUCT_API_URL}/api/products?${searchParams.toString()}`)
}

export function fetchProductByIdApi(productId) {
  return request(`${PRODUCT_API_URL}/api/products/${productId}`)
}

export function fetchCategoriesApi() {
  return request(`${PRODUCT_API_URL}/api/categories`)
}

export function fetchCartApi() {
  return request(`${ORDER_API_URL}/api/cart?sessionId=${SESSION_ID}`)
}

export function addCartItemApi(productId, quantity = 1) {
  return request(`${ORDER_API_URL}/api/cart/items`, {
    method: 'POST',
    body: JSON.stringify({
      sessionId: SESSION_ID,
      productId,
      quantity,
    }),
  })
}

export function updateCartItemApi(cartItemId, quantity) {
  return request(`${ORDER_API_URL}/api/cart/items/${cartItemId}`, {
    method: 'PUT',
    body: JSON.stringify({
      quantity,
    }),
  })
}

export function deleteCartItemApi(cartItemId) {
  return request(`${ORDER_API_URL}/api/cart/items/${cartItemId}`, {
    method: 'DELETE',
  })
}

export function createOrderApi(customer) {
  return request(`${ORDER_API_URL}/api/orders`, {
    method: 'POST',
    body: JSON.stringify({
      sessionId: SESSION_ID,
      customer,
    }),
  })
}