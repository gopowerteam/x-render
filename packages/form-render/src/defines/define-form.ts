import type { DataRecord, FormItemsOptions } from '../interfaces'

export function defineForm<T = DataRecord>(form: FormItemsOptions<T>) {
  return form
}
