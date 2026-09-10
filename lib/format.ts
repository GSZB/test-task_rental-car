/** Groups thousands with a space so the server and client always agree. */
export function formatNumber(value: number): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function formatMileage(mileage: number): string {
  return `${formatNumber(mileage)} km`;
}

export function formatPrice(rentalPrice: string): string {
  return `$${rentalPrice}`;
}
