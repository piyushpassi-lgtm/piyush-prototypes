import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// `base: './'` + hash routing lets the build run from any GitHub Pages sub-path.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  server: { host: true },
})
