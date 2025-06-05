import { type TableColumnData, type TableData } from '@arco-design/web-vue'
import type { Ref } from 'vue'
import type { ColumnsGroup, TableColumnOptions, TableColumnSharedOptions, TableColumnsOptions } from '../interfaces'
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

export function renderTableColumns({
  columns,
  columnsOptions,
  columnsGroups,
  pageMode,
  collapsedColumns,
  events,
}: {
  columns: TableColumnsOptions
  columnsOptions: TableColumnSharedOptions | undefined
  columnsGroups: ColumnsGroup[]
  pageMode: 'client' | 'server'
  collapsedColumns: Ref<{ key: string;title: string;collapsed: boolean }[]>
  events: EventEmits
}) {
  const data = columns
    .map(column => ({
      ...columnsOptions || {},
      ...column,
    }))
    .map(column => renderTableColumn(column, pageMode, collapsedColumns, events))
    .filter(Boolean) as TableColumnData[]

  return transformColumnsGroups(data, columnsGroups)
}

function generateColumnsGroup(group: ColumnsGroup, columns: TableColumnData[]) {
  const includes: TableColumnData[] = []
  const generate = (node: ColumnsGroup | ColumnsGroup['children'][number]): any => {
    if ('children' in node) {
      node.children = node.children.map(generate)
    }

    if ('key' in node) {
      const column = columns.find(x =>
        Object.getOwnPropertyDescriptor(x, 'key')?.value === node.key,
      )

      if (column) {
        includes.push(column)
        return column
      }
    }

    return node
  }

  const columnsGroup = generate(group)

  if (includes?.length && columnsGroup) {
    const index = Math.min(...includes.map(x => columns.indexOf(x)))
    // 删除column
    includes.forEach((column) => {
      const index = columns.indexOf(column)
      columns.splice(index, 1)
    })
    // 添加group
    columns.splice(index, 0, columnsGroup)
  }
}

function transformColumnsGroups(columns: TableColumnData[], columnsGroups: ColumnsGroup[] = []): TableColumnData[] {
  columnsGroups.forEach((group) => {
    generateColumnsGroup(group, columns)
  })

  return columns
}

/**
 * 创建表格列
 * @param options
 * @returns
 */
export function renderTableColumn<T>(options: TableColumnOptions<T>, pageMode: 'client' | 'server', collapsedColumns: Ref<{ key: string;title: string;collapsed: boolean }[]>, events: EventEmits): TableColumnData | undefined {
  const { render, disableColumnMode } = toRenderColumn(options, {
    previewing: false,
    emits: events,
  }) || {}

  if (disableColumnMode || options.visiable === false) {
    return
  }

  if (typeof options.visiable === 'function' && options.visiable() === false) {
    return
  }

  if (collapsedColumns.value.find(item => item.key === options.key && item.collapsed === true)) {
    return
  }

  return {
    dataIndex: options.index || options.key as string,
    title: options.title,
    width: options.width === 'auto' ? undefined : options.width,
    align: options.align ?? 'center',
    fixed: options.fixed,
    ellipsis: options.ellipsis ?? true,
    sortable: options.sortable
      ? {
          sorter: pageMode === 'server',
          sortDirections: ['ascend', 'descend'],
          defaultSortOrder: options.sortable === 'asc' ? 'ascend' : 'descend',
        }
      : undefined,
    tooltip: true,
    ...options.extraProps,
    ...{
      key: options.key,
    },
    render: render as any,
  }
}
