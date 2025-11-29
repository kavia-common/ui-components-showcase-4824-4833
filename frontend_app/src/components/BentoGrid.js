import React from "react";

/**
 * PUBLIC_INTERFACE
 * BentoGrid
 * Responsive, uniform grid of cards with simple headers and no hover-scale.
 *
 * Reverted:
 * - Removed extra cards; back to 4 core items.
 * - Restored uniform grid (no asymmetric row/col spans).
 * - Removed subtle scale-only hover/focus-visible transforms.
 * - Reverted header to plain surface (no gradient).
 */
export default function BentoGrid() {
  // Reverted set: four uniform cards
  const cards = [
    { title: "Fast", desc: "Optimized build with minimal dependencies." },
    { title: "Themed", desc: "Ocean Professional palette out-of-the-box." },
    { title: "Responsive", desc: "Mobile-first, adapts to all screen sizes." },
    { title: "Accessible", desc: "Usability and semantics considered." },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {cards.map((c, i) => (
        <div key={i} className="surface overflow-hidden rounded-xl">
          {/* Simple header (no gradient) */}
          <div className="px-5 py-3 border-b border-gray-100">
            <h3 className="text-base sm:text-lg font-semibold leading-6 text-gray-900">
              {c.title}
            </h3>
          </div>

          {/* Card body */}
          <div className="p-5">
            <p className="text-sm text-gray-600">{c.desc}</p>

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
      ))}
    </div>
  );
}
