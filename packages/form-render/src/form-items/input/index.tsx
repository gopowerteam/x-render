import { Input, InputNumber } from '@arco-design/web-vue'
import type { DataRecord, FormItemOptions } from '../../interfaces'

export function renderInputItem(options?: RenderInputItemOptions) {
  return (data: DataRecord, form: FormItemOptions) => {
    switch (options?.type) {
      case 'number':
        return (
          <InputNumber
            v-model={data[form.key]}
            hideButton
            placeholder={options?.placeholder}
            allowClear={options?.clearable}></InputNumber>
        )
      case 'string':
      default:
        return (
          <Input
            v-model={data[form.key]}
            placeholder={options?.placeholder}
            allowClear={options?.clearable}></Input>
        )
    }
  }
}

export interface RenderInputItemOptions {
  placeholder?: string
  clearable?: boolean
  type?: 'string' | 'number'
}
