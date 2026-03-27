import HeroSection from '@/components/shop/HeroSection'
import CategoryShowcase from '@/components/shop/CategoryShowcase'
import FeaturedProducts from '@/components/shop/FeaturedProducts'
import PromoBanner from '@/components/shop/PromoBanner'
import WhyChooseUs from '@/components/shop/WhyChooseUs'
import BrandsSection from '@/components/shop/BrandsSection'
import TestimonialsSection from '@/components/shop/TestimonialsSection'

export const metadata = {
  title: 'Vapocria - Fornecedor Top 1 do Brasil | Vapes & Pods Premium',
  description:
    'Descubra o melhor em vaporizadores, pods e acessorios premium. Qualidade garantida, precos imbativeis e entrega rapida para todo o Brasil.',
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-dark-950">
      <HeroSection />
      <CategoryShowcase />
      <FeaturedProducts />
      <PromoBanner />
      <WhyChooseUs />
      <BrandsSection />
      <TestimonialsSection />
    </main>
  )
}
