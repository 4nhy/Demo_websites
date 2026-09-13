import Hero from "@/components/Hero";
import FoliageParallax from "@/components/FoliageParallax";
import ShopShowcase from "@/components/ShopShowcase";
import WhyVerdeNoir from "@/components/WhyVerdeNoir";
import ProductPreview from "@/components/ProductPreview";
import CareTeaser from "@/components/CareTeaser";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <FoliageParallax />
      <ShopShowcase />
      <WhyVerdeNoir />
      <ProductPreview />
      <CareTeaser />
      <Newsletter />
      <Footer />
    </main>
  );
}
