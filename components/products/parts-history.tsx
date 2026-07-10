'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Clock, FileText, Wrench } from 'lucide-react'

export function PartsHistory() {
  const history = [
    {
      stage: "Sourcing",
      icon: CheckCircle2,
      description: "Parts sourced from certified auto salvage yards across our 2,000+ yard network",
      details: [
        "Certified vehicle donors",
        "Accident history documented",
        "Clean title verification"
      ]
    },
    {
      stage: "Inspection",
      icon: Wrench,
      description: "Comprehensive inspection and testing by certified technicians",
      details: [
        "Full functional testing",
        "Visual damage assessment",
        "Component compatibility check",
        "Serial number verification"
      ]
    },
    {
      stage: "Processing",
      icon: Clock,
      description: "Careful removal, cleaning, and preparation for shipment",
      details: [
        "Professional removal process",
        "Thorough cleaning",
        "Protective packaging",
        "Quality assurance review"
      ]
    },
    {
      stage: "Documentation",
      icon: FileText,
      description: "Complete documentation and warranty registration",
      details: [
        "Condition documentation",
        "Warranty certificate",
        "Installation guide",
        "Fitment verification"
      ]
    }
  ]

  return (
    <section className="py-12 md:py-20 bg-card/50">
      <div className="mx-auto max-w-[1000px] px-4">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Parts History & Journey</h2>
          <p className="text-lg text-muted-foreground">
            From salvage yard to your vehicle - complete transparency in every step
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 via-primary/30 to-primary/10 transform -translate-x-1/2" />

          <div className="space-y-8 md:space-y-12">
            {history.map((item, index) => {
              const Icon = item.icon
              return (
                <div key={index} className="relative">
                  {/* Timeline dot */}
                  <div className="hidden md:block absolute left-1/2 top-6 w-4 h-4 bg-primary rounded-full transform -translate-x-1/2 border-4 border-background" />

                  <Card className={`border-border/50 ${index % 2 === 0 ? 'md:mr-auto md:w-1/2 md:pr-8' : 'md:ml-auto md:w-1/2 md:pl-8'}`}>
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">{item.stage}</CardTitle>
                        <Badge className="ml-auto" variant="outline">Step {index + 1}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      <ul className="space-y-2">
                        {item.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-primary mt-1">•</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { number: "2,000+", label: "Certified Yards" },
            { number: "100%", label: "Tested & Verified" },
            { number: "90 Days", label: "Warranty Coverage" }
          ].map((stat, i) => (
            <Card key={i} className="border-border/50 text-center">
              <CardContent className="pt-6">
                <p className="text-3xl font-bold text-primary mb-2">{stat.number}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Section */}
        <Card className="mt-12 border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle>Why Trust AUAPW for Parts?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Industry-leading quality standards",
                "Transparent sourcing and testing",
                "Expert technical support team",
                "30-day money-back guarantee",
                "Free shipping on all orders",
                "Fast, reliable delivery"
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-primary font-bold text-lg mt-0.5">✓</span>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
