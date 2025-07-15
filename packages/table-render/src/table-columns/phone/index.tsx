import { useClipboard } from '@vueuse/core'
import { Message } from '@arco-design/web-vue'
import type { DataRecord, TableColumnOptions } from '../../interfaces'
import { createColumnRender, getColumnValue } from '../../utils'

const DEFAULT_SPARATOR = ' '

export interface PhoneColumnOptions {
  // 安全模式 - 数据脱敏
  safe?: boolean
  // 严格安全
  allowPreview?: boolean
  // 允许呼出
  allowDial?: boolean
  // 允许复制
  allowCopy?: boolean
  // 设置显示分隔符
  separator?: string
  // 拨出回调
  onDial?: (phone: string) => void
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
    const id = `phone_${Math.random().toString(36).slice(2)}`
    const className = '__table__column_phone__'
    const phone = getColumnValue(record, column)

    const iconSize = 16
    const iconStyle = `cursor:pointer;width:${iconSize}px;height:${iconSize}px;`

    const encryptValue = formatText(
      encryptText(phone),
      options?.separator,
    )
    const originValue = formatText(
      phone,
      options?.separator,
    )

    function onCopyPhone() {
      window.focus()
      clipboard.copy(phone).then(() => {
        Message.success({
          content: '复制成功',
          duration: 1000,
        })
      })
    }

    function clearOtherOriginValue() {
      const elemnets = document.querySelectorAll(`.${className}.content`)

      if (elemnets.length > 0) {
        elemnets.forEach((item) => {
          const element = item as HTMLElement

          if (element.innerText.includes('****')) {
            return
          }

          // 更新内容
          element.innerText = element.dataset.encrypt!

          const node = element.nextSibling as HTMLElement

          if (!node || !node.classList.contains('preview-icon')) {
            return
          }

          node.innerHTML = `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 36C35.0457 36 44 24 44 24C44 24 35.0457 12 24 12C12.9543 12 4 24 4 24C4 24 12.9543 36 24 36Z" fill="none" stroke="#333" stroke-width="2" stroke-linejoin="round"/><path d="M24 29C26.7614 29 29 26.7614 29 24C29 21.2386 26.7614 19 24 19C21.2386 19 19 21.2386 19 24C19 26.7614 21.2386 29 24 29Z" fill="none" stroke="#333" stroke-width="4" stroke-linejoin="round"/></svg>`
        })
      }
    }

    function updatePreivewIcon(isEncrypt: boolean) {
      const previewIcon = document.querySelector(`#${id}>.preview-icon`)

      if (!previewIcon) {
        return
      }

      if (isEncrypt) {
        previewIcon.innerHTML = `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 36C35.0457 36 44 24 44 24C44 24 35.0457 12 24 12C12.9543 12 4 24 4 24C4 24 12.9543 36 24 36Z" fill="none" stroke="#333" stroke-width="2" stroke-linejoin="round"/><path d="M24 29C26.7614 29 29 26.7614 29 24C29 21.2386 26.7614 19 24 19C21.2386 19 19 21.2386 19 24C19 26.7614 21.2386 29 24 29Z" fill="none" stroke="#333" stroke-width="4" stroke-linejoin="round"/></svg>`
      }
      else {
        previewIcon.innerHTML = `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 16C6.63472 17.2193 7.59646 18.3504 8.82276 19.3554C12.261 22.1733 17.779 24 24 24C30.221 24 35.739 22.1733 39.1772 19.3554C40.4035 18.3504 41.3653 17.2193 42 16" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M28.9775 24L31.048 31.7274" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M37.3535 21.3536L43.0103 27.0104" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M5.00004 27.0103L10.6569 21.3534" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M16.9278 31.7276L18.9983 24.0001" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`
      }
    }

    function updatePreviewState() {
      const element = document.querySelector(`#${id}>.content`)
      const isEncrypt = !!element?.innerHTML.includes('****')

      if (isEncrypt) {
        clearOtherOriginValue()

        if (element) {
          element.innerHTML = originValue
        }
      }
      else {
        // 非加密状态
        if (element) {
          element.innerHTML = encryptValue
        }
      }

      updatePreivewIcon(!isEncrypt)
    }

    function onCallOutPhone() {
      if (options?.onDial) {
        options.onDial(phone)
      }
      else {
        window.open(`tel:${phone}`, '_blank')
      }
    }

    return (
      <div id={id} style="display:flex;align-items:center;gap:4px;">
         <div data-encrypt={encryptValue} class={`${className} content`} style="use-select:none;font-family: monospace;cursor:pointer;font-variant-numeric: tabular-nums;padding-right: 2px;">
           {options?.safe ? encryptValue : originValue}
         </div>
         {
          options?.safe && options?.allowPreview && <i class="preview-icon" title="显示完整号码" style={iconStyle} onClick={updatePreviewState}>
            <svg width={iconSize} height={iconSize} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 36C35.0457 36 44 24 44 24C44 24 35.0457 12 24 12C12.9543 12 4 24 4 24C4 24 12.9543 36 24 36Z" fill="none" stroke="#333" stroke-width="2" stroke-linejoin="round"/><path d="M24 29C26.7614 29 29 26.7614 29 24C29 21.2386 26.7614 19 24 19C21.2386 19 19 21.2386 19 24C19 26.7614 21.2386 29 24 29Z" fill="none" stroke="#333" stroke-width="4" stroke-linejoin="round"/></svg>
         </i>
         }
         {
          options?.allowDial && <i style={iconStyle} title="拨出号码" onClick={onCallOutPhone}>
           <svg width={iconSize} height={iconSize} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M41.7796 20.6066C42.0324 18.9108 41.9495 17.1747 41.5309 15.5054C40.978 13.3002 39.8392 11.2118 38.1147 9.4873C36.3902 7.76281 34.3018 6.62409 32.0967 6.07115C30.4274 5.65257 28.6912 5.56967 26.9954 5.82245" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M34.1896 19.8035C34.4604 17.9869 33.8966 16.0699 32.4982 14.6715C31.0997 13.2731 29.1827 12.7092 27.3662 12.98" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M14.3755 8.79423C15.1021 8.79423 15.7715 9.18825 16.1241 9.82349L18.5706 14.2303C18.8909 14.8073 18.9059 15.5052 18.6108 16.0955L16.254 20.8091C16.254 20.8091 16.937 24.3206 19.7954 27.179C22.6538 30.0374 26.1535 30.7086 26.1535 30.7086L30.8664 28.3522C31.4571 28.0568 32.1555 28.0721 32.7327 28.393L37.152 30.85C37.7866 31.2028 38.1802 31.8719 38.1802 32.598L38.1802 37.6715C38.1802 40.2552 35.7803 42.1213 33.3322 41.2952C28.3043 39.5987 20.4996 36.3685 15.5528 31.4216C10.6059 26.4748 7.3757 18.6701 5.67916 13.6422C4.85314 11.1941 6.71923 8.79423 9.30288 8.79423L14.3755 8.79423Z" fill="none" stroke="#333" stroke-width="4" stroke-linejoin="round"/></svg>
         </i>
         }
         {
          options?.allowCopy && <i style={iconStyle} title="复制号码" onClick={onCopyPhone}>
            <svg width={iconSize} height={iconSize} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 12.4316V7.8125C13 6.2592 14.2592 5 15.8125 5H40.1875C41.7408 5 43 6.2592 43 7.8125V32.1875C43 33.7408 41.7408 35 40.1875 35H35.5163" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M32.1875 13H7.8125C6.2592 13 5 14.2592 5 15.8125V40.1875C5 41.7408 6.2592 43 7.8125 43H32.1875C33.7408 43 35 41.7408 35 40.1875V15.8125C35 14.2592 33.7408 13 32.1875 13Z" fill="none" stroke="#333" stroke-width="4" stroke-linejoin="round"/></svg>
          </i>
         }
      </div>
    )

    // if (options?.callable) {
    //   return (
    //     <a
    //       style="text-decoration:none;font-family: monospace;cursor:pointer;font-variant-numeric: tabular-nums;"
    //       href={`tel:${phone}`}>
    //       {options?.safe ? encryptValue : originValue}
    //     </a>
    //   )
    // }
    // else {
    //   return (
    //     <a onClick={onCopyPhone} style="text-decoration:none;use-select:none;font-family: monospace;cursor:pointer;font-variant-numeric: tabular-nums;" onMouseenter={onMouseenter} onMouseleave={onMouseleave}>
    //       {options?.safe ? encryptValue : originValue}
    //     </a>
    //   )
    // }
  }

  return createColumnRender<T>('phone', render)
}
