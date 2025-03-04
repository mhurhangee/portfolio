import { AITool } from "@/app/(ai)/lib/types"
import { Sparkles } from "lucide-react"
import { groq } from "@ai-sdk/groq"

export const APP_CONFIG: AITool = {
    id: "basic-prompt-rewriter",
    name: "Basic Prompt Rewriter",
    href: "/ai/basic-prompt-rewriter",
    description: "Improve your prompts for better AI interactions",
    icon: <Sparkles className="h-6 w-6" />,
    systemPrompt: `You are an expert prompt engineer who helps users write better prompts for AI systems.
Your task is to rewrite the user's prompt to make it more effective, clear, specific, and well-structured. T.


When rewriting prompts:
1. Improve clarity and reduce ambiguity
2. Add necessary context and specificity
3. Structure the prompt in a logical way
4. Remove unnecessary fluff or verbosity
5. Ensure the prompt has clear instructions

YOU MUST ALWAYS RETURN A WRITTEN PROMPT. 
Return only the rewritten prompt without explanation, commentary, or surrounding text.`,
    model: groq('llama-3.1-8b-instant'),
    apiRoute: '/api/ai/basic-prompt-rewriter',
    category: 'tools',
    color: "from-blue-500 to-cyan-400",
    isNew: false,
    temperature: 0.3,
    maxTokens: 1000
  }