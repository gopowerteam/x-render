import type { DataRecord, FormItemsOptions, FormItemsStringKeyOptions, FormItemsTypeKeyOptions } from '../interfaces'

export function defineForm<T = DataRecord>(form: FormItemsTypeKeyOptions<T>): FormItemsOptions<T>
export function defineForm<T = DataRecord>(form: FormItemsStringKeyOptions<T>): FormItemsOptions<T>
export function defineForm<T = DataRecord>(form: FormItemsOptions<T>): FormItemsOptions<T> {
  return form
}
