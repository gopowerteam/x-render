import type { ShortcutType } from '@arco-design/web-vue'
import { RangePicker } from '@arco-design/web-vue'
import dayjs from 'dayjs'
import updateLocale from 'dayjs/plugin/updateLocale'

import type { ComponentPublicInstance } from 'vue'
import type { DataRecord, FormItemOptions, FormItemRenderReturn } from '../../interfaces'

/**
 * 日期节点表单渲染
 * @param options 日期节点配置选项
 * @returns JSX
 */
export function renderDateRangeItem<T=DataRecord>(options?: RenderDateRangeItemOptions): FormItemRenderReturn<T> {
  dayjs.extend(updateLocale)
  let dateRangeInstance: ComponentPublicInstance
  const defaultValueFormat = 'YYYY-MM-DD HH:mm:ss'
  const defaultDateRangeShortcuts: ShortcutType[] = [
    {
      label: '默认',
      value: () => {
        const start = dayjs().startOf('month').toDate()
        const end = dayjs().endOf('date').toDate()
        return [start, end]
      },
    },
    {
      label: '今天',
      value: () => {
        const start = dayjs().startOf('date').toDate()
        const end = dayjs().endOf('date').toDate()
        return [start, end]
      },
    },
    {
      label: '昨天',
      value: () => {
        const start = dayjs().subtract(1, 'day').startOf('date').toDate()
        const end = dayjs().subtract(1, 'day').endOf('date').toDate()
        return [start, end]
      },
    },
    {
      label: '本周',
      value: () => {
        dayjs.updateLocale('zh-cn', { weekStart: 1 })
        const start = dayjs().startOf('week').toDate()
        const end = dayjs().endOf('week').toDate()
        return [start, end]
      },
    },
    {
      label: '上周',
      value: () => {
        dayjs.updateLocale('zh-cn', { weekStart: 1 })
        const start = dayjs().subtract(1, 'week').startOf('week').toDate()
        const end = dayjs().subtract(1, 'week').endOf('week').toDate()
        return [start, end]
      },
    },
    {
      label: '本月',
      value: () => {
        const start = dayjs().startOf('month').toDate()
        const end = dayjs().endOf('month').toDate()
        return [start, end]
      },
    },
    {
      label: '上月',
      value: () => {
        const start = dayjs().subtract(1, 'month').startOf('month').toDate()
        const end = dayjs().subtract(1, 'month').endOf('month').toDate()
        return [start, end]
      },
    },
    {
      label: '本年',
      value: () => {
        const start = dayjs().startOf('year').toDate()
        const end = dayjs().endOf('year').toDate()
        return [start, end]
      },
    },
    {
      label: '去年',
      value: () => {
        const start = dayjs().subtract(1, 'year').startOf('year').toDate()
        const end = dayjs().subtract(1, 'year').endOf('year').toDate()
        return [start, end]
      },
    },
  ]

  const onDatePickerChange = (value?: string[]) => {
    if (options?.onChange) {
      options?.onChange(value)
    }

    if (!options?.autoSubmit || !dateRangeInstance) {
      return
    }

    let parent: ComponentPublicInstance | null = dateRangeInstance

    while (parent && (parent.$el as HTMLElement).tagName !== 'FORM') {
      parent = parent.$parent
    }

    if (parent && parent.$el) {
      const form = parent.$el as HTMLFormElement
      form.dispatchEvent(new Event('submit'))
    }
  }

  return (data: T, form: FormItemOptions<T>) => {
    let dates: string[] = []

    function onSelect(value: (Date | string | number | undefined)[]) {
      dates = value as string[]
    }

    function onChange(values: (Date | string | number | undefined)[] | undefined) {
      if (values && values.length === 2) {
        const [startDateStr, endDateStr] = values.sort()
        const startDate = dayjs(startDateStr).startOf('days')
        const endDate = dayjs(endDateStr).endOf('days')

        const value = [
          startDate.format(options?.valueFormat || defaultValueFormat),
          endDate.format(options?.valueFormat || defaultValueFormat),
        ] as any

        data[form.key as keyof T] = value

        onDatePickerChange(value)
      }

      if (values === undefined) {
        onDatePickerChange()
      }
    }

    function disabledMethod(date: Date) {
      if (!options?.disabledDate) {
        return false
      }

      return options.disabledDate(dates.filter(Boolean), date)
    }

    function renderText() {
      const range = data[form.key as keyof T] as string[] | number[] | Date[]
      const [startDate, endDate] = range

      const getDateText = (value: string | number | Date) => {
        switch (options?.type) {
          case 'week':
            return (<span>{`${dayjs(value).format('YYYY年')}${dayjs(value).week()}周`}</span>)
          case 'month':
            return (<span>{dayjs(value).format('YYYY年MM月')}</span>)
          case 'quarter':
            return (<span>{`${dayjs(value).format('YYYY年')}${dayjs(value).quarter()}季度`}</span>)
          case 'year':
            return (<span>{dayjs(value).format('YYYY年')}</span>)
          case 'date':
          default:
            return (<span>{dayjs(value).format('YYYY年MM月DD日')}</span>)
        }
      }

      return (<span>{getDateText(startDate)} - {getDateText(endDate)}</span>)
    }

    function getRangeShortcuts() {
      switch (true) {
        case !!options?.shortcuts:
          return options?.shortcuts
        case options?.type === 'date':
        case options?.type === undefined:
          return defaultDateRangeShortcuts
      }
    }

    function renderComponent() {
      return (
        <div>
          <RangePicker
            ref={(instance: unknown) => dateRangeInstance = (instance as ComponentPublicInstance)}
            disabled-input
            style={{ width: '300px' }}
            v-model={data[form.key as keyof T]}
            onSelect={onSelect}
            onChange={onChange}
            mode={options?.type}
            placeholder={options?.placeholder}
            shortcuts={getRangeShortcuts()}
            allowClear={options?.clearable}
            disabled-date={disabledMethod}
            format={options?.labelFormat}
            value-format={options?.valueFormat ?? defaultValueFormat}></RangePicker>
        </div>
      )
    }

    switch (form.mode) {
      case 'text':
        return renderText()
      case 'component':
      default:{
        return renderComponent()
      }
    }
  }
}

export interface RenderDateRangeItemOptions {
  placeholder?: string[]
  clearable?: boolean
  multiple?: boolean
  type?: 'date' | 'year' | 'quarter' | 'month' | 'week'
  valueFormat?: string
  labelFormat?: string
  disabledDate?: (value: string[], date: Date) => boolean
  shortcuts?: ShortcutType[]
  onChange?: (value: string[] | undefined) => void
  autoSubmit?: boolean
}
