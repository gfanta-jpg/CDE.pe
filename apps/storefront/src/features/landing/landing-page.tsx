import {
  ConfianzaSection, DoctoraSection, HeroSection, InstagramSection, LandingFooter, ServiciosSection, StatsSection,
} from "./landing-content";
import { BlogSection, ContactSection } from "./landing-interactive";
import { LandingNav } from "./landing-nav";
import { FeaturedProducts, StoreSection } from "./landing-store";

/** CDE design landing: the HTML sections plus featured products and the live store. */
export function LandingPage() {
  return (
    <div className="cde-landing" data-slot="cde-landing">
      <LandingNav />
      <main>
        <HeroSection />
        <StatsSection />
        <DoctoraSection />
        <ServiciosSection />
        <InstagramSection />
        <BlogSection />
        <FeaturedProducts />
        <StoreSection />
        <ConfianzaSection />
        <ContactSection />
      </main>
      <LandingFooter />
    </div>
  );
}
