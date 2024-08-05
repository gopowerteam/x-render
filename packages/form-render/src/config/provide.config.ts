import type { InjectionKey, Ref } from 'vue'
import type { DataRecord } from '../interfaces'

export const provides = {
  id: Symbol('ID') as InjectionKey<Ref<string>>,
  source: Symbol('Source') as InjectionKey<Ref<DataRecord>>,
}
