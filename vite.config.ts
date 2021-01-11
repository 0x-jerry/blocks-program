import { defineConfig } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  build: {
    base: './'
  },
  plugins: [vueJsx()]
})
