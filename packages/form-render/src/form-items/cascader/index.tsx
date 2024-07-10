import { Cascader, type CascaderOption } from '@arco-design/web-vue'
import { type ComponentPublicInstance, type Ref, isRef, ref } from 'vue'
import { watchOnce } from '@vueuse/core'
import type { DataRecord, FormItemOptions, FormItemRenderReturn } from '../../interfaces'
import { findTreePathByKey, findTreePathByKeyPath } from '../../utils/tree'

const cache = new WeakMap()

function useSelectOptions(): [Ref<SelectOptions>, (value: SelectOptions) => void] {
  const selectOptions = ref<SelectOptions>([])
  const updateSelectOptions = (value: SelectOptions) => selectOptions.value = value

  return [selectOptions, updateSelectOptions]
}

export function renderCascaderItem<T=DataRecord>(options: RenderCascaderItemOptions): FormItemRenderReturn<T> {
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
      watchOnce(options.options as Ref<SelectOptions>, () => {
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

      const findPathByKey = (key: string) => {
        const items = findTreePathByKey({
          data: selectOptions.value,
          labelProp: 'label',
          valueProp: 'value',
          key,
        })

        return items.map(x => x.label).join('/')
      }

      const findPathByPath = (path: string[]) => {
        const items = findTreePathByKeyPath({
          data: selectOptions.value,
          labelProp: 'label',
          valueProp: 'value',
          path,
        })

        return items.map(x => x.label).join('/')
      }

      switch (true) {
        case !options.pathMode && !options.multiple:{
          const labelPath = findPathByKey(value as string)
          return (<span>{labelPath}</span>)
        }
        case !options.pathMode && options.multiple:{
          const list = (value as string[]).map((key) => {
            return findPathByKey(key)
          })

          return (<span>{list.join(', ')}</span>)
        }
        case options.pathMode && !options.multiple:{
          const labelPath = findPathByPath(value as string[])
          return (<span>{labelPath}</span>)
        }
        case options.pathMode && options.multiple:{
          const list = (value as string[][]).map((key) => {
            return findPathByPath(key)
          })

          return (<span>{list.join(', ')}</span>)
        }
        default:
          return <span></span>
      }
    }

    function renderComponent() {
      return (
        <Cascader
          pathMode={options.pathMode}
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

export type SelectOptions = CascaderOption[]

export interface RenderCascaderItemOptions {
  // 占位符
  placeholder?: string
  // 可清楚
  clearable?: boolean
  // 可搜索
  searchable?: boolean
  // 路径模式
  pathMode?: boolean
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
