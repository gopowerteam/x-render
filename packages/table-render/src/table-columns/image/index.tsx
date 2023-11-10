import type { CSSProperties } from 'vue'
import { createColumnRender, getColumnValue } from '../../utils'
import type { DataRecord, TableColumnOptions } from '../../interfaces'
import type { EventEmits } from '../..'

export interface ImageColumnOptions {
  width?: string
  height?: string
  radius?: string
  preview?: boolean
  rotate?: number
  parse?: (key: string) => Promise<string>
}

export function renderImageColumn<T = DataRecord>(
  options?: ImageColumnOptions,
) {
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

  const render = (
    record: T,
    column: TableColumnOptions<T>,
    ctx?: {
      previewing?: boolean
      emits?: EventEmits
    },
  ) => {
    const value = getColumnValue(record, column)
    const id = Math.random().toString(32).slice(2).toUpperCase()

    const style: CSSProperties = {
      width: ctx?.previewing ? options?.width || 'auto' : '40px',
      height: ctx?.previewing ? options?.height || 'auto' : 'auto',
      borderRadius: options?.radius,
      maxWidth: !options?.height && !options?.width ? '150px' : 'auto',
      display: 'block',
      margin: 'auto',
      objectFit: 'contain',
      transform: `rotate(${options?.rotate || 0}deg)`,
      cursor: options?.preview ? 'pointer' : 'unset',
    }

    const parsedKey = `${column.index || column.key}_parsed`

    // 获取转换值
    if (options?.parse) {
      options
        ?.parse(value)
        .then(v => ((record as Record<string, string>)[parsedKey] = v))
    }

    if (options?.parse && !(record as Record<string, string>)[parsedKey]) {
      return <div>Loading...</div>
    }
    else {
      const url = (record as Record<string, string>)[parsedKey] || value
      return (
        <img
          id={id}
          onMouseenter={() => options?.preview && !ctx?.previewing && showPreview(id, url)}
          onMouseleave={() => options?.preview && !ctx?.previewing && closePreview(id)}
          src={url}
          style={style}
        />
      )
    }
  }

  return createColumnRender<T>('image', render)
}
