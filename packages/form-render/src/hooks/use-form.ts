import type { ComponentPublicInstance, Ref } from 'vue'
import type { FormRenderInstance } from '../form-render'
import { getCurrentInstance, onMounted, onUpdated, ref } from 'vue'

type FormRenderExpose = {
  -readonly [K in keyof Omit<
    FormRenderInstance,
    keyof ComponentPublicInstance
  >]: FormRenderInstance[K]
}

/**
 * 获取TableRender实例
 * @param key ref标识
 * @returns FormRender实例的只读响应式引用
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
