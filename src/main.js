import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import { Quasar, Notify } from 'quasar'
import './style.css'

import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
import App from './App.vue'

createApp(App)
    .use(createPinia())
    .use(Quasar, {
        plugins: {Notify},
        config: { notify: {}}
    })
    .use(router)
    .mount('#app')

