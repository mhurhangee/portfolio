// File: /home/mjh/front/apps/web/app/(ai)/ai/[slug]/page.tsx

import React from "react"
import { getToolBySlug } from "@/app/(ai)/lib/playground-config"
import { notFound } from "next/navigation"
import dynamic from "next/dynamic"

// Import the prompt rewriter component
const PromptRewriterTool = dynamic(() => import("@/app/(ai)/ai-apps/prompt-rewriter/app"))

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tool = getToolBySlug(slug)
  
  // If no tool configuration is found, return 404
  if (!tool) {
    notFound()
  }

  // Render the appropriate tool UI based on the tool type
  const renderToolUI = () => {
    if (tool.id === 'prompt-rewriter') {
      return <PromptRewriterTool />
    }
    
    // Default fallback
    return <div>Tool type not supported yet</div>
  }

  return (
    <div className="container max-w-4xl py-10">
      {renderToolUI()}
    </div>
  )
}