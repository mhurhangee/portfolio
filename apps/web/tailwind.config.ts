import type { Config } from "tailwindcss"
import ui from "@workspace/ui/tailwind.config"
import typography from "@tailwindcss/typography"

const config = {
  // Extend the base UI config
  content: [
    ...ui.content,
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/blog/src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/demo/src/components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: ui.theme,
  plugins: [...ui.plugins, typography],
} satisfies Config

export default config