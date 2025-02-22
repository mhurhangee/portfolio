import { Agent } from "@mastra/core/agent";
import { groq } from "@ai-sdk/groq";
 
export const completion = new Agent({
  name: "Completion",
  instructions: "You are a helpful assistant.",
  model: groq('llama-3.3-70b-versatile', ),
});