import { groq } from '@ai-sdk/groq'

export const LLM_CONFIG = {
  MODEL: groq('llama-3.1-8b-instant'),
  SYSTEM_PROMPT: 'You are a helpful assistant.  Keep your responses short and to the point.',
  MAX_TOKENS: 256,
  TEMPERATURE: 0.3,
  RUNTIME: 'edge',
  MAX_DURATION: 30,
  MAX_INPUT_LENGTH: 256,
  WELCOME_MESSAGE: 'Hello! Welcome to the chatbot interface. This is an example of a simple and elegant interface that is packed full of features and functionality.' 
}