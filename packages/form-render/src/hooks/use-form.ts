import {
  type ComponentPublicInstance,
  type Ref,
  getCurrentInstance,
  onMounted,
  onUpdated,
  ref,
} from 'vue'
import type { FormRenderInstance } from '../form-render'

type FormRenderExpose = {
  -readonly [K in keyof Omit<
    FormRenderInstance,
    keyof ComponentPublicInstance
  >]: FormRenderInstance[K]
}

/**
 * 获取TableRender实例
 * @param key
 * @returns
 */
export function useForm(key: string): Readonly<Ref<FormRenderExpose>> {
  const instance = getCurrentInstance()
  const form = ref<FormRenderExpose>()

  function updateForm() {
    const target = instance?.proxy?.$refs?.[key]

    if (target) {
      form.value = target as any
    }
  }

  onMounted(updateForm)
  onUpdated(updateForm)

  return form as unknown as Readonly<Ref<FormRenderExpose>>
}
