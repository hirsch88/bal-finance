<script setup lang="ts">
import { defineProps, PropType } from 'vue'
import { icons } from '@/app/utils/icons'
import { colors } from '@/app/utils/colors'
import { PaymentCategory } from '@/types'

const props = defineProps({
  value: {
    type: String as PropType<PaymentCategory>,
    default: 'Home',
    required: true,
  },
  small: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div
    :style="{
      height: props.small ? '22px' : '32px',
      width: props.small ? '22px' : '32px',
      fill: colors[props.value],
    }"
    v-html="icons[props.value]"
  ></div>
</template>
