/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		colors: {
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))',
  				'50': '#FEF9E7',
  				'100': '#FDF2C9',
  				'200': '#FAE494',
  				'300': '#F7D55E',
  				'400': '#F5C842',
  				'500': '#E8B430',
  				'600': '#D4A020',
  				'700': '#B8870F',
  				'800': '#8C6508',
  				'900': '#604504'
  			},
  			brown: {
  				'50': '#FAF5F0',
  				'100': '#F0E6D8',
  				'200': '#DCC9A8',
  				'300': '#C4A87A',
  				'400': '#A0785A',
  				'500': '#6B4226',
  				'600': '#4F3018',
  				'700': '#3B2A1A',
  				'800': '#2A1E12',
  				'900': '#1A120A'
  			},
  			neutral: {
  				'0': '#FFFFFF',
  				'50': '#FAFAF8',
  				'100': '#F5F5F2',
  				'200': '#E8E8E4',
  				'300': '#D4D4D0',
  				'400': '#A3A3A0',
  				'500': '#6B6B6B',
  				'600': '#4B4B4B',
  				'700': '#333333',
  				'800': '#1A1A1A',
  				'900': '#0F0F0F',
  				'950': '#080808'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}