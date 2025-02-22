import { MastraClient } from "@mastra/client-js";
import { NextResponse } from "next/server";

interface ErrorWithResponse extends Error {
  response?: {
    data?: unknown;
    status?: number;
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages } = body;

    console.log("Body:", body);
    console.log("Messages:", messages);
    console.log("API URL:", 'http://localhost:4111');
    
    console.log("AUTH TOKEN (first 10 chars):", process.env.AUTH_TOKEN?.substring(0, 10));

    const client = new MastraClient({
      baseUrl: 'http://localhost:4111',
    });

    const agents = await client.getAgents();
    console.log("Agents:", agents);
    
    console.log("Attempting to get agent: completion");
    const agent = client.getAgent("completion");
    
    console.log("Calling generate with messages:", messages);
    const response = await agent.generate({ messages });
    
    console.log("Response:", response);
    return NextResponse.json(response);
  } catch (error) {
    const err = error as ErrorWithResponse;
    console.error('Detailed Error:', {
      message: err.message,
      stack: err.stack,
      response: err.response?.data,
      status: err.response?.status,
    });
    
    return NextResponse.json(
      { error: 'Failed to generate response', details: err.message },
      { status: err.response?.status || 500 }
    );
  }
}
