module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {},
  },
  // eslint-disable-next-line global-require
  plugins: [require('@tailwindcss/forms')],
};
