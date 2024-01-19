import { Input, InputNumber } from '@arco-design/web-vue'
import type { DataRecord, FormItemOptions, FormItemRenderReturn } from '../../interfaces'

export function renderInputItem<T=DataRecord>(options?: RenderInputItemOptions): FormItemRenderReturn<T> {
  return (data: T, form: FormItemOptions<T>) => {
    switch (options?.type) {
      case 'number':
        return (
          <InputNumber
            v-model={data[form.key as keyof T]}
            hideButton
            read-only={options?.readonly}
            placeholder={options?.placeholder}
            allowClear={options?.clearable}></InputNumber>
        )
      case 'string':
      default:
        return (
          <Input
            v-model={data[form.key as keyof T]}
            placeholder={options?.placeholder}
            readonly={options?.readonly}
            allowClear={options?.clearable}></Input>
        )
    }
  }
}

export interface RenderInputItemOptions {
  placeholder?: string
  clearable?: boolean
  readonly?: boolean
  type?: 'string' | 'number'
}
