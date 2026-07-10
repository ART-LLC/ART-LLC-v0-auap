'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Truck, Package, Shield, MapPin, Clock, DollarSign } from 'lucide-react'

export function ShippingInfo() {
  return (
    <section className="py-12 md:py-20 bg-card/50">
      <div className="mx-auto max-w-[1000px] px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">Shipping & Delivery</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Standard Shipping */}
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <Truck className="w-5 h-5 text-primary" />
                <CardTitle>Standard Shipping</CardTitle>
                <Badge className="ml-auto">FREE</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-foreground">3-5 Business Days</p>
                <p className="text-sm text-muted-foreground">Included on all orders</p>
              </div>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Continental United States</li>
                <li>• Real-time tracking provided</li>
                <li>• Insured for full value</li>
                <li>• Professional packaging</li>
              </ul>
            </CardContent>
          </Card>

          {/* Expedited Shipping */}
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <Truck className="w-5 h-5 text-accent" />
                <CardTitle>Expedited Shipping</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-foreground">Next Business Day</p>
                <p className="text-sm text-muted-foreground">Call for pricing</p>
              </div>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Available on select items</li>
                <li>• Order by 2pm EST for same day</li>
                <li>• Full tracking and updates</li>
                <li>• Premium packaging included</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Shipping Process */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              How Shipping Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { icon: Clock, title: "Order Placed", desc: "24hr processing" },
                { icon: Package, title: "Packed", desc: "Professional packaging" },
                { icon: Truck, title: "Shipped", desc: "Tracking sent via email" },
                { icon: MapPin, title: "Delivered", desc: "3-5 business days" }
              ].map((step, i) => {
                const Icon = step.icon
                return (
                  <div key={i} className="text-center">
                    <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <p className="font-semibold text-sm mb-1">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.desc}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Shipping Guarantees */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Shield, title: "100% Insured", desc: "All shipments fully insured for protection" },
            { icon: DollarSign, title: "Money Back", desc: "30-day satisfaction guarantee on all orders" },
            { icon: Truck, title: "Free Returns", desc: "Free return shipping on defective parts" }
          ].map((guarantee, i) => {
            const Icon = guarantee.icon
            return (
              <Card key={i} className="border-border/50 text-center">
                <CardContent className="pt-6">
                  <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">{guarantee.title}</h3>
                  <p className="text-sm text-muted-foreground">{guarantee.desc}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
