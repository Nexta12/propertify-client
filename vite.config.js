import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/components'),
      '@context': path.resolve(__dirname, './src/context'),
      '@api': path.resolve(__dirname, './src/api'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@customTypes': path.resolve(__dirname, './src/customTypes'),
      '@routes': path.resolve(__dirname, './src/routes'), // Fix for @routes alias
      '@store': path.resolve(__dirname, './src/store'),
      '@dummy': path.resolve(__dirname, './src/dummy'),
    },
  },
  preview: {
    port: 3002,
     allowedHosts: ['propertifynig.com']

  },
 
})
