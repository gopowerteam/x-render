import { FormRender } from '@gopowerteam/form-render'
import type { TableRenderContext, TableRenderOptions, TableRenderProps } from '.'

export function tableFormRender(
  props: TableRenderProps,
  ctx: TableRenderContext,
  {
    tableForm,
    tableEvents,
    formInstance,
  }: TableRenderOptions) {
  if (tableForm?.length) {
    return () => (
      <div class="table-form">
        <FormRender
          form={tableForm}
          ref={form => formInstance && (formInstance.value = form as any)}
          searchable
          onSubmit={() => tableEvents('reload', { reset: true })}
        ></FormRender>
      </div>
    )
  }

  return () => undefined
}
