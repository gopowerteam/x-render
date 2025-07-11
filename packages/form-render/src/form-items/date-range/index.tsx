import type { ShortcutType } from '@arco-design/web-vue'
import { RangePicker } from '@arco-design/web-vue'
import dayjs from 'dayjs'
import type { DataRecord, FormItemOptions, FormItemRenderReturn } from '../../interfaces'

/**
 * 日期节点表单渲染
 * @param options 日期节点配置选项
 * @returns JSX
 */
export function renderDateRangeItem<T=DataRecord>(options?: RenderDateRangeItemOptions): FormItemRenderReturn<T> {
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

        data[form.key as keyof T] = [
          startDate.format(options?.valueFormat || 'YYYY-MM-DD'),
          endDate.format(options?.valueFormat || 'YYYY-MM-DD'),
        ] as any
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

    function renderComponent() {
      return (
        <div>
          <RangePicker
            disabled-input
            style={{ width: '300px' }}
            v-model={data[form.key as keyof T]}
            onSelect={onSelect}
            onChange={onChange}
            mode={options?.type}
            placeholder={options?.placeholder}
            shortcuts={options?.shortcuts}
            allowClear={options?.clearable}
            disabled-date={disabledMethod}
            format={options?.labelFormat}
            value-format={options?.valueFormat}></RangePicker>
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
}
