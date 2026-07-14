import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BrandLogosSection } from "@/components/brand-logos"
import { HeroSection } from "@/components/home/hero-section"
import { CinematicShowcaseSection } from "@/components/home/cinematic-showcase-section"
import { ContentSection } from "@/components/home/content-section"
import { FeaturesGridSection } from "@/components/home/features-grid-section"
import { BrandValuesSection } from "@/components/home/brand-values-section"
import { ShowcaseGallerySection } from "@/components/home/showcase-gallery-section"
import { CategoriesSection } from "@/components/home/categories-section"
import { FeaturedProductsSection } from "@/components/home/featured-products-section"

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#3a3d44]">
        <HeroSection />
        <CinematicShowcaseSection />
        <FeaturesGridSection />
        <ContentSection />
        <BrandValuesSection />
        <ShowcaseGallerySection />
        <CategoriesSection />
        <FeaturedProductsSection />
        <BrandLogosSection />
      </main>
      <Footer />
    </>
  )
}
