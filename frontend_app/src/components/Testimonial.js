import React, { useMemo } from "react";

/**
 * PUBLIC_INTERFACE
 * Testimonial
 * Grid of customer testimonials with avatars, star ratings, and subtle hover animations.
 */
export default function Testimonial() {
  const gradient = useMemo(
    () => "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)",
    []
  );

  const items = [
    {
      name: "Alex M.",
      role: "Product Lead",
      quote: "Clean and professional UI with delightful details.",
      rating: 5,
    },
    {
      name: "Jamie L.",
      role: "Engineer",
      quote: "Tailwind makes iteration fast; these components are a great start.",
      rating: 4,
    },
    {
      name: "Priya K.",
      role: "Designer",
      quote: "Ocean palette feels modern and trustworthy.",
      rating: 5,
    },
  ];

  return (
    <section aria-label="Testimonials" className="w-full">
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">
          <span style={{ textTransform: "uppercase" }}>What People Say</span>
        </h2>
        <p className="text-sm text-slate-600">
          Feedback from teams shipping with confidence.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((t, i) => (
          <article
            key={i}
            className="surface p-5 transition-transform duration-200"
            style={{ willChange: "transform" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "";
            }}
          >
            <header className="flex items-center gap-3">
              <div
                aria-hidden="true"
                className="h-10 w-10 rounded-full ring-2 ring-white shadow"
                style={{
                  background: gradient,
                  display: "grid",
                  placeItems: "center",
                  color: "#fff",
                  fontWeight: 700,
                }}
              >
                {t.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <h3 className="text-sm font-semibold">{t.name}</h3>
                <p className="text-xs text-slate-500">{t.role}</p>
              </div>
            </header>

            <p className="mt-3 text-slate-700">“{t.quote}”</p>

            <div className="mt-3 flex items-center gap-1" aria-label={`${t.rating} out of 5 stars`}>
              {Array.from({ length: 5 }).map((_, idx) => (
                <svg
                  key={idx}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  style={{
                    color: idx < t.rating ? "#F59E0B" : "#E5E7EB",
                    filter: idx < t.rating ? "drop-shadow(0 1px 0 rgba(0,0,0,0.05))" : "none",
                  }}
                >
                  <path
                    fill="currentColor"
                    d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                  />
                </svg>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
