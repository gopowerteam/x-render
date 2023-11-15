import { Switch } from '@arco-design/web-vue'
import type { DataRecord, FormItemOptions } from '../../interfaces'

export function renderSwitchItem<T=DataRecord>(options?: RenderSwitchItemOptions) {
  // const events = useEvents(inject<string>('id'))
  function onChange() {
    if (options?.autoSumbit) {
      // events.emit('reload')
    }
  }

  return (data: T, form: FormItemOptions) => {
    // 设置默认值
    if (options?.default) {
      data[form.key as keyof T] = options.default as any
    }

    return (
      <Switch
        v-model={data[form.key as keyof T]}
        checkedText={options?.openLabel ?? '是'}
        uncheckedText={options?.closeLabel ?? '否'}
        checkedValue={options?.openValue ?? true}
        uncheckedValue={options?.closeValue ?? false}
        onChange={onChange}></Switch>
    )
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
