import { type TreeFieldNames, type TreeNodeData, TreeSelect } from '@arco-design/web-vue'
import { type ComponentPublicInstance, type Ref, isRef, ref } from 'vue'
import { watchOnce } from '@vueuse/core'
import type { TreeProps } from '@arco-design/web-vue/es/tree/interface'
import type { DataRecord, FormItemOptions, FormItemRenderReturn } from '../../interfaces'
import { findTreePathByKey } from '../../utils/tree'

const cache = new WeakMap()

function useSelectOptions(): [Ref<SelectOptions>, (value: SelectOptions) => void] {
  const selectOptions = ref<SelectOptions>([])
  const updateSelectOptions = (value: SelectOptions) => selectOptions.value = value

  return [selectOptions, updateSelectOptions]
}
export function renderTreeSelectItem<T=DataRecord>(options: RenderTreeSelectItemOptions): FormItemRenderReturn<T> {
  let selectInstance: ComponentPublicInstance
  let mounted = false

  const [selectOptions, updateSelectOptions] = useSelectOptions()

  const onSelectChange = () => {
    if (!options.autoSubmit || !selectInstance) {
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

    function renderText() {
      const value = data[form.key as keyof T]

      const findPathByKey = (key: string) => {
        const [item] = findTreePathByKey({
          data: selectOptions.value,
          labelProp: 'title',
          valueProp: 'key',
          key,
        }).reverse() || []

        return item?.title
      }

      if (options.multiple) {
        const list = (value as string[]).map((key) => {
          return findPathByKey(key)
        })

        return (<span>{list.join(', ')}</span>)
      }
      else {
        const labelPath = findPathByKey(value as string)
        return (<span>{labelPath}</span>)
      }
    }

    function renderComponent() {
      return (
        <TreeSelect
          ref={(instance: any) => selectInstance = (instance as ComponentPublicInstance)}
          multiple={options.multiple}
          v-model={data[form.key as keyof T]}
          placeholder={options.placeholder}
          allowClear={options.clearable}
          allowSearch={options.searchable}
          maxTagCount={options.maxTagCount ?? 2}
          onChange={onSelectChange}
          filterTreeNode={filterTreeNode}
          data={selectOptions.value}
          fieldNames={options.fieldNames}
          treeProps={options.treeProps}
          treeCheckStrictly={options.treeCheckStrictly}
          treeCheckedStrategy={options.treeCheckedStrategy}
          >
            {{ ...options.slots }}
        </TreeSelect>
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
  autoSubmit?: boolean
  // 开启缓存
  cache?: boolean
  // 默认展开所有
  treeProps?: Partial<TreeProps>
  // 父子节点是否关联
  treeCheckStrictly?: boolean
  // 定制回显方式
  treeCheckedStrategy?: 'all' | 'parent' | 'child'
  // Slots
  slots?: Partial<Record<'trigger' | 'prefix' | 'label' | 'header' | 'loader' | 'empty' | 'footer' | 'tree-slot-extra' | 'tree-slot-title' | 'tree-slot-icon' | 'tree-slot-switcher-icon', (data?: TreeNodeData) => JSX.Element>>
}
