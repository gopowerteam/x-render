export interface SortableOptions {
  /**
   * 重置分页数据
   */
  reset(): void

  update(key: string, diretion: 'asc' | 'desc'): void
  remove(key: string): void
}
