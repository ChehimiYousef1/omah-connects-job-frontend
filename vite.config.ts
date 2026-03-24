import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Optional: if you need Node polyfills
      buffer: 'buffer/',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis', // required for some Node libraries
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({ buffer: true }), // polyfill Buffer
        NodeModulesPolyfillPlugin(), // polyfill Node modules like events, process
      ],
    },
  },
  server: {
    port: 5173, // default Vite port
    open: true, // automatically open in browser
    fs: {
      strict: false, // allow accessing files outside root
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // your Express backend
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''), // optional if your backend doesn't use /api prefix
      },
    },
  },
})
