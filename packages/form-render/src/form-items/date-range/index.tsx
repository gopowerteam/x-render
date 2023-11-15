import { RangePicker } from '@arco-design/web-vue'
import dayjs from 'dayjs'
import type { FormItemOptions } from '../../interfaces'

/**
 * 日期节点表单渲染
 * @param options 日期节点配置选项
 * @returns JSX
 */
export function renderDateRangeItem(options?: RenderDateRangeItemOptions) {
  return (data: Record<string, any>, form: FormItemOptions) => {
    let dates: string[] = []

    function onSelect(value: (Date | string | number | undefined)[]) {
      dates = value as string[]
    }

    function onChange(values: (Date | string | number | undefined)[] | undefined) {
      if (values && values.length === 2) {
        const [startDateStr, endDateStr] = values.sort()
        const startDate = dayjs(startDateStr).startOf('days')
        const endDate = dayjs(endDateStr).endOf('days')

        data[form.key] = [
          startDate.format(options?.valueFormat || 'YYYY-MM-DD'),
          endDate.format(options?.valueFormat || 'YYYY-MM-DD'),
        ]
      }
    }

    function disabledMethod(date: Date) {
      if (!options?.disabledDate) {
        return false
      }

      return options.disabledDate(dates, date)
    }

    return (
      <div>
        <RangePicker
          style={{ width: '300px' }}
          v-model={data[form.key]}
          onSelect={onSelect}
          onChange={onChange}
          mode={options?.type}
          allowClear={options?.clearable}
          disabled-date={disabledMethod}
          format={options?.labelFormat}
          value-format={options?.valueFormat}></RangePicker>
      </div>
    )
  }
}

export interface RenderDateRangeItemOptions {
  placeholder?: string
  clearable?: boolean
  multiple?: boolean
  type?: 'date' | 'year' | 'quarter' | 'month' | 'week'
  valueFormat?: string
  labelFormat?: string
  disabledDate?: (value: string[], date: Date) => boolean
}
