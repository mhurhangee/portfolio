import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: ['src/index.ts', 'src/server.ts'],
    format: ['esm'],
    dts: true,
    clean: true,
    external: [
      'react',
      'react-dom',
      'next',
      '@workspace/ui',
      'lucide-react',
      'next/image',
      'next/link',
      'framer-motion',
      'gray-matter',
      'next-mdx-remote'
    ],
    treeshake: true,
    sourcemap: true,
    minify: true,
    env: {
      NODE_ENV: 'production'
    }
  }
])
