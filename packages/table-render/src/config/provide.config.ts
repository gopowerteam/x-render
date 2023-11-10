import type { InjectionKey } from 'vue'
import type { DataRecord } from '../interfaces'

export const provides = {
  id: Symbol('ID') as InjectionKey<string>,
  source: Symbol('SOURCE') as InjectionKey<DataRecord[]>,
}
