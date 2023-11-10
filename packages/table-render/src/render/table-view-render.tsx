import { type PropType, defineComponent, getCurrentInstance, onMounted, ref } from 'vue'
import { Button, Descriptions, DescriptionsItem, Modal } from '@arco-design/web-vue'
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
      default: 300,
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
      .map(column => ({
        options: column,
        renderer: toRenderColumn(column, {
          previewing: true,
        }),
      }))
      .filter(({ options }) => !props.exclude?.includes(options.key))
      .filter(({ renderer }) => !renderer?.disableViewMode)

    function updateFormColumnValue() {
      if (instance) {
        const container = instance.proxy?.$el as HTMLDivElement
        console.log(container.offsetWidth)
        viewColumns.value = Math.floor(container.offsetWidth / props.minWidth)
      }
    }

    onMounted(() => {
      updateFormColumnValue()
    })

    const renderButtons = () => {
      const toBooleanValue = (
        value: boolean | ((record: DataRecord) => boolean) | undefined,
        defaultValue: boolean,
      ) =>
        typeof value === 'function'
          ? value(props.record)
          : value === undefined
            ? defaultValue
            : value

      async function onClick(
        button: RenderSingleButtonColumnOptions<DataRecord>,
      ) {
        // 获取执行状态
        const executable = await (button.confirm === true
          ? new Promise<boolean>((resolve) => {
            Modal.confirm({
              title: '提示信息',
              content: button.confirmText ?? '您确定要执行该操作？',
              onOk: () => resolve(true),
              onCancel: () => resolve(false),
            })
          })
          : Promise.resolve(true))

        if (executable && button.onClick) {
          button.onClick(props.record)
        }

        if (executable && button.onClick) {
          button.onClick(props.record)
        }
      }

      return (
        <div style="display:flex;justify-content:flex-end;">
          {props.buttons
            .filter(button => toBooleanValue(button.visiable, true))
            .map(button => (
                <Button
                onClick={() => onClick(button)}
                type={button.type || 'text'}
                shape={button.shape}
                disabled={toBooleanValue(button.disabled, false)}>
                {{
                  icon: button.icon,
                  default: () => button.content,
                }}
              </Button>
            ))}
        </div>
      )
    }

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
        {/* <table
          class="VIEW_COLUMN_TABLE"
          cellpadding="0"
          cellspacing="0"
          style={toStyle(tableStyle)}>
          {rows.map(items => (
            <tr>
              {items.map(item => (
                <td
                  colspan={item.options.preview?.span ?? 1}
                  style={toStyle(cellStyle)}>
                  <span style={toStyle(labelStyle)}>{item.options.title}:</span>
                  <span style={toStyle(valueStyle)}>
                    {item.render?.render
                      ? item.render?.render({ record: props.record })
                      : getColumnValue(props.record, item.options)}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </table>
        {props.buttons?.length > 0 && renderButtons()} */}
      </div>
    )
  },
})
