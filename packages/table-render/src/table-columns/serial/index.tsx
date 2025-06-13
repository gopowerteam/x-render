import type { EventEmits } from '../../hooks'
import type { DataRecord, TableColumnOptions } from '../../interfaces'
import { createColumnRender } from '../../utils'

export interface SerialColumnOptions<T> {
  color?: string | ((record: T) => string)
  weight?: 'bold' | 'normal' | 'lighter' | 'bolder'
}

export function renderSerialColumn<T = DataRecord>(
  options?: SerialColumnOptions<T>,
) {
  const render = (record: T, column: TableColumnOptions<T>, ctx?: {
    previewing?: boolean
    emits?: EventEmits
    rowIndex?: number
  }) => {
    const style = {
      color: typeof options?.color === 'function' ? options.color(record) : options?.color,
      fontWeight: options?.weight || 'normal',
      textAlign: 'center' as const,
    }
    return (
      <div style={style}>
        {ctx!.rowIndex! + 1}
      </div>
    )
  }

  return createColumnRender<T>('serial', render, {
    disableViewMode: true,
  })
}
