/** @type {import('tailwindcss').Config} */
export default {
	// Hover styles only apply on devices with a real pointer, so taps don't leave them stuck on.
	future: { hoverOnlyWhenSupported: true },
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
				mono: ['"Geist Mono Variable"', 'ui-monospace', '"SF Mono"', 'Menlo', 'Consolas', 'monospace'],
			},
			animation: {
				'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
				'fade-in': 'fadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
				'blob-spin': 'blobSpin 20s linear infinite',
			},
			keyframes: {
				fadeInUp: {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				blobSpin: {
					from: { transform: 'rotate(0deg)' },
					to: { transform: 'rotate(360deg)' },
				}
			},
			colors: {
				surface: {
					50: '#fafafa',
					100: '#f5f5f5',
					200: '#e5e5e5',
					300: '#d4d4d4',
					400: '#a3a3a3',
					500: '#737373',
					600: '#525252',
					700: '#404040',
					800: '#262626',
					850: '#1a1a1a',
					900: '#171717',
					950: '#0a0a0a',
				},
				accent: {
					DEFAULT: '#a16207',
					50: '#fefce8',
					100: '#fef9c3',
					200: '#fef08a',
					300: '#fde047',
					400: '#facc15',
					500: '#a16207',
					600: '#854d0e',
					700: '#713f12',
				},
			},
			letterSpacing: {
				tight: '-0.02em',
				tighter: '-0.03em',
			},
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
	],
	darkMode: 'class',
}
