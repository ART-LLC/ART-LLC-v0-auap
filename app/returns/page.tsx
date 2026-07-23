import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata = {
  title: 'Returns - AUAPW',
  description: 'Return or exchange auto parts',
}

export default function ReturnsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-[58px]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Returns & Exchanges</h1>
            <p className="text-lg text-foreground/70">
              We stand behind our products. If you're not completely satisfied, we make returns easy.
            </p>
          </div>

          {/* Return Policy */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle>Return Window</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/70">
                  30 days from purchase date. Items must be unused and in original condition with all
                  original packaging.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Return Shipping</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/70">
                  Free return shipping on orders over $500. Other returns: flat rate $15 or carrier
                  cost.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Refunds</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/70">
                  Processed within 5-10 business days after we receive and inspect the return.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Defective Parts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/70">
                  Covered by warranty. Free replacement during warranty period with return shipping
                  covered.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Return Process */}
          <div className="bg-card border border-border rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">How to Return an Item</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Contact Us</h3>
                  <p className="text-foreground/70">
                    Submit a return request through your account or contact support@auapw.com
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Get Return Authorization</h3>
                  <p className="text-foreground/70">
                    We'll provide a return authorization number and shipping label
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Ship the Item Back</h3>
                  <p className="text-foreground/70">
                    Pack securely and ship using the provided label within 14 days
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">We Process Your Return</h3>
                  <p className="text-foreground/70">
                    We inspect the item and process your refund within 5-10 business days
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Request Return Button */}
          <div className="text-center">
            <h3 className="text-xl font-semibold text-foreground mb-4">Ready to start a return?</h3>
            <Button size="lg">Request a Return</Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
