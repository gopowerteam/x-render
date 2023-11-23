import type { FormItemOptions, FormItemsOptions } from '@gopowerteam/form-render'
import type { TableColumnsOptions } from '../interfaces'

export function createTableForm(columns: TableColumnsOptions): FormItemsOptions {
  return columns
    .filter(column => column.form)
    .map((column) => {
      const formItemOptions: FormItemOptions = {
        key: column.key as string,
        title: column.title,
        ...(typeof column.form === 'boolean' ? {} : column.form),
      }

      return formItemOptions
    })
}
