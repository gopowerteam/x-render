import { Button, Dropdown, type TriggerEvent } from '@arco-design/web-vue'
import type { DataRecord, TableColumnOptions } from '../../interfaces'
import { createColumnRender } from '../../utils'

export interface DropdownColumnOptions<T> {
  trigger?: TriggerEvent
  content?: string
  options: {
    content: string | ((record: T) => string | number | undefined)
    onClick: (record: T) => Promise<void> | void
    visiable?: boolean | ((record: T) => boolean)
    disabled?: boolean | ((record: T) => boolean)
  }[]
}

export function renderDropdownColumn<T = DataRecord>(
  options: DropdownColumnOptions<T>,
) {
  const render = (record: T, _column: TableColumnOptions<T>) => {
    const dropdownOptions = options.options
      .filter(
        option => typeof option.visiable === 'function' ? option.visiable(record) : option.visiable !== false,
      )

    return (
        <Dropdown trigger={options?.trigger || 'click'}>
        {{
          default: () => <Button disabled={dropdownOptions.length === 0} type='text'>{options?.content || '操作'}</Button>,
          content: () => dropdownOptions.map((option) => {
            return (
              <Dropdown.Option onClick={() => option.onClick(record)}>
              {
                typeof option.content === 'function'
                  ? option.content(record)
                  : option.content
              }
              </Dropdown.Option>
            )
          }),
        }}
        </Dropdown>
    )
  }

  return createColumnRender<T>('dropdown', render)
}
