import { type TableColumnData, type TableData } from '@arco-design/web-vue'
import type { TableColumnOptions, TableColumnSharedOptions, TableColumnsOptions } from '../interfaces'
import { TableColumnRenders } from '../table-columns'
import { RenderColumnType } from '../utils'
import type { EventEmits } from '../hooks'

/**
 * 生成Render模板
 * @param render
 * @returns
 */
export function toRenderColumn<T>(
  options?: TableColumnOptions<T>,
  context?: {
    previewing?: boolean
    emits?: EventEmits
  },
) {
  if (!options?.render) {
    return undefined
  }

  // 获取渲染模板
  const templateRender = options.render({
    ...TableColumnRenders(),
    // ...(Table?.$override?.table || {}),
  })

  // 获取deault slot
  return {
    render: ({ record }: { record: TableData }) => templateRender(record as T, options, context),
    [RenderColumnType]: templateRender.$type,
    disableColumnMode: templateRender.$disableColumnMode,
    disableViewMode: templateRender.$disableViewMode,
    isRender: templateRender.$type === 'render',
    type: templateRender.$type,
  }
}

export function renderTableColumns(columns: TableColumnsOptions, columnsOptions: TableColumnSharedOptions | undefined, events: EventEmits) {
  return columns
    .map(column => ({
      ...columnsOptions || {},
      ...column,
    }))
    .map(column => renderTableColumn(column, events))
    .filter(Boolean) as TableColumnData[]
}

/**
 * 创建表格列
 * @param options
 * @returns
 */
export function renderTableColumn<T>(options: TableColumnOptions<T>, events: EventEmits): TableColumnData | undefined {
  const { render, disableColumnMode } = toRenderColumn(options, {
    previewing: false,
    emits: events,
  }) || {}

  if (disableColumnMode || options.visiable === false || (typeof options.visiable === 'function' && options.visiable() === false)) {
    return
  }

  return {
    dataIndex: options.index || options.key,
    title: options.title,
    width: options.width === 'auto' ? undefined : options.width,
    align: options.align ?? 'center',
    fixed: options.fixed,
    ellipsis: options.ellipsis ?? true,
    sortable: options.sortable
      ? {
          sorter: true,
          sortDirections: ['ascend', 'descend'],
          defaultSortOrder: options.sortable === 'asc' ? 'ascend' : 'descend',
        }
      : undefined,
    tooltip: true,
    ...options.extraProps,
    render,
  }
}
