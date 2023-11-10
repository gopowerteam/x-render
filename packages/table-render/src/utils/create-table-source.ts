import { type Ref, ref } from 'vue'
import type { DataRecord, TableColumnsOptions } from '../interfaces'
import { setColumnValue } from './set-column-value'

export function createTableSource(
  columns: TableColumnsOptions,
): [Ref<DataRecord[]>, (source: DataRecord[]) => void] {
  // 创建数据库
  const state = ref<DataRecord[]>([])

  // 格式化Record
  const formatState = (source: DataRecord[]) => {
    // 获取format column
    const formatColumns = columns.filter(column => column.formatter)

    if (formatColumns.length > 0) {
      return source.map((record) => {
        // format操作
        formatColumns.forEach((column) => {
          if (column.formatter) {
            setColumnValue(record, column, column.formatter(record))
          }
        })

        return record
      })
    }
    else {
      return source
    }
  }

  const updateState = (value: DataRecord[]) => {
    state.value = formatState(value)
  }

  return [state, updateState]
}
