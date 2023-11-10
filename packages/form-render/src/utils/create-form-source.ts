import { type Ref, ref } from 'vue'
import type { DataRecord, FormItemsOptions } from '../interfaces'

export function createFormSource(
  form?: FormItemsOptions,
): [Ref<DataRecord>, (value: DataRecord) => void] {
  // 创建数据库
  const state = ref<DataRecord>({})

  form?.forEach((item) => {
    state.value[item.key] = (typeof item.default === 'function' ? item.default() : item.default) || null
  })

  const updateState = (value: DataRecord) => {
    state.value = value
  }

  return [state, updateState]
}
