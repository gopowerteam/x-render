import type { CSSProperties } from 'vue'
import { Image } from '@arco-design/web-vue'
import { createColumnRender, getColumnValue, isPromise } from '../../utils'
import type { DataRecord, TableColumnOptions } from '../../interfaces'

export interface ImageColumnOptions<T> {
  width?: string
  height?: string
  size?: number
  radius?: string
  preview?: boolean
  rotate?: number
  parse?: (key: string, record: T) => Promise<string> | string
}

const defaultOptions = {
  size: 30,
}

export function renderImageColumn<T = DataRecord>(
  options?: ImageColumnOptions<T>,
) {
  options = {
    ...defaultOptions,
    ...(options || {}),
  }

  const render = (
    record: T,
    column: TableColumnOptions<T>,
    // ctx?: {
    //   previewing?: boolean
    //   emits?: EventEmits
    //   rowIndex?: number
    // },
  ) => {
    const value = getColumnValue(record, column)
    const id = Math.random().toString(32).slice(2).toUpperCase()

    const style: CSSProperties = {
      maxWidth: '100%',
      maxHeight: '100%',
      borderRadius: options?.radius,
      transform: `rotate(${options?.rotate || 0}deg)`,
      cursor: options?.preview ? 'zoom-in' : 'unset',
      overflow: 'hidden',
    }

    const parsedKey = `${column.index || column.key as string}_parsed`

    // 获取转换值
    if (options?.parse) {
      const result = options?.parse(value, record)

      if (isPromise(result)) {
        (result as Promise<string>).then(v => ((record as Record<string, string>)[parsedKey] = v ?? ''))
      }
      else {
        (record as DataRecord)[parsedKey] = result ?? ''
      }
    }

    if (options?.parse && !(record as Record<string, string>)[parsedKey] === undefined) {
      return <div>Loading...</div>
    }
    else {
      const url = (record as Record<string, string>)[parsedKey] || value
      return url
        ? (
        <div
          id={id}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: `${options?.size}px`,
            width: `${options?.size}px`,
            margin: 'auto',
          }}
        >
            <Image preview={options?.preview} width="100%" height="100%" fit="contain" src={url} alt="image" style={style}></Image>
        </div>
          )
        : <></>
    }
  }

  return createColumnRender<T>('image', render)
}
