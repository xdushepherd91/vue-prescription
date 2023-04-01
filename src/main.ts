import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
//theme
import "primevue/resources/themes/lara-light-indigo/theme.css"     
    
//core
import "primevue/resources/primevue.min.css"

//icons
import "primeicons/primeicons.css"

import App from './App.vue'
import router from './router'

import './assets/main.css'
import print from 'print-js'

import 'print-js/dist/print.css'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'




const app = createApp(App)

app.use(PrimeVue)
app.use(createPinia())
app.use(router)
app.config.globalProperties.$print = print
app.use(ConfirmationService)
app.use(ToastService);

app.mount('#app')
