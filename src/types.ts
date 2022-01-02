export type PaymentType = 'Incomings' | 'Outgoings'

export type PaymentCategory =
  | 'Home'
  | 'Food and drink'
  | 'Cash'
  | 'Shopping'
  | 'Household'
  | 'Travel'
  | 'Leisure'
  | 'Transport'
  | 'Health'
  | 'Finances'
  | 'Work'
  | 'Uncategorized'

export interface Payment {
  date: string
  text: string
  type: PaymentType
  category: PaymentCategory
  amount: number
}

export interface CategoryValue {
  name: PaymentCategory
  amount: number
}
