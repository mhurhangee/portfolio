"use client"

import { Button } from "@workspace/ui/components/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { ModeToggle } from "../components/mode-toggle"
import { FlipWords } from "@workspace/ui/components/flipwords"
import { User2, Bot } from "lucide-react"
import { container, item } from "../lib/animation"

export default function Home() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-4">
      <div className="absolute right-4 top-4">
        <ModeToggle />
      </div>
      
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="container space-y-24 text-center"
      >
        <motion.div className="space-y-8">
          <motion.h1
            variants={item}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tighter"
          >
            Welcome to <span className="text-blue-500">Super</span><span className="text-green-500">fier</span>
          </motion.h1>
          
          <motion.h2 variants={item} 
            className="text-2xl sm:text-3xl tracking-tighter font-light font-mono text-muted-foreground"
          >
            a portfolio by michael hurhangee
          </motion.h2>
        </motion.div>
        
        <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <Link href="/aboutme">
            <Button size="lg" className="text-lg px-8 py-6 space-x-2">
              <User2 className="h-5 w-5" />
              <span>About me</span>
            </Button>
          </Link>
          
          <Link href="/ai">
            <Button size="lg" variant="outline" className="text-lg py-6 space-x-2">
              <Bot className="h-5 w-5" />
              <span>AI Playground</span>
            </Button>
          </Link>
        </motion.div>

        <motion.div
          variants={item}
          className="text-sm text-muted-foreground pt-8"
        >          
          <FlipWords
            words={[
              "Building a better future for all with AI.",
              "Exploring the intersection of AI and creative development",
              "Building innovative solutions",
              "Crafting digital experiences"
            ]}
          />
        </motion.div>
      </motion.div>
    </div>
  )
}