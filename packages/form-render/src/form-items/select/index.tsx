import { Option, Select } from '@arco-design/web-vue'
import { type ComponentPublicInstance, type Ref, isRef, ref } from 'vue'
import { watchOnce } from '@vueuse/core'
import type { DataRecord, FormItemOptions, FormItemRenderReturn } from '../../interfaces'

const cache = new WeakMap()

function useSelectOptions(): [Ref<SelectOptions>, (value: SelectOptions) => void] {
  const selectOptions = ref<SelectOptions>(new Map())
  const updateSelectOptions = (value: SelectOptions) => selectOptions.value = value

  return [selectOptions, updateSelectOptions]
}

export function renderSelectItem<T=DataRecord>(options: RenderSelectItemOptions): FormItemRenderReturn<T> {
  let selectInstance: ComponentPublicInstance
  let mounted = false

  const [selectOptions, updateSelectOptions] = useSelectOptions()

  const onSelectChange = (value: string | number | boolean | Record<string, any> | (string | number | boolean | Record<string, any>)[]) => {
    if (options.onChange) {
      options.onChange(value)
    }

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

  const runSelectOptionsFunction = (fun: (() => SelectOptions) | (() => Promise<SelectOptions>), callback: (value: SelectOptions) => void) => {
    const result = fun()

    if (result instanceof Promise) {
      result.then(callback)
    }
    else {
      callback(result)
    }
  }

  const updateSelectOptionsFromCache = async () => {
    const value = cache.get(options.options)

    switch (typeof value) {
      // 已经执行未返回
      case 'function':

        cache.set(options.options, updateSelectOptions)
        return
      // 已经执行已返回
      case 'object':

        updateSelectOptions(value)
        return
    }
    // 缓存执行

    cache.set(options.options, updateSelectOptions)
    // 未执行
    runSelectOptionsFunction(
      options.options as (() => SelectOptions) | (() => Promise<SelectOptions>),
      (value) => {
        const update = cache.get(options.options)
        cache.set(options.options, value)
        update(value)
      },
    )
  }

  const updateSelectOptionsFromData = () => {
    runSelectOptionsFunction(
      options.options as (() => SelectOptions) | (() => Promise<SelectOptions>),
      (value) => {
        updateSelectOptions(value)
      },
    )
  }

  switch (true) {
    case options.options instanceof Function:{
      if (options.cache !== false) {
        updateSelectOptionsFromCache()
      }
      else {
        updateSelectOptionsFromData()
      }
      break
    }
    case isRef(options.options): {
      watchOnce(() => options.options, () => {
        updateSelectOptions((options.options as Ref<SelectOptions>).value)
      }, {
        immediate: true,
      })
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

    function renderText() {
      const value = data[form.key as keyof T]

      if (options.multiple) {
        return (
        <span>{(value as string[]).map(item => selectOptions.value.get(item)).join(' ,')}</span>
        )
      }
      else {
        return (
        <span>{selectOptions.value.get(value as string)}</span>
        )
      }
    }

    function renderComponent() {
      return (
        <Select
          ref={(instance: unknown) => selectInstance = (instance as ComponentPublicInstance)}
          multiple={options.multiple}
          v-model={data[form.key as keyof T]}
          placeholder={options.placeholder}
          allowClear={options.clearable}
          allowSearch={options.searchable}
          allow-create={options.createable}
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

export interface RenderSelectItemOptions {
  // 占位符
  placeholder?: string
  // 可清楚
  clearable?: boolean
  // 可搜索
  searchable?: boolean
  // 可创建
  createable?: boolean
  // select options列表
  options:
  | SelectOptions
  | (() => SelectOptions)
  | (() => Promise<SelectOptions>)
  | Ref<SelectOptions>
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
  // change事件
  onChange?: (value: string | number | boolean | Record<string, any> | (string | number | boolean | Record<string, any>)[]) => void
}
