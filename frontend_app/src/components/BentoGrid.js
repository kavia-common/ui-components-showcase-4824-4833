import React from "react";

/**
 * PUBLIC_INTERFACE
 * BentoGrid
 * Asymmetric, responsive mosaic of cards with gradient headers and subtle scale-only hover/focus-visible effect.
 *
 * Dense, hole-free layout approach:
 * - Use a fixed auto-row size so row-span values translate to predictable heights.
 * - Apply grid-auto-flow: dense to backfill earlier gaps when later items fit them.
 * - Curate span patterns per breakpoint (sm/md/lg) to keep an asymmetric look without leaving orphan spaces.
 * - Constrain transforms with overflow-hidden and transform-gpu so scale does not affect layout.
 * - Keep header gradient: linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%).
 */
export default function BentoGrid() {
  // Static content; if data-driven later, attach span meta per item.
  const cards = [
    { title: "Fast", desc: "Optimized build with minimal dependencies." },
    { title: "Themed", desc: "Ocean Professional palette out-of-the-box." },
    { title: "Responsive", desc: "Mobile-first, adapts to all screen sizes." },
    { title: "Accessible", desc: "Usability and semantics considered." },
    { title: "Composable", desc: "Mix and match primitives for velocity." },
    { title: "Performant", desc: "GPU-accelerated transitions, no jank." },
  ];

  /**
   * Row sizing and spans
   * - auto-rows is set to a fixed baseline (e.g., 96px at md, 110px on small) so "row-span-N" map to N * rowHeight.
   * - Spans are tuned to avoid holes across md and lg breakpoints. Small screens stay single-column.
   *
   * Pattern (6 items):
   *  - 0: wide hero (fills width), 2 rows
   *  - 1: tall column, 3 rows at lg to absorb leftover space
   *  - 2: medium, 2 rows at lg to pair with the tall
   *  - 3: small, 1 row
   *  - 4: small, 1 row
   *  - 5: wide footer, 2 rows at md to close the grid evenly
   */
  const spanClasses = [
    // md uses 6 columns; lg refines proportions
    // 0: hero wide
    "col-span-6 row-span-2 lg:col-span-4 lg:row-span-2",
    // 1: tall
    "col-span-3 row-span-2 lg:col-span-2 lg:row-span-3",
    // 2: medium
    "col-span-3 row-span-2 lg:col-span-3 lg:row-span-2",
    // 3: small
    "col-span-3 row-span-1 lg:col-span-2 lg:row-span-1",
    // 4: small
    "col-span-3 row-span-1 lg:col-span-2 lg:row-span-1",
    // 5: footer closer
    "col-span-6 row-span-2 lg:col-span-3 lg:row-span-2",
  ];

  const headerGradient =
    "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)";

  return (
    <section aria-label="Bento grid of features" className="w-full">
      {/* 
        Grid rules:
        - grid-auto-flow: dense helps backfill earlier gaps with later items.
        - auto-rows use a fixed track height so row-span math is consistent.
        - We slightly reduce the row height at md to increase packing density.
      */}
      <div
        className={[
          "grid grid-cols-1 gap-4",
          // Use 6 columns from md up for expressive spans
          "md:grid-cols-6",
          // Fixed row height per breakpoint; smaller at md for tighter packing
          "auto-rows-[minmax(110px,auto)] md:auto-rows-[96px] lg:auto-rows-[96px]",
          // Dense packing to avoid holes
          "md:[grid-auto-flow:dense]",
        ].join(" ")}
      >
        {cards.map((c, i) => {
          const span = spanClasses[i] || "col-span-6 row-span-1";
          return (
            <article
              key={i}
              className={[
                // Asymmetric spans (apply from md upwards)
                "md:" + span,
                // Card wrapper with confined transform
                "surface overflow-hidden rounded-xl",
                "transform-gpu will-change-transform origin-center",
                "transition-transform duration-200 ease-out",
                "hover:scale-[1.012] focus-within:scale-[1.012]",
                // Isolate stacking to prevent overlap artifacts on scale
                "relative",
              ].join(" ")}
              aria-label={`${c.title} card`}
            >
              {/* Gradient header, maintain color/contrast */}
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

              {/* Body uses intrinsic height; outer overflow-hidden ensures transform doesn't affect layout */}
              <div className="p-4">
                <p className="text-sm text-gray-700">{c.desc}</p>

                <div className="mt-3 flex items-center justify-between">
                  {/* Visual block scales with span height (thanks to auto-rows baseline) */}
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
          );
        })}
      </div>
    </section>
  );
}
