import type { DataRecord, TableColumnOptions } from '../../interfaces'
import { createColumnRender, getColumnValue } from '../../utils'

const DEFAULT_SPARATOR = ' '

export interface PhoneColumnOptions {
  // 安全模式 - 数据脱敏
  safe?: boolean
  // 设置显示分隔符
  separator?: string
  // 是否可呼叫
  callable?: boolean
}

/**
 * 加密文本
 * @param value
 * @returns
 */
function encryptText(value: string) {
  return value?.replace(/(\d{3})\d*(\d{4})/g, '$1****$2')
}

/**
 * 获取格式化值
 * @param value
 * @param separator
 * @returns
 */
function formatText(value: string, separator?: string) {
  return value
    ?.replace(/\*/g, 'M')
    .replace(/\B(?=(?:\S{4})+$)/g, separator ?? DEFAULT_SPARATOR)
    .replace(/M/g, '*')
}

export function renderPhoneColumn<T = DataRecord>(
  options?: PhoneColumnOptions,
) {
  const render = (record: T, column: TableColumnOptions<T>) => {
    const phone = getColumnValue(record, column)
    const value = formatText(
      options?.safe ? encryptText(phone) : phone,
      options?.separator,
    )

    if (options?.callable) {
      return (
        <a
          style="text-decoration:none;"
          href={`tel:${phone}`}>
          {value}
        </a>
      )
    }
    else {
      return <span>{value}</span>
    }
  }

  return createColumnRender<T>('phone', render)
}
