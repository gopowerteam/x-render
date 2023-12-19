import { type TreeFieldNames, type TreeNodeData, TreeSelect } from '@arco-design/web-vue'
import { type ComponentPublicInstance, ref } from 'vue'
import type { DataRecord, FormItemOptions } from '../../interfaces'
import { isPromise } from '../../utils/is-promise'

const cache = new WeakMap()

export function renderTreeSelectItem<T=DataRecord>(options: RenderTreeSelectItemOptions) {
  let selectInstance: ComponentPublicInstance
  let mounted = false
  const selectOptions = ref<TreeNodeData[]>([])

  const updateSelectOptions = (data: TreeNodeData[]) => {
    selectOptions.value = data

    if (options.cache !== false) {
      cache.set(options.options, data)
    }
  }

  switch (true) {
    case options.options instanceof Function:{
      if (cache.has(options.options)) {
        selectOptions.value = cache.get(options.options)
        break
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
