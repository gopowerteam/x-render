import ArcoVue from '@arco-design/web-vue'
import { createApp } from 'vue'
import * as VueRouter from 'vue-router'
import App from './App.vue'
import Form from './views/form.vue'
import Modal from './views/modal.vue'
import Table from './views/table.vue'
import Test1 from './views/test1.vue'
import './style.css'
import '@arco-design/web-vue/dist/arco.less'

import '@arco-themes/vue-tuboshi/index.less'
import '@gopowerteam/modal-render/dist/style.css'
import '@gopowerteam/form-render/dist/style.css'
import '@gopowerteam/table-render/dist/style.css'

const routes = [
  { path: '/form', component: Form },
  { path: '/modal', component: Modal },
  { path: '/table', component: Table },
  { path: '/form', component: Form },
  { path: '/test1', component: Test1 },
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
})

createApp(App).use(router).use(ArcoVue).mount('#app')
