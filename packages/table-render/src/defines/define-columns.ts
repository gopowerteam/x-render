import type { DataRecord, TableColumnsOptions, TableColumnsStringKeyOptions, TableColumnsTypeKeyOptions } from '../interfaces'

export function defineColumns<T = DataRecord>(columns: TableColumnsTypeKeyOptions<T>): TableColumnsOptions<T>
export function defineColumns<T = DataRecord>(columns: TableColumnsStringKeyOptions<T>): TableColumnsOptions<T>
export function defineColumns<T = DataRecord>(columns: TableColumnsOptions<T>): TableColumnsOptions<T> {
  return columns
}
