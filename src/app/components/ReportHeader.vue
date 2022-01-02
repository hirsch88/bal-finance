<script setup lang="ts">
import { BalHeading } from '@baloise/design-system-components-vue'
import { paymentsStore } from '@/app/store/payments.store'
</script>

<template>
  <BalHeading level="h3">
    Month {{ paymentsStore.getState().selectedMonth }}
  </BalHeading>
</template>
