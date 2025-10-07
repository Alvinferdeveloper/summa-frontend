import { BenefitsSection } from "@/app/(main)/components/benefits-section"
import { TestimonialsSection } from "@/app/(main)/components/testimonial"
import { Footer } from "@/app/(main)/components/footer"
import { HeroSection } from "@/app/(main)/components/hero-section"
import { HowItWorks } from "@/app/(main)/components/how-it-works"
import { Header } from "@/app/(main)/components/header"
import { CTASection } from "@/app/(main)/components/cta-section"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-[#010826]">
        <Header />
        <HeroSection />
        <HowItWorks />
        <BenefitsSection />
        <TestimonialsSection />
        <CTASection />
        <Footer />
      </main>
    </div>
  )
}
