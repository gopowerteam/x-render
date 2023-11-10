import type { DataRecord, TableColumnOptions } from '../../interfaces'
import { createColumnRender, getColumnValue } from '../../utils'
import { toPx } from '../../utils/to-px'

export type TextColumnOptions<T> = TextColumnObjectOptions<T> | TextColumnFunctionOptions<T>

export interface TextColumnObjectOptions<T> {
  color?: string | ((record: T) => string)
  content?: string | ((record: T) => string | number | undefined)
  size?: string | number | ((record: T) => string | number)
}

export interface TextColumnFunctionOptions<T> {
  (record: T): string | number | undefined
}

function generateText<T>(
  options: TextColumnOptions<T>,
  column: TableColumnOptions<T>,
  record: T,
) {
  if (typeof options === 'function') {
    return options(record)?.toString()
  }

  if (typeof options?.content === 'function') {
    return options?.content(record)?.toString()
  }

  if (typeof options?.content === 'string') {
    return options?.content
  }

  return getColumnValue(record, column)
}

function generatColor<T>(options: TextColumnOptions<T>, record: T) {
  if (typeof options === 'function') {
    return
  }

  if (typeof options?.color === 'function') {
    return options?.color(record)
  }

  if (typeof options?.color === 'string') {
    return options?.color
  }
}

function generatSize<T>(options: TextColumnOptions<T>, record: T) {
  if (typeof options === 'function') {
    return
  }

  if (typeof options?.size === 'function') {
    return toPx(options?.size(record))
  }
  else {
    return toPx(options?.size)
  }
}

function generateStyle<T>(options: TextColumnOptions<T>, record: T) {
  let style = ''

  const color = generatColor(options, record)
  const size = generatSize(options, record)

  if (color) {
    style += `color:${color};`
  }

  if (size) {
    style += `font-size:${size};`
  }

  return style
}

export function renderTextColumn<T = DataRecord>(
  options?: TextColumnOptions<T>,
) {
  const render = (record: T, column: TableColumnOptions<T>) => {
    const text = generateText(options || {}, column, record)
    const style = generateStyle(options || {}, record)

    return <span style={style}>{text}</span>
  }

  return createColumnRender<T>('text', render)
}
