'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface PartDetails {
  category: string
  condition: string
  source: string
  mileage: string
  warranty: string
  testing: string[]
  includes: string[]
  compatibility: string[]
}

const DEFAULT_DETAILS: PartDetails = {
  category: "Engine & Motor",
  condition: "Used - Good Condition",
  source: "Certified Auto Salvage Yards",
  mileage: "80,000 - 120,000 miles average",
  warranty: "90-Day Manufacturer Warranty",
  testing: [
    "Full functionality test performed",
    "Visual inspection for damage",
    "Component verification",
    "Quality assurance check"
  ],
  includes: [
    "Main assembly",
    "All original components",
    "Installation documentation",
    "Warranty certificate"
  ],
  compatibility: [
    "Compatible with multiple vehicle models",
    "Year range verification included",
    "Make and model specifications provided",
    "VIN verification assistance available"
  ]
}

export function PartsDetails({ details = DEFAULT_DETAILS }: { details?: PartDetails }) {
  return (
    <section className="py-12 md:py-20">
      <div className="mx-auto max-w-[1000px] px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">Parts Details & Specifications</h2>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="testing">Testing & QA</TabsTrigger>
            <TabsTrigger value="compatibility">Compatibility</TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Part Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Category</p>
                      <p className="font-semibold">{details.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Condition</p>
                      <div className="flex gap-2">
                        <Badge variant="outline">{details.condition}</Badge>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Source</p>
                      <p className="font-semibold text-sm">{details.source}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Average Mileage</p>
                      <p className="font-semibold text-sm">{details.mileage}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">What's Included</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {details.includes.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-primary font-bold mt-0.5">✓</span>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Warranty & Protection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold mb-2">{details.warranty}</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Covers defects in materials and workmanship</li>
                    <li>• Valid from date of purchase</li>
                    <li>• Full refund or replacement offered</li>
                    <li>• Free return shipping on warranty claims</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testing & QA Tab */}
          <TabsContent value="testing" className="space-y-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Quality Assurance Process</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {details.testing.map((test, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold text-sm">{i + 1}</span>
                      </div>
                      <div>
                        <p className="font-semibold">{test}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-accent/5 p-4 rounded-lg border border-accent/20">
                  <p className="text-sm">
                    <span className="font-semibold">Our Commitment:</span> Every single part that leaves our facility has passed rigorous testing and inspection. We work with certified salvage yards and experienced technicians to ensure quality standards.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compatibility Tab */}
          <TabsContent value="compatibility" className="space-y-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Vehicle Compatibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {details.compatibility.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 pb-4 border-b border-border/30 last:border-0 last:pb-0">
                    <span className="text-primary mt-1">→</span>
                    <p className="text-sm">{item}</p>
                  </div>
                ))}

                <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm font-semibold mb-2">Need help with compatibility?</p>
                  <p className="text-sm text-muted-foreground">
                    Our experts can verify fitment for your specific vehicle. Call (888) 818-5001 or use the Get Quote button with your vehicle details.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
