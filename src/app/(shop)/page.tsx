import HeroSection from '@/components/shop/HeroSection'
import CategoryShowcase from '@/components/shop/CategoryShowcase'
import FeaturedProducts from '@/components/shop/FeaturedProducts'
import PromoBanner from '@/components/shop/PromoBanner'
import WhyChooseUs from '@/components/shop/WhyChooseUs'
import BrandsSection from '@/components/shop/BrandsSection'
import TestimonialsSection from '@/components/shop/TestimonialsSection'

export const metadata = {
  title: 'Decria Outlet - Vapes, Cosméticos & Óculos | Até 70% OFF',
  description:
    'Outlet premium com os melhores preços em vapes, cosméticos e óculos. Até 70% OFF, frete grátis acima de R$200 e 12x sem juros.',
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <HeroSection />
      <div className="py-4" />
      <CategoryShowcase />
      <div className="py-4" />
      <FeaturedProducts />
      <PromoBanner />
      <WhyChooseUs />
      <div className="py-4" />
      <BrandsSection />
      <div className="py-4" />
      <TestimonialsSection />
    </main>
  )
}
