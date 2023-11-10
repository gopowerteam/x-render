import type { DataRecord, TableColumnsOptions } from '../interfaces'

export function defineColumns<T = DataRecord>(columns: TableColumnsOptions<T>) {
  return columns
}
