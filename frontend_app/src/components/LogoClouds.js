import React, { useMemo } from "react";

/**
 * PUBLIC_INTERFACE
 * LogoClouds
 * Responsive row/grid of grayscale logos with subtle hover tint in theme gradient.
 */
export default function LogoClouds() {
  const gradient = useMemo(
    () => "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)",
    []
  );

  const logos = ["Acme", "Globex", "Umbrella", "Initech", "Stark", "Wayne"];

  return (
    <section aria-label="Logo Clouds" className="w-full">
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">
          <span style={{ textTransform: "uppercase" }}>Trusted by Teams</span>
        </h2>
        <p className="text-sm text-slate-600">
          Great companies use these UI patterns.
        </p>
      </header>
      <div className="surface p-4">
        <ul className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
          {logos.map((name) => (
            <li key={name}>
              <div
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-500 select-none transition-all"
                style={{ filter: "grayscale(1)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = "grayscale(0)";
                  e.currentTarget.style.background = gradient;
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = "grayscale(1)";
                  e.currentTarget.style.background = "#fff";
                  e.currentTarget.style.color = "#6b7280";
                }}
              >
                <span style={{ textTransform: "uppercase" }}>{name}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
