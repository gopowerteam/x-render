import { RadioGroup } from '@arco-design/web-vue'
import { type ComponentPublicInstance, type Ref, isRef, ref } from 'vue'
import { watchOnce } from '@vueuse/core'
import type { DataRecord, FormItemOptions, FormItemRenderReturn } from '../../interfaces'

const cache = new WeakMap()

function useRadioOptions(): [Ref<RadioOptions>, (value: RadioOptions) => void] {
  const radioOptions = ref<RadioOptions>(new Map())
  const updateRadioOptions = (value: RadioOptions) => radioOptions.value = value

  return [radioOptions, updateRadioOptions]
}

export function renderRadioItem<T=DataRecord>(options: RenderRadioItemOptions): FormItemRenderReturn<T> {
  let radioInstance: ComponentPublicInstance
  let mounted = false

  const [radioOptions, updateRadioOptions] = useRadioOptions()

  const onRadioChange = (value: string | number | boolean) => {
    if (options.onChange) {
      options.onChange(value as string | number)
    }

    if (!options.autoSubmit || !radioInstance) {
      return
    }

    let parent: ComponentPublicInstance | null = radioInstance

    while (parent && (parent.$el as HTMLElement).tagName !== 'FORM') {
      parent = parent.$parent
    }

    if (parent && parent.$el) {
      const form = parent.$el as HTMLFormElement
      form.dispatchEvent(new Event('submit'))
    }
  }

  const runRadioOptionsFunction = (fun: (() => RadioOptions) | (() => Promise<RadioOptions>), callback: (value: RadioOptions) => void) => {
    const result = fun()

    if (result instanceof Promise) {
      result.then(callback)
    }
    else {
      callback(result)
    }
  }

  const updateRadioOptionsFromCache = async () => {
    const value = cache.get(options.options)

    switch (typeof value) {
      // 已经执行未返回
      case 'function':
        cache.set(options.options, updateRadioOptions)
        return
      // 已经执行已返回
      case 'object':
        updateRadioOptions(value)
        return
    }
    // 缓存执行
    cache.set(options.options, updateRadioOptions)
    // 未执行
    runRadioOptionsFunction(
      options.options as (() => RadioOptions) | (() => Promise<RadioOptions>),
      (value) => {
        const update = cache.get(options.options)
        cache.set(options.options, value)
        update(value)
      },
    )
  }

  const updateRadioOptionsFromData = () => {
    runRadioOptionsFunction(
      options.options as (() => RadioOptions) | (() => Promise<RadioOptions>),
      (value) => {
        updateRadioOptions(value)
      },
    )
  }

  switch (true) {
    case options.options instanceof Function:{
      if (options.cache !== false) {
        updateRadioOptionsFromCache()
      }
      else {
        updateRadioOptionsFromData()
      }
      break
    }
    case isRef(options.options): {
      watchOnce(() => options.options, () => {
        updateRadioOptions((options.options as Ref<RadioOptions>).value)
      }, {
        immediate: true,
      })
      break
    }
    default:{
      radioOptions.value = options.options as RadioOptions
    }
  }

  return (data: T, form: FormItemOptions<T>) => {
    // 设置默认值
    if (options.default && !mounted) {
      data[form.key as keyof T] = options.default as any
      mounted = true
    }

    function renderText() {
      const value = data[form.key as keyof T]

      return (
        <span>{radioOptions.value?.get(value as string)}</span>
      )
    }

    function renderComponent() {
      return (
        <RadioGroup
          type={options.type || 'radio'}
          size={options.size}
          ref={(instance: unknown) => radioInstance = (instance as ComponentPublicInstance)}
          v-model={data[form.key as keyof T]}
          onChange={onRadioChange}
          options={Array.from(radioOptions.value.entries()).map(([value, label]) => ({ label, value }))}>
        </RadioGroup>
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

export type RadioOptions = Map<string | number, string>

export interface RenderRadioItemOptions {
  options:
  | RadioOptions
  | (() => RadioOptions)
  | (() => Promise<RadioOptions>)
  | Ref<RadioOptions>
  // 模式
  type?: 'radio' | 'button'
  size?: 'mini' | 'small' | 'medium' | 'large'
  // 默认值
  default?: string | number
  // 自动提交
  autoSubmit?: boolean
  // 开启缓存
  cache?: boolean
  // change事件
  onChange?: (value: string | number) => void
}
