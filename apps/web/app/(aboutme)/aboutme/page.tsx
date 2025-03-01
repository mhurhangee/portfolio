"use client"

import { NavBar } from "@/components/aboutme/navbar"
import { Hero } from "@/components/aboutme/mehero"
import { ExpertiseAndAchievements } from "@/components/aboutme/expertise"
import { ContactMe } from "@/components/aboutme/contactme"
import { MyStory } from "@/components/aboutme/mystory"
import { Services } from "@/components/aboutme/services"
import { Section } from "@/components/aboutme/section"
import { SectionProvider } from "@/components/aboutme/sectioncontext"
import { Spotlight } from "@workspace/ui/components/spotlight"
import { MainNav } from "@/components/main-nav"

export default function Home() {
    return (
      <SectionProvider>
        <div className="min-h-screen">
          <MainNav />
          <div className="space-y-16">
            <Spotlight />
            <Section id="hero">
              <Hero />
            </Section>
            <Section id="services">
              <Services />
            </Section>
            <Section id="expertise">
              <ExpertiseAndAchievements />
            </Section>
            <Section id="story">
              <MyStory />
            </Section>
            <Section id="contact">
              <ContactMe />
            </Section>
          </div>
        </div>
      </SectionProvider>
    )
}