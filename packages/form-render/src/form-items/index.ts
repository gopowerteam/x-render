import { renderDateItem } from './date'
import { renderInputItem } from './input'
import { renderSelectItem } from './select'
import { renderSwitchItem } from './switch'
import { renderDateRangeItem } from './date-range'
import { renderTextareaItem } from './textarea'
import { renderTreeSelectItem } from './tree-select'
import { renderCascaderItem } from './cascader'
import { renderRenderItem } from './render'

export function FormItemRenders<T>() {
  return {
    input: renderInputItem<T>,
    textarea: renderTextareaItem<T>,
    select: renderSelectItem<T>,
    treeSelect: renderTreeSelectItem<T>,
    date: renderDateItem<T>,
    switch: renderSwitchItem<T>,
    dateRange: renderDateRangeItem<T>,
    render: renderRenderItem<T>,
    cascader: renderCascaderItem<T>,
  }
}
