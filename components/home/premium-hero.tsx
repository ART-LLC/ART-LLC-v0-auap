'use client'

import Link from "next/link"
import Image from "next/image"
import { Search, Zap, Shield, Truck } from "lucide-react"

export function PremiumHero() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-black">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Video or gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-900 to-black">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }} />
        </div>

        {/* Orange accent glow */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-600 rounded-full opacity-20 blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-72 h-72 bg-blue-600 rounded-full opacity-10 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">
          {/* Left: Copy */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <span className="inline-block w-fit text-xs font-bold tracking-widest uppercase bg-orange-600/20 border border-orange-600/40 px-4 py-2 rounded-full text-orange-400">
                ⚡ Industry Leading Network
              </span>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight">
                Premium Used Auto Parts
                <span className="block bg-gradient-to-r from-orange-400 via-orange-300 to-yellow-300 bg-clip-text text-transparent">
                  Delivered Fast
                </span>
              </h1>
            </div>

            <p className="text-lg text-slate-300 max-w-xl leading-relaxed">
              Access 2,000+ verified yards nationwide. Quality guaranteed. Same-day shipping. 90-day warranty on every part. Search, quote, and order in minutes.
            </p>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Shield, label: "90-Day Warranty", desc: "Guaranteed quality" },
                { icon: Truck, label: "Same-Day Shipping", desc: "When available" },
                { icon: Zap, label: "24-Hour Response", desc: "Expert support" },
                { icon: Search, label: "2,000+ Yards", desc: "All 50 states" },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:border-orange-600/50 transition-all">
                  <div className="flex-shrink-0 p-2 bg-orange-600/20 rounded-lg">
                    <Icon className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="flex flex-col text-sm">
                    <span className="font-bold text-white">{label}</span>
                    <span className="text-xs text-slate-400">{desc}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/catalog" className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-orange-600/40 flex items-center justify-center gap-2">
                <Search className="w-5 h-5" />
                Shop Now
              </Link>
              <Link href="/quote" className="px-8 py-3 border-2 border-slate-600 hover:border-orange-600 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2">
                Get Free Quote
              </Link>
            </div>
          </div>

          {/* Right: Image placeholder - automotive showcase */}
          <div className="relative h-[500px] hidden lg:block">
            <div className="absolute inset-0 rounded-2xl overflow-hidden border border-orange-600/30 bg-gradient-to-br from-slate-800 to-slate-900">
              {/* Placeholder for automotive image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/images/hero-engine-parts.png"
                  alt="Premium auto parts"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Featured stat */}
              <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur border border-orange-600/30 rounded-lg p-4">
                <p className="text-sm text-slate-300 mb-2">Over 81,000+ parts in stock</p>
                <p className="text-2xl font-bold text-white">2,000+ Verified Suppliers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
