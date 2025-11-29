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
 */
export default function BentoGrid() {
  // Added four more items; kept spans to form a pleasing responsive mosaic.
  const cards = [
    { title: "Fast", desc: "Optimized build with minimal dependencies.", span: "md:col-span-2" },
    { title: "Themed", desc: "Ocean Professional palette out-of-the-box.", span: "" },
    { title: "Responsive", desc: "Mobile-first, adapts to all screen sizes.", span: "" },
    { title: "Accessible", desc: "Usability and semantics considered.", span: "md:col-span-2" },
    // New cards
    { title: "Composable", desc: "Small primitives you can combine for richer UIs.", span: "" },
    { title: "Performant", desc: "Snappy transitions and lightweight runtime.", span: "" },
    { title: "Customizable", desc: "Tweak tokens, radius, and spacing easily.", span: "md:col-span-2" },
    { title: "Documented", desc: "Clear guidance and comments in code.", span: "" },
  ];

  const headerGradient =
    "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((c, i) => (
        <div
          key={i}
          // Use group to allow nested hover effects if needed; apply scale-only transitions.
          className={[
            "surface overflow-hidden",
            c.span,
            "transform transition-transform duration-200 ease-out",
            "hover:scale-[1.015] focus-within:scale-[1.015]",
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

            {/* Example interactive element to ensure accessible focus within the card; */}
            {/* keeps focus-visible ring without color change on hover */}
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
