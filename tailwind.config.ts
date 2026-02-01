import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Base colors
                charcoal: '#1a1a2e',
                graphite: '#16213e',
                slate: '#0f3460',

                // Text colors
                'off-white': '#f5f5f0',
                'warm-gray': '#a0a0a0',
                'muted-text': '#6b7280',

                // Accent
                cyan: {
                    DEFAULT: '#4ecdc4',
                    hover: '#45b7aa',
                    subtle: 'rgba(78, 205, 196, 0.1)',
                },

                // Additional accents
                magenta: '#e94560',
                purple: '#533483',

                // Status
                success: '#10b981',
                warning: '#f59e0b',
                error: '#ef4444',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                serif: ['Merriweather', 'Georgia', 'serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
            },
            backgroundColor: {
                card: 'rgba(26, 26, 46, 0.8)',
            },
            borderColor: {
                card: 'rgba(78, 205, 196, 0.2)',
            },
            boxShadow: {
                card: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
                'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
};

export default config;
