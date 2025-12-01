import React from "react";

/**
 * PUBLIC_INTERFACE
 * Breadcrumbs
 * Pixel-precise breadcrumb aligned to the reference:
 * - Container: rounded pill/card with subtle border and soft shadow (≈14–16px radius)
 * - Padding: 8–10px vertical, 14–16px horizontal
 * - Separator: chevron 16px, stroke 2px, low-contrast gray (≈slate-400/80)
 * - Link items: 13–14px responsive, weight 500, slight letter-spacing; hover underline + tint
 * - Current item: bold 700 in a subtle white chip with thin border and optional tiny gradient dot
 * - Focus ring: visible with offset, no layout shift
 * - Accessibility: uses <nav aria-label="Breadcrumb"> with <ol>/<li>, aria-current on last item
 */
export default function Breadcrumbs() {
  const crumbs = ["Home", "Components", "Forms", "Wizard"];
  const lastIndex = crumbs.length - 1;

  // Accent gradient for the current-item dot
  const accentGradient =
    "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)";

  // Chevron separator icon (16px, stroke 2)
  const Chevron = ({ ariaHidden = true }) => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden={ariaHidden}
      xmlns="http://www.w3.org/2000/svg"
      className="pointer-events-none"
    >
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  // Typography and focus tokens
  const baseTypeClasses =
    "text-[13px] sm:text-[14px] tracking-[0.005em]";
  const focusRing =
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500/60";

  return (
    <nav aria-label="Breadcrumb">
      {/* Card/pill container */}
      <div
        className="shadow-soft"
        style={{
          background: "#FFFFFF",
          borderRadius: 14,
          border: "1px solid rgba(17,24,39,0.08)", // slate-900 @ 8%
        }}
      >
        <ol
          className={[
            "flex flex-wrap items-center",
            "py-2.5 px-4",
            baseTypeClasses,
          ].join(" ")}
        >
          {crumbs.map((c, idx) => {
            const isLast = idx === lastIndex;

            return (
              <li key={c} className="flex items-center">
                {!isLast ? (
                  <a
                    href="#"
                    className={[
                      "px-1 py-1 rounded-[8px]",
                      "text-slate-700 hover:text-slate-900",
                      "font-medium",
                      "transition-colors",
                      "hover:underline underline-offset-2 decoration-slate-400/60",
                      focusRing,
                    ].join(" ")}
                  >
                    {c}
                  </a>
                ) : (
                  <span
                    aria-current="page"
                    title={c}
                    className={[
                      "inline-flex items-center gap-2",
                      "font-bold text-slate-900",
                      "rounded-full",
                      "px-3 py-1.5",
                    ].join(" ")}
                    style={{
                      background: "#FFFFFF", // solid per reference; change to faint tint if needed
                      border: "1px solid rgba(17,24,39,0.10)",
                      boxShadow:
                        "0 1px 2px rgba(16,24,40,0.05)",
                    }}
                  >
                    {/* Tiny gradient dot accent (≈6px) */}
                    <span
                      aria-hidden="true"
                      className="inline-block h-1.5 w-1.5 rounded-full"
                      style={{ background: accentGradient }}
                    />
                    <span>{c}</span>
                  </span>
                )}

                {/* Separator chevron (not after last) */}
                {idx < lastIndex && (
                  <span
                    className="mx-2 select-none inline-flex items-center justify-center"
                    aria-hidden="true"
                    // Use slate-400 with ~80–90% opacity for the glyph color
                    style={{ color: "rgba(148,163,184,0.85)" }}
                  >
                    <Chevron />
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
