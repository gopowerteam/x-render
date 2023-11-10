import { Tag } from '@arco-design/web-vue'
import type { DataRecord, TableColumnOptions } from '../../interfaces'
import { createColumnRender, getColumnValue } from '../../utils'

type Dict = Map<string | number | boolean, string | number | boolean>

const TagType = {
  success: 'arcoblue',
  warning: 'orange',
  error: 'red',
}

export type DictColumnOptions = Dict | { dict: Dict; tag: boolean | keyof typeof TagType }

function getDict(options: DictColumnOptions) {
  return options instanceof Map ? options : options.dict
}

function getTag(options: DictColumnOptions) {
  const tag = options instanceof Map ? false : options.tag

  if (typeof tag === 'string') {
    return TagType[tag]
  }
  else {
    return tag
  }
}

export function renderDictColumn<T = DataRecord>(
  options: DictColumnOptions,
) {
  const dict = getDict(options)
  const tag = getTag(options)

  const render = (record: T, column: TableColumnOptions<T>) => {
    const value = getColumnValue(record, column)

    if (tag) {
      return <Tag color={tag === true ? undefined : tag}>{dict.get(value) || value}</Tag>
    }
    else {
      return <span>{dict.get(value) || value}</span>
    }
  }

  return createColumnRender<T>('dict', render)
}
