import React from "react";

/**
 * PUBLIC_INTERFACE
 * BentoGrid
 * Asymmetric, responsive mosaic of cards with gradient headers and subtle scale-only hover/focus-visible effect.
 *
 * Changes for asymmetric layout:
 * - Apply varied col-span and row-span per card across breakpoints to create a non-uniform mosaic.
 * - Keep gradient headers: linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%).
 * - Preserve scale-only hover/focus with overflow-hidden, transform-gpu, will-change, modest scale, origin-center.
 * - Ensure accessibility and readable text contrast over gradient headers.
 */
export default function BentoGrid() {
  // If later data-driven, attach span props per item; here we define a static pattern.
  const cards = [
    { title: "Fast", desc: "Optimized build with minimal dependencies." },
    { title: "Themed", desc: "Ocean Professional palette out-of-the-box." },
    { title: "Responsive", desc: "Mobile-first, adapts to all screen sizes." },
    { title: "Accessible", desc: "Usability and semantics considered." },
    { title: "Composable", desc: "Mix and match primitives for velocity." },
    { title: "Performant", desc: "GPU-accelerated transitions, no jank." },
  ];

  // Define per-index responsive span classes for an asymmetric mosaic.
  // Mobile (grid-cols-1): all span full width.
  // md (grid-cols-6): varied col/row spans; lg refines some spans.
  const spanClasses = [
    // Item 0: hero tile
    "col-span-6 row-span-2 lg:col-span-4 lg:row-span-2",
    // Item 1: tall tile
    "col-span-3 row-span-2 lg:col-span-2 lg:row-span-3",
    // Item 2: wide short
    "col-span-3 row-span-1 lg:col-span-3 lg:row-span-1",
    // Item 3: square-ish
    "col-span-3 row-span-1 lg:col-span-2 lg:row-span-1",
    // Item 4: small accent
    "col-span-3 row-span-1 lg:col-span-2 lg:row-span-1",
    // Item 5: footer-wide
    "col-span-6 row-span-1 lg:col-span-3 lg:row-span-1",
  ];

  const headerGradient =
    "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)";

  return (
    <section aria-label="Bento grid of features" className="w-full">
      {/* Use 6-column track at md+ for flexible mosaic placement */}
      <div className="grid grid-cols-1 md:grid-cols-6 auto-rows-[minmax(110px,auto)] gap-4">
        {cards.map((c, i) => {
          const span = spanClasses[i] || "col-span-6 row-span-1";
          return (
            <article
              key={i}
              className={[
                // Asymmetric spans
                "md:" + span,
                // Card wrapper: surface with confined transform
                "surface overflow-hidden rounded-xl",
                "transform-gpu will-change-transform origin-center",
                "transition-transform duration-200 ease-out",
                "hover:scale-[1.012] focus-within:scale-[1.012]",
                // Maintain stacking context to avoid overlaps while scaling
                "relative",
              ].join(" ")}
              aria-label={`${c.title} card`}
            >
              {/* Gradient header with readable text; keep header compact to save space in small tiles */}
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

              {/* Body adapts to available height; ensure overflow-hidden at wrapper level prevents layout shift on hover */}
              <div className="p-4">
                <p className="text-sm text-gray-700">{c.desc}</p>

                <div className="mt-3 flex items-center justify-between">
                  {/* Placeholder media block for visual balance; height scales with auto-rows */}
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
