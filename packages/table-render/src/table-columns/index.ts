import { renderButtonColumn } from './button'
import { renderCurrencyColumn } from './currency'
import { renderDateColumn } from './date'
import { renderDictColumn } from './dict'
import { renderDropdownColumn } from './dropdown'
import { renderImageColumn } from './image'
import { renderPhoneColumn } from './phone'
import { renderRenderColumn } from './render'
import { renderTagColumn } from './tag'
import { renderTextColumn } from './text'
import { renderProgressColumn } from './progress'

export function TableColumnRenders<T>() {
  return {
    dropdown: renderDropdownColumn<T>,
    text: renderTextColumn<T>,
    dict: renderDictColumn<T>,
    tag: renderTagColumn<T>,
    render: renderRenderColumn<T>,
    phone: renderPhoneColumn<T>,
    image: renderImageColumn<T>,
    currency: renderCurrencyColumn<T>,
    date: renderDateColumn<T>,
    button: renderButtonColumn<T>,
    progress: renderProgressColumn<T>,
  }
}
