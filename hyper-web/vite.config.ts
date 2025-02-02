import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Read base URL from environment variable (with a default fallback)
const baseUrl = process.env.VITE_BASE_URL || '/hyper/';

export default defineConfig({
  plugins: [react()],
  base: baseUrl,
});