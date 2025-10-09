import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const config = {
    plugins: [react()],
    // Use relative path for GitHub Pages deployment
    base: command === 'build' ? '/settlekar-web/' : '/',
  }
  
  return config
})
