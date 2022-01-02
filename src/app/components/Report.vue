<script setup lang="ts">
import { BalCard } from '@baloise/design-system-components-vue'
import ReportHeader from './ReportHeader.vue'
import ReportChart from './ReportChart.vue'
import ReportCategories from './ReportCategories.vue'
import ReportTable from './ReportTable.vue'
</script>

<template>
  <ReportHeader></ReportHeader>
  <div class="columns mt-6">
    <div class="column is-7">
      <ReportChart></ReportChart>
    </div>
    <div class="column is-5">
      <BalCard border flat>
        <ReportCategories></ReportCategories>
      </BalCard>
    </div>
  </div>
  <BalCard class="mt-6" flat border>
    <ReportTable></ReportTable>
  </BalCard>
</template>
