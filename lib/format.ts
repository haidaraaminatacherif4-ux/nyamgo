export function formatGNF(amount: number) {
  return new Intl.NumberFormat("fr-GN", { maximumFractionDigits: 0 }).format(amount) + " GNF";
}
