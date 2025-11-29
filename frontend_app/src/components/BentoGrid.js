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
 */
export default function BentoGrid() {
  const cards = [
    { title: "Fast", desc: "Optimized build with minimal dependencies.", span: "md:col-span-2" },
    { title: "Themed", desc: "Ocean Professional palette out-of-the-box.", span: "" },
    { title: "Responsive", desc: "Mobile-first, adapts to all screen sizes.", span: "" },
    { title: "Accessible", desc: "Usability and semantics considered.", span: "md:col-span-2" },
  ];

  const headerGradient =
    "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((c, i) => (
        <div
          key={i}
          className={`surface overflow-hidden ${c.span}`}
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
            <div className="mt-4 h-24 rounded-lg bg-blue-50"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
