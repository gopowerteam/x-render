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
    reloadSelection(): void
    resetSelection(): void
  } {
  const selectedRowKeys = ref<(string | number)[]>([])

  function resetSelection() {
    selectedRowKeys.value = []
    ctx.emit('update:radio-key', null)
    ctx.emit('update:radio-row', null)
    ctx.emit('update:checkbox-keys', [])
    ctx.emit('update:checkbox-rows', [])
  }

  function reloadSelection() {
    nextTick(() => {
      if (props.checkboxRows !== undefined) {
        selectedRowKeys.value = [...props.checkboxRows.map(x => x[props.rowKey])]
      }

      if (props.checkboxKeys !== undefined) {
        selectedRowKeys.value = [...props.checkboxKeys]
      }

      if (props.radioKey) {
        selectedRowKeys.value = [props.radioKey]
      }

      if (props.radioRow) {
        selectedRowKeys.value = [props.radioRow[props.rowKey]]
      }
    })
  }

  function getRowSelection() {
    const selection = typeof props.selection === 'string' ? { type: props.selection } : props.selection

    switch (selection?.type) {
      case 'radio':{
        return {
          title: '选择',
          width: 80,
          selectedRowKeys: selectedRowKeys.value,
          ...selection,
        }
      }
      case 'checkbox':{
        return {
          width: 80,
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

  reloadSelection()

  return {
    selectedRowKeys,
    rowSelection: getRowSelection(),
    onSelect,
    onSelectAll,
    resetSelection,
    reloadSelection,
  }
}
