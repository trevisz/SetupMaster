module.exports = {
  content: ['./index.html', './renderer.js'],
  theme: {
    extend: {
      colors: {
        apple: { blue: '#007AFF', cyan: '#32ADE6', green: '#30D158', red: '#FF453A', yellow: '#FFD60A' },
        graphite: { 950: '#080B12', 900: '#0B0F17', 850: '#101621', 800: '#151D2A' }
      },
      fontFamily: { sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'] },
      boxShadow: { glass: '0 22px 70px rgba(0,0,0,.42)' }
    }
  },
  plugins: []
};
