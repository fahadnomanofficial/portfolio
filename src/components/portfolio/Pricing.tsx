import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Check, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import {
  coreTiers,
  websitePackages,
  appPackages,
  marketingPackages,
  maintenancePackages,
  publishingServices,
  PricingPackage
} from "./pricingData";
import { fadeUp, staggerParent } from "./motion";

interface PricingProps {
  onSelectPackage: (pkg: PricingPackage) => void;
  showHeader?: boolean;
}

export function Pricing({ onSelectPackage, showHeader = true }: PricingProps) {
  const [activeTab, setActiveTab] = useState<
    "all" | "websites" | "apps" | "marketing" | "maintenance" | "publishing"
  >("all");

  const tabs = [
    { key: "all" as const, label: "⭐ Core Tiers (From €300)" },
    { key: "websites" as const, label: "Websites" },
    { key: "apps" as const, label: "Mobile Apps" },
    { key: "marketing" as const, label: "Growth & SEO" },
    { key: "maintenance" as const, label: "Maintenance (24/7)" },
    { key: "publishing" as const, label: "Store Publishing" },
  ];

  return (
    <section id="pricing" className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 relative z-10">
        
        {/* Section Header */}
        {showHeader && (
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-xs font-mono font-medium text-accent">
              <Sparkles className="w-3.5 h-3.5" />
              <span>TRANSPARENT PRICING</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              Predictable Investment.{" "}
              <span className="text-gradient-accent block sm:inline">Crafted for Growth.</span>
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Transparent starting packages built for maximum return on investment. From €300 custom websites to full enterprise app and AI search ecosystems.
            </p>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex justify-center mb-10 sm:mb-14">
          <div className="inline-flex items-center overflow-x-auto no-scrollbar max-w-full gap-1 p-1.5 rounded-full bg-surface border border-border backdrop-blur-xl shadow-sm">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold shrink-0 transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? "bg-accent text-accent-foreground font-bold shadow-glow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-surface-2"
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Pricing Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={staggerParent}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="space-y-10"
          >
            {/* 1. ALL CORE TIERS */}
            {activeTab === "all" && (
              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
                  {coreTiers.map((pkg) => (
                    <motion.div
                      key={pkg.id}
                      variants={fadeUp}
                      whileHover={{ y: -6 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                      className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ${
                        pkg.popular
                          ? "bg-surface border-2 border-accent shadow-glow ring-2 ring-accent/20 lg:-translate-y-2"
                          : "bg-surface border border-border hover:border-accent/40 hover:shadow-glow-sm"
                      }`}
                    >
                      {pkg.badge && (
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                          <div className="rounded-full bg-accent px-3 py-1 text-[10px] font-bold text-accent-foreground uppercase tracking-wider shadow-sm flex items-center gap-1 whitespace-nowrap">
                            <Sparkles className="w-3 h-3" />
                            <span>{pkg.badge.replace("⭐", "").trim()}</span>
                          </div>
                        </div>
                      )}

                      <div className="space-y-4">
                        <div>
                          <h3 className="font-display text-lg font-bold text-foreground leading-snug">
                            {pkg.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-2 min-h-[44px] leading-relaxed">
                            {pkg.description}
                          </p>
                        </div>

                        <div className="flex items-baseline gap-1.5 border-y border-border py-3.5">
                          <span className="font-display text-3xl sm:text-4xl font-extrabold text-foreground font-mono">
                            {pkg.price}
                          </span>
                          <span className="text-[11px] text-muted-foreground font-mono uppercase">
                            {pkg.billingPeriod}
                          </span>
                        </div>

                        <div className="space-y-2.5">
                          <p className="font-mono text-[10px] uppercase tracking-wider text-accent font-semibold">
                            What&apos;s Included:
                          </p>
                          <ul className="space-y-2">
                            {pkg.features.map((feat, fIdx) => (
                              <li key={fIdx} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                                <div className="h-3.5 w-3.5 rounded-full bg-accent/15 text-accent flex items-center justify-center shrink-0 mt-0.5">
                                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                                </div>
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-border">
                        <button
                          onClick={() => onSelectPackage(pkg)}
                          className={`w-full flex items-center justify-center gap-2 rounded-full py-3 text-xs font-bold transition-transform hover:scale-[1.02] cursor-pointer ${
                            pkg.popular
                              ? "bg-accent text-accent-foreground shadow-glow"
                              : "border border-border bg-surface-2 text-foreground hover:border-accent/40 hover:bg-accent hover:text-accent-foreground"
                          }`}
                        >
                          <span>Inquire on WhatsApp</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Maintenance Highlight Banner */}
                <motion.div
                  variants={fadeUp}
                  className="rounded-3xl border border-accent/40 bg-accent/5 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm"
                >
                  <div className="space-y-2 max-w-2xl">
                    <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 border border-accent/20 px-3 py-0.5 text-[11px] font-mono text-accent">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>ONGOING RELIABILITY &amp; SUPPORT</span>
                    </div>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                      Website &amp; App Maintenance Plan — <span className="text-accent font-mono">€200/month</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      24/7 uptime monitoring, daily cloud backups, weekly security patching, Core Web Vitals speed tuning, and dedicated hours for content &amp; code updates.
                    </p>
                  </div>
                  <div className="shrink-0 w-full md:w-auto">
                    <button
                      onClick={() => onSelectPackage(maintenancePackages[0])}
                      className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-xs sm:text-sm font-bold text-accent-foreground shadow-glow hover:scale-[1.03] transition-transform cursor-pointer"
                    >
                      <span>Add Maintenance SLA</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              </div>
            )}

            {/* 2. WEBSITES ONLY */}
            {activeTab === "websites" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto pt-4">
                {websitePackages.map((pkg) => (
                  <motion.div
                    key={pkg.id}
                    variants={fadeUp}
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ${
                      pkg.popular
                        ? "bg-surface border-2 border-accent shadow-glow ring-2 ring-accent/20"
                        : "bg-surface border border-border hover:border-accent/40 hover:shadow-glow-sm"
                    }`}
                  >
                    {pkg.badge && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                        <div className="rounded-full bg-accent px-3 py-1 text-[10px] font-bold text-accent-foreground uppercase tracking-wider shadow-sm whitespace-nowrap">
                          {pkg.badge}
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <h3 className="font-display text-xl font-bold text-foreground">
                          {pkg.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-2 min-h-[36px] leading-relaxed">
                          {pkg.description}
                        </p>
                      </div>

                      <div className="flex items-baseline gap-1.5 border-y border-border py-3">
                        <span className="font-display text-3xl sm:text-4xl font-extrabold text-foreground font-mono">
                          {pkg.price}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono uppercase">
                          {pkg.billingPeriod}
                        </span>
                      </div>

                      <ul className="space-y-2">
                        {pkg.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                            <div className="h-3.5 w-3.5 rounded-full bg-accent/15 text-accent flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="h-2.5 w-2.5 stroke-[3]" />
                            </div>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 pt-4 border-t border-border">
                      <button
                        onClick={() => onSelectPackage(pkg)}
                        className={`w-full flex items-center justify-center gap-2 rounded-full py-3 text-xs font-bold transition-transform hover:scale-[1.02] cursor-pointer ${
                          pkg.popular
                            ? "bg-accent text-accent-foreground shadow-glow"
                            : "border border-border bg-surface-2 text-foreground hover:border-accent/40 hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        <span>Inquire on WhatsApp</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* 3. APPS */}
            {activeTab === "apps" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto pt-4">
                {appPackages.map((pkg) => (
                  <motion.div
                    key={pkg.id}
                    variants={fadeUp}
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className={`relative rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                      pkg.popular
                        ? "bg-surface border-2 border-accent shadow-glow ring-2 ring-accent/20"
                        : "bg-surface border border-border hover:border-accent/40 hover:shadow-glow-sm"
                    }`}
                  >
                    {pkg.badge && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                        <div className="rounded-full bg-accent px-3 py-1 text-[10px] font-bold text-accent-foreground uppercase tracking-wider shadow-sm whitespace-nowrap">
                          {pkg.badge}
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <h3 className="font-display text-2xl font-bold text-foreground">
                          {pkg.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                          {pkg.description}
                        </p>
                      </div>

                      <div className="flex items-baseline gap-1.5 border-y border-border py-3.5">
                        <span className="font-display text-4xl font-extrabold text-foreground font-mono">
                          {pkg.price}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono uppercase">
                          {pkg.billingPeriod}
                        </span>
                      </div>

                      <ul className="space-y-2.5">
                        {pkg.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            <div className="h-4 w-4 rounded-full bg-accent/15 text-accent flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="h-3 w-3 stroke-[3]" />
                            </div>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-8 pt-5 border-t border-border">
                      <button
                        onClick={() => onSelectPackage(pkg)}
                        className={`w-full flex items-center justify-center gap-2 rounded-full py-3.5 text-xs sm:text-sm font-bold transition-transform hover:scale-[1.02] cursor-pointer ${
                          pkg.popular
                            ? "bg-accent text-accent-foreground shadow-glow"
                            : "border border-border bg-surface-2 text-foreground hover:border-accent/40 hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        <span>Inquire on WhatsApp</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* 4. MARKETING */}
            {activeTab === "marketing" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto pt-4">
                {marketingPackages.map((pkg) => (
                  <motion.div
                    key={pkg.id}
                    variants={fadeUp}
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ${
                      pkg.popular
                        ? "bg-surface border-2 border-accent shadow-glow ring-2 ring-accent/20"
                        : "bg-surface border border-border hover:border-accent/40 hover:shadow-glow-sm"
                    }`}
                  >
                    {pkg.badge && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                        <div className="rounded-full bg-accent px-3 py-1 text-[10px] font-bold text-accent-foreground uppercase tracking-wider shadow-sm whitespace-nowrap">
                          {pkg.badge}
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <h3 className="font-display text-xl font-bold text-foreground">
                          {pkg.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-2 min-h-[38px] leading-relaxed">
                          {pkg.description}
                        </p>
                      </div>

                      <div className="flex items-baseline gap-1.5 border-y border-border py-3">
                        <span className="font-display text-3xl sm:text-4xl font-extrabold text-foreground font-mono">
                          {pkg.price}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {pkg.billingPeriod}
                        </span>
                      </div>

                      <ul className="space-y-2">
                        {pkg.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                            <div className="h-3.5 w-3.5 rounded-full bg-accent/15 text-accent flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="h-2.5 w-2.5 stroke-[3]" />
                            </div>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 pt-4 border-t border-border">
                      <button
                        onClick={() => onSelectPackage(pkg)}
                        className={`w-full flex items-center justify-center gap-2 rounded-full py-3 text-xs font-bold transition-transform hover:scale-[1.02] cursor-pointer ${
                          pkg.popular
                            ? "bg-accent text-accent-foreground shadow-glow"
                            : "border border-border bg-surface-2 text-foreground hover:border-accent/40 hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        <span>Inquire on WhatsApp</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* 5. MAINTENANCE */}
            {activeTab === "maintenance" && (
              <div className="max-w-3xl mx-auto pt-4">
                {maintenancePackages.map((pkg) => (
                  <motion.div
                    key={pkg.id}
                    variants={fadeUp}
                    className="rounded-3xl border-2 border-accent bg-surface p-8 sm:p-10 shadow-glow space-y-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 border border-accent/20 px-3 py-1 text-[11px] font-mono text-accent mb-2">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>GUARANTEED 99.9% UPTIME SLA</span>
                        </div>
                        <h3 className="font-display text-2xl font-bold text-foreground">
                          {pkg.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed">
                          {pkg.description}
                        </p>
                      </div>
                      <div className="sm:text-right shrink-0">
                        <p className="font-display text-3xl sm:text-4xl font-extrabold text-accent font-mono">
                          {pkg.price}
                        </p>
                        <span className="text-xs text-muted-foreground font-mono">
                          {pkg.billingPeriod}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-border pt-6">
                      <p className="font-mono text-xs uppercase tracking-wider text-accent mb-4 font-semibold">
                        Included Protection &amp; SLAs:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {pkg.features.map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground">
                            <div className="h-4 w-4 rounded-full bg-accent/15 text-accent flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="h-3 w-3 stroke-[3]" />
                            </div>
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <button
                        onClick={() => onSelectPackage(pkg)}
                        className="w-full flex items-center justify-center gap-2 rounded-full bg-accent py-4 text-xs sm:text-sm font-bold text-accent-foreground shadow-glow hover:scale-[1.02] transition-transform cursor-pointer"
                      >
                        <span>Activate Maintenance Plan on WhatsApp</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* 6. PUBLISHING SERVICES */}
            {activeTab === "publishing" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto pt-4">
                {publishingServices.map((service, idx) => (
                  <motion.div
                    key={idx}
                    variants={fadeUp}
                    whileHover={{ y: -4 }}
                    className="rounded-3xl border border-border bg-surface p-7 sm:p-8 flex flex-col justify-between space-y-5 hover:border-accent/40 hover:shadow-glow-sm transition-all"
                  >
                    <div className="space-y-4">
                      <h3 className="font-display text-xl font-bold text-foreground">
                        {service.title}
                      </h3>
                      <div className="flex items-baseline gap-1.5 border-y border-border py-2.5">
                        <span className="font-display text-3xl font-extrabold text-foreground font-mono">
                          {service.price}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {service.billing}
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {service.details.map((detail, dIdx) => (
                          <li key={dIdx} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <div className="h-3.5 w-3.5 rounded-full bg-accent/15 text-accent flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="h-2.5 w-2.5 stroke-[3]" />
                            </div>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <a
                      href={`https://wa.me/35699784477?text=${encodeURIComponent(service.whatsAppMessage)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 rounded-full border border-border bg-surface-2 py-3 text-xs font-bold text-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all cursor-pointer"
                    >
                      <span>Inquire on WhatsApp</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* FAQ Link */}
        <div className="mt-14 text-center">
          <Link
            to="/faq"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono text-muted-foreground hover:text-accent transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-accent" />
            <span>Have questions about pricing, scopes or deliverables? Explore FAQs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}
