export interface DataRecord { [key: string]: any }
export interface DataProp { [key: string]: any }

/**
 * 分页接口
 */
export interface PageService {
  page: number
  size: number
}

/**
 * 数据加载参数
 */
export interface TableLoadParams {
  form: DataRecord
  page?: PageService
  update: (data: DataRecord[]) => void
}
