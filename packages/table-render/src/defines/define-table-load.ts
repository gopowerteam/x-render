import type { TableLoadParams } from '../interfaces'

export function defineTableLoad(load: (params: TableLoadParams) => void) {
  return load
}
