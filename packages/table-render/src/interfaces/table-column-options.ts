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

/**
 * 列配置
 */
export interface TableColumnOptions<T> {
  key: string
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
  treeNode?: boolean
  visiable?: boolean | (() => boolean)
  extraProps?: Partial<Omit<TableColumnData, 'dataIndex' | 'title' | 'fixed' | 'align' | 'width'>>

}

export interface ExportColumnOptions {
  header?: string
  width?: number
  content?: (record: DataRecord) => string | number | undefined
}

// 列配置
export type TableColumnsOptions<T = DataRecord> = TableColumnOptions<T>[]

// Formatter格式化
export type DataFormatter<T> = (record: T) => string | number | Date | undefined
