import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import unocss from 'unocss/vite'
import presetIcons from '@unocss/preset-icons'
import { presetUno } from 'unocss'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src', 'index.ts'),
      name: 'modal',
      fileName: 'index',
    },
    rollupOptions: {
      external: ['vue'],
      output: [
        {
          format: 'cjs',
        },
        {
          format: 'es',
        },
      ],
    },
  },
  plugins: [
    vue(),
    unocss({
      presets: [
        presetUno(),
        presetIcons({
          collections: {
            'icon-park-outline': () =>
              import('@iconify-json/icon-park-outline').then(i => i.icons),
          },
        }),
      ],
    }),
    dts(),
  ],
})
