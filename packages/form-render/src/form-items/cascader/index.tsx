import { Cascader, type CascaderOption } from '@arco-design/web-vue'
import { type ComponentPublicInstance, type Ref, isRef, ref } from 'vue'
import { watchOnce } from '@vueuse/core'
import type { DataRecord, FormItemOptions } from '../../interfaces'

const cache = new WeakMap()

function useSelectOptions(): [Ref<SelectOptions>, (value: SelectOptions) => void] {
  const selectOptions = ref<SelectOptions>([])
  const updateSelectOptions = (value: SelectOptions) => selectOptions.value = value

  return [selectOptions, updateSelectOptions]
}

export function renderCascaderItem<T=DataRecord>(options: RenderCascaderItemOptions) {
  let selectInstance: ComponentPublicInstance
  let mounted = false

  const [selectOptions, updateSelectOptions] = useSelectOptions()

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
      watchOnce(options.options, () => {
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

    return (
      <Cascader
        ref={instance => selectInstance = (instance as ComponentPublicInstance)}
        multiple={options.multiple}
        v-model={data[form.key as keyof T]}
        placeholder={options.placeholder}
        allowClear={options.clearable}
        allowSearch={options.searchable}
        maxTagCount={options.maxTagCount ?? 2}
        onChange={onSelectChange}
        options={selectOptions.value}>
      </Cascader>
    )
  }
}

export type SelectOptions = CascaderOption[]

export interface RenderCascaderItemOptions {
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
}
