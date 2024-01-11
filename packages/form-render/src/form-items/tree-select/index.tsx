import { type TreeFieldNames, type TreeNodeData, TreeSelect } from '@arco-design/web-vue'
import { type ComponentPublicInstance, type Ref, isRef, ref } from 'vue'
import { watchOnce } from '@vueuse/core'
import type { DataRecord, FormItemOptions } from '../../interfaces'

const cache = new WeakMap()

function useSelectOptions(): [Ref<SelectOptions>, (value: SelectOptions) => void] {
  const selectOptions = ref<SelectOptions>([])
  const updateSelectOptions = (value: SelectOptions) => selectOptions.value = value

  return [selectOptions, updateSelectOptions]
}
export function renderTreeSelectItem<T=DataRecord>(options: RenderTreeSelectItemOptions) {
  console.log('开始渲染SelectTree:')
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
    console.log('当前缓存值:', value)
    switch (typeof value) {
      // 已经执行未返回
      case 'function':
        console.log('检测到缓存正在请求中')
        console.log('更新缓存')
        cache.set(options.options, updateSelectOptions)
        return
      // 已经执行已返回
      case 'object':
        console.log('检测到缓存数据完成')
        updateSelectOptions(value)
        return
    }
    // 缓存执行

    console.log('未检测到缓存开始进行请求')
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
        console.log('缓存开启')
        updateSelectOptionsFromCache()
      }
      else {
        console.log('缓存关闭')
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

  function filterTreeNode(searchValue: string, nodeData: TreeNodeData) {
    const key = options.fieldNames?.title || 'title'

    const title = nodeData[key as keyof TreeNodeData] as string

    if (title) {
      return title.toLowerCase().includes(searchValue.toLowerCase())
    }
    else {
      return false
    }
  }

  return (data: T, form: FormItemOptions<T>) => {
    // 设置默认值
    if (options.default && !mounted) {
      data[form.key as keyof T] = options.default as any
      mounted = true
    }

    return (
      <TreeSelect
        ref={instance => selectInstance = (instance as ComponentPublicInstance)}
        multiple={options.multiple}
        v-model={data[form.key as keyof T]}
        placeholder={options.placeholder}
        allowClear={options.clearable}
        allowSearch={options.searchable}
        maxTagCount={options.maxTagCount ?? 2}
        onChange={onSelectChange}
        filterTreeNode={filterTreeNode}
        data={selectOptions.value}
        fieldNames={options.fieldNames}>
      </TreeSelect>
    )
  }
}

export type SelectOptions = TreeNodeData[]
export interface RenderTreeSelectItemOptions {
  // 占位符
  placeholder?: string
  // 可清楚
  clearable?: boolean
  // 可搜索
  searchable?: boolean
  // 字段配置
  fieldNames?: TreeFieldNames
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
