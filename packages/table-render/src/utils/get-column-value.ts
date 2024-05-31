import type { TableColumnOptions } from '../interfaces'

/**
 * 获取当前
 * @param record
 * @param column
 * @returns
 */
export function getColumnValue<T>(
  record: T,
  column: TableColumnOptions<T>,
): any {
  if (column.index) {
    return column.index
      .split('.')
      .reduce<any>((r, i) => r?.[i], record)
  }
  else {
    return [column.key]
      .reduce<any>((r, i) => r?.[i], record)
  }
}
