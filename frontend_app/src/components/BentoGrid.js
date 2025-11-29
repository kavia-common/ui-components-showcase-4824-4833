import React from "react";

/**
 * PUBLIC_INTERFACE
 * BentoGrid
 * Asymmetric, dense CSS Grid layout whose visual style is now uniform per card:
 * - Identical header gradient, fixed header height/padding
 * - Consistent rounded corners and surface padding
 * - Subtle scale-only hover/focus-visible feedback (no color changes)
 * - Cohesive typography for titles/subtitles/content
 *
 * The dense, asymmetric layout and gap structure are preserved.
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

  // Shared visual tokens for uniform styling
  const headerGradient =
    "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)";

  // Fixed header height and padding for consistency
  const headerStyle = {
    background: headerGradient,
    color: "#ffffff",
    minHeight: 48, // consistent header height target
  };

  return (
    <section aria-label="Bento grid of features" className="w-full">
      {/* Grid shell: preserve dense, asymmetric layout and gaps */}
      <div
        className={[
          "grid gap-0", // ensure gap-free between cards; internal paddings provide spacing
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
              // Surface with rounded corners and isolation
              "bg-[var(--color-surface)] overflow-hidden rounded-xl",
              // Uniform border for all cards to match polished look
              "border border-white/10",
              // Subtle elevation
              "shadow-soft",
              // Scale-only hover/focus-visible behavior (no color change)
              "transform-gpu will-change-transform origin-center",
              "transition-transform duration-200 ease-out",
              "hover:scale-[1.01] focus-within:scale-[1.01]",
              "relative",
            ].join(" ")}
            aria-label={`${c.title} card`}
          >
            {/* Uniform gradient header with fixed height/padding */}
            <header
              className="flex items-center px-4 py-3 border-b border-white/15"
              style={headerStyle}
            >
              <h3 className="text-[15px] sm:text-sm font-semibold leading-6 text-white">
                {c.title}
              </h3>
            </header>

            {/* Consistent body padding and typography */}
            <div className="p-4 md:p-5">
              <p className="text-[14px] sm:text-sm leading-relaxed text-gray-700">
                {c.desc}
              </p>

              <div className="mt-3.5 flex items-center justify-between">
                {/* Demo block scales with row-span via fixed auto-rows */}
                <div
                  className="flex-1 rounded-lg bg-blue-50"
                  style={{ height: "4.0rem" }} // subtle, uniform demo area height baseline
                  aria-hidden="true"
                />
                <a
                  href="#"
                  className="ml-4 rounded-full px-3 py-1.5 text-[11px] font-semibold text-blue-700 bg-blue-50 focus-ring"
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
