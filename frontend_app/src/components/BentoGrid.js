import React from "react";

/**
 * PUBLIC_INTERFACE
 * BentoGrid
 * Responsive, uniform grid of cards with gradient headers and a subtle scale-only hover/focus-visible effect.
 *
 * Updates:
 * - Each card header uses the gradient: linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%).
 * - Reintroduced subtle scale-only hover/focus-visible transforms similar to Accordion (no color change on hover).
 * - Ensured text is readable (white/high-contrast) over gradient.
 * - Preserved rounded corners, spacing, responsiveness.
 * - Confined transforms to avoid layout shifts: transform-gpu, overflow-hidden, will-change, transform-origin center, modest scale.
 * - Accessibility: focus-visible mirrors hover effect and retains proper focus ring on actionable elements.
 */
export default function BentoGrid() {
  const cards = [
    { title: "Fast", desc: "Optimized build with minimal dependencies." },
    { title: "Themed", desc: "Ocean Professional palette out-of-the-box." },
    { title: "Responsive", desc: "Mobile-first, adapts to all screen sizes." },
    { title: "Accessible", desc: "Usability and semantics considered." },
  ];

  const headerGradient =
    "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {cards.map((c, i) => (
        <div
          key={i}
          // Card wrapper: surface with confined scale transform on hover/focus
          className={[
            "surface overflow-hidden rounded-xl",
            "transform-gpu will-change-transform",
            "transition-transform duration-200 ease-out",
            "hover:scale-[1.015] focus-within:scale-[1.015]",
            "origin-center",
          ].join(" ")}
        >
          {/* Gradient header with high-contrast text */}
          <div
            className="px-5 py-3 border-b border-white/15"
            style={{
              background: headerGradient,
              color: "#ffffff",
            }}
          >
            <h3 className="text-base sm:text-lg font-semibold leading-6 text-white">
              {c.title}
            </h3>
          </div>

          {/* Card body */}
          <div className="p-5">
            <p className="text-sm text-gray-700">{c.desc}</p>

            <div className="mt-4 flex items-center justify-between">
              <div className="h-24 flex-1 rounded-lg bg-blue-50" />
              {/* Keep actions accessible; focus ring visible. No color change on hover—only slight opacity as before. */}
              <a
                href="#"
                className="ml-4 rounded-full px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:opacity-95 focus-ring"
              >
                Details
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
