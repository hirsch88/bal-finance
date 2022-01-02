<script setup lang="ts">
import { computed, defineProps } from 'vue'
import { formatMoney } from '../utils/currency'

const props = defineProps({
  value: {
    type: Number,
    required: true,
  },
  minus: {
    type: Boolean,
    default: false,
  },
})

const money = computed(() => (props.minus ? props.value * -1 : props.value))
</script>

<template>
  <strong
    :class="{
      'has-radius-large': !props.minus,
      'py-1 px-2': !props.minus,
      'has-text-success-dark': !props.minus,
      'has-background-success-light': !props.minus,
    }"
    >{{ formatMoney(money) }}</strong
  >
</template>
