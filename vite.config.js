/**
 * Vite Configuration for GAUD-E SDK
 * Optimized for React 19, Three.js, and GAUD-E API integration
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

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
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three'],
          'react-three': ['@react-three/fiber', '@react-three/drei'],
          'vendors': ['react', 'react-dom', 'framer-motion'],
        },
      },
    },
  },

  resolve: {
    alias: {
      '@': '/src',
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
    // Make environment variables available in code
    'import.meta.env.VITE_GAUD_E_API_URL': JSON.stringify(
      process.env.VITE_GAUD_E_API_URL || 'https://api.gaude.ai/v1'
    ),
  },
});
