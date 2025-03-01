import type { Config } from 'tailwindcss'
import uiConfig from '@workspace/ui/tailwind.config'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
    '../../packages/blog/src/**/*.{js,ts,jsx,tsx}',
  ],
  presets: [uiConfig],
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config