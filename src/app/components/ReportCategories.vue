<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue'
import {
  BalHeading,
  BalList,
  BalListItem,
  BalListItemContent,
  BalListItemTitle,
  BalListItemIcon,
} from '@baloise/design-system-components-vue'
import { paymentsStore } from '@/app/store/payments.store'
import Category from '@/app/components/Category.vue'
import { CategoryValue, PaymentCategory } from '@/types'
import Money from './Money.vue'

const categoryValues = ref<CategoryValue[]>([])

const updateCategoryValues = () => {
  const d = paymentsStore.getData()
  categoryValues.value = paymentsStore
    .getCategories()
    .map((c, i) => ({ name: c, amount: d[i] }))
    .sort((a, b) => {
      if (a.amount === b.amount) {
        return 0
      }
      if (a.amount > b.amount) {
        return -1
      }
      return 1
    })
}

const onSelect = (category: PaymentCategory) => {
  if (paymentsStore.getState().selectedCategory === category) {
    paymentsStore.selectCategory('All')
  } else {
    paymentsStore.selectCategory(category)
  }
}

onMounted(() => {
  updateCategoryValues()
})

watchEffect(() => {
  updateCategoryValues()
})
</script>

<template>
  <BalHeading level="h4" space="none" class="mt-3 mb-1 ml-3 mr-3 mb-0 p-0">
    Categories
  </BalHeading>
  <BalHeading subtitle level="h5" space="bottom" class="mb-3 ml-3 mr-3 p-0">
    Select a categories to filter the payments below.
  </BalHeading>
  <BalList :border="true" class="p-0 m-0">
    <BalListItem
      v-for="cat in categoryValues"
      :key="cat.name"
      :selected="paymentsStore.getState().selectedCategory === cat.name"
      @click="onSelect(cat.name)"
    >
      <BalListItemIcon class="ml-1">
        <Category :value="cat.name"></Category>
      </BalListItemIcon>
      <BalListItemContent>
        <BalListItemTitle>
          <div class="is-flex pl-3 pr-3">
            <div class="is-flex-grow-1">
              {{ cat.name }}
            </div>
            <div>
              <Money :value="cat.amount" :minus="true"></Money>
            </div>
          </div>
        </BalListItemTitle>
      </BalListItemContent>
    </BalListItem>
  </BalList>
</template>
