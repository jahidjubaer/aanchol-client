// Talks to aanchol-server. Set VITE_API_URL in .env (see .env.example).
const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:4000').replace(/\/$/, '')

export class ApiError extends Error {
  constructor(status, body) {
    super(body?.error ?? 'Request failed')
    this.status = status
    this.body = body ?? {}
  }
}

export async function request(path, options = {}) {
  let res
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    })
  } catch {
    throw new ApiError(0, { error: "We couldn't reach our shop just now. Please check your connection and try again." })
  }
  const body = await res.json().catch(() => null)
  if (!res.ok) throw new ApiError(res.status, body)
  return body
}

export async function placeOrder(payload) {
  const { order } = await request('/api/orders', { method: 'POST', body: JSON.stringify(payload) })
  return order
}
