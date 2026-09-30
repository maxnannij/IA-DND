import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Obligatorio para GitHub Pages: https://maxnannij.github.io/IA-DND/
  base: '/IA-DND/',
})
