import { BRAND } from '../config/brand.js'

export function whatsappLink(message) {
  const base = `https://wa.me/${BRAND.whatsapp}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export function productWhatsappMessage(product) {
  return `Hello ${BRAND.name}, I'd like to order "${product.name}". ${window.location.origin}/products/${product.slug}`
}
