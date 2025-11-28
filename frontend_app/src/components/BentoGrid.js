import React from "react";

/**
 * PUBLIC_INTERFACE
 * BentoGrid
 * Responsive grid mixing varied card sizes.
 */
export default function BentoGrid() {
  const cards = [
    { title: "Fast", desc: "Optimized build with minimal dependencies.", span: "md:col-span-2" },
    { title: "Themed", desc: "Ocean Professional palette out-of-the-box.", span: "" },
    { title: "Responsive", desc: "Mobile-first, adapts to all screen sizes.", span: "" },
    { title: "Accessible", desc: "Usability and semantics considered.", span: "md:col-span-2" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((c, i) => (
        <div key={i} className={`surface p-5 ${c.span}`}>
          <h3 className="text-lg font-semibold">{c.title}</h3>
          <p className="mt-2 text-sm text-gray-600">{c.desc}</p>
          <div className="mt-4 h-24 rounded-lg bg-blue-50"></div>
        </div>
      ))}
    </div>
  );
}
