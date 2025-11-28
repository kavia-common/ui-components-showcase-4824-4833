import React from "react";

/**
 * PUBLIC_INTERFACE
 * Hero
 * A responsive, two-column hero with decorative gradients/orbs, strong headline hierarchy,
 * and dual CTAs following the Ocean Professional theme. Tokens are adjustable via CSS variables
 * and Tailwind utilities.
 */
export default function Hero() {
  const frontendUrl = process.env.REACT_APP_FRONTEND_URL || window.location.origin;

  // Token-like values kept in one place for easy tweaking
  const tokens = {
    bgBase: "#0B1020",
    accent: "#6366F1", // indigo-500/600
    accentHover: "#4F46E5",
    textPrimary: "#FFFFFF",
    textSecondary: "#CBD5E1", // slate-300-ish
  };

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden rounded-2xl shadow-soft"
      style={{
        // subtle radial + linear background per notes
        background:
          "radial-gradient(100% 100% at 0% 0%, rgba(99,102,241,0.20) 0%, transparent 60%), linear-gradient(180deg, #0B1020 0%, #070B16 100%)",
      }}
    >
      {/* Decorative orbs/stripes */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-64 -bottom-20 h-[240px] w-[60%] bg-gradient-to-r from-indigo-400/30 to-transparent blur-2xl opacity-60" />

      {/* Container */}
      <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-16 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-y-10 lg:gap-8">
          {/* Left column: Text stack */}
          <div className="lg:col-span-6 xl:col-span-5">
            {/* Eyebrow / kicker */}
            <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-indigo-300">
              New • Ocean UI v2
            </div>

            <h1
              id="hero-heading"
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight"
              style={{ color: tokens.textPrimary, lineHeight: 1.08 }}
            >
              UI Components Showcase
            </h1>

            <p
              className="mt-4 md:mt-5 max-w-prose text-base md:text-lg lg:text-xl"
              style={{ color: tokens.textSecondary }}
            >
              Ship delightful experiences with React and Tailwind. Explore polished, accessible
              components styled with the Ocean Professional theme and ready for production.
            </p>

            {/* CTA group */}
            <div className="mt-6 flex flex-wrap items-center gap-3 md:gap-4">
              <a
                href="#accordion"
                className="inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm md:text-base font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
                style={{ backgroundColor: tokens.accent }}
                onMouseDown={(e) => e.currentTarget.classList.add("scale-[0.98]")}
                onMouseUp={(e) => e.currentTarget.classList.remove("scale-[0.98]")}
                onMouseLeave={(e) => e.currentTarget.classList.remove("scale-[0.98]")}
              >
                Explore Components
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="stroke-white"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12h14M13 5l7 7-7 7"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>

              <a
                href={frontendUrl}
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-5 py-3 text-sm md:text-base font-semibold text-slate-200/90 hover:text-white hover:bg-white/[0.05] hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
                aria-label="Open application"
              >
                Open App
              </a>
            </div>

            {/* Optional trust row */}
            <div className="mt-4 text-xs text-slate-400">
              Trusted by teams building modern web apps
            </div>
          </div>

          {/* Right column: Illustration / media */}
          <div className="lg:col-span-6 xl:col-span-7">
            <div className="relative overflow-hidden rounded-2xl ring-1 ring-white/10 bg-white/5 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.6)]">
              {/* Illustration placeholder; projects can replace with real asset */}
              <div className="aspect-[16/10] md:aspect-[16/9] w-full">
                <img
                  src="https://dummyimage.com/1200x700/0b1020/ffffff&text=Product+Preview"
                  alt="Product preview"
                  className="w-full h-full object-cover opacity-95"
                />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
