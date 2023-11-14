import {
  type ComponentPublicInstance,
  type Ref,
  getCurrentInstance,
  onMounted,
  onUpdated,
  ref,
} from 'vue'
import type { TableRender } from '../table-render'

type TableRenderInstance = InstanceType<typeof TableRender>

type TableRenderExpose = {
  -readonly [K in keyof Omit<
    TableRenderInstance,
    keyof ComponentPublicInstance
  >]: TableRenderInstance[K]
}

/**
 * 获取TableRender实例
 * @param key
 * @returns
 */
export function useTable(key: string): Readonly<Ref<TableRenderExpose>> {
  const instance = getCurrentInstance()
  const table = ref<TableRenderExpose>()

  function updateTable() {
    const target = instance?.proxy?.$refs?.[key]

    if (target) {
      table.value = target as any
    }
  }

  onMounted(updateTable)
  onUpdated(updateTable)

  return table as unknown as Readonly<Ref<TableRenderExpose>>
}
