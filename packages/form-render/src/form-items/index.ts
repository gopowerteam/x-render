import { renderDateItem } from './date'
import { renderInputItem } from './input'
import { renderSelectItem } from './select'
import { renderSwitchItem } from './switch'
import { renderDateRangeItem } from './date-range'
import { renderTextareaItem } from './textarea'
import { renderRenderItem } from './render'

export const FormItemRenders = {
  input: renderInputItem,
  textarea: renderTextareaItem,
  select: renderSelectItem,
  date: renderDateItem,
  switch: renderSwitchItem,
  dateRange: renderDateRangeItem,
  render: renderRenderItem,
}
