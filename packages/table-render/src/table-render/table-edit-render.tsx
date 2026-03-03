import type { FormItemsOptions } from '@gopowerteam/form-render'
import type { PropType } from 'vue'
import type { DataRecord } from '..'
import { FormRender } from '@gopowerteam/form-render'
import { useModal } from '@gopowerteam/modal-render'
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    value: {
      type: Object,
      required: true,
    },
    form: {
      type: Array as PropType<FormItemsOptions<any>>,
      required: true,
    },
    onSubmit: {
      type: Function,
      required: false,
    },
  },
  setup(props) {
    const modal = useModal()

    function onSubmit(record: DataRecord) {
      if (props.onSubmit) {
        props.onSubmit(record)
      }

      modal.close(record)
    }

    return () => (
      <div class="edit-form-container">
        <FormRender
          name="form"
          value={props.value}
          form={props.form}
          onSubmit={onSubmit}
        >
        </FormRender>
      </div>
    )
  },
})
