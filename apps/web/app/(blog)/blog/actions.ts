'use server'

import path from 'node:path'
import { getAllPosts, getPostBySlug } from '@workspace/blog/lib/server'

export async function getPosts() {
  const contentDir = path.join(process.cwd(), '../../packages/blog/content')
  return getAllPosts(contentDir)
}

export async function getPost(slug: string) {
  const contentDir = path.join(process.cwd(), '../../packages/blog/content')
  return getPostBySlug(contentDir, slug)
}