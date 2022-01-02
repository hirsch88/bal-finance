<script setup lang="ts">
import { BalCard, BalHeading } from '@baloise/design-system-components-vue'
import { computed, defineEmits, onMounted } from 'vue'
import { paymentsStore } from '@/app/store/payments.store'
import { formatMoney } from '@/app/utils/currency'

interface PaymentRow {
  name: string
  incomings: string
  outgoings: string
  diff: string
}

export type onSelectMonth = (month: string) => void

type ListEmitters = {
  selectMonth: onSelectMonth
}

const emits = defineEmits({
  selectMonth: () => true,
} as ListEmitters)

const select = (month: string) => {
  emits('selectMonth', month)
}

const payments = computed<PaymentRow[]>(() => {
  return paymentsStore.getState().files.map((paymentFile) => {
    const incomings = paymentFile.payments
      .filter((p) => p.type === 'Incomings')
      .reduce((a, c) => a + c.amount, 0)
    const outgoings = paymentFile.payments
      .filter((p) => p.type === 'Outgoings')
      .reduce((a, c) => a + c.amount, 0)
    return {
      name: paymentFile.name,
      incomings: formatMoney(incomings),
      outgoings: formatMoney(outgoings),
      diff: formatMoney(incomings - outgoings),
    }
  })
})

onMounted(() => {
  if (payments.value.length > 0) {
    emits('selectMonth', payments.value[0].name)
  }
})
</script>

<template>
  <BalCard
    class="mt-6"
    flat
    border
    v-if="paymentsStore.getState().files.length > 0"
  >
    <BalHeading level="h4" space="none" class="mt-3 mb-1 ml-3 mr-3 mb-0 p-0">
      Montly Account Statements
    </BalHeading>
    <BalHeading subtitle level="h5" space="bottom" class="mb-3 ml-3 mr-3 p-0">
      Download the montly account statement as a CSV file in upload it into the
      app.
    </BalHeading>
    <table class="table is-fullwidth is-striped is-clickable is-hoverable p-0">
      <thead>
        <th>Month</th>
        <th>Incoming</th>
        <th>Outgoing</th>
        <th>Diff</th>
      </thead>
      <tbody>
        <tr
          v-for="(payment, index) in payments"
          :key="index"
          @click="select(payment.name)"
          :class="{
            'is-clickable': true,
            'is-selected':
              payment.name === paymentsStore.getState().selectedMonth,
          }"
        >
          <td>{{ payment.name }}</td>
          <td>{{ payment.incomings }}</td>
          <td>{{ payment.outgoings }}</td>
          <td>{{ payment.diff }}</td>
        </tr>
      </tbody>
    </table>
  </BalCard>
</template>
