import { type PropType, type RendererNode, type VNode, computed, defineComponent, onMounted, provide, ref } from 'vue'
import { Button, type FieldRule, Form, type FormInstance, FormItem, Grid, GridItem, Space } from '@arco-design/web-vue'
import { IconDown, IconUp } from '@arco-design/web-vue/es/icon'
import type { FormItemsOptions } from '../interfaces'
import { provides } from '../config/provide.config'
import { createFormSource } from '../utils/create-form-source'
import { renderFormItem } from './form-item-render'

export const FormRender = defineComponent({
  props: {
    form: {
      type: Object as PropType<FormItemsOptions<any>>,
      required: true,
    },
    value: {
      type: Object as PropType<Record<string, any>>,
      required: false,
    },
    layout: {
      type: String as PropType<'horizontal' | 'vertical'>,
      required: false,
      default: 'horizontal',
    },
    columns: {
      type: Number,
      required: false,
    },
    modelValue: {
      type: Object as PropType<Record<string, any>>,
      required: false,
    },
    minWidth: {
      type: Number,
      required: false,
      default: 350,
    },
    name: {
      type: String,
      required: false,
      default: 'form',
    },
    submitable: {
      type: Boolean,
      required: false,
      default: false,
    },
    searchable: {
      type: Boolean,
      required: false,
      default: false,
    },
    footer: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: [
    'submit',
    'cancel',
    'update:model-value',
  ],
  expose: [
    'formSource',
    'updateFormField',
    'updateFormSource',
    'reset',
  ],
  setup(props) {
    const formId = Math.random().toString(32).slice(2).toUpperCase()
    const formInstance = ref<FormInstance>()
    const [formSource, updateFormSource] = createFormSource(props.form, props.modelValue || props.value)
    const formColumns = ref(props.columns || 0)
    const formCollspased = ref<boolean>(true)
    const toggleFormCollapsed = () => formCollspased.value = !formCollspased.value

    provide(provides.id, formId)
    provide(provides.source, formSource)

    const formActiosSpan = computed(() => {
      if (!formColumns.value) {
        return 1
      }

      const itemSpans = props.form.reduce((result, item) => {
        return result + (item?.span || 1)
      }, 0)

      return formColumns.value - itemSpans % formColumns.value
    })

    const formRules = computed(() => {
      return props.form.reduce<Record<string, FieldRule | FieldRule[]>>((rules, item) => {
        if (item.rule) {
          rules[item.key as string] = item.rule
        }
        return rules
      }, {})
    })

    function updateFormColumnValue() {
      if (formColumns.value === 0) {
        const form = formInstance.value?.$el as HTMLFormElement
        formColumns.value = Math.floor(form.offsetWidth / props.minWidth)
      }
    }

    onMounted(() => {
      updateFormColumnValue()
    })

    function updateFormField(key: string, value: any) {
      formSource.value[key] = value

      updateFormSource({
        ...formSource,
      })
    }

    function resetForm() {
      formInstance.value?.resetFields()
    }

    window.addEventListener('resize', updateFormColumnValue)

    return ({
      formId,
      formSource,
      formInstance,
      formColumns,
      formRules,
      formCollspased,
      formActiosSpan,
      toggleFormCollapsed,
      updateFormField,
      updateFormSource,
      reset: resetForm,
    })
  },
  render() {
    const onSubmitSuccess = () => {
      this.$emit('submit', this.formSource)
      this.$emit('update:model-value', this.formSource)
    }

    const renderFormActions = () => {
      const buttons: (JSX.Element | VNode<RendererNode>)[] = []

      const gridOptions = this.footer
        ? {
            span: this.formColumns,
          }
        : {
            span: this.formActiosSpan,
          }

      if (this.searchable) {
        buttons.push(<Button type="primary" htmlType='submit'>搜索</Button>)
        buttons.push(<Button type="secondary" onClick={() => this.formInstance?.resetFields()}>重置</Button>)
      }

      if (this.submitable) {
        buttons.push(<Button type="primary" htmlType='submit'>提交</Button>)
        buttons.push(<Button type="secondary" onClick={() => this.$emit('cancel')}>取消</Button>)
      }

      if (this.form.some(item => !!item.collapsed)) {
        buttons.push(<Button onClick={this.toggleFormCollapsed}>{{
          default: () => this.formCollspased ? '展开' : '收起',
          icon: () => this.formCollspased ? (<IconDown></IconDown>) : (<IconUp></IconUp>),
        }}</Button>)
      }

      if (this.$slots.actions) {
        buttons.push(
          ...this.$slots.actions(),
        )
      }

      if (buttons.length) {
        return (
        <GridItem {...gridOptions}>
          <FormItem hideLabel contentClass={this.footer ? 'form-footer' : ''}>
            <Space>
              {buttons}
            </Space>
          </FormItem>
        </GridItem>
        )
      }
    }

    return (
      <Form layout={this.$props.layout} rules={this.formRules} onSubmitSuccess={onSubmitSuccess} {...({ name: this.name })} auto-label-width ref={instance => this.formInstance = instance as any} model={this.formSource}>
        <Grid cols={this.formColumns} col-gap={10} rol-gap={10}>
          {this.form.filter(item => this.formCollspased ? !item.collapsed : true).map(item => (
            <GridItem span={item.span}>
              {renderFormItem(this.formSource, item)}
            </GridItem>
          ))}
          {
            renderFormActions()
          }
        </Grid>
      </Form>
    )
  },
})

export type FormRenderInstance = InstanceType<typeof FormRender>
