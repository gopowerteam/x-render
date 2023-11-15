import { Textarea } from '@arco-design/web-vue'
import type { DataRecord, FormItemOptions } from '../../interfaces'

export function renderTextareaItem<T=DataRecord>(options?: RenderTextareaItemOptions) {
  return (data: T, form: FormItemOptions<T>) => {
    return (
      <Textarea
        v-model={data[form.key as keyof T]}
        placeholder={options?.placeholder}
        autoSize={options?.autosize}
        maxLength={options?.maxLength}></Textarea>
    )
  }
}

export interface RenderTextareaItemOptions {
  placeholder?: string
  rows?: number
  resize?: 'none' | 'both' | 'horizontal' | 'vertical'
  autosize?: {
    minRows: number
    maxRows: number
  }
  maxLength?: number
}
