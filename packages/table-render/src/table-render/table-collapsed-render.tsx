import { type PropType, defineComponent, ref } from 'vue'
import { Transfer } from '@arco-design/web-vue'
import { onSubmit, useModal } from '@gopowerteam/modal-render'

export const TableCollapsedRender = defineComponent({
  props: {
    collapsedColumns: {
      type: Array as PropType<{
        key: string
        title: string
        collapsed: boolean
      }[]>,
      required: true,
    },
  },
  setup(props) {
    const modal = useModal()
    const columns = ref(props.collapsedColumns.map(x => ({
      label: x.title,
      value: x.key,
      disabled: false,
    })))

    const selected = ref(props.collapsedColumns.filter(x => x.collapsed).map(x => x.key))

    onSubmit(() => {
      const data = props.collapsedColumns.map(item => ({
        key: item.key,
        title: item.title,
        collapsed: selected.value.includes(item.key),
      }))
      modal.close(data)
    })

    return () => <div class="table-collapsed-render">
      <Transfer data={columns.value} default-value={selected.value} onChange={value => selected.value = [...value]} title={['显示列', '隐藏列']} style={{ justifyContent: 'center' }}>
       <template v-slot:source></template>
     </Transfer>
    </div>
  },
})
