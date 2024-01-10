import { Option, Select } from '@arco-design/web-vue'
import { type ComponentPublicInstance, ref } from 'vue'
import type { DataRecord, FormItemOptions } from '../../interfaces'

const cache = new Map()

export function renderSelectItem<T=DataRecord>(options: RenderSelectItemOptions) {
  let selectInstance: ComponentPublicInstance
  let mounted = false

  const selectOptions = ref<SelectOptions>(new Map())

  const onSelectChange = () => {
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

  const execUpdateSelectOptions = async () => {
    const value: SelectOptions = await (options.options as Function)()

    if (options.cache !== false && cache.has(options.options)) {
      const update = cache.get(options.options)
      typeof update === 'function' && update(value)
      cache.delete(options.options)
    }
    else {
      selectOptions.value = value
    }
  }

  switch (true) {
    case options.options instanceof Function:{
      if (options.cache !== false && cache.has(options.options)) {
        break
      }

      execUpdateSelectOptions()

      if (options.cache !== false) {
        cache.set(options.options, (value: SelectOptions) => {
          selectOptions.value = value
        })
      }
      break
    }
    default:{
      selectOptions.value = options.options as SelectOptions
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
