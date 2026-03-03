import { renderCascaderItem } from './cascader'
import { renderCurrencyItem } from './currency'
import { renderDateItem } from './date'
import { renderDateRangeItem } from './date-range'
import { renderInputItem } from './input'
import { renderRadioItem } from './radio'
import { renderRenderItem } from './render'
import { renderSelectItem } from './select'
import { renderSwitchItem } from './switch'
import { renderTextareaItem } from './textarea'
import { renderTreeSelectItem } from './tree-select'

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
    currency: renderCurrencyItem<T>,
    radio: renderRadioItem<T>,
  }
}
