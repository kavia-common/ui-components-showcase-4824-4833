import React from "react";

/**
 * PUBLIC_INTERFACE
 * Breadcrumbs
 * Implements the exact styling from kavia-docs/breadcrumbs_implementation_notes.md:
 * - Container: pill/card, 14–16px radius, 1px border with ~8% opacity, soft shadow
 * - Padding: 10px vertical, 16px horizontal (wrap-safe)
 * - Separator: chevron 16px, stroke 2px, color slate-400 at 80–86% opacity, spacing 8–12px
 * - Link items: 13–14px, weight 500, tracking 0.2px, slate-700 → slate-900 on hover, underline on hover
 * - Current item: 700 weight inside subtle white chip with 1px border, tiny gradient accent dot
 * - Focus ring: 2px ring + 2px offset, indigo/cyan per Ocean theme, no layout shift
 * - Accessibility: <nav aria-label="Breadcrumb"> with <ol>/<li>, aria-current on last item
 */
export default function Breadcrumbs() {
  const crumbs = ["Home", "Components", "Forms", "Wizard"];
  const lastIndex = crumbs.length - 1;

  // Accent gradient for the current-item dot
  const accentGradient =
    "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)";

  // Chevron separator icon (16px, stroke 2). Color driven by parent via currentColor.
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
  const typeClasses = "text-[13px] sm:text-[14px] tracking-[0.0125em]";
  const linkBase =
    "px-1 py-1 rounded-[10px] font-medium text-slate-700 hover:text-slate-900 transition-colors";
  const linkUnderline =
    "hover:underline underline-offset-2 decoration-slate-400/60";
  const focusVisible =
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500/60";

  // Container/card styles per notes
  const containerStyle = {
    background: "#FFFFFF",
    borderRadius: 16,
    border: "1px solid rgba(17,24,39,0.08)", // slate-900 @ 8%
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
  };

  // Current item chip styles per notes
  const currentChipStyle = {
    background: "#FFFFFF",
    border: "1px solid rgba(17,24,39,0.10)", // slightly stronger than container
    boxShadow: "0 1px 2px rgba(16,24,40,0.05)",
  };

  return (
    <nav aria-label="Breadcrumb">
      <div className="shadow-soft" style={containerStyle}>
        <ol
          className={[
            "flex flex-wrap items-center",
            "py-2.5 px-4", // ≈ 10px vert, 16px horiz
            typeClasses,
          ].join(" ")}
        >
          {crumbs.map((c, idx) => {
            const isLast = idx === lastIndex;

            return (
              <li key={c} className="flex items-center">
                {!isLast ? (
                  <a href="#" className={[linkBase, linkUnderline, focusVisible].join(" ")}>
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
                    style={currentChipStyle}
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

                {/* Separator chevron (not after last) — spacing and color per notes */}
                {idx < lastIndex && (
                  <span
                    className="mx-2 select-none inline-flex items-center justify-center"
                    aria-hidden="true"
                    style={{ color: "rgba(148,163,184,0.86)" }} // slate-400 @ ~86%
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
