<script setup lang="ts">
import { BalFileUpload } from '@baloise/design-system-components-vue'
import { ipcRenderer } from 'electron'

const onFileChange = (list: File[]) => {
  ipcRenderer.send('open-file-dialog-for-file', list[list.length - 1].path)
}
</script>

<template>
  <BalFileUpload
    accept="text/csv"
    :label="'Drop montly account statements here'"
    :has-file-list="false"
    @bal-change="onFileChange($event)"
  ></BalFileUpload>
</template>
