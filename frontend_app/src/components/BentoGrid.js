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
 * Overlap fix:
 * - Parent uses CSS Grid with consistent auto-rows and gaps per breakpoint.
 * - grid-auto-flow: dense at md+ to backfill holes.
 * - Per-card spans are tuned so they pack without collision.
 * - Hover transforms are modest and constrained with overflow-hidden and origin-center to prevent layout shifts.
 */
export default function BentoGrid() {
  /**
   * Layout
   * - xs: 1 column stack.
   * - sm: 2 columns.
   * - md: 6 columns mosaic.
   * - lg: 8 columns mosaic.
   * - Auto rows fixed at md+/lg for predictable row-span sizing.
   *   Use a slightly taller base row (104px) to accommodate header + body content.
   */
  const cards = [
    // Wide hero card; occupies the top-left area
    {
      title: "Fast",
      desc: "Optimized build with minimal dependencies.",
      span: {
        sm: "sm:col-span-2 sm:row-span-2",
        md: "md:col-span-4 md:row-span-2",
        lg: "lg:col-span-5 lg:row-span-2",
      },
    },
    // Small single block
    {
      title: "Themed",
      desc: "Ocean Professional palette out-of-the-box.",
      span: {
        sm: "sm:col-span-1 sm:row-span-1",
        md: "md:col-span-2 md:row-span-1",
        lg: "lg:col-span-3 lg:row-span-1",
      },
    },
    // Tall narrow block
    {
      title: "Responsive",
      desc: "Mobile-first, adapts to all screen sizes.",
      span: {
        sm: "sm:col-span-1 sm:row-span-2",
        md: "md:col-span-2 md:row-span-2",
        lg: "lg:col-span-3 lg:row-span-2",
      },
    },
    // Small single block
    {
      title: "Accessible",
      desc: "Usability and semantics considered.",
      span: {
        sm: "sm:col-span-1 sm:row-span-1",
        md: "md:col-span-2 md:row-span-1",
        lg: "lg:col-span-2 lg:row-span-1",
      },
    },
    // Small single block
    {
      title: "Composable",
      desc: "Mix and match primitives for velocity.",
      span: {
        sm: "sm:col-span-1 sm:row-span-1",
        md: "md:col-span-2 md:row-span-1",
        lg: "lg:col-span-2 lg:row-span-1",
      },
    },
    // Medium wide block
    {
      title: "Performant",
      desc: "GPU-accelerated transitions, no jank.",
      span: {
        sm: "sm:col-span-2 sm:row-span-2",
        md: "md:col-span-3 md:row-span-2",
        lg: "lg:col-span-4 lg:row-span-2",
      },
    },
    // Small block
    {
      title: "Reliable",
      desc: "Mature build tooling and proven patterns.",
      span: {
        sm: "sm:col-span-1 sm:row-span-1",
        md: "md:col-span-2 md:row-span-1",
        lg: "lg:col-span-2 lg:row-span-1",
      },
    },
    // Medium-tall block; tuned spans to avoid collision with previous items at lg
    {
      title: "Extensible",
      desc: "Scale components as your app grows.",
      span: {
        sm: "sm:col-span-1 sm:row-span-2",
        md: "md:col-span-3 md:row-span-2",
        lg: "lg:col-span-3 lg:row-span-2",
      },
    },
  ];

  // PUBLIC_INTERFACE
  // Helper to serialize per-breakpoint span hints into Tailwind classes.
  function spanToClass(span) {
    /**
     * Convert span object (sm/md/ld keys with class strings) into a single
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
      {/* Grid shell with consistent rows and dense packing */}
      <div
        className={[
          "grid",
          // Keep a tiny visual gap; avoid zero to reduce accidental overlap illusions
          "gap-2 sm:gap-2 md:gap-3 lg:gap-3",
          // Responsive columns
          "grid-cols-1",
          "sm:grid-cols-2",
          "md:grid-cols-6",
          "lg:grid-cols-8",
          // Consistent auto-rows for predictable row-span sizing
          // Slightly taller base at md/lg to fit header + body content comfortably
          "auto-rows-[minmax(120px,auto)] sm:auto-rows-[minmax(120px,auto)] md:auto-rows-[104px] lg:auto-rows-[104px]",
          // Dense packing so items fill available gaps
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
              // Unified border for all cards
              "border border-white/10",
              // Subtle elevation
              "shadow-soft",
              // Constrained hover to avoid layout shifts
              "transform-gpu will-change-transform origin-center",
              "transition-transform duration-200 ease-out",
              "hover:scale-[1.01] focus-within:scale-[1.01]",
              // Create a new stacking context and clip hover scale
              "relative isolate",
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
                  style={{ height: "3.75rem" }} // modest baseline height; larger spans visually grow via auto-rows
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
