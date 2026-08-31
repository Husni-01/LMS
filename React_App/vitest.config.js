import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react'; // If using Vite

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom', // Simulates the browser DOM
        globals: true,        // Allows using 'describe', 'it', 'expect' without importing them
    },
});
