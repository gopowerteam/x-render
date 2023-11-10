import { renderButtonColumn } from './button'
import { renderCurrencyColumn } from './currency'
import { renderDictColumn } from './dict'
import { renderImageColumn } from './image'
import { renderPhoneColumn } from './phone'
import { renderRenderColumn } from './render'
import { renderTagColumn } from './tag'
import { renderTextColumn } from './text'

export function TableColumnRenders<T>() {
  return {
    text: renderTextColumn<T>,
    dict: renderDictColumn<T>,
    tag: renderTagColumn<T>,
    render: renderRenderColumn<T>,
    phone: renderPhoneColumn<T>,
    image: renderImageColumn<T>,
    currency: renderCurrencyColumn<T>,
    date: renderCurrencyColumn<T>,
    button: renderButtonColumn<T>,
  }
}
