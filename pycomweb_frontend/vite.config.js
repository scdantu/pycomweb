import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

const env = loadEnv(process.env.NODE_ENV, process.cwd(), 'VITE_');

// https://vitejs.dev/config/
export default defineConfig({
  base: env.VITE_BASE_URL || '/',
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  },
  plugins: [react()],
})


console.log("===============================")
console.log(env.VITE_BASE_URL)
console.log(process.env.NODE_ENV)