import React, { useEffect, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * Carousel
 * Minimal carousel with prev/next controls and auto-advance.
 */
export default function Carousel() {
  const slides = [
    { title: "Sleek design", color: "bg-blue-100" },
    { title: "Tailwind powered", color: "bg-amber-100" },
    { title: "Responsive", color: "bg-gray-100" },
  ];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="surface p-4">
      <div className="relative overflow-hidden rounded-lg">
        <div
          className="whitespace-nowrap transition-transform duration-500"
          style={{ transform: `translateX(-${idx * 100}%)` }}
        >
          {slides.map((s, i) => (
            <div key={i} className={`inline-block w-full align-top ${s.color} h-40 md:h-56 rounded-lg`}>
              <div className="h-full w-full flex items-center justify-center">
                <span className="text-lg font-semibold">{s.title}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-between px-2">
          <button className="rounded-full bg-white/80 px-3 py-1 shadow hover:bg-white focus-ring" onClick={() => setIdx((i) => (i - 1 + slides.length) % slides.length)} aria-label="Previous slide">‹</button>
          <button className="rounded-full bg-white/80 px-3 py-1 shadow hover:bg-white focus-ring" onClick={() => setIdx((i) => (i + 1) % slides.length)} aria-label="Next slide">›</button>
        </div>
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
          {slides.map((_, i) => (
            <span key={i} className={`h-2 w-2 rounded-full ${i === idx ? "bg-blue-600" : "bg-gray-300"}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
