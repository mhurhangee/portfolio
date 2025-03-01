"use client"

import Link from 'next/link'
import { Button } from '@workspace/ui/components/button'
import { ChevronLeft, ChevronRight, ScrollText } from 'lucide-react'
import type { PostMeta } from '@workspace/blog/types'

interface BlogNavProps {
  prevPost?: PostMeta
  nextPost?: PostMeta
  position?: 'top' | 'bottom'
}

export function BlogNav({ prevPost, nextPost, position = 'bottom' }: BlogNavProps) {
  return (
    <nav 
      className={`
        flex items-center justify-between w-full gap-2
        ${position === 'top' ? 'mb-8 pt-24' : 'mt-8 pb-16'}
      `}
    >
      <div className="w-[40%] flex justify-start">
        {prevPost ? (
          <Button variant="ghost" asChild className="w-full justify-start">
            <Link href={`/blog/${prevPost.slug}`} className="flex items-center gap-2 min-w-0">
              <ChevronLeft className="h-4 w-4 flex-shrink-0" />
              <span className="hidden sm:inline truncate">{prevPost.title}</span>
              <span className="sm:hidden">Previous</span>
            </Link>
          </Button>
        ) : (
          <div />
        )}
      </div>

      <Button variant="ghost" asChild className="flex-shrink-0">
        <Link href="/blog">
          <ScrollText className="h-4 w-4" />
        </Link>
      </Button>

      <div className="w-[40%] flex justify-end">
        {nextPost ? (
          <Button variant="ghost" asChild className="w-full justify-end">
            <Link href={`/blog/${nextPost.slug}`} className="flex items-center gap-2 min-w-0">
              <span className="hidden sm:inline truncate">{nextPost.title}</span>
              <span className="sm:hidden">Next</span>
              <ChevronRight className="h-4 w-4 flex-shrink-0" />
            </Link>
          </Button>
        ) : (
          <div />
        )}
      </div>
    </nav>
  )
}
