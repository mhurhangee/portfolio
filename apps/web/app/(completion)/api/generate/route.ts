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

    const client = new MastraClient({
      baseUrl: 'http://localhost:4111',
    });

    const agent = client.getAgent("completion");
    
    const response = await agent.generate({ messages });
    
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
