import { type PropType, defineComponent, getCurrentInstance, onMounted, ref } from 'vue'
import { Descriptions, DescriptionsItem } from '@arco-design/web-vue'
import type { DataRecord, TableColumnsOptions } from '..'
import type { RenderSingleButtonColumnOptions } from '../table-columns/button'
import { getColumnValue } from '../utils'
import { toRenderColumn } from './table-column-render'

export default defineComponent({
  props: {
    record: {
      type: Object,
      required: true,
    },
    columns: {
      type: Array as PropType<TableColumnsOptions<any>>,
      required: true,
    },
    minWidth: {
      type: Number,
      required: false,
      default: 350,
    },
    border: {
      type: Boolean,
      default: true,
    },
    exclude: {
      type: Array as PropType<Array<string>>,
      default: () => [],
    },
    layout: {
      type: String as PropType<'horizontal' | 'vertical' | 'inline-horizontal' | 'inline-vertical'>,
      required: false,
      default: 'horizontal',
    },
    buttons: {
      type: Array as PropType<RenderSingleButtonColumnOptions<DataRecord>[]>,
      default: () => [],
    },
  },
  setup(props) {
    const instance = getCurrentInstance()
    const viewColumns = ref(0)
    const columns = props.columns
      .filter((column) => {
        if (typeof column.visiable === 'boolean') {
          return column.visiable
        }
        if (typeof column.visiable === 'function') {
          return column.visiable()
        }
        return true
      })
      .map(column => ({
        options: column,
        renderer: toRenderColumn(column, {
          previewing: true,
        }),
      }))
      .filter(({ options }) => !props.exclude?.includes(options.key as string))
      .filter(({ renderer }) => !renderer?.disableViewMode)

    function updateFormColumnValue() {
      if (instance) {
        const container = instance.proxy?.$el as HTMLDivElement
        viewColumns.value = Math.floor(container.offsetWidth / props.minWidth)
      }
    }

    onMounted(() => {
      updateFormColumnValue()
    })

    return () => (
      <div class="preview-container">
        <Descriptions column={viewColumns.value} bordered={true} align="left" layout={props.layout}>
          {
            columns.map(column => (
              <DescriptionsItem label={column.options.title}>
                {column.renderer?.render
                  ? column.renderer?.render({ record: props.record })
                  : getColumnValue(props.record, column.options)}
              </DescriptionsItem>
            ))
          }
        </Descriptions>
      </div>
    )
  },
})
