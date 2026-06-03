const PRODUCT_API_URL = 'http://localhost:8001'
const ORDER_API_URL = 'http://localhost:8002'

export const ADMIN_TOKEN_KEY = 'adminToken'

function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY)
}

function getAuthHeaders() {
  const token = getAdminToken()

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
    },
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

export async function loginAdminApi(username, password) {
  return request(`${ORDER_API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  })
}

export function saveAdminToken(token) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token)
}

export function removeAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY)
}

export function isAdminAuthenticated() {
  return Boolean(getAdminToken())
}

export function fetchAdminProductsApi() {
  return request(`${PRODUCT_API_URL}/api/admin/products`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
}

export function createAdminProductApi(product) {
  return request(`${PRODUCT_API_URL}/api/admin/products`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(product),
  })
}

export function updateAdminProductApi(productId, product) {
  return request(`${PRODUCT_API_URL}/api/admin/products/${productId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(product),
  })
}

export function deleteAdminProductApi(productId) {
  return request(`${PRODUCT_API_URL}/api/admin/products/${productId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
}

export function fetchAdminOrdersApi() {
  return request(`${ORDER_API_URL}/api/admin/orders`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
}

export function updateAdminOrderStatusApi(orderId, status) {
  return request(`${ORDER_API_URL}/api/admin/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      status,
    }),
  })
}