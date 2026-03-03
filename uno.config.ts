import { defineConfig, presetUno } from 'unocss'
// @ts-ignore presetIcons type mismatch with UnoCSS 66.x
import presetIcons from '@unocss/preset-icons'

export default defineConfig({
  presets: [presetUno(), presetIcons()],
  safelist: ['justify-end'],
})
