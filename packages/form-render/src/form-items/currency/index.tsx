import { InputNumber } from '@arco-design/web-vue'
import { ref, watch } from 'vue'
import type { DataRecord, FormItemOptions, FormItemRenderReturn } from '../../interfaces'

const defaultOptions: Partial<RenderCurrencyOptions> = {
  thousands: true,
  inputUnit: '元',
  outputUnit: '元',
}

const unitMaps = {
  分: 10 ** 0,
  元: 10 ** 2,
  万: 10 ** 4,
}

export function renderCurrencyItem<T=DataRecord>(options?: RenderCurrencyOptions): FormItemRenderReturn<T> {
  options = { ...defaultOptions, ...(options || {}) }

  const transformToInputUnit = (value: number) => {
    if (value === null || value === undefined) {
      return
    }

    if (options?.inputUnit === options?.outputUnit) {
      return value
    }

    const scale = unitMaps[options!.outputUnit!] / unitMaps[options!.inputUnit!]
    return value * scale
  }

  const transformToOutputUnit = (value: number) => {
    if (options?.inputUnit === options?.outputUnit) {
      return value
    }

    const scale = unitMaps[options!.inputUnit!] / unitMaps[options!.outputUnit!]
    return value * scale
  }

  const toThousands = (value: string) => {
    const values = value.split('.')
    values[0] = values[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return values.join('.')
  }

  // 千分位显示
  const formatter = (value: string) => {
    const data = value
    return options?.thousands ? toThousands(data) : data
  }

  const parser = (value: string) => {
    const data = value.replace(/,/g, '')
    return data
  }

  return (data: T, form: FormItemOptions<T>) => {
    const currentValue = ref(transformToInputUnit(data[form.key as keyof T] as number))

    watch(currentValue, (value) => {
      data[form.key as keyof T] = transformToOutputUnit(value) as T[keyof T]
    })

    return (
      <InputNumber
        v-model={currentValue.value}
        formatter={formatter}
        parser={parser}
        precision={options?.precision}
        hideButton
        read-only={options?.readonly}
        placeholder={options?.placeholder}
        allowClear={options?.clearable}>
      {{
        prefix: options?.prefix && (() => (
          typeof options?.suffix === 'string'
            ? (<span>{options.suffix}</span>)
            : options!.suffix!()
        )),
        suffix: () => (
          typeof options?.suffix === 'string'
            ? (<span>{options.suffix}</span>)
            : typeof options?.suffix === 'function' ? options.suffix() : options?.inputUnit
        ),
      }}
     </InputNumber>
    )
  }
}

export interface RenderCurrencyOptions {
  placeholder?: string
  clearable?: boolean
  readonly?: boolean
  prefix?: string | (() => JSX.Element)
  suffix?: string | (() => JSX.Element)
  thousands?: boolean
  precision?: number
  inputUnit?: '分' | '元' | '万'
  outputUnit?: '分' | '元' | '万'
}
