import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import eslint from 'vite-plugin-eslint'
import { resolve } from 'path'

const pjoneServer = 'http://127.0.0.1:1304/'
const modaServer = 'http://127.0.0.1:3007/'
export default defineConfig({
  base: '/pjone/',
  server: {
    port: 1305,
    proxy: {
      '/pjone-server': {
        target: pjoneServer,
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/pjone-server/, '')
      },
      '/api': {
        target: modaServer,
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
  },
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    eslint({
      include: ['src/**/*.js', 'src/**/*.vue', 'src/*.js', 'src/*.vue']
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // 路径别名
    },
    extensions: ['.js', '.json', '.ts'] // 使用路径别名时想要省略的后缀名，可以自己 增减
  },
  build: {
    outDir: 'pjone'
  }
})
