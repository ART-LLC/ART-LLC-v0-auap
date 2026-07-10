"use client"

import { CheckCircle2, Handshake, Award, Wrench } from "lucide-react"

const values = [
  {
    title: "Your Trusted US Partner",
    description: "As a US-based platform, we connect car owners and repair professionals with America's most reliable junkyards and salvage yards. Our commitment to quality relationships ensures you always have a dependable partner in sourcing auto parts.",
    Icon: Handshake
  },
  {
    title: "Premium Quality Guarantee",
    description: "Every supplier in our nationwide network is vetted for quality and reliability. We only connect you with yards that meet our strict standards, ensuring you receive genuine OEM parts that perform like new.",
    Icon: Award
  },
  {
    title: "Comprehensive Solutions",
    description: "From engines and transmissions to body parts and accessories, our extensive US network covers all vehicle makes and models. One platform, thousands of qualified suppliers, endless possibilities.",
    Icon: Wrench
  }
]

export function BrandValuesSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-background via-background/95 to-background">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="font-sans text-[clamp(1.5rem,4vw,2.75rem)] font-black mercury-heading text-3d-section mb-4" style={{ fontFamily: 'system-ui', fontSize: '62px' }}>
            Why Choose AUAPW
          </h2>
          <p className="text-muted-foreground text-[0.9rem] sm:text-[1rem] leading-relaxed max-w-2xl mx-auto">
            Your reliable US-based platform connecting you with top junkyards and salvage yards nationwide. We make sourcing quality used auto parts simple, fast, and hassle-free.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-10 sm:mb-16">
          {values.map((value, idx) => (
            <div key={idx} className="group glass-card rounded-xl sm:rounded-2xl p-6 sm:p-8 backdrop-blur-sm border border-primary/10 hover:border-primary/20 transition-all duration-300">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <value.Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground text-3d-subtle mb-2 sm:mb-3">{value.title}</h3>
              <p className="text-muted-foreground text-[0.85rem] sm:text-[0.95rem] leading-relaxed tracking-tight">
                {value.description}
              </p>
            </div>
          ))}
        </div>

        {/* Main Value Proposition */}
        <div className="glass-card rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 backdrop-blur-sm border border-primary/10 mb-10 sm:mb-16">
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground text-3d-subtle mb-4 sm:mb-6">The AUAPW Advantage</h3>
          
          <div className="space-y-3 sm:space-y-4">
            <div className="flex gap-3 sm:gap-4">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5 sm:mt-1" />
              <p className="text-muted-foreground text-[0.85rem] sm:text-[0.95rem] leading-relaxed tracking-tight">
                <strong className="text-foreground">2,000+ Verified US Suppliers:</strong> We collaborate with the top junkyards and salvage yards across all 50 states, giving you access to America&apos;s largest network of quality used auto parts.
              </p>
            </div>
            
            <div className="flex gap-3 sm:gap-4">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5 sm:mt-1" />
              <p className="text-muted-foreground text-[0.85rem] sm:text-[0.95rem] leading-relaxed tracking-tight">
                <strong className="text-foreground">User-Friendly Search Tool:</strong> Our intuitive platform makes finding used auto parts effortless. Simply enter your vehicle details and instantly connect with qualified suppliers who have the exact part you need.
              </p>
            </div>
            
            <div className="flex gap-3 sm:gap-4">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5 sm:mt-1" />
              <p className="text-muted-foreground text-[0.85rem] sm:text-[0.95rem] leading-relaxed tracking-tight">
                <strong className="text-foreground">Seamless Experience:</strong> No more roaming around junkyards or making endless phone calls. We handle the sourcing so you can focus on what matters – getting your vehicle back on the road.
              </p>
            </div>
          </div>
        </div>

        {/* Trust Statement */}
        <div className="text-center px-2">
          <div className="inline-block glass-card rounded-xl sm:rounded-2xl p-6 sm:p-8 backdrop-blur-sm border border-primary/10 max-w-2xl">
            <p className="text-foreground text-base sm:text-lg leading-relaxed tracking-tight">
              AUAPW.ORG is your reliable connector to America&apos;s finest salvage yards. We bring <span className="text-primary font-bold">top-quality service, verified suppliers, and a seamless experience</span> right to your fingertips – no hassle, no guesswork, just quality parts delivered.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
