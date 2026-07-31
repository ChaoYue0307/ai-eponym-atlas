import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS ? '/ai-eponym-atlas/' : '/',
  build: {
    target: 'es2022',
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'react-vendor',
              test: /node_modules[\\/](?:react|react-dom|scheduler)[\\/]/,
              priority: 30,
            },
            {
              name: 'math-vendor',
              test: /node_modules[\\/]katex[\\/]/,
              priority: 20,
            },
            {
              name: 'icons-vendor',
              test: /node_modules[\\/]lucide-react[\\/]/,
              priority: 15,
            },
            {
              name: 'catalog-data',
              test: /content[\\/](?:eponyms|people-media)\.json$/,
              priority: 10,
            },
          ],
        },
      },
    },
  },
})
