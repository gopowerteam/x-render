import type { DataRecord, TableColumnOptions } from '../../interfaces'
import { createColumnRender, getColumnValue } from '../../utils'

export interface TagColumnOptions<T> {
  textColors?: string[] | ((tag: any, index: number) => string)
  backgroundColors?: string[] | ((tag: any, index: number) => string)
  border?: boolean
  radius?: number
  maxCount?: number
  minWidth?: number
  formatter?: (record: T) => string[]
}

export function renderTagColumn<T = DataRecord>(
  options?: TagColumnOptions<T>,
) {
  const render = (record: T, column: TableColumnOptions<T>) => {
    const maxCount = options?.maxCount || 5
    const value = options?.formatter ? options.formatter(record) : getColumnValue(record, column)
    const textColors = options?.textColors || ['#F87335']
    const backgroundColor = options?.backgroundColors || ['#FFF4E8']
    const isMoreThanMax = value.length > maxCount
    const minWidth = options?.minWidth

    return (
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {value.slice(0, maxCount).map((v: string, i: number) => {
          const textColor = typeof textColors === 'function'
            ? textColors(v, i)
            : textColors[i % textColors.length]

          const bgColor = typeof backgroundColor === 'function'
            ? backgroundColor(v, i)
            : backgroundColor[i % backgroundColor.length]

          return (
            <span
              style={{
                minWidth: minWidth ? `${minWidth}px` : 'unset',
                textAlign: 'center',
                margin: '2px',
                padding: '2px 5px',
                border: `solid 2px ${options?.border ? textColor : 'transparent'}`,
                borderRadius: `${options?.radius || 0}px`,
                color: textColor,
                backgroundColor: bgColor,
              }}>
            {v}
            </span>
          )
        })}
        {isMoreThanMax && '...'}
      </div>
    )
  }

  return createColumnRender<T>('tag', render)
}
