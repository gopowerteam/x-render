import type { DataRecord } from '../../interfaces'

export function renderRenderItem(renderer: RenderInputItemOptions) {
  return (data: DataRecord) => {
    return renderer(data)
  }
}

export interface RenderInputItemOptions {
  (record: any): JSX.Element
}
