import { Payment, PaymentType } from '../../types'

export const filterType = (payments: Payment[], type: PaymentType): Payment[] =>
  payments.filter((p) => p.type === type)

export const incomings = (payments: Payment[]): Payment[] =>
  filterType(payments, 'Incomings')

export const outgoings = (payments: Payment[]): Payment[] =>
  filterType(payments, 'Outgoings')
