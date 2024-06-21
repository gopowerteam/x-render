import type { RequestPlugin, RequestSendOptions } from '@gopowerteam/request'
import type { SortableOptions } from '../interfaces'

export class SortService implements RequestPlugin, SortableOptions {
  private sort: { [key: string]: 'asc' | 'desc' } = {}
  private readonly defaultSort = {}

  constructor(data?: Record<string, 'asc' | 'desc'>) {
    if (data) {
      this.sort = data
      this.defaultSort = data
    }
  }

  /**
   * 更新排序
   * @param key 排序关键字
   * @param value 排序方式
   */
  public update(key: string, value: 'desc' | 'asc') {
    if (key && value) {
      this.sort[key] = value
    }
  }

  /**
   * 移除排序项
   * @param key 排序关键字
   */
  public remove(key: string) {
    // 过滤
    const items: any[] = Object.entries(this.sort).filter(([k]) => k !== key) as any[]

    this.sort = {}

    // 判断排序项是否存在
    if (items) {
      items.forEach(([k, v]) => {
        this.sort[k] = v
      })
    }
  }

  public before = (params: RequestSendOptions) => {
    params.paramsQuery = {
      ...(params.paramsQuery || {}),

      sort: this.stringify(this.sort),
    }
  }

  /**
   * 重置分页数据
   */
  public reset() {
    this.sort = this.defaultSort || {}
  }

  /**
   * 转换排序对象为字符串
   */
  private stringify(value: SortService | { [key: string]: 'asc' | 'desc' }): string[] {
    if (typeof value !== 'object') {
      return []
    }

    if (value instanceof SortService) {
      value = value.sort
    }

    return Object.entries(value).map(([k, v]) => `${k},${v}`)
  }
}
