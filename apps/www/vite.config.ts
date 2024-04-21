import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

if (!process.env.WWW_HOST) {
  throw new Error('WWW_HOST not declared in the .env file')
}
if (!process.env.WWW_PORT) {
  throw new Error('WWW_PORT not declared in the .env file')
}

export default defineConfig({
  plugins: [solid()],
  server: {
    host: process.env.WWW_HOST,
    port: parseInt(process.env.WWW_PORT),
  },
})
