import type { TableColumnRenderResult } from '../interfaces'

export const RenderColumnType = Symbol.for('RenderColumnType')

export function createColumnRender<T>(
  type: string,
  render: TableColumnRenderResult<T>,
  options?: {
    disableColumnMode?: boolean
    disableViewMode?: boolean
    showOverflow?: boolean
  },
): TableColumnRenderResult<T> {
  render.$type = type
  render.$disableColumnMode = options?.disableColumnMode
  render.$disableViewMode = options?.disableViewMode

  return render
}
