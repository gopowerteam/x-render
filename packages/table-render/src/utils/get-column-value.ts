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
  return (column.index || column.key)
    .split('.')
    .reduce<any>((r, i) => r?.[i], record)
}
