import { Textarea } from '@arco-design/web-vue'
import type { DataRecord, FormItemOptions, FormItemRenderReturn } from '../../interfaces'

export function renderTextareaItem<T=DataRecord>(options?: RenderTextareaItemOptions): FormItemRenderReturn<T> {
  return (data: T, form: FormItemOptions<T>) => {
    function renderText() {
      return (
        <span>{data[form.key as keyof T]}</span>
      )
    }

    function renderComponent() {
      return (
        <Textarea
          v-model={data[form.key as keyof T]}
          placeholder={options?.placeholder}
          autoSize={options?.autosize}
          maxLength={options?.maxLength}></Textarea>
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
