'use client'

import * as React from 'react'
import { PostList } from '@workspace/blog'
import { motion } from 'framer-motion'
import type { PostMeta } from '@workspace/blog'

interface BlogPageClientProps {
  posts: PostMeta[]
}

export function BlogPageClient({ posts }: BlogPageClientProps) {
  return (
    <div className="py-8 pt-24">
      <motion.header 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-2">Blog</h1>
        <p className="text-lg text-muted-foreground">
          Thoughts, ideas, and learnings about software development and AI
        </p>
      </motion.header>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <PostList posts={posts} />
      </motion.div>
    </div>
  )
}
