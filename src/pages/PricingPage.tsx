import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, HelpCircle } from "lucide-react";
import { Nav } from "@/components/portfolio/Nav";
import { Footer } from "@/components/portfolio/Footer";
import { FloatingOrbs } from "@/components/portfolio/FloatingOrbs";
import { Pricing } from "@/components/portfolio/Pricing";
import { WhatsAppModal } from "@/components/portfolio/WhatsAppModal";
import { PricingPackage, pricingFaqs } from "@/components/portfolio/pricingData";
import { fadeUp, staggerParent } from "@/components/portfolio/motion";
import { useSeo } from "@/hooks/use-seo";

export function PricingPage() {
  useSeo({
    title: "Pricing & Packages — Web Development, Mobile Apps & SEO | Fahad Al Noman",
    description:
      "Transparent pricing packages for custom website development, Laravel & React apps, mobile apps, technical SEO, and 24/7 maintenance starting from €300.",
    path: "/pricing",
  });

  const [isSalesModalOpen, setIsSalesModalOpen] = useState(false);
  const [selectedPackageForModal, setSelectedPackageForModal] = useState<PricingPackage | null>(null);

  const handleSelectPackage = (pkg: PricingPackage) => {
    setSelectedPackageForModal(pkg);
    setIsSalesModalOpen(true);
  };

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground">
      <FloatingOrbs />
      <Nav />

      <main className="pt-28 pb-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <motion.div
            variants={staggerParent}
            initial="hidden"
            animate="show"
            className="space-y-12"
          >
            {/* Page Header */}
            <motion.div variants={fadeUp} className="border-b border-border pb-8 text-center max-w-3xl mx-auto">
              <Link
                to="/"
                className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-accent"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Home
              </Link>
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                ▸ Pricing &amp; Packages
              </div>
              <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Transparent Pricing. <span className="text-gradient-accent">No Hidden Fees.</span>
              </h1>
              <p className="mt-4 max-w-2xl mx-auto text-base leading-relaxed text-muted-foreground">
                Honest, modular investment tiers crafted for independent businesses and growing products.
                Choose a pre-configured tier or customize a tailored technical roadmap.
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Full Interactive Pricing Matrix */}
        <Pricing onSelectPackage={handleSelectPackage} showHeader={false} />

        {/* Pricing FAQs Section */}
        <div className="mx-auto max-w-5xl px-5 sm:px-8 pt-10">
          <div className="rounded-3xl border border-border bg-surface p-8 sm:p-12 space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3.5 py-1 text-xs font-mono font-medium text-accent">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>PRICING &amp; SCOPE FAQS</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-muted-foreground">
                Clear details to help you choose the right package for your product goals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {pricingFaqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-border bg-surface-2 p-6 space-y-2.5 hover:border-accent/40 transition-colors"
                >
                  <h3 className="font-display text-base font-semibold text-foreground">
                    {faq.q}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>

            {/* Contextual Link */}
            <div className="pt-4 text-center">
              <Link
                to="/faq"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-accent hover:underline"
              >
                <span>Have more technical or general questions? View the complete FAQ page</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mx-auto max-w-4xl px-5 sm:px-8 pt-16">
          <div className="rounded-3xl border border-accent/30 bg-accent/5 p-8 text-center sm:p-12 space-y-4">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              Ready to start your project?
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Schedule a free 30-minute discovery call or send a project brief. I review every inquiry personally.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => {
                  setSelectedPackageForModal(null);
                  setIsSalesModalOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-glow hover:scale-[1.03] transition-transform cursor-pointer"
              >
                <span>Talk on WhatsApp</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground hover:bg-surface-2 hover:border-accent/40 transition-all"
              >
                <span>Send Contact Form</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Global WhatsApp Sales Modal */}
      <WhatsAppModal
        isOpen={isSalesModalOpen}
        onClose={() => setIsSalesModalOpen(false)}
        selectedPackage={selectedPackageForModal}
      />
    </div>
  );
}
export default PricingPage;
