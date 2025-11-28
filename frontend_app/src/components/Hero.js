import React from "react";

/**
 * PUBLIC_INTERFACE
 * Hero
 * Ocean Professional themed hero section with gradient background and CTA.
 */
export default function Hero() {
  const frontendUrl = process.env.REACT_APP_FRONTEND_URL || window.location.origin;

  return (
    <section className="ocean-gradient rounded-2xl p-8 md:p-12 shadow-soft">
      <div className="max-w-3xl">
        <h1 className="text-3xl md:text-5xl font-bold text-[var(--color-text)]">
          UI Components Showcase
        </h1>
        <p className="mt-4 text-gray-600 md:text-lg">
          Explore a curated set of interactive components built with React and Tailwind CSS,
          styled with the Ocean Professional theme.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-white shadow hover:opacity-95 transition focus-ring"
            href="#accordion"
          >
            Explore Components
          </a>
          <a
            className="inline-flex items-center justify-center rounded-lg border border-blue-200 bg-white px-5 py-2.5 text-blue-700 hover:bg-blue-50 transition focus-ring"
            href={frontendUrl}
            rel="noreferrer"
          >
            Open App
          </a>
        </div>
      </div>
    </section>
  );
}
