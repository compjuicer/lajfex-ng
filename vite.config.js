import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  root: 'src/ui',
  plugins: [
    vue(),
    {
      name: 'api-server',
      configureServer(server) {
        import('./src/api/api.js').then(({ createApp }) => {
          server.middlewares.use(createApp());
        });
      },
    },
  ],
  server: {
    port: 8888,
  },
  build: {
    outDir: '../../dist',
  },
});
