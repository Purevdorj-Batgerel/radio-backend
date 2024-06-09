import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  if (!env.WWW_HOST) {
    throw new Error('WWW_HOST not declared in the .env file')
  }
  if (!env.WWW_PORT) {
    throw new Error('WWW_PORT not declared in the .env file')
  }

  return {
    plugins: [react()],
    server: {
      host: env.WWW_HOST,
      port: parseInt(env.WWW_PORT),
    },
  }
})
