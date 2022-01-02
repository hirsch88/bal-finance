export const formatMoney = (amount: number): string => {
  const formatter = new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: 'CHF',
  })

  return formatter.format(amount).replace('CHF', '')
}
