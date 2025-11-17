import type {
  ShortcutType,
} from '@arco-design/web-vue'
import {
  DatePicker,
  MonthPicker,
  QuarterPicker,
  WeekPicker,
  YearPicker,
} from '@arco-design/web-vue'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import type { ComponentPublicInstance } from 'vue'
import type { DataRecord, FormItemOptions, FormItemRenderReturn } from '../../interfaces'

dayjs.extend(weekOfYear)
dayjs.extend(quarterOfYear)
dayjs.locale('zh-cn', { weekStart: 1 })

/**
 * 日期节点表单渲染
 * @param options 日期节点配置选项
 * @returns JSX
 */
export function renderDateItem<T = DataRecord>(options?: RenderDateItemOptions): FormItemRenderReturn<T> {
  let pickerInstance: ComponentPublicInstance

  function disabledMethod(value: string, date: Date) {
    if (!options?.disabledDate) {
      return false
    }

    return options.disabledDate(value, date)
  }

  function onChange(value: string | number | Date | undefined) {
    if (options?.onChange) {
      options?.onChange(value)
    }

    if (!options?.autoSubmit || !pickerInstance) {
      return
    }

    let parent: ComponentPublicInstance | null = pickerInstance

    while (parent && (parent.$el as HTMLElement).tagName !== 'FORM') {
      parent = parent.$parent
    }

    if (parent && parent.$el) {
      const form = parent.$el as HTMLFormElement
      form.dispatchEvent(new Event('submit'))
    }
  }

  return (data: T, form: FormItemOptions<T>) => {
    function renderText() {
      const value = data[form.key as keyof T] as string | number | Date

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
          return (<span>{dayjs(value).format(options?.showTime ? 'YYYY年MM月DD日 HH:mm:ss' : 'YYYY年MM月DD日')}</span>)
      }
    }

    function renderComponent() {
      switch (options?.type) {
        case 'week':
          return (
            <WeekPicker
              ref={(instance: unknown) => pickerInstance = (instance as ComponentPublicInstance)}
              day-start-of-week={1}
              v-model={data[form.key as keyof T]}
              disabled-date={disabledMethod}
              format={options?.labelFormat}
              value-format={options?.valueFormat}
              {...{ onChange }}>
              </WeekPicker>
          )
        case 'month':
          return (
            <MonthPicker
              ref={(instance: unknown) => pickerInstance = (instance as ComponentPublicInstance)}
              v-model={data[form.key as keyof T]}
              disabled-date={disabledMethod}
              format={options?.labelFormat}
              value-format={options?.valueFormat}
              {...{ onChange }}>
            </MonthPicker>
          )
        case 'quarter':
          return (
            <QuarterPicker
              ref={(instance: unknown) => pickerInstance = (instance as ComponentPublicInstance)}
              v-model={data[form.key as keyof T]}
              disabled-date={disabledMethod}
              format={options?.labelFormat}
              value-format={options?.valueFormat}
              {...{ onChange }}>
            </QuarterPicker>
          )
        case 'year':
          return (
            <YearPicker
              ref={(instance: unknown) => pickerInstance = (instance as ComponentPublicInstance)}
              v-model={data[form.key as keyof T]}
              disabled-date={disabledMethod}
              format={options?.labelFormat}
              value-format={options?.valueFormat}
              {...{ onChange }}>
            </YearPicker>
          )
        case 'date':
        default:
          return (
            <DatePicker
              ref={(instance: unknown) => pickerInstance = (instance as ComponentPublicInstance)}
              disabled-input
              v-model={data[form.key as keyof T]}
              disabled-date={disabledMethod}
              format={options?.labelFormat}
              value-format={options?.valueFormat}
              show-time={options?.showTime}
              {...{ onChange }}
              {...{ shortcuts: options?.shortcuts }}></DatePicker>
          )
      }
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

export interface RenderDateItemOptions {
  placeholder?: string
  clearable?: boolean
  disabledDate?: (value: string, date: Date) => boolean
  type?: 'date' | 'year' | 'quarter' | 'month' | 'week'
  valueFormat?: string
  labelFormat?: string
  shortcuts?: ShortcutType[]
  showTime?: boolean
  onChange?: (value: string | number | Date | undefined) => void
  autoSubmit?: boolean
}
