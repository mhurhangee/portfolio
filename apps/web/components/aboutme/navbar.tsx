"use client"

import { ModeToggle } from "../mode-toggle"
import Link from "next/link"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@workspace/ui/components/button"
import { Home, Menu } from "lucide-react"
import { ScrollBeam } from "./scrollbeam"
import { cn } from "@workspace/ui/lib/utils"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@workspace/ui/components/sheet"
import { useSection } from "./sectioncontext"

const navItems = [
  { 
    name: "About", 
    section: "hero",
    activeClass: "bg-foreground text-background"
  },
  { 
    name: "Services", 
    section: "services",
    activeClass: "bg-gradient-to-r from-red-500 to-red-600 text-foreground"
  },
  { 
    name: "Expertise", 
    section: "expertise",
    activeClass: "bg-gradient-to-r from-blue-500 to-blue-600 text-foreground"
  },
  { 
    name: "Story", 
    section: "story",
    activeClass: "bg-gradient-to-r from-yellow-300 to-yellow-400 text-foreground"
  },
  { 
    name: "Contact", 
    section: "contact",
    activeClass: "bg-gradient-to-r from-green-500 to-green-600 text-foreground"
  },
]

export function NavBar() {
  const [isOpen, setIsOpen] = useState(false)
  const { currentSection, scrollToSection } = useSection()

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 h-12 flex items-center justify-between px-4 md:px-8 z-[1000] backdrop-blur-sm text-foreground"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1.0 }}
      >
        <Link href="/">
          <Button variant="ghost" size="icon">
            <Home className="w-4 h-4" />
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                size="sm"
                className={cn(
                  "font-mono transition-all duration-300",
                  currentSection === item.section && item.activeClass
                )}
                onClick={() => scrollToSection(item.section)}
              >
                {item.name}
              </Button>
            ))}
            <ModeToggle />
          </div>

          <div className="md:hidden">
          <ModeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] p-0">
                <SheetHeader className="px-6 py-4 text-left border-b">
                  <SheetTitle className="font-mono text-lg">Navigation</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col py-4">
                  {navItems.map((item) => (
                    <Button
                      key={item.name}
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "font-mono transition-all duration-300 rounded-none justify-start h-14",
                        "hover:bg-muted/50",
                        currentSection === item.section && item.activeClass
                      )}
                      onClick={() => {
                        scrollToSection(item.section)
                        setIsOpen(false)
                      }}
                    >
                      <span className="px-6">{item.name}</span>
                    </Button>
                  ))}
                      
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.nav>
      <ScrollBeam />
    </>
  )
}
