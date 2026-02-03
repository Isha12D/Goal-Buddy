// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174, // Your frontend port
    proxy: {
      // '/api': {
      //   target: 'http://localhost:3006', // Your backend API server
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, ''), // Remove /api prefix before forwarding to backend
      // },
      // '/socket.io': {
      //   target: 'http://localhost:3006',
      //   ws: true, // Enable WebSocket proxying for socket.io
      //   changeOrigin: true,
      // },
    },
  },
});

