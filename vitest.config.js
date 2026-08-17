import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify('https://lkqlrfbywtjdvnpslazy.supabase.co'),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify('sb_publishable_jedzHNx-TzQ5iD7B5oFRdQ_JEzv5iZo'),
    'import.meta.env.VITE_API_URL': JSON.stringify(''),
    'import.meta.env.VITE_VIDA360_REAL_DATA_ENABLED': JSON.stringify('false'),
    'import.meta.env.VITE_FST_APP_REAL_DATA_ENABLED': JSON.stringify('false'),
  },
  test: {
    environment: 'jsdom',
    include: ['src/__tests__/**/*.test.jsx'],
  },
});
