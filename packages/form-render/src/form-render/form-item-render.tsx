import { FormItem } from '@arco-design/web-vue'
import { h } from 'vue'
import type { DataRecord, FormItemOptions } from '../interfaces'
import { FormItemRenders as renders } from '../form-items'
/**
 * 生成Render模板
 * @param render
 * @returns
 */
function toRenderTemplate(source: DataRecord, options: FormItemOptions) {
  if (!options.render) {
    options.render = r => r.input()
  }

  // 获取渲染模板
  const templateRender = options.render({
    ...renders(),
  })

  // 获取deault slot
  return {
    default: () => templateRender(source, options),
  }
}

/**
 * 创建表格列
 * @param options
 * @returns
 */
export function renderFormItem(source: DataRecord, options: FormItemOptions) {
  return h(
    FormItem,
    {
      field: options.key,
      label: options.title,
      hideLabel: options.hideLabel,
      labelColStyle: options.labelStyle,
      wrapperColStyle: options.contentStyle,
    },

    toRenderTemplate(source, options),
  )
}
