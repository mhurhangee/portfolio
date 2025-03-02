import * as React from 'react'
import { getPosts } from './actions'
import { BlogPostList } from '@/components/blog/blog-post-list'

export const dynamic = 'force-static'

export default async function BlogPage() {
  const posts = await getPosts()
  return <BlogPostList posts={posts} />
}