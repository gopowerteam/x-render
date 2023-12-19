import { type Ref, nextTick, ref } from 'vue'
import type { TableData, TableRowSelection } from '@arco-design/web-vue'
import type { TableRenderContext, TableRenderOptions, TableRenderProps } from '.'

export function tableSecletionRender(
  props: TableRenderProps,
  ctx: TableRenderContext,
  {
    tableSource,
  }: TableRenderOptions): {
    selectedRowKeys: Ref<(string | number)[]>
    rowSelection?: TableRowSelection
    onSelect: (rowKeys: (string | number)[], rowKey: string | number, record: TableData) => void
    onSelectAll: (value: boolean) => void
  } {
  const selectedRowKeys = ref<(string | number)[]>([])

  if (props.checkboxRows?.length) {
    selectedRowKeys.value = [...props.checkboxRows.map(x => x[props.rowKey])]
  }

  if (props.checkboxKeys?.length) {
    selectedRowKeys.value = [...props.checkboxKeys]
  }

  function getRowSelection() {
    const selection = typeof props.selection === 'string' ? { type: props.selection } : props.selection

    switch (selection?.type) {
      case 'radio':{
        return {
          title: '选择',
          ...selection,
          selectedRowKeys: selectedRowKeys.value,
        }
      }
      case 'checkbox':{
        return {
          showCheckedAll: true,
          selectedRowKeys: selectedRowKeys.value,
          ...selection,
        }
      }
    }
  }

  function onSelect(rowKeys: (string | number)[], rowKey: string | number, record: TableData) {
    const { type } = getRowSelection() || {}

    switch (type) {
      case 'radio':
        ctx.emit('update:radio-key', rowKey)
        ctx.emit('update:radio-row', record)
        break
      case 'checkbox':
        ctx.emit('update:checkbox-keys', rowKeys)
        ctx.emit('update:checkbox-rows', rowKeys.map((row) => {
          return tableSource.value.find(item => item[props.rowKey] === row) || props.checkboxRows?.find(item => item[props.rowKey] === row)
        }))
        break
    }
  }

  function onSelectAll() {
    nextTick(() => {
      ctx.emit('update:checkbox-keys', selectedRowKeys.value)
      ctx.emit('update:checkbox-rows', selectedRowKeys.value.map((row) => {
        return tableSource.value.find(item => item[props.rowKey] === row) || props.checkboxRows?.find(item => item[props.rowKey] === row)
      }))
    })
  }

  return {
    selectedRowKeys,
    rowSelection: getRowSelection(),
    onSelect,
    onSelectAll,
  }
}
