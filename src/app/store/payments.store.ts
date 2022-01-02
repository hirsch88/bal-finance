import { Payment, PaymentCategory } from '../../types'
import { outgoings } from '../utils/payment'
import { Store } from './store'

export interface PaymentFiles {
  name: string
  payments: Payment[]
}

export interface PaymentsState extends Object {
  files: PaymentFiles[]
  selectedPayments: Payment[]
  selectedMonth: string
  selectedCategory: PaymentCategory | 'All'
}

export class PaymentsStore extends Store<PaymentsState> {
  protected data(): PaymentsState {
    return {
      files: [],
      selectedPayments: [],
      selectedMonth: '',
      selectedCategory: 'All',
    }
  }

  selectCategory(category: PaymentCategory | 'All'): void {
    console.log('selectCategory', category)
    this.state.selectedCategory = category
  }

  selectPayments(name: string): void {
    console.log('selectPayments', name)
    this.state.selectedMonth = name
    this.state.selectedPayments =
      this.state.files.find((f) => f.name === name)?.payments || []
  }

  setPayments(paymentFiles: PaymentFiles[]): void {
    console.log('setPayments', paymentFiles)
    this.state.files = paymentFiles
  }

  getCategories(): PaymentCategory[] {
    return outgoings(paymentsStore.getState().selectedPayments)
      .map((p) => p.category)
      .filter((value, index, self) => self.indexOf(value) === index)
  }

  getData(): number[] {
    return this.getCategories().map((c) =>
      outgoings(paymentsStore.getState().selectedPayments)
        .filter((p) => p.category === c)
        .reduce((total, payment) => total + payment.amount, 0),
    )
  }
}

export const paymentsStore: PaymentsStore = new PaymentsStore()
