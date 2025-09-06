// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';
export default defineConfig({
    plugins: [
        react({
            // Ensure React plugin is configured properly
            include: '**/*.{js,jsx,ts,tsx}',
        }),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
    build: {
        // Explicitly set empty lib configuration to avoid issues
        lib: false,
        outDir: 'dist',
        // Clear output directory before build
        emptyOutDir: true,
    },
    // Ensure we're not in lib mode accidentally
    define: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    },
});
