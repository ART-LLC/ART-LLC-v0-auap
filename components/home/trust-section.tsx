'use client'

import { CheckCircle, Users, Zap, Globe } from "lucide-react"

export function TrustSection() {
  return (
    <section className="bg-black py-20 sm:py-32 border-y border-slate-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-orange-400">Why Trust Us</span>
          <h2 className="text-4xl sm:text-5xl font-black text-white mt-3">
            America's Largest Used Parts Network
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto mt-4">
            AUAPW LLC connects you directly with vetted suppliers nationwide. Every part is inspected, warranted, and delivered fast.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[
            { value: "81,000+", label: "Parts in Inventory", icon: CheckCircle },
            { value: "2,000+", label: "Verified Yards", icon: Users },
            { value: "50", label: "States Covered", icon: Globe },
            { value: "24hr", label: "Response Time", icon: Zap },
          ].map(({ value, label, icon: Icon }) => (
            <div key={label} className="group p-8 rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-900/50 hover:border-orange-600/50 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-orange-600/20 rounded-lg group-hover:bg-orange-600/30 transition-colors">
                  <Icon className="w-6 h-6 text-orange-400" />
                </div>
              </div>
              <div className="text-3xl font-black text-white mb-2">{value}</div>
              <p className="text-sm text-slate-400">{label}</p>
            </div>
          ))}
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Quality Assured",
              desc: "Every part undergoes certified inspection for condition, functionality, and fitment before shipping.",
              features: ["Compression tested", "Leak verified", "Mileage documented"],
            },
            {
              title: "Nationwide Network",
              desc: "Partner with 2,000+ top-rated junkyards and salvage yards across all 50 US states.",
              features: ["All major makes", "Rare inventory", "Local pickup available"],
            },
            {
              title: "Hassle-Free Ordering",
              desc: "Search, quote, and order in minutes. Expert support 24/7 for technical questions.",
              features: ["Free shipping*", "30-180 day warranty", "Same-day processing"],
            },
          ].map(({ title, desc, features }) => (
            <div key={title} className="p-8 rounded-xl border border-slate-700 bg-slate-900/50">
              <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
              <p className="text-sm text-slate-400 mb-6">{desc}</p>
              <ul className="space-y-2">
                {features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
