import { Input, InputNumber } from '@arco-design/web-vue'
import type { ComponentPublicInstance } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import type { DataRecord, FormItemOptions, FormItemRenderReturn } from '../../interfaces'

export function renderInputItem<T=DataRecord>(options?: RenderInputItemOptions): FormItemRenderReturn<T> {
  let inputElement: ComponentPublicInstance

  return (data: T, form: FormItemOptions<T>) => {
    function renderText() {
      return (
        <span>{data[form.key as keyof T]}</span>
      )
    }

    const dispatchEvent = useDebounceFn((form: HTMLFormElement) => {
      if (form) {
        form.dispatchEvent(new Event('submit'))
      }
    }, 1000)

    function onInputChange() {
      if (!options?.autoSumbit) {
        return
      }

      let parent: ComponentPublicInstance | null = inputElement

      while (parent && (parent.$el as HTMLElement).tagName !== 'FORM') {
        parent = parent.$parent
      }

      if (parent && parent.$el) {
        const form = parent.$el as HTMLFormElement
        dispatchEvent(form)
      }
    }

    function renderComponent() {
      switch (options?.type) {
        case 'number':
          return (
            <InputNumber
              ref={(instance: unknown) => inputElement = (instance as ComponentPublicInstance)}
              v-model={data[form.key as keyof T]}
              hideButton
              read-only={options?.readonly}
              placeholder={options?.placeholder}
              onInput={onInputChange}
              allowClear={options?.clearable}></InputNumber>
          )
        case 'string':
        default:
          return (
            <Input
              ref={(instance: unknown) => inputElement = (instance as ComponentPublicInstance)}
              v-model={data[form.key as keyof T]}
              placeholder={options?.placeholder}
              readonly={options?.readonly}
              onInput={onInputChange}
              allowClear={options?.clearable}></Input>
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

export interface RenderInputItemOptions {
  placeholder?: string
  clearable?: boolean
  readonly?: boolean
  autoSumbit?: boolean
  type?: 'string' | 'number'
}
