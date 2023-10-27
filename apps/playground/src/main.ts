import { createApp } from 'vue'
import './style.css'
import * as VueRouter from 'vue-router'
import ArcoVue from '@arco-design/web-vue'
import App from './App.vue'
import '@arco-design/web-vue/dist/arco.less'
import '@arco-themes/vue-tuboshi/index.less'
import '@gopowerteam/modal-render/dist/style.css'

import Modal from './views/modal.vue'

const routes = [
  { path: '/', component: Modal },
  { path: '/modal', component: Modal },
]

const router = VueRouter.createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: VueRouter.createMemoryHistory(),
  routes, // `routes: routes` 的缩写
})

createApp(App).use(router).use(ArcoVue).mount('#app')
