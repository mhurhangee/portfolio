import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container py-10">
      <div className="flex flex-col items-center justify-center space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Welcome to Mastra.ai Demo
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
            Explore the power of AI with our interactive demos
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-5xl">
          <Link href="/completion" className="transition-transform hover:scale-105">
            <Card>
              <CardHeader>
                <CardTitle>Text Generation</CardTitle>
                <CardDescription>
                  Generate text responses using Mastra.ai
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Try our text generation model to create human-like responses for any prompt.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}