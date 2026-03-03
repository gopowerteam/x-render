import type { Ref } from 'vue'
import type { DataRecord, FormItemsOptions } from '../interfaces'
import { ref } from 'vue'

export function createFormSource(
  form?: FormItemsOptions,
  source?: Record<string, any>,
): [Ref<DataRecord>, (value: DataRecord) => void] {
  // 创建数据库
  const state = ref<DataRecord>({})

  form?.forEach((item) => {
    let value = null

    if (item.default) {
      value = (typeof item.default === 'function' ? item.default() : item.default) || null
    }

    if (source && source[item.key] !== undefined) {
      value = source[item.key]
    }

    state.value[item.key] = value
  })

  const updateState = (value: DataRecord) => {
    state.value = value
  }

  return [state, updateState]
}
