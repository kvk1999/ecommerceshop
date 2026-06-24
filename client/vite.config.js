import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // (or vue, depending on your stack)

export default defineConfig({
  base: './', // <--- ADD THIS EXACT LINE. IT MUST BE A RELATIVE PATH FOR MOBILE!
  plugins: [react()],
  // ... rest of your config
});