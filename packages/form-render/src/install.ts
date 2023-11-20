import type { Plugin } from 'vue'
import { FormRender } from './form-render'

interface FormRenderOptions {
  //
}

export default {
  install(app, _options?: FormRenderOptions) {
    app.component('FormRender', FormRender)
  },
} as Plugin
