import dayjs from 'dayjs'
import type { DataRecord, TableColumnOptions } from '../../interfaces'
import 'dayjs/locale/zh-cn'
import { createColumnRender, getColumnValue } from '../../utils'

dayjs.locale('zh-cn')

export interface DateColumnOptions {
  format?: keyof typeof dateFormats | (() => string)
}

const dateFormats = {
  date: 'YYYY-MM-DD',
  datetime: 'YYYY-MM-DD HH:mm:ss',
  time: 'HH:mm:ss',
  week: 'ddd',
}

/**
 * 渲染Date Column
 * @param options DateColumn列选项
 * @returns JSX
 */
export function renderDateColumn<T = DataRecord>(
  options?: DateColumnOptions,
) {
  const render = (record: T, column: TableColumnOptions<T>) => {
    const value = getColumnValue<T>(record, column)
    const formatStr
      = typeof options?.format === 'function'
        ? options?.format()
        : dateFormats[options?.format || 'datetime']

    const date = dayjs(value)

    return <span>{date.isValid() && date.format(formatStr)}</span>
  }

  return createColumnRender<T>('date', render)
}
