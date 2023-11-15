import { Pagination } from '@arco-design/web-vue'
import type { TableRenderContext, TableRenderOptions, TableRenderProps } from '.'

export function tablePaginationRender(
  props: TableRenderProps,
  ctx: TableRenderContext,
  {
    pageService,
    tableEvents,
  }: TableRenderOptions): ()=>(JSX.Element | undefined) {
  function onPageChange(index: number) {
    if (pageService) {
      pageService.pageIndex = index
      tableEvents('reload')
    }
  }

  function onPageSizeChange(size: number) {
    if (pageService) {
      pageService.pageSize = size
      tableEvents('reload')
    }
  }

  if (pageService) {
    return () => (
        <div class="table-pagination" style={{ padding: '10px 0' }}>
          <Pagination
            v-model:current={pageService.pageIndex}
            v-model:page-size={pageService.pageSize}
            total={pageService.total}
            page-size-options={pageService.pageSizeOpts}
            hide-on-single-page
            show-total
            show-page-size
            onChange={index => onPageChange(index)}
            onPageSizeChange={size => onPageSizeChange(size)}
            style={{
              justifyContent: 'flex-end',
            }}
            ></Pagination>
        </div>
    )
  }

  return () => undefined
}
