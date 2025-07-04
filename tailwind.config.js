// tailwind.config.js

module.exports = {

  content: [
    './app/**/*.{js,ts,jsx,tsx}',
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
    extend: {},
  },
  plugins: [],
};
