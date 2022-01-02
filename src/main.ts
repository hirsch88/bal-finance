import { createApp } from 'vue'
import { BaloiseDesignSystem } from '@baloise/design-system-components-vue'
import './styles/main.scss'
import App from './app/App.vue'
import './registerServiceWorker'
import { PaymentFiles, paymentsStore } from './app/store/payments.store'

createApp(App).use(BaloiseDesignSystem).mount('#app')

import { ipcRenderer } from 'electron'

ipcRenderer.send('init')

ipcRenderer.on('data-is-ready', (event, files) => {
  const paymentFiles: PaymentFiles[] = JSON.parse(files)
  paymentsStore.setPayments(paymentFiles)
  if (paymentFiles && paymentFiles.length > 0) {
    paymentsStore.selectPayments(paymentFiles[0].name)
  }
})
