import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { vitePluginForArco as arco } from '@arco-plugins/vite-vue'
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
      entry: [
        resolve(__dirname, 'src/index.ts'),
        resolve(__dirname, 'src/resolver.ts'),
      ],
      name: 'bundle',
      fileName: (format, name) =>
        `${format}/${name}.${format === 'es' ? 'mjs' : 'cjs'}`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      treeshake: true,
      external: ['vue', '@arco-design/web-vue', 'dayjs'],
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
    arco({
      style: 'css',
    }) as any,
    unocss({
      presets: [presetUno()],
      safelist: ['justify-end'],
    }),
  ],
})
