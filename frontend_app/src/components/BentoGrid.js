import React from "react";

/**
 * PUBLIC_INTERFACE
 * BentoGrid
 * Asymmetric, dense CSS Grid layout with comfortable gaps restored.
 *
 * Implementation details:
 * - Uses grid-auto-flow: dense and consistent auto-rows so varied spans pack tightly.
 * - Tailored span patterns per breakpoint (sm/md/lg) preserved to keep asymmetric rhythm.
 * - Restores prior grid gap utilities and per-card padding/margins that were recently tightened.
 * - Keeps gradient headers and subtle scale-only hover/focus-visible effect without color changes.
 */
export default function BentoGrid() {
  /**
   * Layout
   * - xs/sm: 1–2 columns stack.
   * - md: 6 columns mosaic.
   * - lg: 8 columns mosaic.
   * - Auto rows fixed at md+/lg to ensure consistent row-span sizing.
   */
  const cards = [
    { title: "Fast", desc: "Optimized build with minimal dependencies.", span: { sm: "sm:col-span-2 sm:row-span-2", md: "md:col-span-4 md:row-span-2", lg: "lg:col-span-5 lg:row-span-2" } },
    { title: "Themed", desc: "Ocean Professional palette out-of-the-box.", span: { sm: "sm:col-span-1 sm:row-span-1", md: "md:col-span-2 md:row-span-1", lg: "lg:col-span-3 lg:row-span-1" } },
    { title: "Responsive", desc: "Mobile-first, adapts to all screen sizes.", span: { sm: "sm:col-span-1 sm:row-span-2", md: "md:col-span-2 md:row-span-2", lg: "lg:col-span-3 lg:row-span-2" } },
    { title: "Accessible", desc: "Usability and semantics considered.", span: { sm: "sm:col-span-1 sm:row-span-1", md: "md:col-span-2 md:row-span-1", lg: "lg:col-span-2 lg:row-span-1" } },
    { title: "Composable", desc: "Mix and match primitives for velocity.", span: { sm: "sm:col-span-1 sm:row-span-1", md: "md:col-span-2 md:row-span-1", lg: "lg:col-span-2 lg:row-span-1" } },
    { title: "Performant", desc: "GPU-accelerated transitions, no jank.", span: { sm: "sm:col-span-2 sm:row-span-2", md: "md:col-span-3 md:row-span-2", lg: "lg:col-span-4 lg:row-span-2" } },
    { title: "Reliable", desc: "Mature build tooling and proven patterns.", span: { sm: "sm:col-span-1 sm:row-span-1", md: "md:col-span-1 md:row-span-1", lg: "lg:col-span-2 lg:row-span-1" } },
    { title: "Extensible", desc: "Scale components as your app grows.", span: { sm: "sm:col-span-1 sm:row-span-2", md: "md:col-span-3 md:row-span-2", lg: "lg:col-span-3 lg:row-span-2" } },
  ];

  // PUBLIC_INTERFACE
  // Helper to serialize per-breakpoint span hints into Tailwind classes.
  function spanToClass(span) {
    /**
     * Convert span object (sm/md/lg keys with class strings) into a single
     * className string, preserving prefixes for breakpoints.
     */
    if (!span) return "";
    const sm = span.sm ? `${span.sm}` : "";
    const md = span.md ? `${span.md}` : "";
    const lg = span.lg ? `${span.lg}` : "";
    return [sm, md, lg].filter(Boolean).join(" ");
  }

  const headerGradient =
    "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)";

  return (
    <section aria-label="Bento grid of features" className="w-full">
      {/* Grid shell with restored gaps */}
      <div
        className={[
          // Restore prior roomy gaps while keeping dense packing via spans
          "grid gap-4 sm:gap-4 md:gap-5 lg:gap-6",
          "grid-cols-1",
          "sm:grid-cols-2",
          "md:grid-cols-6",
          "lg:grid-cols-8",
          // consistent auto rows for predictable row-span sizing
          "auto-rows-[minmax(112px,auto)] sm:auto-rows-[minmax(112px,auto)] md:auto-rows-[96px] lg:auto-rows-[96px]",
          // dense packing so items fill available gaps
          "md:[grid-auto-flow:dense] lg:[grid-auto-flow:dense]",
        ].join(" ")}
      >
        {cards.map((c, i) => (
          <article
            key={`${c.title}-${i}`}
            className={[
              "col-span-1",
              spanToClass(c.span),
              // Surface with rounded corners and transform isolation
              "surface overflow-hidden rounded-xl",
              "transform-gpu will-change-transform origin-center",
              "transition-transform duration-200 ease-out",
              "hover:scale-[1.01] focus-within:scale-[1.01]",
              "relative",
            ].join(" ")}
            aria-label={`${c.title} card`}
          >
            {/* Gradient header preserved; no hover color changes */}
            <header
              className="px-4 py-2.5 border-b border-white/15"
              style={{
                background: headerGradient,
                color: "#ffffff",
              }}
            >
              <h3 className="text-sm sm:text-[15px] font-semibold leading-6 text-white">
                {c.title}
              </h3>
            </header>

            {/* Content body with restored padding for readability */}
            <div className="p-4 sm:p-4 md:p-5">
              <p className="text-sm text-gray-700">{c.desc}</p>

              <div className="mt-3.5 flex items-center justify-between">
                {/* Demo block height scales with row-span due to fixed auto-rows */}
                <div className="h-20 md:h-16 flex-1 rounded-lg bg-blue-50" />
                <a
                  href="#"
                  className="ml-4 rounded-full px-3 py-1.5 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:opacity-95 focus-ring"
                >
                  Details
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
