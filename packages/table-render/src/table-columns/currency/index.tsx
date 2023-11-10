import type { DataRecord, TableColumnOptions } from '../../interfaces'
import { createColumnRender, getColumnValue } from '../../utils'

export interface CurrencyColumnOptions {
  prefix?: string
  suffix?: string
  precision?: number
  scale?: number
  thousands?: boolean
}

export function renderCurrencyColumn<T = DataRecord>(
  options?: CurrencyColumnOptions,
) {
  const toThousandsStyle = (v: string) =>
    v.replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,')

  const getCurrencyValue = (value: string | number) => {
    return (parseFloat(value.toString()) / (options?.scale || 1)).toFixed(
      options?.precision || 2,
    )
  }

  const render = (record: T, column: TableColumnOptions<T>) => {
    const value = getColumnValue(record, column)

    return (
      <div>
        {options?.prefix !== undefined && <span>{options?.prefix}</span>}
        <span class="currency_value">
          {options?.thousands === false
            ? getCurrencyValue(value)
            : toThousandsStyle(getCurrencyValue(value))}
        </span>
        {options?.suffix !== undefined && <span>{options?.suffix}</span>}
      </div>
    )
  }

  return createColumnRender<T>('dict', render)
}
