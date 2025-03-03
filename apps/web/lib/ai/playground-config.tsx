// File: /home/mjh/front/apps/web/lib/ai/playground-config.ts

import { BotMessageSquare } from "lucide-react";
import { ReactNode } from "react";

export interface AIApp {
  name: string;
  href: string;
  description: string;
  icon: ReactNode;
  color: string;
  category: 'chat' | 'tools' | 'generators' | 'assistants';
  isNew?: boolean;
  isExperimental?: boolean;
}

export interface AICategory {
  name: string;
  description: string;
  apps: AIApp[];
}

// Define all AI applications with their details
export const aiApps: AIApp[] = [
  {
    name: "Prompt Rewriter",
    href: "/ai/prompt-rewriter",
    description: "Improve your prompts for better AI interactions",
    color: "from-blue-500 to-cyan-400",
    icon: <BotMessageSquare className="h-6 w-6" />,
    category: 'tools',
    isNew: true
  }
];

// Organize applications by category
export const aiCategories: AICategory[] = [
  {
    name: "Tools",
    description: "Utilities to enhance your AI workflow",
    apps: aiApps.filter(app => app.category === 'tools')
  }
];

// Helper function to find an app by href
export function getAppByHref(href: string): AIApp | undefined {
  return aiApps.find(app => app.href === href);
}

// Helper function to get all apps (flat list)
export function getAllApps(): AIApp[] {
  return aiApps;
}