import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd()); // Cargar variables de entorno

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@assets': path.resolve(__dirname, 'public/assets'),
        '@svg': path.resolve(__dirname, 'public/assets/svg'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@views': path.resolve(__dirname, 'src/views'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@data': path.resolve(__dirname, 'src/data'),
      },
    },

    server: {
      proxy: {
        "/api": {
          target: env.VITE_BACKEND_URL || "http://localhost:4000/",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});