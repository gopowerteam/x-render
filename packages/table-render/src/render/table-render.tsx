import { Table, type TableInstance } from '@arco-design/web-vue'
import { type PropType, defineComponent, onMounted, provide, ref } from 'vue'
import { FormRender } from '@gopowerteam/form-render'
import { ModalProvider } from '@gopowerteam/modal-render'
import type { FormItemsOptions, FormRenderInstance } from '@gopowerteam/form-render'
import type { TableColumnSharedOptions, TableColumnsOptions, TableLoadParams } from '../interfaces'
import { createTableSource } from '../utils/create-table-source'
import { createTableForm } from '../utils/create-table-form'
import { type TableEditEventOptions, type TableExportEventOptions, type TablePreviewEventOptions, type TableReloadEventOptions, useEvents } from '../hooks'
import { renderTableColumns } from './table-column-render'
import TableViewRender from './table-view-render'

export const TableRender = defineComponent({
  props: {
    // 数据主键
    rowKey: {
      type: String,
      required: true,
    },
    form: {
      type: Object as PropType<FormItemsOptions>,
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
    loadData: {
      type: Function as PropType<(params: TableLoadParams) => void>,
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
    // 分页配置
    // pagination: {
    //   type: Object as PropType<PaginationOptions | boolean>,
    //   required: false,
    // },
  },
  expose: [
    'preview',
    'export',
  ],
  setup(props) {
    const tableId = Math.random().toString(32).slice(2).toUpperCase()
    const tableInstance = ref<TableInstance>()
    const formInstance = ref<FormRenderInstance>()
    const modalInstance = ref<any>()
    const [tableSource, updateTableSource] = createTableSource(props.columns)

    const tableOptions: Partial<TableInstance['$props']> = {
      rowKey: props.rowKey,
      size: props.size,
      scroll: {
        x: props.columns.reduce((r, item) =>
          r += (typeof item.width !== 'number' ? Math.max(item.title.length * 16, 80) : item.width),
        0),
        y: props.height ?? '100%',
      },
    }
    provide('a', 'xxxxasdasdasd')

    const tableForm = props.form || createTableForm(props.columns)

    /**
     * 加载表单数据
     */
    const onTableReload = (options?: TableReloadEventOptions) => {
      if (!props.loadData) {
        return
      }

      if (options?.reset) {
        // TODO
      }

      const formSource = { ...formInstance.value?.formSource || {} }

      // 清空空数据项
      Object.keys(formSource).forEach((key) => {
        if ([null, undefined, ''].includes(formSource[key])) {
          delete formSource[key]
        }
      })

      props.loadData({
        form: formSource,
        update: updateTableSource,
      })
    }

    const onTablePreview = (options: TablePreviewEventOptions) => {
      const record = tableSource.value.find(x => x[props.rowKey] === options.key)

      if (!record) {
        throw new Error('未找到需要预览的数据')
      }

      modalInstance.value.open(TableViewRender, {
        record,
        columns: props.columns,
      }, {
        title: options.title || '详情',
        mode: options.mode,
      })
    }

    const onTableExport = (options?: TableExportEventOptions) => {

    }

    const onTableEdit = (options: TableEditEventOptions) => {

    }

    const tableEvents = useEvents({
      reload: onTableReload,
      preview: onTablePreview,
      export: onTableExport,
      edit: onTableEdit,
    })

    const tableColumns = renderTableColumns(props.columns, props.columnsOptions, tableEvents)

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
      formInstance,
      modalInstance,
      reload: onTableReload,
      preview: onTablePreview,
    }
  },
  render() {
    const renderForm = () => {
      if (this.tableForm) {
        return (
          <div class="table-form">
            <FormRender
              form={this.tableForm}
              ref={form => this.formInstance = form as any}
              searchable
              onSubmit={() => this.tableEvents('reload')}
            ></FormRender>
          </div>
        )
      }
    }

    const renderTable = () => (
      <div class="table-body">
        <Table data={this.tableSource} columns={this.tableColumns} ref={table => this.tableInstance = table as any} {...this.tableOptions}>
        </Table>
      </div>
    )

    return (
      <div class="table-render">
        <ModalProvider ref={modal => this.modalInstance = modal as any}>
          <div class="table-render-content">
            {renderForm()}
            {renderTable()}
          </div>
        </ModalProvider>
      </div>
    )
  },
})

export type TableRenderInstance = InstanceType<typeof TableRender>
