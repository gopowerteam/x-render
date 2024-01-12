import { Button, Dropdown, type TriggerEvent } from '@arco-design/web-vue'
import { useModal } from '@gopowerteam/modal-render'
import type { DataRecord, TableColumnOptions } from '../../interfaces'
import { createColumnRender } from '../../utils'

export interface DropdownOptionItemOptions<T> {
  content: string | ((record: T) => string | number | undefined)
  onClick: (record: T) => Promise<void> | void
  visiable?: boolean | ((record: T) => boolean)
  disabled?: boolean | ((record: T) => boolean)
  confirm?: boolean
  confirmText?: string
}
export interface DropdownColumnOptions<T> {
  trigger?: TriggerEvent
  content?: string
  options: DropdownOptionItemOptions<T>[]
}

export function renderDropdownColumn<T = DataRecord>(
  options: DropdownColumnOptions<T>,
) {
  const modal = useModal()

  async function onExecConfirm(options: DropdownOptionItemOptions<T>, record: T) {
    if (options.confirm) {
      const result = await new Promise<boolean>((resolve, reject) => {
        modal.open('confirm', {
          title: '确认',
          content: options.confirmText || '是否确认执行该操作?',
          onOk: () => resolve(true),
          onCancel: () => resolve(false),
        })
      })

      if (!result) {
        return
      }
    }

    options.onClick(record)
  }
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
              <Dropdown.Option onClick={() => onExecConfirm(option, record)}>
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
