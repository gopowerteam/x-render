import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import jsx from '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'
import { vitePluginForArco as arco } from '@arco-plugins/vite-vue'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'modules',
    lib: {
      entry: [
        resolve(__dirname, 'src/index.ts'),
        // resolve(__dirname, 'resolver.ts'),
      ],
      name: 'bundle',
      fileName: (format, name) => `${format}/${name}.${format === 'es' ? 'mjs' : 'cjs'}`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      treeshake: true,
      external: ['vue', '@arco-design/web-vue', 'dayjs', 'mitt'],
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
      tsconfigPath: './tsconfig.dts.json',
    }),
    arco({
      style: 'css',
    }) as any,
  ],
})
