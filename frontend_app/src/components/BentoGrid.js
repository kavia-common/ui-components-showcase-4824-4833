import React from "react";

/**
 * PUBLIC_INTERFACE
 * BentoGrid
 * Responsive grid mixing varied card sizes.
 *
 * Headers: Each card uses the specified gradient as the header bar background:
 * linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)
 * Text in the header is forced to white for readability. Card surfaces, rounded
 * corners, spacing, and hover behaviors are preserved.
 *
 * Interaction: Subtle scale-only hover and focus-visible effect is applied to each
 * card container (mirrors Accordion’s interaction approach). No color changes on hover.
 *
 * Update:
 * - Prevent hover scale from creating empty layout space by ensuring transforms
 *   do not affect layout: GPU transforms, will-change, overflow-hidden on wrapper,
 *   centered origin, and small scale.
 * - Restore/maintain a non-uniform mosaic using CSS grid with grid-auto-rows and
 *   varied col/row spans for asymmetric layout.
 */
export default function BentoGrid() {
  // Create a deliberate, asymmetric mosaic via column and row spans.
  // rowSpan uses Tailwind row-span utilities supported by grid-auto-rows below.
  const cards = [
    { title: "Fast", desc: "Optimized build with minimal dependencies.", colSpan: "md:col-span-2", rowSpan: "row-span-2" },
    { title: "Themed", desc: "Ocean Professional palette out-of-the-box.", colSpan: "", rowSpan: "row-span-1" },
    { title: "Responsive", desc: "Mobile-first, adapts to all screen sizes.", colSpan: "", rowSpan: "row-span-1" },
    { title: "Accessible", desc: "Usability and semantics considered.", colSpan: "md:col-span-2", rowSpan: "row-span-1" },
    { title: "Composable", desc: "Small primitives you can combine for richer UIs.", colSpan: "", rowSpan: "row-span-2" },
    { title: "Performant", desc: "Snappy transitions and lightweight runtime.", colSpan: "", rowSpan: "row-span-1" },
    { title: "Customizable", desc: "Tweak tokens, radius, and spacing easily.", colSpan: "md:col-span-2", rowSpan: "row-span-2" },
    { title: "Documented", desc: "Clear guidance and comments in code.", colSpan: "", rowSpan: "row-span-1" },
  ];

  const headerGradient =
    "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)";

  return (
    <div
      // Use grid-auto-rows to establish a base track size so row-span works as a masonry-like mosaic.
      // The small base (e.g., 8 or 10) allows fine-grained height increments without layout jumps.
      className="grid grid-cols-1 md:grid-cols-3 gap-4 [grid-auto-rows:10px]"
    >
      {cards.map((c, i) => (
        <div
          key={i}
          // Parent wrapper prevents scaled child from affecting layout and clipping rounded corners
          className={[
            "relative rounded-xl",          // keep rounding on outermost container
            "overflow-hidden",              // clip any scaled child overflow
            c.colSpan,
            c.rowSpan,
          ].join(" ")}
        >
          {/* inner card applies transform without layout shift */}
          <div
            className={[
              "surface h-full", // ensure fills the grid area
              // GPU transform + contained paint for smoother transitions
              "transform-gpu will-change-transform",
              // centered origin to avoid directional push
              "origin-center",
              // subtle scale only on hover/focus-visible; keep small to avoid any perceived gaps
              "transition-transform duration-200 ease-out",
              "hover:scale-[1.01] focus-within:scale-[1.01]",
            ].join(" ")}
          >
            {/* Gradient header bar */}
            <div
              className="px-5 py-3"
              style={{
                background: headerGradient,
                color: "#fff",
              }}
            >
              <h3 className="text-base sm:text-lg font-semibold leading-6">
                {c.title}
              </h3>
            </div>

            {/* Card body */}
            <div className="p-5">
              <p className="text-sm text-gray-600">{c.desc}</p>

              {/* Interactive element retains focus-visible styling */}
              <div className="mt-4 flex items-center justify-between">
                <div className="h-24 flex-1 rounded-lg bg-blue-50" />
                <a
                  href="#"
                  className="ml-4 rounded-full px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:opacity-95 focus-ring"
                >
                  Details
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
