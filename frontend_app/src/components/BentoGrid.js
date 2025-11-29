import React from "react";

/**
 * PUBLIC_INTERFACE
 * BentoGrid
 * Asymmetric, dense CSS Grid layout with no gaps across breakpoints.
 *
 * Implementation details:
 * - Uses grid-auto-flow: dense and consistent auto-rows so varied spans pack tightly.
 * - Tailored span patterns per breakpoint (sm/md/lg) to keep an intentionally
 *   non-uniform yet well-balanced layout.
 * - Preserves gradient headers and subtle scale-only hover/focus-visible effect.
 */
export default function BentoGrid() {
  /**
   * Layout approach
   * - sm: 1 column, each item full width, natural stack (no holes).
   * - md: 6 columns, auto-rows fixed (92–96px); spans chosen so rows fill to 6 cols.
   * - lg: 8 columns, same auto-rows height; spans adjusted to maintain asymmetry and density.
   *
   * The spans below are tuned to avoid common holes on 6/8 column tracks.
   */
  const cards = [
    {
      title: "Fast",
      desc: "Optimized build with minimal dependencies.",
      span: { md: "col-span-3 row-span-2", lg: "col-span-4 row-span-2" },
    },
    {
      title: "Themed",
      desc: "Ocean Professional palette out-of-the-box.",
      span: { md: "col-span-3 row-span-1", lg: "col-span-2 row-span-1" },
    },
    {
      title: "Responsive",
      desc: "Mobile-first, adapts to all screen sizes.",
      span: { md: "col-span-2 row-span-2", lg: "col-span-2 row-span-2" },
    },
    {
      title: "Accessible",
      desc: "Usability and semantics considered.",
      span: { md: "col-span-2 row-span-1", lg: "col-span-2 row-span-1" },
    },
    {
      title: "Composable",
      desc: "Mix and match primitives for velocity.",
      span: { md: "col-span-2 row-span-1", lg: "col-span-2 row-span-1" },
    },
    {
      title: "Performant",
      desc: "GPU-accelerated transitions, no jank.",
      span: { md: "col-span-3 row-span-2", lg: "col-span-4 row-span-2" },
    },
    {
      title: "Reliable",
      desc: "Mature build tooling and proven patterns.",
      span: { md: "col-span-2 row-span-1", lg: "col-span-2 row-span-1" },
    },
    {
      title: "Extensible",
      desc: "Scale components as your app grows.",
      span: { md: "col-span-2 row-span-2", lg: "col-span-2 row-span-2" },
    },
  ];

  // PUBLIC_INTERFACE
  // Helper to serialize per-breakpoint span hints into Tailwind classes.
  function spanToClass(span) {
    /** Convert span object to md:/lg: prefixed utility classes. */
    if (!span) return "";
    const md = span.md ? `md:${span.md}` : "";
    const lg = span.lg ? `lg:${span.lg}` : "";
    return [md, lg].filter(Boolean).join(" ");
  }

  const headerGradient =
    "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)";

  return (
    <section aria-label="Bento grid of features" className="w-full">
      {/* Grid shell:
         - Small: single column; slightly taller auto-rows to provide breathing room.
         - md: 6 columns; fixed auto-rows and dense packing.
         - lg: 8 columns; same auto-rows height for stable row-span math.
      */}
      <div
        className={[
          "grid gap-4",
          "grid-cols-1",
          "sm:grid-cols-2", // allow early 2-col packing to avoid tall stacks on small-ish screens
          "md:grid-cols-6",
          "lg:grid-cols-8",
          // consistent auto row height; slightly taller on base for better single-column rhythm
          "auto-rows-[minmax(116px,auto)] sm:auto-rows-[minmax(116px,auto)] md:auto-rows-[96px] lg:auto-rows-[96px]",
          // dense packing at md+ so later items can backfill holes
          "md:[grid-auto-flow:dense] lg:[grid-auto-flow:dense]",
        ].join(" ")}
      >
        {cards.map((c, i) => (
          <article
            key={`${c.title}-${i}`}
            className={[
              // Base spans
              "col-span-1",
              // Apply responsive span hints
              spanToClass(c.span),
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

            {/* Content body; layout remains stable on hover due to transform-only scale */}
            <div className="p-4">
              <p className="text-sm text-gray-700">{c.desc}</p>

              <div className="mt-3 flex items-center justify-between">
                {/* Demo block height scales perceptually with row-span because auto-rows are fixed */}
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
