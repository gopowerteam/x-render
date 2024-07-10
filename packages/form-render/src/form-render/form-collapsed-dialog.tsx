import { type PropType, defineComponent, ref } from 'vue'
import { Button, Divider, TabPane, Tabs } from '@arco-design/web-vue'
import { useModal } from '@gopowerteam/modal-render'
import { type FormItemsOptions, FormRender } from '..'

export default defineComponent({
  props: {
    form: {
      type: Object as PropType<FormItemsOptions>,
      required: true,
    },
    value: {
      type: Object,
    },
  },
  setup(props) {
    const modal = useModal()
    const formItems = props.form.map(item => ({ ...item, collapsed: false }))
    const groups = Array.from(new Set(formItems.map(x => x.group).flat().filter(Boolean))) as string[]
    const groupForms = formItems.reduce<{ group: string;instance?: any;form: FormItemsOptions }[]>((result, item) => {
      (item.group ? [item.group].flat() : ['默认']).forEach((key) => {
        let current = result.find(x => x.group === key)
        if (!current) {
          current = {
            group: key,
            instance: undefined,
            form: [],
          }
          result.push(current)
        }

        current.form.push(item)
      })
      return result
    }, []).sort((x, y) => {
      return x.group === '默认' ? -1 : y.group === '默认' ? 1 : x.group > y.group ? -1 : 1
    })
    const activeTab = ref('默认')

    const onSubmit = () => {
      const group = groupForms.find(x => x.group === activeTab.value)

      if (group && group.instance) {
        const formSource = group.instance.formSource
        group.instance.validate().then(() => {
          modal.close(formSource)
        })
      }
    }

    const onReset = () => {
      const group = groupForms.find(x => x.group === activeTab.value)
      if (group && group.instance) {
        group.instance.reset()
      }
    }

    return {
      formItems,
      groups,
      groupForms,
      activeTab,
      onSubmit,
      onReset,
    }
  },
  render() {
    const defaultGroup = this.groupForms.find(x => x.group === this.activeTab)
    if (!this.groups.length) {
      return <>
        <FormRender form={this.formItems} ref={(instance: any) => defaultGroup!.instance = instance}></FormRender>
        <Divider></Divider>
        <div class="flex items-center justify-between space-x-2">
          <Button type="secondary" size="large" onClick={this.onReset}>重置</Button>
          <Button class="w-100px" type="primary" size="large" onClick={this.onSubmit}>搜索</Button>
        </div>
      </>
    }
    else {
      return <Tabs v-model:active-key={this.activeTab}>
        { this.groupForms.map(item => (
           <TabPane title={item.group} key={item.group}>
            <FormRender form={item.form} value={this.value} ref={(instance: any) => item.instance = instance}></FormRender>
            <Divider></Divider>
            <div class="flex items-center justify-between space-x-2">
              <Button type="secondary" size="large" onClick={this.onReset}>重置</Button>
              <Button class="w-100px" type="primary" size="large" onClick={this.onSubmit}>搜索</Button>
            </div>
           </TabPane>
        ))}

      </Tabs>
    }
  },
})
