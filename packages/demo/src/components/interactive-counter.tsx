"use client"

import { useState, useEffect } from 'react'
import { Card } from '@workspace/ui/components/card'
import { Button } from '@workspace/ui/components/button'
import { PlusCircle, MinusCircle, RotateCcw, Clock } from 'lucide-react'

export function InteractiveCounter() {
  const [count, setCount] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)

  // Client-side only effect to demonstrate browser APIs
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1)
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])

  return (
    <Card className="p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Client-Side Counter</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>{timeElapsed}s elapsed</span>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <div className="text-4xl font-bold">{count}</div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setCount(c => c - 1)}
            >
              <MinusCircle className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setCount(0)}
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setCount(c => c + 1)}
            >
              <PlusCircle className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <p className="text-sm text-gray-500">
          This component uses the "use client" directive and React hooks for client-side interactivity.
        </p>
      </div>
    </Card>
  )
}