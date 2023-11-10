import { Textarea } from '@arco-design/web-vue'
import type { DataRecord, FormItemOptions } from '../../interfaces'

export function renderTextareaItem(options?: RenderTextareaItemOptions) {
  return (data: DataRecord, form: FormItemOptions) => {
    return (
      <Textarea
        v-model={data[form.key]}
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
