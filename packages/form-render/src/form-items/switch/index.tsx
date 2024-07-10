import { Switch } from '@arco-design/web-vue'
import type { ComponentPublicInstance } from 'vue'
import type { DataRecord, FormItemOptions, FormItemRenderReturn } from '../../interfaces'

export function renderSwitchItem<T=DataRecord>(options?: RenderSwitchItemOptions): FormItemRenderReturn<T> {
  // const events = useEvents(inject<string>('id'))
  let switchInstance: ComponentPublicInstance

  function onChange() {
    if (!options?.autoSumbit || !switchInstance) {
      return
    }

    let parent: ComponentPublicInstance | null = switchInstance

    while (parent && (parent.$el as HTMLElement).tagName !== 'FORM') {
      parent = parent.$parent
    }

    if (parent && parent.$el) {
      const form = parent.$el as HTMLFormElement
      form.dispatchEvent(new Event('submit'))
    }
  }

  return (data: T, form: FormItemOptions<T>) => {
    // 设置默认值
    if (options?.default) {
      data[form.key as keyof T] = options.default as any
    }

    function renderText() {
      const value = data[form.key as keyof T]

      return (
        <span>{value ? options?.openLabel ?? '是' : options?.closeLabel ?? '否'}</span>
      )
    }

    function renderComponent() {
      return (
        <Switch
          ref={(instance: unknown) => switchInstance = (instance as ComponentPublicInstance)}
          v-model={data[form.key as keyof T]}
          checkedText={options?.openLabel ?? '是'}
          uncheckedText={options?.closeLabel ?? '否'}
          checkedValue={options?.openValue ?? true}
          uncheckedValue={options?.closeValue ?? false}
          onChange={onChange}></Switch>
      )
    }

    switch (form.mode) {
      case 'text':
        return renderText()
      case 'component':
      default:{
        return renderComponent()
      }
    }
  }
}

export type SelectOptions = Map<string | number, string>

export interface RenderSwitchItemOptions {
  // 占位符
  size?: 'small' | 'medium'
  // 打开时文字
  openLabel?: string
  // 关闭时文字
  closeLabel?: string
  // 打开时值
  openValue?: string | number | boolean
  // 关闭时值
  closeValue?: string | number | boolean
  // 默认值
  default?: string | number | boolean
  // 自定更新列表
  autoSumbit?: boolean
}
