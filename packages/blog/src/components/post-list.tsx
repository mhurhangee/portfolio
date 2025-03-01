"use client"

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@workspace/ui/components/card'
import { Badge } from '@workspace/ui/components/badge'
import { CalendarIcon } from 'lucide-react'
import type { PostMeta } from '../lib/types'

interface PostListProps {
  posts: PostMeta[]
}

export function PostList({ posts }: PostListProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {posts.map((post) => (
        <Link key={post.slug} href={`/blog/${post.slug}`} className="block h-full">
          <Card className="h-full overflow-hidden hover:border-foreground/50 transition-colors">
            {post.image && (
              <div className="relative h-48 w-full">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-6 flex flex-col gap-4">
              <div>
                <h2 className="text-xl font-semibold mb-2 line-clamp-2 leading-tight">
                  {post.title}
                </h2>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {post.description}
                </p>
              </div>

              <div className="mt-auto space-y-4">
                <div className="flex flex-wrap gap-2">
                  {post.tags?.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {post.tags && post.tags.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{post.tags.length - 3}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarIcon className="h-4 w-4" />
                  <time dateTime={post.date}>{post.date}</time>
                </div>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}