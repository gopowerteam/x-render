import type { FieldRule } from '@arco-design/web-vue'
import type { CSSProperties } from 'vue'
import type { FormItemRenders } from '../form-items'

/**
 * 表单项配置
 */
export interface FormItemOptions<T = Record<string, any>> {
  key: keyof T | string
  title: string
  default?: any | (() => any) | (() => Promise<any>)
  collapsed?: boolean
  group?: string | string[]
  visiable?: boolean | ((record: T) => boolean)
  span?: number
  hideLabel?: boolean
  labelStyle?: CSSProperties
  contentStyle?: CSSProperties
  rule?: FieldRule | FieldRule[]
  render?: FormItemRender<T>
}

export interface FormItemStringKeyOptions<T = Record<string, any>> extends FormItemOptions<T> {
  key: string
}
export interface FormItemTypeKeyOptions<T = Record<string, any>> extends FormItemOptions<T> {
  key: keyof T
}

/**
 * 表单配置
 */
export type FormItemsOptions<T = Record<string, any>> = Array<FormItemOptions<T>>

export type FormItemsTypeKeyOptions<T= Record<string, any>> = FormItemTypeKeyOptions<T>[]
export type FormItemsStringKeyOptions<T = Record<string, any>> = FormItemStringKeyOptions<T>[]

/**
 * Render函数
 */
export interface FormItemRender<T = Record<string, any>> {
  (
    render: FormItemRenderFun<T>
  ): FormItemRenderReturn<T>

}

export interface FormItemRenderReturn<T> {
  (data: T, itemOptions: FormItemOptions<T>): JSX.Element
}
/**
 * Render函数模板
 */
export type FormItemRenderFun<T> = ReturnType<typeof FormItemRenders<T>> & { [key: string]: any }
