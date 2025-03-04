// File: /home/mjh/front/apps/web/app/(ai)/lib/playground-config.tsx

import { AITool, AICategory } from "@/app/(ai)/lib/types"
import { APP_CONFIG as PromptRewriterConfig } from "../ai-apps/basic-prompt-rewriter/config";
import { APP_CONFIG as PromptTutorConfig } from "../ai-apps/prompt-tutor/config";

// Only define the prompt rewriter for now
export const aiTools: AITool[] = [
  PromptRewriterConfig,
  PromptTutorConfig
];

// Organize applications by category
export const aiCategories: AICategory[] = [
  {
    name: "Tools",
    description: "Utilities to enhance your AI workflow",
    apps: aiTools.filter(app => app.category === 'tools')
  },
  {
    name: "Assistants",
    description: "Specialized AI helpers for specific tasks",
    apps: aiTools.filter(app => app.category === 'assistants')
  }
];

// Helper function to find a tool by id (slug)
export function getToolBySlug(slug: string): AITool | undefined {
  return aiTools.find(tool => tool.id === slug);
}

// Helper function to find a tool by href
export function getToolByHref(href: string): AITool | undefined {
  return aiTools.find(tool => tool.href === href);
}

// Helper function to get all tools
export function getAllTools(): AITool[] {
  return aiTools;
}

// Helper function to get all apps (for backward compatibility)
export function getAllApps(): AITool[] {
  return aiTools;
}

// Helper function to get app by href (for backward compatibility)
export function getAppByHref(href: string): AITool | undefined {
  return getToolByHref(href);
}

// Helper function to get app by slug (for backward compatibility)
export function getAppBySlug(slug: string): AITool | undefined {
  return getToolBySlug(slug);
}