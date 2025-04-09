module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // =============================================
        // BACKGROUND COLORS - Edit these directly
        // =============================================
        // Light mode background colors
        lightMode: {
          // Main background color for light mode
          background: '#ffffff',
          // Navbar background for light mode (can use rgba for transparency)
          navbar: 'rgba(255, 255, 255, 0.95)',
          // Card background for light mode
          card: '#f9fafb',
          // Secondary background for light mode (for sections, etc)
          secondary: '#f1f5f9',
        },
        
        // Dark mode background colors - PRESERVING ORIGINAL DARK THEME
        darkMode: {
          // Main background color for dark mode
          background: '#0F1429',  // Original dark blue
          // Navbar background for dark mode
          navbar: '#0F1429', 
          // Card background for dark mode (with transparency)
          card: 'rgba(0, 0, 0, 0.2)',
          // Secondary background for dark mode (for sections, etc)
          secondary: 'rgba(0, 0, 0, 0.3)',
        },

        // =============================================
        // TEXT COLORS - Edit these directly
        // =============================================
        // Light mode text colors
        lightText: {
          // Primary text color for light mode
          primary: '#0f172a',
          // Secondary text color for light mode
          secondary: '#475569',
          // Muted text color for light mode
          muted: '#94a3b8',
        },

        // Dark mode text colors - PRESERVING ORIGINAL
        darkText: {
          // Primary text color for dark mode
          primary: '#ffffff',
          // Secondary text color for dark mode
          secondary: '#cbd5e1',
          // Muted text color for dark mode
          muted: '#94a3b8',
        },

        // =============================================
        // ACCENT COLORS - Edit these directly
        // =============================================
        // Button and highlight colors
        button: {
          // Primary button color (light mode)
          light: '#2960e6',
          // Primary button color (dark mode) - KEEP ORIGINAL BLUE 
          dark: '#3b82f6',
          // Secondary button color (light mode)
          secondaryLight: '#8c52ff',
          // Secondary button color (dark mode)
          secondaryDark: '#b38fff',
        },
        
        // =============================================
        // EXISTING COLORS - For compatibility
        // =============================================
        primary: {
          light: '#2960e6', // blue primary for light mode
          dark: '#3b82f6',  // original blue for dark mode
        },
        accent: {
          light: '#8c52ff', // purple accent for light mode
          dark: '#b38fff',  // lighter purple for dark mode
        },
        background: {
          light: '#ffffff',
          dark: '#0F1429', // original dark blue background
        },
        card: {
          light: '#f9fafb', // light gray for cards in light mode
          dark: 'rgba(0, 0, 0, 0.2)', // original semi-transparent black
        },
        navbar: {
          light: 'rgba(255, 255, 255, 0.95)',
          dark: '#0F1429', // original dark blue for navbar
        },
        dark: {
          100: '#ffffff', // original white text for dark mode
          200: '#cbd5e1', // secondary text color for dark mode
          300: '#94a3b8', // muted text color for dark mode
          bg: '#0F1429',  // original main background
          card: 'rgba(0, 0, 0, 0.2)', // original card background
          accent: '#3b82f6', // original accent color
        },
        link: {
          text: '#2960e6', // link color for light mode
          dark: '#ffffff', // white link color for dark mode
        },
      },
    },
  },
  plugins: [],
}; 