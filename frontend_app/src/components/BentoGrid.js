import React from "react";

/**
 * PUBLIC_INTERFACE
 * BentoGrid
 * Slightly more uniform, responsive mosaic of cards with gradient headers and subtle scale-only hover/focus-visible effect.
 *
 * Changes in this tweak:
 * - Reduce extreme span variations; keep variations within 1–2 rows and 2–3 columns at larger breakpoints.
 * - Balance spans across md and lg to avoid awkward leftover gaps while preserving density (grid-auto-flow: dense).
 * - Maintain transform isolation: overflow-hidden, transform-gpu, modest scale so layout isn't affected.
 * - Keep existing gradient headers exactly as specified.
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
   * More uniform spans strategy
   * - Use 6 columns from md upward for flexibility without extremes.
   * - Keep row-span 1–2 for most, 3 only on one item at lg to absorb height.
   * - Keep col-span between 2–3 at lg, 3 at md, and full-width on small.
   *
   * Pattern (6 items):
   *  md (6 cols): [3,2], [3,2], [3,2] blocks using row-span {1,2} to interlock evenly.
   *  lg (6 cols): introduce minor variety but avoid 4+ col spans to reduce stark size differences.
   */
  const spanClasses = [
    // Item 0: medium hero feel but not excessive
    "col-span-6 row-span-2 lg:col-span-3 lg:row-span-2",
    // Item 1: slightly shorter to balance with item 0
    "col-span-6 row-span-1 lg:col-span-3 lg:row-span-1",
    // Item 2: medium
    "col-span-6 row-span-2 lg:col-span-2 lg:row-span-2",
    // Item 3: small
    "col-span-6 row-span-1 lg:col-span-2 lg:row-span-1",
    // Item 4: small-medium
    "col-span-6 row-span-1 lg:col-span-2 lg:row-span-1",
    // Item 5: only slightly larger; avoids footer overly wide look
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
        - Slightly tighter row height for packing, but not too small to avoid cramped content.
      */}
      <div
        className={[
          "grid grid-cols-1 gap-4",
          // 6 columns from md up for balanced spans
          "md:grid-cols-6",
          // Fixed row height; keep consistent across md and lg for predictability
          "auto-rows-[minmax(108px,auto)] md:auto-rows-[92px] lg:auto-rows-[92px]",
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
                // Apply spans from md upwards; mobile stays 1-col
                "md:" + span,
                // Card wrapper; isolate transforms so scale doesn't reflow layout
                "surface overflow-hidden rounded-xl",
                "transform-gpu will-change-transform origin-center",
                "transition-transform duration-200 ease-out",
                "hover:scale-[1.01] focus-within:scale-[1.01]",
                "relative",
              ].join(" ")}
              aria-label={`${c.title} card`}
            >
              {/* Gradient header, maintain color/contrast and rounded corners */}
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
                  {/* Visual block scales with span height thanks to auto-rows baseline */}
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
