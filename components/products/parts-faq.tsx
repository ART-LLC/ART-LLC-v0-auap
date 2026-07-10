'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'

const COMMON_FAQS = [
  {
    question: "What is the warranty on these used parts?",
    answer: "All our parts come with a 90-day warranty covering defects in materials and workmanship. We stand behind the quality of every part we sell. If you experience any issues, contact our customer service team for immediate assistance."
  },
  {
    question: "Do you offer free shipping?",
    answer: "Yes! We offer free shipping on all orders within the continental United States. Orders typically ship within 24 hours and arrive within 3-5 business days. For expedited shipping options, contact our sales team."
  },
  {
    question: "How do I know if this part fits my vehicle?",
    answer: "Each product listing includes detailed compatibility information with year, make, model, and engine specifications. Use our advanced search filters to narrow down options for your specific vehicle. Our experts are also available via phone or chat to help confirm fitment."
  },
  {
    question: "Are these parts tested and inspected?",
    answer: "Absolutely. Every part undergoes rigorous testing and quality inspection before shipping. We verify functionality, check for damage, and ensure all components are complete and working properly. All parts are sourced from our network of 2,000+ certified yards."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day money-back guarantee if you're not satisfied with your purchase. Simply contact us within 30 days of purchase for a full refund. Return shipping is free on defective parts; otherwise, standard return shipping applies."
  },
  {
    question: "Can I get a quote before purchasing?",
    answer: "Yes! You can request a quote for any product directly from the product page using the 'Get Quote' button. Our sales team will contact you within 2 hours with pricing and availability confirmation."
  },
  {
    question: "Do you offer bulk discounts?",
    answer: "We offer special pricing for bulk orders. Contact our sales team at (888) 818-5001 or email sales@auapw.com to discuss your requirements and get a custom quote."
  },
  {
    question: "How are parts packaged and shipped?",
    answer: "All parts are professionally packaged in protective materials to prevent damage during transit. We use industry-standard packing methods and partner with reliable carriers. Tracking information is provided with every order."
  }
]

export function PartsFAQ({ category }: { category?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-12 md:py-20">
      <div className="mx-auto max-w-[1000px] px-4">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about our {category || 'auto'} parts and ordering process
          </p>
        </div>

        <div className="space-y-4">
          {COMMON_FAQS.map((faq, index) => (
            <Card key={index} className="border border-border/50 hover:border-primary/50 transition-colors">
              <Button
                variant="ghost"
                className="w-full justify-between p-6 h-auto hover:bg-transparent"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-left font-semibold text-foreground">{faq.question}</span>
                <ChevronDown 
                  className={`h-5 w-5 transition-transform flex-shrink-0 ml-4 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </Button>
              {openIndex === index && (
                <CardContent className="pt-0 pb-6 px-6">
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-lg">
          <h3 className="font-semibold mb-2">Still have questions?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Contact our expert team available Monday-Friday, 8am-6pm EST
          </p>
          <div className="flex flex-wrap gap-3">
            <Button className="auapw-btn auapw-btn-green" asChild>
              <a href="tel:8888185001">Call (888) 818-5001</a>
            </Button>
            <Button className="auapw-btn auapw-btn-blue" asChild>
              <a href="mailto:support@auapw.com">Email Support</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
