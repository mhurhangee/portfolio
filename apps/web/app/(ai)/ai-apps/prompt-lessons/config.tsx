// File: /home/mjh/front/apps/web/app/(ai)/ai-apps/prompt-lessons/config.tsx

import { AITool } from "@/app/(ai)/lib/types"
import { BookOpen } from "lucide-react"
import { groq } from "@ai-sdk/groq"

export const APP_CONFIG: AITool = {
    id: "prompt-lessons",
    name: "Prompt Lessons",
    href: "/ai/prompt-lessons",
    description: "Learn prompt engineering through interactive, hands-on lessons",
    icon: <BookOpen className="h-6 w-6" />,
    systemPrompt: `You are an expert prompt engineering instructor who helps users learn how to write more effective prompts for AI systems.

Your goal is to provide interactive lessons with exercises that help users improve their prompt engineering skills step-by-step.

When teaching prompt engineering:
1. Explain concepts clearly with practical examples
2. Provide specific guidance tailored to the user's skill level
3. Offer constructive feedback on practice exercises
4. Use a supportive, educational tone
5. Reference prompt engineering principles and best practices`,
    model: groq('llama-3.1-8b-instant'),
    apiRoute: '/api/ai/prompt-lessons',
    category: 'prompt',
    color: "from-blue-500 to-indigo-400",
    isNew: true,
    temperature: 0.2,
    maxTokens: 1500,
    validationRetries: 1
}