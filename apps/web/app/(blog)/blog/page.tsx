import * as React from 'react'
import { getPosts } from './actions'
import { BlogPageClient } from './client'

export const dynamic = 'force-static'

export default async function BlogPage() {
  const posts = await getPosts()
  return (
    <div className="container mx-auto px-4">
      <BlogPageClient posts={posts} />
    </div>
  )
}