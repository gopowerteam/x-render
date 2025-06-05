import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import jsx from '@vitejs/plugin-vue-jsx'
import components from 'unplugin-vue-components/vite'
import { TableRenderResolver } from '@gopowerteam/table-render'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
  },
  plugins: [
    vue(),
    jsx(),
    components({
      dts: 'src/components.d.ts',
      resolvers: [
        TableRenderResolver(),
      ],
      include: [/\.vue$/, /\.vue\?vue/],
    }),
  ],
})
