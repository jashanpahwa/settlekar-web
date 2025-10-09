import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const config = {
    plugins: [react()],
  }
 
  if (command === 'serve') {
    // Development server configuration
    config.base = '/'
  } else {
    // Production build configuration
    config.base = 'https://jashanpahwa.github.io/settlekar-web/'
  }
 
  return config
})
