/**
 * Vite Configuration for GAUD-E SDK
 * Configured as LIBRARY BUILD for npm publishing
 * Supports CJS + ESM dual output
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,
    strictPort: false,
    open: true,
  },

  preview: {
    port: 4173,
  },

  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'GaudeSDK',
      formats: ['es', 'cjs'],
      fileName: (format) => \`index.\${format === 'es' ? 'es' : 'cjs'}.js\`,
    },
    rollupOptions: {
      // Externalize peer dependencies — NOT bundled into the SDK
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'three',
        '@react-three/fiber',
        '@react-three/drei',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
          three: 'THREE',
          '@react-three/fiber': 'ReactThreeFiber',
          '@react-three/drei': 'Drei',
        },
      },
    },
    sourcemap: true,
    minify: 'terser',
    outDir: 'dist',
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      'framer-motion',
      'lucide-react',
    ],
  },

  define: {
    'import.meta.env.VITE_GAUD_E_API_URL': JSON.stringify(
      process.env.VITE_GAUD_E_API_URL || 'https://api.gaude.ai/v1'
    ),
  },
});
