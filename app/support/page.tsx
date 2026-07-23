import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { TicketForm } from '@/components/support/ticket-form'

export const metadata = {
  title: 'Support - AUAPW',
  description: 'Get help from our customer support team',
}

export default function SupportPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-[58px]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Customer Support</h1>
            <p className="text-lg text-foreground/70">
              We're here to help. Submit a support ticket and our team will respond within 24 hours.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Support Channels */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Phone Support</h3>
                  <p className="text-sm text-foreground/70">1-800-PARTS-USA</p>
                  <p className="text-xs text-foreground/50">Mon-Fri, 8am-6pm PST</p>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="font-semibold text-foreground mb-2">Email Support</h3>
                  <p className="text-sm text-foreground/70">support@auapw.com</p>
                  <p className="text-xs text-foreground/50">Response within 24 hours</p>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="font-semibold text-foreground mb-2">Live Chat</h3>
                  <p className="text-sm text-foreground/70">Available 24/7</p>
                  <p className="text-xs text-foreground/50">Click the chat icon in corner</p>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="font-semibold text-foreground mb-2">Response Time</h3>
                  <p className="text-sm text-foreground/70">Average: 2-4 hours</p>
                  <p className="text-xs text-foreground/50">Weekdays during business hours</p>
                </div>
              </div>
            </div>

            {/* Ticket Form */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-lg p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Submit a Ticket</h2>
                <TicketForm />
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-12 pt-12 border-t border-border">
            <h2 className="text-2xl font-bold text-foreground mb-8">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-foreground mb-2">What's your warranty policy?</h3>
                <p className="text-sm text-foreground/70">
                  All parts come with a 30-180 day warranty depending on the category. See product pages for specifics.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">How do I track my order?</h3>
                <p className="text-sm text-foreground/70">
                  You'll receive a tracking number via email as soon as your order ships. You can also check your
                  dashboard.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Can I return a part?</h3>
                <p className="text-sm text-foreground/70">
                  Yes, we offer 30-day returns on most parts if they are unused and in original condition.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Do you offer installation help?</h3>
                <p className="text-sm text-foreground/70">
                  We provide installation guides with every part. For specific installation questions, contact support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
