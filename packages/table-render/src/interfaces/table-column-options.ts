import type { FormItemOptions } from '@gopowerteam/form-render'
import type { TableColumnData } from '@arco-design/web-vue'
import type { TableColumnRender } from './table-column-render'
import type { DataRecord } from '.'

export interface TableColumnPreviewOptions {
  span?: number
}

export interface TableColumnSharedOptions {
  align?: 'left' | 'right' | 'center'
  width?: number
  ellipsis?: boolean
}

export interface TableFormSharedOptions {
  minWidth?: number
  columns?: number
  collapsedMode?: 'append' | 'dialog'
}

/**
 * 列配置
 */
export interface TableColumnOptions<T> {
  key: string | keyof T
  title: string
  index?: string
  fixed?: 'left' | 'right'
  align?: 'left' | 'right' | 'center'
  width?: number | 'auto'
  render?: TableColumnRender<T>
  form?: boolean | Omit<FormItemOptions, 'key' | 'title'>
  formatter?: DataFormatter<T>
  ellipsis?: boolean
  preview?: TableColumnPreviewOptions
  exportable?: ExportColumnOptions | boolean
  sortable?: 'asc' | 'desc'
  treeNode?: boolean
  visiable?: boolean | (() => boolean)
  extraProps?: Partial<Omit<TableColumnData, 'dataIndex' | 'title' | 'fixed' | 'align' | 'width'>>
}

export interface TableColumnTypeKeyOptions<T> extends TableColumnOptions<T> {
  key: keyof T
}
export interface TableColumnStringKeyOptions<T> extends TableColumnOptions<T> {
  key: string
}

export interface ExportColumnOptions {
  header?: string
  width?: number
  content?: (record: DataRecord) => string | number | undefined
}

// 列配置
export type TableColumnsOptions<T = DataRecord> = TableColumnOptions<T>[]
export type TableColumnsTypeKeyOptions<T = DataRecord> = TableColumnTypeKeyOptions<T>[]
export type TableColumnsStringKeyOptions<T = DataRecord> = TableColumnStringKeyOptions<T>[]
// Formatter格式化
export type DataFormatter<T> = (record: T) => string | number | Date | undefined
