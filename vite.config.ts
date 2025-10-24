/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      }
    })],
    server: {
    headers: {
      // This is the one that matters for the popup warning
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      // optional: many setups also include COEP, leave it unset unless you need it
      // 'Cross-Origin-Embedder-Policy': 'require-corp',
    }
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
})
