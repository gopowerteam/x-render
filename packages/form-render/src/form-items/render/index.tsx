import type { DataRecord, FormItemRenderReturn } from '../../interfaces'

export function renderRenderItem<T=DataRecord>(renderer: RenderInputItemOptions<T>): FormItemRenderReturn<T> {
  return (data: T) => {
    return renderer(data)
  }
}

export interface RenderInputItemOptions<T> {
  (record: T): JSX.Element
}
