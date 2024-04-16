// import type { getTableColumnRenders } from '../table-columns'
import type { EventEmits } from '../hooks'
import type { TableColumnRenders } from '../table-columns'
import type { TableColumnOptions } from './table-column-options'

interface TableColumnRenderResultType {
  $type?: string
  $disableColumnMode?: boolean
  $disableViewMode?: boolean
}
export interface TableColumnRenderResult<T>
  extends TableColumnRenderResultType {
  (
    record: T,
    columnOptions: TableColumnOptions<T>,
    ctx?: {
      previewing?: boolean
      emits?: EventEmits
    }
  ): JSX.Element | any
}
/**
 * Render函数
 */
export interface TableColumnRender<T> {
  (render: TableColumnRenderFun<T>): TableColumnRenderResult<T>
}

/**
 * Render函数模板
 */
type TableColumnRenderFun<T> = ReturnType<typeof TableColumnRenders<T>> & {
  [key: string]: any
}
