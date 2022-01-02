<script setup lang="ts">
import { ref } from 'vue'
import {
  BalApp,
  BalIcon,
  BalHeading,
} from '@baloise/design-system-components-vue'
import MonthlyAccountStatement from '@/app/components/MonthlyAccountStatement.vue'
import Report from '@/app/components/Report.vue'
import { paymentsStore } from '@/app/store/payments.store'
import DropZone from './components/DropZone.vue'

const selectedMonth = ref<string | undefined>(undefined)

const showMonth = (month: string) => {
  selectedMonth.value = month
  paymentsStore.selectPayments(month)
}
</script>

<template>
  <BalApp>
    <header class="has-background-blue px-6 py-2 is-flex">
      <div
        class="is-flex is-justify-content-start is-align-items-center is-flex-grow-1"
      >
        <BalIcon name="logo" inverted size="large"></BalIcon>
        <BalHeading class="ml-2" inverted space="none" level="h3">
          Finance
        </BalHeading>
      </div>
    </header>
    <main class="p-6">
      <DropZone></DropZone>
      <MonthlyAccountStatement
        @select-month="showMonth($event)"
      ></MonthlyAccountStatement>
      <Report v-if="paymentsStore.getState().files.length > 0"></Report>
    </main>
  </BalApp>
</template>
