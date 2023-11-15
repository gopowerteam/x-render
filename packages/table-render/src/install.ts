import type { Plugin } from 'vue'
import { TableRender } from './table-render'

interface TableRenderOptions {
  //
}

export default {
  install(app, _options?: TableRenderOptions) {
    app.component('TableRender', TableRender)
  },
} as Plugin
