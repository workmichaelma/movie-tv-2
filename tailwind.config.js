module.exports = {
  content: ['./components/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    borderWidth: {
      1: '1px',
      2: '2px',
      3: '3px',
      4: '4px',
    },
    extend: {
      zIndex: {
        100: '100',
      },
    },
  },
  plugins: [],
  corePlugins: require('tailwind-rn/unsupported-core-plugins'),
}
