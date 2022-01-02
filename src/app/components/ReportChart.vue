<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { paymentsStore } from '@/app/store/payments.store'
import { useChart } from '@/app/composables/chart'
import { outgoings } from '../utils/payment'
import Money from './Money.vue'

const canvasElement = ref<HTMLCanvasElement | null>(null)

const { updateChart } = useChart({
  ctx: () => canvasElement.value as HTMLCanvasElement,
  labels: () => paymentsStore.getCategories(),
  data: () => paymentsStore.getData(),
})

const outgoingTotal = computed(() =>
  outgoings(paymentsStore.getState().selectedPayments).reduce(
    (acc, payment) => acc + payment.amount,
    0,
  ),
)

watch(paymentsStore.getState(), () => updateChart())
</script>

<template>
  <div style="position: relative">
    <canvas ref="canvasElement"></canvas>
    <div
      style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      "
      class="has-text-centered"
    >
      <Money
        class="is-size-2 title has-text-hint"
        :value="outgoingTotal"
        :minus="true"
      ></Money>
      <p class="is-size-4 subtitle has-text-hint mt-2">Outgoings</p>
    </div>
  </div>
</template>
