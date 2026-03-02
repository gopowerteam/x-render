import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import presetIcons from '@unocss/preset-icons'

import vue from '@vitejs/plugin-vue'
import jsx from '@vitejs/plugin-vue-jsx'
import { presetUno } from 'unocss'
import unocss from 'unocss/vite'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'esnext',
    lib: {
      entry: [resolve(__dirname, 'src/index.ts')],
      name: 'bundle',
      fileName: (format, name) =>
        `${format}/${name}.${format === 'es' ? 'mjs' : 'cjs'}`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      treeshake: true,
      external: ['vue'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  plugins: [
    vue(),
    jsx(),
    dts({
      entryRoot: resolve(__dirname, 'src'),
      outDir: ['dist/cjs', 'dist/es'],
      copyDtsFiles: false,
      tsconfigPath: './tsconfig.json',
    }),
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
  ],
})
