import React, { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * Accordion
 * Simple multi-item accordion with smooth expand/collapse.
 */
export default function Accordion() {
  const items = [
    { q: "What is Ocean Professional theme?", a: "A blue-forward, modern theme with amber accents, subtle gradients, rounded corners, and soft shadows." },
    { q: "Is Tailwind used?", a: "Yes, Tailwind CSS powers the layout and styling for rapid, consistent UI." },
    { q: "Is this interactive?", a: "Absolutely. Each section expands and collapses with smooth transitions." },
  ];

  const [open, setOpen] = useState(0);

  return (
    <div id="accordion" className="space-y-3">
      {items.map((it, idx) => {
        const isOpen = open === idx;
        return (
          <div key={idx} className="surface overflow-hidden">
            <button
              className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition"
              onClick={() => setOpen((o) => (o === idx ? -1 : idx))}
              aria-expanded={isOpen}
            >
              <span className="font-medium">{it.q}</span>
              <span className={`text-blue-600 transition-transform ${isOpen ? "rotate-180" : ""}`}>▾</span>
            </button>
            <div
              className={`px-4 transition-[max-height] duration-300 ease-in-out ${isOpen ? "max-h-40" : "max-h-0"}`}
              aria-hidden={!isOpen}
            >
              <p className={`pb-4 text-gray-600 ${isOpen ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}>
                {it.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
