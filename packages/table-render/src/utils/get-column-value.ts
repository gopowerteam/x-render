import type { TableColumnOptions } from '../interfaces'

/**
 * 获取列值
 * @param record 数据记录
 * @param column 列配置
 * @returns 列值
 */
export function getColumnValue<T>(
  record: T,
  column: TableColumnOptions<T>,
): any {
  if (column.index) {
    return column.index.split('.').reduce<any>((r, i) => r?.[i], record)
  }
  else {
    return [column.key].reduce<any>((r, i) => r?.[i], record)
  }
}
