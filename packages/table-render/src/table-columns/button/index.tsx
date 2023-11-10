import { Button } from '@arco-design/web-vue'

import { useModal } from '@gopowerteam/modal-render'
import { createColumnRender } from '../../utils'
import type { EventEmits, TableColumnOptions } from '../..'

export type RenderButtonColumnOptions<T> =
  | RenderSingleButtonColumnOptions<T>
  | RenderSingleButtonColumnOptions<T>[]
  | RenderMultipleButtonColumnOptions<T>

export interface RenderSingleButtonColumnOptions<T> {
  content?: string | ((record: T) => string | number | undefined)
  onClick?: (record: T) => Promise<void> | void
  autoReload?: boolean
  type?: 'primary' | 'secondary' | 'outline' | 'dashed' | 'text'
  shape?: 'square' | 'round' | 'circle'
  visiable?: boolean | ((record: T) => boolean)
  disabled?: boolean | ((record: T) => boolean)
  confirm?: boolean
  icon?: () => JSX.Element
  confirmText?: string
  confirmAppend?: string | HTMLElement
  confirmOffset?: { left: number; top: number }
  confirmPosition?: { left: number; top: number }
}

export interface RenderMultipleButtonColumnOptions<T> {
  buttons?: RenderSingleButtonColumnOptions<T>[]
}

export function renderButtonColumn<T>(options: RenderButtonColumnOptions<T>) {
  const render = (
    record: T,
    _column: TableColumnOptions<T>,
    ctx?: {
      previewing?: boolean
      emits?: EventEmits
    }) => {
    const modal = useModal()
    const buttons = (
      Array.isArray(options)
        ? options
        : 'buttons' in options
          ? options.buttons
          : [options]
    ) as RenderSingleButtonColumnOptions<T>[]

    const toBooleanValue = (
      value: boolean | ((record: T) => boolean) | undefined,
      defaultValue: boolean,
    ) =>
      typeof value === 'function'
        ? value(record)
        : value === undefined
          ? defaultValue
          : value

    async function onClick(button: RenderSingleButtonColumnOptions<T>) {
      // 计算Append容器修正位置
      // const getConfirmPosition = () => {
      //   if (button.confirmPosition) {
      //     return button.confirmPosition
      //   }

      //   if (!button.confirmAppend) {
      //     return {}
      //   }

      //   const container
      //     = typeof button.confirmAppend === 'string'
      //       ? document.querySelector<HTMLElement>(button.confirmAppend)
      //       : button.confirmAppend

      //   if (!container) {
      //     return {}
      //   }

      //   const width = 420
      //   const height = 150

      //   // 获取容器区域尺寸
      //   const clientVisibleWidth = container.clientWidth
      //   const clientVisibleHeight = container.clientHeight
      //   // 计算Left,Top
      //   const left = clientVisibleWidth / 2 - width / 2 + container.offsetLeft
      //   const top = clientVisibleHeight / 2 - height / 2 + container.offsetTop

      //   return {
      //     position: {
      //       left: left + (button?.confirmOffset?.left || 0),
      //       top: top + (button?.confirmOffset?.top || 0),
      //     },
      //     width,
      //     height,
      //   }
      // }
      // 获取执行状态
      const executable = await (button.confirm === true
        ? new Promise<boolean>((resolve) => {
          modal.confirm({
            title: '提示信息',
            content: button.confirmText ?? '您确定要执行该操作？',
            onOk: () => resolve(true),
            onCancel: () => resolve(false),
          })
        })
        : Promise.resolve(true))

      if (executable && button?.onClick) {
        await button.onClick(record)

        if (button.autoReload && ctx?.emits) {
          ctx?.emits('reload')
        }
      }
    }

    return (
      <>
        {buttons
          .filter(button => toBooleanValue(button.visiable, true))
          .map(button => (
            <Button
              onClick={() => onClick(button)}
              type={button.type || 'text'}
              shape={button.shape}
              disabled={toBooleanValue(button.disabled, false)}>
              {{
                icon: button.icon,
                default: () => (typeof button.content === 'function'
                  ? button.content(record)
                  : button.content) || '',
              }}
            </Button>
          ))}
      </>
    )
  }

  return createColumnRender<T>('button', render, { disableViewMode: true })
}
