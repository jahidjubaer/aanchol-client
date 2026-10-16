// Bangladesh uses lakh grouping (1,25,000), same as en-IN.
const formatter = new Intl.NumberFormat('en-IN')

export function formatPrice(amount) {
  return `৳ ${formatter.format(amount)}`
}
