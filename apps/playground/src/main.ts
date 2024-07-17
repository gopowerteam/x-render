import { createApp } from 'vue'
import './style.css'
import * as VueRouter from 'vue-router'
import ArcoVue from '@arco-design/web-vue'
import App from './App.vue'
import '@arco-design/web-vue/dist/arco.less'
import '@arco-themes/vue-tuboshi/index.less'
import '@gopowerteam/modal-render/dist/style.css'
import '@gopowerteam/form-render/dist/style.css'
import '@gopowerteam/table-render/dist/style.css'

import Modal from './views/modal.vue'
import Form from './views/form.vue'
import Table from './views/table.vue'

const routes = [
  { path: '/form', component: Form },
  { path: '/modal', component: Modal },
  { path: '/table', component: Table },
  { path: '/form', component: Form },
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
})

createApp(App).use(router).use(ArcoVue).mount('#app')
