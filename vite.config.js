import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { setEnv } from './plugins'
console.log('Loaded vitest config')

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  esbuild: {
    loader: 'jsx',
    include: /(src)\/.*\.jsx?$/,
    exclude: [],
  },
  plugins: [react()],
  test: {
    // 👋 add the line below to add jsdom to vite
    environment: 'jsdom',
    // hey! 👋 over here
    globals: true,
    setupFiles: './tests/setup.js', // assuming the test folder is in the root of our project
  },
  define: setEnv(mode)
}))