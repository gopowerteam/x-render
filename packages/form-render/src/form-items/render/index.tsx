import type { DataRecord } from '../../interfaces'

export function renderRenderItem<T=DataRecord>(renderer: RenderInputItemOptions<T>) {
  return (data: T) => {
    return renderer(data)
  }
}

export interface RenderInputItemOptions<T> {
  (record: T): JSX.Element
}
