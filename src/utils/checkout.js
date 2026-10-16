import { BRAND } from '../config/brand.js'
import { formatPrice } from './formatPrice.js'

// Bangladeshi mobile: 01[3-9] + 8 digits, optional +88 / 88 prefix.
const BD_PHONE = /^(?:\+?88)?01[3-9]\d{8}$/

export function validateCheckout(form) {
  const errors = {}
  if (form.name.trim().length < 2) errors.name = 'Please enter your full name.'
  if (!BD_PHONE.test(form.phone.replace(/[\s-]/g, ''))) errors.phone = 'Enter a valid Bangladeshi mobile number, e.g. 01712345678.'
  if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid email or leave it empty.'
  if (!form.city.trim()) errors.city = 'Please enter your city or district.'
  if (form.address.trim().length < 8) errors.address = 'Please enter your full delivery address.'
  return errors
}

export function makeOrderId() {
  return `AN-${Date.now().toString(36).toUpperCase().slice(-6)}`
}

export function orderWhatsappMessage(order) {
  const lines = order.items.map((i) => `• ${i.name} × ${i.qty} = ${formatPrice(i.price * i.qty)}`)
  return [
    `Hello ${BRAND.name}, I placed order ${order.id}.`,
    ...lines,
    `Delivery: ${order.delivery.label} (${formatPrice(order.delivery.fee)})`,
    `Total: ${formatPrice(order.total)} · Cash on delivery`,
    `Name: ${order.customer.name}`,
    `Phone: ${order.customer.phone}`,
    `Address: ${order.customer.address}, ${order.customer.city}`,
  ].join('\n')
}
