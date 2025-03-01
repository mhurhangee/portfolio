"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@workspace/ui/components/card'
import { Badge } from '@workspace/ui/components/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@workspace/ui/components/avatar'
import { CalendarIcon, ClockIcon } from 'lucide-react'
import { BlogNav } from './blog-nav'
import type { Post, PostMeta } from '../types'

interface BlogLayoutProps {
  post: Post
  prevPost?: PostMeta
  nextPost?: PostMeta
  children: React.ReactNode
}

export function BlogLayout({ post, prevPost, nextPost, children }: BlogLayoutProps) {
  return (
    <div className="container max-w-4xl mx-auto px-4">
      <BlogNav prevPost={prevPost} nextPost={nextPost} position="top" />
      
      <Card className="overflow-hidden">
        {post.image && (
          <div className="relative h-[400px] w-full">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        <div className="p-6 md:p-8">
          <header className="mb-8 space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold">{post.title}</h1>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <Link href={post.author.link}>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.author.avatar} alt={post.author.name} />
                    <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex flex-col">
                  <Link href={post.author.link} className="font-medium hover:underline">
                    {post.author.name}
                  </Link>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4" />
                    <time dateTime={post.date}>{post.date}</time>
                    {post.readTime && (
                      <>
                        <span>•</span>
                        <ClockIcon className="h-4 w-4" />
                        <span>{post.readTime}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {post.tags && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </header>

          <article className="prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg max-w-none">
            {children}
          </article>
        </div>
      </Card>

      <BlogNav prevPost={prevPost} nextPost={nextPost} position="bottom" />
    </div>
  )
}
