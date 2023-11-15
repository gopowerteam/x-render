import { Option, Select } from '@arco-design/web-vue'
import { ref } from 'vue'
import type { DataRecord, FormItemOptions } from '../../interfaces'
// import { useEvents } from '../../utils/use-events'

export function renderSelectItem<T=DataRecord>(options: RenderSelectItemOptions) {
  // const events = useEvents(inject<string>('id'))

  let mounted = false
  const selectOptions = ref<SelectOptions>(new Map())

  // 获取SelectOptions值
  if (options.options instanceof Function) {
    options.options().then(data => (selectOptions.value = data))
  }
  else if (options.options instanceof Promise) {
    options.options.then(data => (selectOptions.value = data))
  }
  else {
    selectOptions.value = options.options
  }

  function onSelectChange() {
    if (options.autoSumbit) {
      // events.emit('reload')
    }
  }

  return (data: T, form: FormItemOptions<T>) => {
    // 设置默认值
    if (options.default && !mounted) {
      data[form.key as keyof T] = options.default as any
      mounted = true
    }

    return (
      <Select
        multiple={options.multiple}
        v-model={data[form.key as keyof T]}
        placeholder={options.placeholder}
        allowClear={options.clearable}
        maxTagCount={options.maxTagCount || 4}
        onChange={onSelectChange}>
        {Array.from(selectOptions.value.entries()).map(([value, label]) => (
          <Option
            key={value}
            value={value}
            label={label}></Option>
        ))}
      </Select>
    )
  }
}

export type SelectOptions = Map<string | number, string>

export interface RenderSelectItemOptions {
  // 占位符
  placeholder?: string
  // 可清楚
  clearable?: boolean
  // select options列表
  options:
  | SelectOptions
  | Promise<SelectOptions>
  | (() => Promise<SelectOptions>)
  // 多选支持
  multiple?: boolean
  maxTagCount?: number
  // 默认值
  default?: string | number | boolean
  // 自动提交
  autoSumbit?: boolean
}
