import type { DataRecord, TableColumnOptions } from '../../interfaces'
import { createColumnRender, getColumnValue } from '../../utils'

type CurrencyUnit = '分' | '元' | '万'
export interface CurrencyColumnOptions {
  prefix?: string | (() => JSX.Element)
  suffix?: string | (() => JSX.Element)
  precision?: number
  inputUnit?: CurrencyUnit
  outputUnit?: CurrencyUnit
  thousands?: boolean
  zeroString?: string // 当值为0时，是否使用字符串代替
  nullString?: string
}

const defaultOptions: Partial<CurrencyColumnOptions> = {
  thousands: true,
  inputUnit: '元',
  outputUnit: '元',
}

const unitMaps = {
  分: 10 ** 0,
  元: 10 ** 2,
  万: 10 ** 6,
}

export function renderCurrencyColumn<T = DataRecord>(
  options?: CurrencyColumnOptions,
) {
  options = { ...defaultOptions, ...(options || {}) }

  const transformToOutputUnit = (value?: number) => {
    if (value === null || value === undefined) {
      return
    }

    if (options?.inputUnit === options?.outputUnit) {
      return value
    }

    const scale = unitMaps[options!.inputUnit!] / unitMaps[options!.outputUnit!]
    const data = parseFloat((value * scale).toFixed(10))
    return options?.precision === undefined ? data : data.toFixed(options?.precision)
  }

  const toThousands = (value?: string | number) => {
    if (value === null || value === undefined) {
      return
    }

    const values = value.toString().split('.')
    values[0] = values[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return values.join('.')
  }

  // 千分位显示
  const formatter = (value: string | number) => {
    if (options?.zeroString !== undefined && Number(value) === 0) {
      return options?.zeroString
    }

    if (options?.nullString !== undefined && isNaN(Number(value))) {
      return options?.nullString
    }

    const data = transformToOutputUnit(Number(value))
    return options?.thousands ? toThousands(data) : data
  }

  const render = (record: T, column: TableColumnOptions<T>) => {
    const value = getColumnValue(record, column)

    return (
      <div>
        {
        typeof options?.prefix === 'string'
          ? (<span>{options.prefix}</span>)
          : typeof options?.prefix === 'function'
            ? (<span>{options.prefix()}</span>)
            : undefined
        }
        <span class="currency_value">
          {formatter(value)}
        </span>
        {
        typeof options?.suffix === 'string'
          ? (<span>{options.suffix}</span>)
          : typeof options?.suffix === 'function'
            ? (<span>{options.suffix()}</span>)
            : undefined
        }
      </div>
    )
  }

  return createColumnRender<T>('dict', render)
}
