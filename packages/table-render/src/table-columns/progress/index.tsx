import type { DataRecord, TableColumnOptions } from '../../interfaces'
import { createColumnRender, getColumnValue } from '../../utils'

export interface ProgressColumnOptions {
  // 是否显示文本
  showText?: boolean
  // 背景色
  backgroundColor?: string
  // 前景色
  foregroundColor?: string
  // 文本颜色
  textColor?: string
  // 精度
  precision?: number
  // 格式化
  format?: (value: DataRecord) => number
}

export function renderProgressColumn<T = DataRecord>(
  options?: ProgressColumnOptions,
) {
  const backgroundColor = options?.backgroundColor ?? '#f5f5f5'
  const foregroundColor = options?.foregroundColor ?? '#1677ff'
  const showText = options?.showText ?? true
  const textColor = options?.textColor ?? '#000'

  const render = (record: T, column: TableColumnOptions<T>) => {
    const value = getColumnValue(record, column)
    const precision = options?.precision ?? 0
    const progressValue = Math.min(Math.max(options?.format?.(value) ?? value, 0), 1)
    const progressText = showText ? `${(progressValue * 100).toFixed(precision)}%` : ''

    return (
      <div style={`background-color:${backgroundColor};position:relative;min-height: 20px;text-align: center;border-radius: 2px;overflow:hidden;`}>
        <div style={`background-color: ${foregroundColor};position:absolute;left:0;top:0;right;0;width: ${progressText};height: 100%;`}></div>
        {showText && <div style={`position:absolute;inset:0;display:flex;justify-content:center;align-items:center;color:${textColor}`}>{ progressText }</div>}
      </div>
    )
  }

  return createColumnRender<T>('progress', render)
}
