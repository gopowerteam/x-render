import type { DataRecord } from '../../interfaces'
import { createColumnRender } from '../../utils'

export interface RenderColumnOptions<T> {
  (record: T): JSX.Element
}

export function renderRenderColumn<T = DataRecord>(
  renderer: RenderColumnOptions<T>,
) {
  const render = (record: T) => {
    return renderer(record)
  }

  return createColumnRender<T>('render', render)
}
