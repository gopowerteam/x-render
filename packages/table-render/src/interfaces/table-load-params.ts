import type { RequestPlugin } from '@gopowerteam/request'
import type { SortableOptions } from './sortable-options'
import type { PageableOptions } from './pageable-options'

export interface DataRecord { [key: string]: any }
export interface DataProp { [key: string]: any }

/**
 * 数据加载参数
 */
export interface TableLoadParams {
  form: DataRecord
  page?: (RequestPlugin & PageableOptions)
  sort?: (RequestPlugin & SortableOptions)
  update: (data: DataRecord[]) => void
}
