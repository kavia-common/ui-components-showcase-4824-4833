import React from "react";

/**
 * PUBLIC_INTERFACE
 * BentoGrid
 * Dense, responsive mosaic of cards using CSS Grid with grid-auto-flow:dense,
 * consistent auto-rows, and balanced spans for sm/md/lg breakpoints.
 *
 * Preserves:
 * - Gradient headers (linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%))
 * - Subtle scale-only hover/focus-visible (no color change)
 * - Rounded corners, responsiveness, accessibility
 * - Transform isolation: overflow-hidden, transform-gpu, modest scale, origin-center
 */
export default function BentoGrid() {
  /**
   * If data-driven, items can carry span hints to guide packing.
   * Here we provide a stable set that produces dense fill across common widths.
   *
   * Strategy:
   * - Use 6 columns from md upward for flexible composition.
   * - Keep a single consistent row height at md/lg so row-span math is predictable.
   * - Balance spans to sum to full rows (6 columns) to avoid leftover holes.
   * - Enable [grid-auto-flow:dense] to allow later items to backfill gaps.
   */
  const cards = [
    { title: "Fast", desc: "Optimized build with minimal dependencies.", span: { md: "col-span-3 row-span-2", lg: "col-span-3 row-span-2" } },
    { title: "Themed", desc: "Ocean Professional palette out-of-the-box.", span: { md: "col-span-3 row-span-2", lg: "col-span-3 row-span-1" } },
    { title: "Responsive", desc: "Mobile-first, adapts to all screen sizes.", span: { md: "col-span-2 row-span-2", lg: "col-span-2 row-span-2" } },
    { title: "Accessible", desc: "Usability and semantics considered.", span: { md: "col-span-2 row-span-1", lg: "col-span-2 row-span-1" } },
    { title: "Composable", desc: "Mix and match primitives for velocity.", span: { md: "col-span-2 row-span-1", lg: "col-span-2 row-span-1" } },
    { title: "Performant", desc: "GPU-accelerated transitions, no jank.", span: { md: "col-span-3 row-span-2", lg: "col-span-3 row-span-2" } },
  ];

  // Helper to serialize span hints into Tailwind classes
  const spanToClass = (span) => {
    if (!span) return "";
    const md = span.md ? `md:${span.md}` : "";
    const lg = span.lg ? `lg:${span.lg}` : "";
    return [md, lg].filter(Boolean).join(" ");
  };

  const headerGradient =
    "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)";

  return (
    <section aria-label="Bento grid of features" className="w-full">
      {/* Grid:
          - 1 column on small screens so each item is full width.
          - 6 columns at md+ for flexible spans.
          - auto-rows fixed at md/lg so row-span is consistent; slightly taller on small.
          - grid-auto-flow:dense at md+ to backfill any gaps.
       */}
      <div
        className={[
          "grid gap-4",
          "grid-cols-1",
          "md:grid-cols-6",
          "auto-rows-[minmax(112px,auto)] md:auto-rows-[96px] lg:auto-rows-[96px]",
          "md:[grid-auto-flow:dense]",
        ].join(" ")}
      >
        {cards.map((c, i) => (
          <article
            key={i}
            className={[
              // Full width on small; apply span hints at md+
              "col-span-1",
              spanToClass(c.span),
              // Wrapper with transform isolation and subtle scale-only hover/focus
              "surface overflow-hidden rounded-xl",
              "transform-gpu will-change-transform origin-center",
              "transition-transform duration-200 ease-out",
              "hover:scale-[1.01] focus-within:scale-[1.01]",
              "relative",
            ].join(" ")}
            aria-label={`${c.title} card`}
          >
            {/* Gradient header preserved */}
            <header
              className="px-4 py-2.5 border-b border-white/15"
              style={{
                background: headerGradient,
                color: "#ffffff",
              }}
            >
              <h3 className="text-sm sm:text-base font-semibold leading-6 text-white">
                {c.title}
              </h3>
            </header>

            {/* Body content; outer overflow-hidden ensures transforms do not impact layout */}
            <div className="p-4">
              <p className="text-sm text-gray-700">{c.desc}</p>

              <div className="mt-3 flex items-center justify-between">
                {/* Demo block scales visually with row-span due to fixed auto-rows */}
                <div className="h-20 md:h-16 flex-1 rounded-lg bg-blue-50" />
                <a
                  href="#"
                  className="ml-4 rounded-full px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:opacity-95 focus-ring"
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
