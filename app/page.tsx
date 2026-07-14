import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BrandLogosSection } from "@/components/brand-logos"
import { PremiumHero } from "@/components/home/premium-hero"
import { TrustSection } from "@/components/home/trust-section"
import { CategoriesSection } from "@/components/home/categories-section"
import { FeaturedProductsSection } from "@/components/home/featured-products-section"

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="bg-black">
        <PremiumHero />
        <TrustSection />
        <CategoriesSection />
        <FeaturedProductsSection />
        <BrandLogosSection />
      </main>
      <Footer />
    </>
  )
}
