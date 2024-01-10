import { type TreeFieldNames, type TreeNodeData, TreeSelect } from '@arco-design/web-vue'
import { type ComponentPublicInstance, ref } from 'vue'
import type { DataRecord, FormItemOptions } from '../../interfaces'
import { isPromise } from '../../utils/is-promise'

const cache_value = new WeakSet()
const cache_update = new WeakMap()

export function renderTreeSelectItem<T=DataRecord>(options: RenderTreeSelectItemOptions) {
  let selectInstance: ComponentPublicInstance
  let mounted = false
  const selectOptions = ref<TreeNodeData[]>([])

  const updateSelectOptions = (data: TreeNodeData[]) => {
    if (options.cache !== false) {
      const update = cache_update.get(options.options)
      update(data)
    }
    else {
      selectOptions.value = data
    }
  }

  if (options.cache !== false) {
    cache_update.set(options.options, (value: TreeNodeData[]) => {
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

      const value: Promise<TreeNodeData[]> | TreeNodeData[] = (options.options as Function)()

      if (isPromise(value)) {
        (value as Promise<TreeNodeData[]>).then(updateSelectOptions)
      }
      else {
        updateSelectOptions(value as TreeNodeData[])
      }
      break
    }
    case isPromise(options.options): {
      (options.options as Promise<TreeNodeData[]>).then(data => (selectOptions.value = data))
      break
    }
    default:{
      selectOptions.value = options.options as TreeNodeData[]
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
  | TreeNodeData[]
  | (() => TreeNodeData[])
  | Promise<TreeNodeData[]>
  | (() => Promise<TreeNodeData[]>)
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
