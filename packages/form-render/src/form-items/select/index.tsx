import { Option, Select } from '@arco-design/web-vue'
import { type ComponentPublicInstance, ref } from 'vue'
import type { DataRecord, FormItemOptions } from '../../interfaces'
import { isPromise } from '../../utils/is-promise'

const cache_value = new WeakSet()
const cache_update = new WeakMap()

export function renderSelectItem<T=DataRecord>(options: RenderSelectItemOptions) {
  let selectInstance: ComponentPublicInstance
  let mounted = false

  const selectOptions = ref<SelectOptions>(new Map())

  const updateSelectOptions = (data: SelectOptions) => {
    if (options.cache !== false) {
      const update = cache_update.get(options.options)
      update(data)
    }
    else {
      selectOptions.value = data
    }
  }

  if (options.cache !== false) {
    cache_update.set(options.options, (value: SelectOptions) => {
      selectOptions.value = value
    })
  }

  switch (true) {
    case options.options instanceof Function:{
      if (options.cache !== false && cache_value.has(options.options)) {
        break
      }

      if (options.cache !== false) {
        cache_value.add(options.options)
      }

      const value: Promise<SelectOptions> | SelectOptions = (options.options as Function)()

      if (isPromise(value)) {
        (value as Promise<SelectOptions>).then(updateSelectOptions)
      }
      else {
        updateSelectOptions(value as SelectOptions)
      }
      break
    }
    case isPromise(options.options): {
      (options.options as Promise<SelectOptions>).then(data => (selectOptions.value = data))
      break
    }
    default:{
      selectOptions.value = options.options as SelectOptions
    }
  }

  function onSelectChange() {
    if (!options.autoSumbit || !selectInstance) {
      return
    }

    let parent: ComponentPublicInstance | null = selectInstance

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
    if (options.default && !mounted) {
      data[form.key as keyof T] = options.default as any
      mounted = true
    }

    return (
      <Select
        ref={instance => selectInstance = (instance as ComponentPublicInstance)}
        multiple={options.multiple}
        v-model={data[form.key as keyof T]}
        placeholder={options.placeholder}
        allowClear={options.clearable}
        allowSearch={options.searchable}
        maxTagCount={options.maxTagCount ?? 2}
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
  // 可搜索
  searchable?: boolean
  // select options列表
  options:
  | SelectOptions
  | (() => SelectOptions)
  | Promise<SelectOptions>
  | (() => Promise<SelectOptions>)
  // 多选支持
  multiple?: boolean
  // 最大标签数量
  maxTagCount?: number
  // 默认值
  default?: string | number | boolean
  // 自动提交
  autoSumbit?: boolean
  // 开启缓存
  cache?: boolean
}
