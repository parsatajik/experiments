/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#1f2937', // text-gray-800
            h1: {
              color: '#1f2937',
            },
            h2: {
              color: '#1f2937',
            },
            h3: {
              color: '#1f2937',
            },
            h4: {
              color: '#1f2937',
            },
            p: {
              color: '#1f2937',
            },
            strong: {
              color: '#1f2937',
            },
            li: {
              color: '#1f2937',
            },
            a: {
              color: '#3b82f6',
              '&:hover': {
                color: '#2563eb',
              },
            },
            code: {
              color: '#1f2937',
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
              background: 'rgba(0, 0, 0, 0.1)',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            blockquote: {
              color: '#4b5563', // text-gray-600
              borderLeftColor: '#e5e7eb', // border-gray-200
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}