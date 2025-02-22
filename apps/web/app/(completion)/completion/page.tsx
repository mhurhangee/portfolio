"use client";

import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { Textarea } from "@workspace/ui/components/textarea";

export default function CompletionGeneratePage() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResponse(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: input }],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate response');
      }

      const res = await response.json();

      setResponse(res.text || "No response received"); // Access the content safely
    } catch (error) {
      setResponse("Error fetching response");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Completion Generate</CardTitle>
          <CardDescription>Simple implementation of Mastra.ai agent: generate response based on a prompt.</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Ask something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button onClick={handleSendMessage} disabled={loading} className="mt-4 w-full">
            {loading ? "Generating..." : "Send"}
          </Button>
          {response && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-100">
              <strong>Response:</strong>
              <p>{response}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
