import { type PropType, type RendererNode, type VNode, computed, defineComponent, onMounted, provide, ref } from 'vue'
import { Button, type FieldRule, Form, type FormInstance, FormItem, Grid, GridItem, Space, Tag } from '@arco-design/web-vue'
import { IconDown, IconSearch, IconUp } from '@arco-design/web-vue/es/icon'
import { ModalProvider } from '@gopowerteam/modal-render'
import type { DataRecord, FormItemsOptions } from '../interfaces'
import { provides } from '../config/provide.config'
import { createFormSource } from '../utils/create-form-source'
import { renderFormItem } from './form-item-render'
import FormCollapsedDialog from './form-collapsed-dialog'

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
      default: 400,
    },
    name: {
      type: String,
      required: false,
      default: `form-${Math.random().toString(32).slice(2)}`,
    },
    id: {
      type: String,
      required: false,
      default: `form-${Math.random().toString(32).slice(2)}`,
    },
    collapsedMode: {
      type: String as PropType<'append' | 'dialog'>,
      required: false,
      default: 'append',
    },
    showFormResult: {
      type: Boolean,
      required: false,
      default: (props: { collapsedMode: 'append' | 'dialog' }) => props.collapsedMode === 'dialog',
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
    'validate',
  ],
  setup(props, { emit }) {
    const formInstance = ref<FormInstance>()
    const [formSource, _updateFormSource] = createFormSource(props.form, props.modelValue || props.value)
    const formColumns = ref(props.columns || 0)
    const formCollspased = ref<boolean>(true)
    const modalInstance = ref<any>()
    const toggleFormCollapsed = () => formCollspased.value = !formCollspased.value
    provide(provides.id, props.id)
    provide(provides.source, formSource)

    const onSubmitSuccess = () => {
      emit('submit', formSource.value)
      emit('update:model-value', formSource.value)
    }

    const formItems = computed(() => {
      return props.form
        .filter(item => formCollspased.value ? !item.collapsed : true)
        .filter((item) => {
          switch (true) {
            case typeof item.visiable === 'boolean':
              return item.visiable
            case typeof item.visiable === 'function':
              return (item.visiable as Function)(formSource.value)
            default:
              return true
          }
        })
    })

    const formActiosSpan = computed(() => {
      if (!formColumns.value) {
        return 1
      }

      const itemSpans = formItems.value.reduce((result, item) => {
        return result + (item?.span || 1)
      }, 0)

      return formColumns.value - itemSpans % formColumns.value
    })

    const proxyFormItemRule = (rule: FieldRule<any>) => {
      if (rule?.validator) {
        return {
          ...rule,
          validator: (value: any, callback: (error?: string) => void) => {
            const cb = rule.validator!(value, callback) as unknown
            if (typeof cb === 'function') {
              return cb(formSource.value)
            }
          },
        }
      }
      else {
        return rule
      }
    }

    const formRules = computed(() => {
      return props.form.reduce<Record<string, FieldRule | FieldRule[]>>((rules, item) => {
        if (item.rule) {
          if (Array.isArray(item.rule)) {
            rules[item.key as string] = item.rule.map(proxyFormItemRule)
          }
          else {
            rules[item.key as string] = proxyFormItemRule(item.rule)
          }
        }
        return rules
      }, {})
    })

    function updateFormColumnValue() {
      if (props.columns) {
        return
      }

      const form = formInstance.value?.$el as HTMLFormElement

      if (form) {
        formColumns.value = Math.max(Math.floor(form.offsetWidth / props.minWidth), 1)
      }
    }

    function updateFormElementId() {
      const form = formInstance.value?.$el as HTMLFormElement

      if (form) {
        form.id = props.id
      }
    }

    function openCollapsedDialog() {
      modalInstance.value.open(FormCollapsedDialog, {
        form: props.form,
        value: formSource.value,
      }, {
        title: '高级搜索',
        footer: false,
        submitText: '搜索',
      }).then((data: DataRecord) => {
        if (data) {
          updateFormSource(data)
          onSubmitSuccess()
        }
      })
    }

    onMounted(() => {
      updateFormColumnValue()
      updateFormElementId()
    })

    function updateFormSource(value: DataRecord) {
      _updateFormSource({
        ...formSource.value,
        ...(value || {}),
      })
    }

    function updateFormField(key: string, value: any) {
      formSource.value[key] = value

      updateFormSource({
        ...formSource.value,
      })
    }

    function resetFormField(key: string) {
      const formItem = props.form.find(item => item.key === key)!
      const value = (typeof formItem.default === 'function' ? formItem.default() : formItem.default) || null

      updateFormField(key, value)
    }

    function resetForm() {
      formInstance.value?.resetFields()
    }

    function validateForm() {
      return formInstance.value?.validate()
    }

    onMounted(() => {
      if (window) {
        window.addEventListener('resize', updateFormColumnValue)
      }
    })

    return ({
      formSource,
      formInstance,
      formColumns,
      formRules,
      formCollspased,
      formActiosSpan,
      formItems,
      toggleFormCollapsed,
      updateFormField,
      resetFormField,
      updateFormSource,
      reset: resetForm,
      validate: validateForm,
      onSubmitSuccess,
      openCollapsedDialog,
      modalInstance,
    })
  },
  render() {
    const renderFormResult = () => {
      if (!this.showFormResult) {
        return
      }

      const items = this.form.filter((item) => {
        const value = this.formSource[item.key as string]
        return value !== null && value !== undefined && value !== ''
      })

      const resetField = (key: string) => {
        const formItem = this.formItems.find(item => item.key === key)
        if (formItem && !formItem?.collapsed) {
          this.formInstance?.resetFields(key as string)
        }
        else {
          this.resetFormField(key)
        }
      }

      return (
        <GridItem span={this.formColumns}>
          <FormItem label='搜索条件'>
            <div class="w-full mt-5px text-left">
                <Space wrap={true} align="center">
                  {
                    items.length > 0
                      ? items.map((item) => {
                        return (
                          <Tag key={item.key} closable onClose={() => resetField(item.key as string)}>
                            <div class="flex space-x-2">
                              <div class="text-#999">{item.title}:</div>
                              <div class="text-#333">
                                {renderFormItem(this.formSource, {
                                  ...item,
                                  key: item.key as string,
                                  mode: 'text',
                                })}
                              </div>
                            </div>
                          </Tag>
                        )
                      })
                      : (<div class="text-#999">暂无搜索条件</div>)
                  }
              </Space>
          </div>
        </FormItem>
      </GridItem>
      )
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
        if (this.collapsedMode === 'append') {
          buttons.push(<Button onClick={this.toggleFormCollapsed}>{{
            default: () => this.formCollspased ? '展开' : '收起',
            icon: () => this.formCollspased ? (<IconDown></IconDown>) : (<IconUp></IconUp>),
          }}</Button>)
        }

        if (this.collapsedMode === 'dialog') {
          buttons.push(<Button onClick={this.openCollapsedDialog}>{{
            default: () => '高级搜索',
            icon: () => <IconSearch></IconSearch>,
          }}</Button>)
        }
      }

      if (this.$slots.actions) {
        buttons.push(
          ...this.$slots.actions(),
        )
      }

      if (buttons.length) {
        return (
        <GridItem {...gridOptions}>
          <FormItem contentClass={this.footer ? 'form-footer' : ''}>
            <Space>
              {buttons}
            </Space>
          </FormItem>
        </GridItem>
        )
      }
    }

    return (
     <div class="form-render">
       <ModalProvider ref={ (modal: any) => this.modalInstance = modal as any}>
          <Form {...({ name: this.name })}
                labelAlign='right'
                layout={this.$props.layout}
                rules={this.formRules}
                onSubmitSuccess={this.onSubmitSuccess}
                auto-label-width
                ref={(instance: unknown) => this.formInstance = instance as any}
                model={this.formSource}>
                <Grid cols={this.formColumns} col-gap={24} rol-gap={10}>
                  {
                    this.formItems.filter(() => this.formColumns !== 0).map(item => (
                      <GridItem span={item.span}>
                        {renderFormItem(this.formSource, item)}
                      </GridItem>
                    ))
                  }
                  {
                    renderFormActions()
                  }
                  {
                    renderFormResult()
                  }
                </Grid>
          </Form>
      </ModalProvider>
     </div>
    )
  },
})

export type FormRenderInstance = InstanceType<typeof FormRender>
