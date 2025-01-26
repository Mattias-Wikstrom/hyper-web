import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'esnext', // Ensure Vite builds with the latest ECMAScript version
  },
  esbuild: {
    jsx: 'automatic', // Ensure JSX is handled properly
  },
});
