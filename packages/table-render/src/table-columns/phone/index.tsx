import { useClipboard } from '@vueuse/core'
import { Message } from '@arco-design/web-vue'
import type { DataRecord, TableColumnOptions } from '../../interfaces'
import { createColumnRender, getColumnValue } from '../../utils'

const DEFAULT_SPARATOR = ' '

export interface PhoneColumnOptions {
  // 安全模式 - 数据脱敏
  safe?: boolean
  // 是否禁用安全模式的hover显示
  noSafeWhenHover?: boolean
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
  const clipboard = useClipboard()
  const render = (record: T, column: TableColumnOptions<T>) => {
    const phone = getColumnValue(record, column)
    const encryptValue = formatText(
      encryptText(phone),
      options?.separator,
    )
    const originValue = formatText(
      phone,
      options?.separator,
    )

    function onMouseenter(event: MouseEvent) {
      if (options?.safe && options.noSafeWhenHover) {
        const target = event.target as HTMLElement
        target.innerText = originValue
      }
    }

    function onMouseleave(event: MouseEvent) {
      if (options?.safe && options.noSafeWhenHover) {
        const target = event.target as HTMLElement
        target.innerText = encryptValue
      }
    }

    function onCopyPhone() {
      clipboard.copy(phone).then(() => {
        Message.success({
          content: '复制成功',
          duration: 1000,
        })
      })
    }

    if (options?.callable) {
      return (
        <a
          style="text-decoration:none;font-family: monospace;cursor:pointer;font-variant-numeric: tabular-nums;"
          href={`tel:${phone}`}>
          {options?.safe ? encryptValue : originValue}
        </a>
      )
    }
    else {
      return (
        <a onClick={onCopyPhone} style="text-decoration:none;use-select:none;font-family: monospace;cursor:pointer;font-variant-numeric: tabular-nums;" onMouseenter={onMouseenter} onMouseleave={onMouseleave}>
          {options?.safe ? encryptValue : originValue}
        </a>
      )
    }
  }

  return createColumnRender<T>('phone', render)
}
