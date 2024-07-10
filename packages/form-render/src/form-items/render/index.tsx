import type { DataRecord, FormItemOptions, FormItemRenderReturn } from '../../interfaces'

export function renderRenderItem<T=DataRecord>(renderer: RenderInputItemOptions<T>): FormItemRenderReturn<T> {
  return (data: T, form: FormItemOptions<T>) => {
    return renderer(data, form)
  }
}

export interface RenderInputItemOptions<T> {
  (record: T, form?: FormItemOptions<T>): JSX.Element
}
