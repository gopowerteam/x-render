import type { FieldRule } from '@arco-design/web-vue'
import type { FormItemRenders } from '../form-items'

/**
 * 表单项配置
 */
export interface FormItemOptions<T = Record<string, any>> {
  key: string
  title: string
  default?: any | (() => any) | (() => Promise<any>)
  collapsed?: boolean
  visiable?: (record: T) => boolean
  span?: number
  minWidth?: number
  rule?: FieldRule | FieldRule[]
  render?: FormItemRender<T>
}

/**
 * 表单配置
 */
export type FormItemsOptions<T = Record<string, any>> = Array<FormItemOptions<T>>

/**
 * Render函数
 */
export interface FormItemRender<T = Record<string, any>> {
  (
    render: FormItemRenderFun
  ):
  (
    data: T,
    itemOptions: FormItemOptions<T>
  ) => JSX.Element
}

/**
 * Render函数模板
 */
export type FormItemRenderFun = typeof FormItemRenders & { [key: string]: any }
