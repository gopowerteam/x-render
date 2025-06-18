import type { CSSProperties } from 'vue'
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

  function showPreview(id: string, url: string) {
    const rect = document.getElementById(id)?.getBoundingClientRect()

    if (rect) {
      const image = new Image(100, 100)
      image.id = `IMAGE_${id}_PREVIEW`
      image.src = url
      image.setAttribute(
        'style',
        [
          'position:fixed;',
          `top:${rect.top}px;`,
          `left:${rect.left + rect.width}px;`,
          'min-width:400px;',
          'height:auto;',
          'z-index:100;',
        ].join(''),
      )

      document.body.appendChild(image)
    }
  }

  function closePreview(id: string) {
    const element = document.getElementById(`IMAGE_${id}_PREVIEW`)
    element?.remove()
  }

  function onPreviewImage() {

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
      objectFit: 'contain',
      transform: `rotate(${options?.rotate || 0}deg)`,
      cursor: options?.preview ? 'zoom-in' : 'unset',
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
        ? (<div
          id={id}
          onClick={onPreviewImage}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: `${options?.size}px`,
          }}
        >
             <img alt="image" style={style} src={url}></img>
        </div>)
        : <></>
    }
  }

  return createColumnRender<T>('image', render)
}
