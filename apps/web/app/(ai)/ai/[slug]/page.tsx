// File: /home/mjh/front/apps/web/app/(ai)/ai/[slug]/page.tsx

import React from "react"
import { getToolBySlug } from "@/app/(ai)/lib/playground-config"
import { notFound } from "next/navigation"
import dynamic from "next/dynamic"

// Import the prompt rewriter component
const BasicPromptRewriterTool = dynamic(() => import("@/app/(ai)/ai-apps/basic-prompt-rewriter/app"))
// Import the prompt tutor component
const PromptTutorTool = dynamic(() => import("@/app/(ai)/ai-apps/prompt-tutor/app"))

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tool = getToolBySlug(slug)
  
  // If no tool configuration is found, return 404
  if (!tool) {
    notFound()
  }

  // Render the appropriate tool UI based on the tool type
  const renderToolUI = () => {
    if (tool.id === 'basic-prompt-rewriter') {
      return <BasicPromptRewriterTool />
    }
    if (tool.id === 'prompt-tutor') {
      return <PromptTutorTool />
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