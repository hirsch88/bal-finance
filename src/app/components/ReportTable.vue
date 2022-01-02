<script setup lang="ts">
import { BalHeading } from '@baloise/design-system-components-vue'
import { paymentsStore } from '@/app/store/payments.store'
import Category from '@/app/components/Category.vue'
import { computed } from 'vue'
import Money from './Money.vue'

const filteredPayments = computed(() => {
  const selectedCategory = paymentsStore.getState().selectedCategory
  return paymentsStore.getState().selectedPayments.filter((p) => {
    if (selectedCategory === 'All') {
      return true
    }
    return selectedCategory === p.category
  })
})
</script>

<template>
  <BalHeading level="h4" space="none" class="mt-3 mb-1 ml-3 mr-3 mb-0 p-0">
    Payments
  </BalHeading>
  <BalHeading subtitle level="h5" space="bottom" class="mb-3 ml-3 mr-3 p-0">
    List of payments during the selected months. The payments are devided into
    12 categories.
  </BalHeading>
  <table class="table is-fullwidth is-striped p-0">
    <thead>
      <th>Name</th>
      <th style="width: 120px">Date</th>
      <th style="width: 160px">Category</th>
      <th class="has-text-right" style="width: 120px">Amount</th>
    </thead>
    <tbody>
      <tr v-for="(payment, index) in filteredPayments" :key="index">
        <td
          style="
            max-width: 0;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          "
        >
          {{ payment.text }}
        </td>
        <td>{{ payment.date }}</td>
        <td>
          <span class="is-flex is-justify-content-start is-align-items-center">
            <Category small :value="payment.category" class="mr-2"></Category>
            {{ payment.category }}
          </span>
        </td>
        <td class="has-text-right">
          <Money
            :value="payment.amount"
            :minus="payment.type === 'Outgoings'"
            :style="{
              marginRight: payment.type === 'Incomings' ? '-7px' : '0',
            }"
          ></Money>
        </td>
      </tr>
    </tbody>
  </table>
</template>
