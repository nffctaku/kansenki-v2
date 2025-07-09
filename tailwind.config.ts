import type { Config } from 'tailwindcss'

const config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'fixed',
    'bottom-0',
    'left-0',
    'right-0',
    'bg-white',
    '!bg-white',
    'bg-white',
    'text-black',
    'bg-teal-600',
    'text-white',
    'text-center',
    'py-4',
    'z-[9999]',
    'text-sm',
    'translate-x-0',
    '-translate-x-[110%]',
  ],
  theme: {
    extend: {
      colors: {
        'vuitton-brown': '#4E3629',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config
