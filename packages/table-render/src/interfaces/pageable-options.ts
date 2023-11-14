export interface PageableOptions {
  /**
   * 当前页码
   */
  pageIndex: number
  /**
   * 分页容量
   */
  pageSize: number
  /**
   * 分页容量选项
   */
  pageSizeOpts: number[]
  /**
   * 分页布局
   */
  pageLayouts: Array<
    | 'PrevJump'
    | 'PrevPage'
    | 'JumpNumber'
    | 'NextPage'
    | 'NextJump'
    | 'Sizes'
    | 'FullJump'
    | 'Total'
  >
  /**
   * 数据总数
   */
  total: number
  /**
   * 重置分页数据
   */
  reset(): void
}
