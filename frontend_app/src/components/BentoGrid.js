import React from "react";

/**
 * PUBLIC_INTERFACE
 * BentoGrid
 * Asymmetric, dense CSS Grid layout with no gaps across breakpoints.
 *
 * Implementation details:
 * - Uses grid-auto-flow: dense and consistent auto-rows so varied spans pack tightly.
 * - Tailored span patterns per breakpoint (sm/md/lg) to match the provided screenshot.
 * - Preserves gradient headers and subtle scale-only hover/focus-visible effect.
 */
export default function BentoGrid() {
  /**
   * Updated layout approach to match the screenshot pattern
   * - xs/sm: 1–2 columns natural stack, full-width items.
   * - md: 6 columns with explicit card spans for a non-uniform mosaic.
   * - lg: 8 columns with adjusted spans preserving the same visual rhythm.
   *
   * We keep grid-auto-rows consistent (md+/lg: 96px) and enable dense packing
   * to eliminate gaps even with non-uniform spans.
   */
  const cards = [
    // Top-left hero tile
    {
      title: "Fast",
      desc: "Optimized build with minimal dependencies.",
      span: {
        sm: "sm:col-span-2 sm:row-span-2",
        md: "md:col-span-4 md:row-span-2",
        lg: "lg:col-span-5 lg:row-span-2",
      },
    },
    // Top-right skinny
    {
      title: "Themed",
      desc: "Ocean Professional palette out-of-the-box.",
      span: {
        sm: "sm:col-span-1 sm:row-span-1",
        md: "md:col-span-2 md:row-span-1",
        lg: "lg:col-span-3 lg:row-span-1",
      },
    },
    // Right column tall block
    {
      title: "Responsive",
      desc: "Mobile-first, adapts to all screen sizes.",
      span: {
        sm: "sm:col-span-1 sm:row-span-2",
        md: "md:col-span-2 md:row-span-2",
        lg: "lg:col-span-3 lg:row-span-2",
      },
    },
    // Small under hero
    {
      title: "Accessible",
      desc: "Usability and semantics considered.",
      span: {
        sm: "sm:col-span-1 sm:row-span-1",
        md: "md:col-span-2 md:row-span-1",
        lg: "lg:col-span-2 lg:row-span-1",
      },
    },
    // Small filler
    {
      title: "Composable",
      desc: "Mix and match primitives for velocity.",
      span: {
        sm: "sm:col-span-1 sm:row-span-1",
        md: "md:col-span-2 md:row-span-1",
        lg: "lg:col-span-2 lg:row-span-1",
      },
    },
    // Mid-row wide feature
    {
      title: "Performant",
      desc: "GPU-accelerated transitions, no jank.",
      span: {
        sm: "sm:col-span-2 sm:row-span-2",
        md: "md:col-span-3 md:row-span-2",
        lg: "lg:col-span-4 lg:row-span-2",
      },
    },
    // Small tile
    {
      title: "Reliable",
      desc: "Mature build tooling and proven patterns.",
      span: {
        sm: "sm:col-span-1 sm:row-span-1",
        md: "md:col-span-1 md:row-span-1",
        lg: "lg:col-span-2 lg:row-span-1",
      },
    },
    // Bottom-right tall
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
      {/* Grid shell
         - Base: 1 column with comfortable row height for readability.
         - sm: 2 columns to begin asymmetry early.
         - md: 6 columns; fixed auto-rows and dense packing.
         - lg: 8 columns; same auto-rows height; pattern widens.
      */}
      <div
        className={[
          // Reduce base gap for tighter spacing; keep slightly more room on md+ for readability
          "grid gap-2 sm:gap-2 md:gap-2.5 lg:gap-3",
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
              "col-span-1", // base
              spanToClass(c.span), // responsive spans
              // Visual surface + transform isolation; scale-only hover/focus
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
              className="px-3.5 py-2 border-b border-white/15"
              style={{
                background: headerGradient,
                color: "#ffffff",
              }}
            >
              <h3 className="text-sm sm:text-[15px] font-semibold leading-6 text-white">
                {c.title}
              </h3>
            </header>

            {/* Content body; layout remains stable on hover due to transform-only scale */}
            <div className="p-3.5 sm:p-3.5 md:p-3.5">
              <p className="text-sm text-gray-700">{c.desc}</p>

              <div className="mt-2.5 flex items-center justify-between">
                {/* Demo block height scales perceptually with row-span because auto-rows are fixed */}
                <div className="h-20 md:h-16 flex-1 rounded-lg bg-blue-50" />
                <a
                  href="#"
                  className="ml-3 rounded-full px-2.5 py-1.5 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:opacity-95 focus-ring"
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
