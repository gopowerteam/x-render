import {
  DatePicker,
  MonthPicker,
  QuarterPicker,
  WeekPicker,
  YearPicker,
} from '@arco-design/web-vue'
import type { DataRecord, FormItemOptions } from '../../interfaces'

/**
 * 日期节点表单渲染
 * @param options 日期节点配置选项
 * @returns JSX
 */
export function renderDateItem<T = DataRecord>(options?: RenderDateItemOptions) {
  function disabledMethod(value: string, date: Date) {
    if (!options?.disabledDate) {
      return false
    }

    return options.disabledDate(value, date)
  }

  return (data: T, form: FormItemOptions<T>) => {
    switch (options?.type) {
      case 'week':
        return (
          <WeekPicker
            v-model={data[form.key as keyof T]}
            disabled-date={disabledMethod}
            format={options?.labelFormat}
            value-format={options?.valueFormat}></WeekPicker>
        )
      case 'month':
        return (
          <MonthPicker
            v-model={data[form.key as keyof T]}
            disabled-date={disabledMethod}
            format={options?.labelFormat}
            value-format={options?.valueFormat}></MonthPicker>
        )
      case 'quarter':
        return (
          <QuarterPicker
            v-model={data[form.key as keyof T]}
            disabled-date={disabledMethod}
            format={options?.labelFormat}
            value-format={options?.valueFormat}></QuarterPicker>
        )
      case 'year':
        return (
          <YearPicker
            v-model={data[form.key as keyof T]}
            disabled-date={disabledMethod}
            format={options?.labelFormat}
            value-format={options?.valueFormat}></YearPicker>
        )
      case 'date':
      default:
        return (
          <DatePicker
            disabled-input
            v-model={data[form.key as keyof T]}
            disabled-date={disabledMethod}
            format={options?.labelFormat}
            value-format={options?.valueFormat}></DatePicker>
        )
    }
  }
}

export interface RenderDateItemOptions {
  placeholder?: string
  clearable?: boolean
  disabledDate?: (value: string, date: Date) => boolean
  type?: 'date' | 'year' | 'quarter' | 'month' | 'week'
  valueFormat?: string
  labelFormat?: string
}
