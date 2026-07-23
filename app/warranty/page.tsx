import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata = {
  title: 'Warranty Registration - AUAPW',
  description: 'Register your auto parts warranty',
}

export default function WarrantyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-[58px]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Warranty Registration</h1>
            <p className="text-lg text-foreground/70">
              Protect your investment. Register your auto parts warranty to ensure full coverage.
            </p>
          </div>

          {/* Warranty Coverage */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Engines</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary mb-2">180 Days</p>
                <p className="text-sm text-foreground/70">
                  Full coverage against manufacturer defects and workmanship issues.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Transmissions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary mb-2">90 Days</p>
                <p className="text-sm text-foreground/70">
                  Covers shifting issues, fluid leaks, and component failures.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Other Parts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary mb-2">30-180 Days</p>
                <p className="text-sm text-foreground/70">
                  Varies by category. See product pages for specific terms.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* What's Covered */}
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">What's Covered</h2>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-green-500">✓</span>
                  <span className="text-foreground/70">Manufacturing defects</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-500">✓</span>
                  <span className="text-foreground/70">Workmanship issues</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-500">✓</span>
                  <span className="text-foreground/70">Component failures</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-500">✓</span>
                  <span className="text-foreground/70">Parts replacement</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-500">✓</span>
                  <span className="text-foreground/70">Return shipping</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">What's NOT Covered</h2>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-red-500">✗</span>
                  <span className="text-foreground/70">Improper installation</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500">✗</span>
                  <span className="text-foreground/70">Accidents or damage</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500">✗</span>
                  <span className="text-foreground/70">Normal wear and tear</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500">✗</span>
                  <span className="text-foreground/70">Modifications</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500">✗</span>
                  <span className="text-foreground/70">After warranty expiration</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Registration Form */}
          <div className="bg-card border border-border rounded-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-6">Register Your Warranty</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Order Number *
                </label>
                <input
                  type="text"
                  placeholder="ORD-123456789"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Part/Product Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Honda Accord 2.4L Engine"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Purchase Date *
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Installation Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Comments
                </label>
                <textarea
                  rows={4}
                  placeholder="Any additional information..."
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <Button className="w-full">Register Warranty</Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
