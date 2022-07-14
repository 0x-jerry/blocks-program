/// <reference types="vitest/globals" />
import { defineConfig } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  base: './',
  plugins: [vueJsx()],
  test: {
    globals: true,
    environment: 'jsdom'
  }
})
