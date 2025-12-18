/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ライトモード用カラー
        light: {
          bg: '#F0F9FF',
          'bg-sub': '#E0F2FE',
          text: '#334155',
          'text-sub': '#64748B',
          accent: '#7DD3FC',
          success: '#A7F3D0',
          error: '#FECACA',
          warning: '#FDE68A',
        },
        // ダークモード用カラー
        dark: {
          bg: '#0F172A',
          'bg-sub': '#1E293B',
          text: '#E0F2FE',
          'text-sub': '#94A3B8',
          accent: '#38BDF8',
          success: '#34D399',
          error: '#F87171',
          warning: '#FBBF24',
        },
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
      },
    },
  },
  plugins: [],
}
