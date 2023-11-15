import { Table, type TableInstance } from '@arco-design/web-vue'

import { type PropType, type Ref, computed, defineComponent, onMounted, readonly, ref } from 'vue'
import { ModalProvider } from '@gopowerteam/modal-render'
import { type DataRecord, type FormItemsOptions, type FormRenderInstance } from '@gopowerteam/form-render'
import type { RequestPlugin } from '@gopowerteam/request'
import type { SortableOptions, TableColumnSharedOptions, TableColumnsOptions, TableLoadParams } from '../interfaces'
import { createTableSource } from '../utils/create-table-source'
import { createTableForm } from '../utils/create-table-form'
import { type EventEmits, type TableEditEventOptions, type TableExportEventOptions, type TablePreviewEventOptions, type TableReloadEventOptions, useEvents } from '../hooks'
import { PageService } from '../utils/page.service'
import { useExport } from '../hooks/use-export'
import type { PageableOptions } from '../interfaces/pageable-options'
import { SortService } from '../utils/sort.service'
import { isPromise } from '../utils'
import { renderTableColumns } from './table-column-render'
import TableViewRender from './table-view-render'
import { tableActionsRender } from './table-actions-render'
import { tableFormRender } from './table-form-render'
import { tableSecletionRender } from './table-selection-render'
import { tablePaginationRender } from './table-pagination-render'
import tableEditRender from './table-edit-render'

export const TableRender = defineComponent({
  props: {
    // 数据主键
    rowKey: {
      type: String,
      required: true,
    },
    form: {
      type: Object as PropType<FormItemsOptions<any>>,
      required: false,
    },
    columns: {
      type: Object as PropType<TableColumnsOptions<any>>,
      required: true,
    },
    autoLoad: {
      type: Boolean,
      required: false,
      default: true,
    },
    dataLoad: {
      type: Function as PropType<(params: TableLoadParams) => (void | Promise<any>)>,
      required: false,
    },
    height: {
      type: Number,
      required: false,
    },
    size: {
      type: String as PropType<'mini' | 'small' | 'medium' | 'large'>,
      required: false,
      default: 'large',
    },
    columnsOptions: {
      type: Object as PropType<TableColumnSharedOptions>,
      required: false,
    },
    selection: {
      type: [String, Object] as PropType<
        | 'radio'
        | 'checkbox'
        | {
          type: 'radio' | 'checkbox'
          width?: number
          title?: string
          fixed?: boolean
          selectable?: (record: any) => boolean
        }
      >,
      required: false,
    },
    radioKey: {
      type: [String, Number] as PropType<string | number>,
      required: false,
    },
    checkboxKeys: {
      type: Array as PropType<(string | number)[]>,
      required: false,
    },
    radioRow: {
      type: Object as PropType<Record<string, any>>,
      required: false,
    },
    checkboxRows: {
      type: Array as PropType<Array<Record<string, any>>>,
      required: false,
    },
    exportable: {
      type: [Boolean, Object] as PropType<boolean | { filename: string }>,
      required: false,
      default: false,
    },
    refreshable: {
      type: Boolean,
      required: false,
    },
    actionsPosition: {
      type: String as PropType<'left' | 'right'>,
      required: false,
      default: 'right',
    },
    pageable: {
      type: [Object, Boolean] as PropType<(RequestPlugin & PageableOptions) | { index: number; size: number } | boolean>,
      required: false,
      default: false,
    },
    sortable: {
      type: [Object] as PropType<Record<string, 'desc' | 'asc'>>,
      required: false,
    },
  },
  expose: [
    'preview',
    'export',
    'edit',
    'reload',
    'tableSource',
    'formSource',
    'update:radio-key',
    'update:radio-row',
    'update:checkbox-keys',
    'update:checkbox-rows',
    'formInstance',
  ],
  setup(props, ctx) {
    const tableId = Math.random().toString(32).slice(2).toUpperCase()
    const tableInstance = ref<TableInstance>()
    const formInstance = ref<FormRenderInstance>()
    const modalInstance = ref<any>()
    const [tableSource, updateTableSource] = createTableSource(props.columns)
    const tableLoading = ref(false)
    const tableForm: FormItemsOptions = props.form ?? createTableForm(props.columns)
    const pageService: (RequestPlugin & PageableOptions) | undefined = createPageService()
    const sortService: (RequestPlugin & SortableOptions) | undefined = createSortService()

    function createPageService() {
      switch (true) {
        case typeof props.pageable === 'boolean' && props.pageable === true:
          return new PageService()
        case typeof props.pageable === 'object' && !!(props.pageable as PageableOptions).reset:
          return props.pageable as (RequestPlugin & PageableOptions)
        case typeof props.pageable === 'object' && (!!(props.pageable as { index?: number; size?: number }).index || !!(props.pageable as { index?: number; size?: number }).size):
          return new PageService((props.pageable as { index?: number; size?: number }).index, (props.pageable as { index?: number; size?: number }).size)
      }
    }

    function createSortService() {
      const column = props.columns.find(column => !!column.sortable)

      if (column) {
        return new SortService({
          [column.key]: column.sortable,
          ...props.sortable,
        })
      }
    }

    const onTableExport = (options?: TableExportEventOptions) => {
      const { exportExcel } = useExport()

      exportExcel(
        options?.columns || props.columns,
        options?.source || tableSource.value,
        options?.filename || (typeof props.exportable === 'object' ? props.exportable.filename : undefined),
      )
    }

    const onTablePreview = (options?: TablePreviewEventOptions) => {
      let record: DataRecord | undefined

      switch (true) {
        case !!options?.key:
          record = tableSource.value.find(x => x[props.rowKey] === options?.key)
          break
        case !!options?.record:
          record = options?.record
          break
      }

      if (!record) {
        throw new Error('未找到需要预览的数据')
      }

      return modalInstance.value.open(TableViewRender, {
        record,
        columns: props.columns,
      }, {
        title: options?.title || '详情',
        mode: options?.mode || 'dialog',
      })
    }

    const onTableEdit = <T=DataRecord> (options: TableEditEventOptions<T>): Promise<DataRecord> => {
      let record: T | undefined

      switch (true) {
        case !!options?.key:
          record = tableSource.value.find(x => x[props.rowKey] === options?.key) as T
          break
        case !!options?.record:
          record = options?.record
          break
      }

      if (!record) {
        throw new Error('未找到需要编辑的数据')
      }

      return modalInstance.value.open(tableEditRender, {
        value: record,
        form: options?.form,
        onSubmit: options.onSubmit,
      }, {
        title: options?.title || '编辑',
        mode: options?.mode || 'dialog',
        footer: true,
        form: 'form',
      })
    }

    /**
     * 加载表单数据
     */
    const onTableReload = (options?: TableReloadEventOptions) => {
      if (!props.dataLoad) {
        return
      }

      if (options?.reset) {
        pageService && pageService.reset()
        sortService && sortService.reset()
      }

      const formSource = { ...formInstance.value?.formSource || {} }

      // 清空空数据项
      Object.keys(formSource).forEach((key) => {
        if ([null, undefined, ''].includes(formSource[key])) {
          delete formSource[key]
        }
      })

      const promise = props.dataLoad({
        form: formSource,
        page: pageService,
        sort: sortService,
        update: updateTableSource,
      })

      if (isPromise(promise)) {
        tableLoading.value = true

        Promise.resolve(promise).finally(() => {
          tableLoading.value = false
        })
      }
    }

    const tableEvents = useEvents({
      reload: onTableReload,
      preview: onTablePreview,
      export: onTableExport,
      edit: onTableEdit,
    })

    function onSorterChange(dataIndex: string, direction: string) {
      if (!sortService) {
        return
      }

      if (direction) {
        sortService.update(dataIndex, direction === 'descend' ? 'desc' : 'asc')
      }
      else {
        sortService.remove(dataIndex)
      }

      tableEvents('reload')
    }

    const tableColumns = renderTableColumns(props.columns, props.columnsOptions, tableEvents)

    const renderOptions: TableRenderOptions = {
      tableEvents,
      tableForm,
      tableSource,
      formInstance: formInstance as Ref<FormRenderInstance>,
      pageService,
    }

    const renderTableForm = tableFormRender(props, ctx, renderOptions)
    const renderTableActions = tableActionsRender(props, ctx, renderOptions)
    const renderTablePagination = tablePaginationRender(props, ctx, renderOptions)
    const {
      selectedRowKeys,
      rowSelection,
      onSelect,
      onSelectAll,
    } = tableSecletionRender(props, ctx, renderOptions)

    /**
     * 创建表单配置选项
     */
    const tableOptions: Partial<TableInstance['$props']> = {
      rowKey: props.rowKey,
      size: props.size,
      scroll: {
        x: props.columns.reduce((r, item) =>
          r += (typeof item.width !== 'number' ? Math.max(item.title.length * 16, 80) : item.width),
        0),
        y: props.height ?? '100%',
      },
      rowSelection,
    }

    onMounted(() => {
      if (props.autoLoad) {
        onTableReload()
      }
    })

    return {
      tableId,
      tableInstance,
      tableSource,
      tableOptions,
      tableColumns,
      tableEvents,
      tableForm,
      tableLoading,
      modalInstance,
      formSource: readonly(computed(() => formInstance?.value?.formSource)),
      formInstance,
      reload: onTableReload,
      preview: onTablePreview,
      edit: onTableEdit,
      export: onTableExport,
      onSorterChange,
      renders: {
        renderTableForm,
        renderTableActions,
        renderTablePagination,
      },
      tableSelection: {
        selectedRowKeys,
        rowSelection,
        onSelect,
        onSelectAll,
      },
    }
  },
  render() {
    const renderTable = () => (
      <div class="table-body">
        <Table
          loading={this.tableLoading}
          data={this.tableSource}
          columns={this.tableColumns}
          ref={table => this.tableInstance = table as any}
          onSelect={this.tableSelection.onSelect}
          onSelectAll={this.tableSelection.onSelectAll}
          onSorterChange={this.onSorterChange}
          v-model:selectedKeys={this.tableSelection.selectedRowKeys.value}
          pagination={false}
          {...this.tableOptions}>
        </Table>
      </div>
    )

    return (
      <div class="table-render">
        <ModalProvider ref={modal => this.modalInstance = modal as any}>
          <div class="table-render-content">
            {this.renders.renderTableForm()}
            {this.renders.renderTableActions()}
            {renderTable()}
            {this.renders.renderTablePagination()}
          </div>
        </ModalProvider>
      </div>
    )
  },
})

export type TableRenderInstance = InstanceType<typeof TableRender>
export type TableRenderProps = TableRenderInstance['$props']
export interface TableRenderContext {
  emit: TableRenderInstance['$emit']
  slots: TableRenderInstance['$slots']
}
export interface TableRenderOptions {
  tableForm?: FormItemsOptions
  tableEvents: EventEmits
  tableSource: Ref<DataRecord[]>
  formInstance?: Ref<FormRenderInstance>
  pageService?: PageableOptions
}
