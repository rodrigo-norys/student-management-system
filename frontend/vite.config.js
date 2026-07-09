import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// Parser precisa tratar .js como JSX — via esbuild.loader (transform)
// e optimizeDeps (pré-bundle do dev).
// tsconfigPaths lê o baseUrl:"src" do jsconfig e replica os imports absolutos do CRA.
export default defineConfig({
  plugins: [react({ include: '**/*.{js,jsx}' }), tsconfigPaths()],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' },
    },
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: 'build',
  },
});
