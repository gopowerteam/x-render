import type { DataRecord, TableColumnOptions } from '../interfaces'

/**
 * 设置列值
 * @param record 数据记录
 * @param column 列配置
 * @param value 要设置的值
 */
export function setColumnValue<T = DataRecord>(
  record: DataRecord,
  column: TableColumnOptions<T>,
  value: any,
): any {
  const [key, ...rest] = column.index
    ? column.index.split('.').reverse()
    : [column.key]
  const props = rest.reverse().reduce((r, i) => r?.[i as any], record)

  props[key as string | number] = value
}
