import { Button, Divider, Space } from '@arco-design/web-vue'
import type { TableRenderContext, TableRenderOptions, TableRenderProps } from '.'

export function tableActionsRender(
  props: TableRenderProps,
  ctx: TableRenderContext,
  {
    tableForm,
    tableEvents,
  }: TableRenderOptions): ()=>(JSX.Element | undefined) {
  const showActions = props.refreshable || props.exportable || ctx.slots.actions
  const showDivider = !!tableForm?.length && showActions

  if (showActions || showDivider) {
    return () => (
      <>
        {showDivider && <Divider margin={0}></Divider>}
        {showActions && <div
          class="table-actions"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            margin: '20px 0',
            flexDirection: props.actionsPosition === 'right' ? 'row' : 'row-reverse',
            alignItems: 'center',
          }}>
          <div class="built-in">
            <Space>
             { props.refreshable && <Button type='primary' onClick={() => tableEvents('reload')}>
                刷新
              </Button>
              }
              { props.exportable && <Button type='primary' onClick={() => tableEvents('export')}>
                导出
              </Button>}
              { props.collapsable && <Button type='primary' onClick={() => tableEvents('collapse')}>
                显示
              </Button>}
            </Space>
          </div>
          <div class="customs">
             <Space>
              {ctx.slots.actions && ctx.slots.actions()}
             </Space>
          </div>
        </div>}
      </>)
  }

  return () => undefined
}
