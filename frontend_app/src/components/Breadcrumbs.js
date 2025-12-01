import React from "react";

/**
 * PUBLIC_INTERFACE
 * Breadcrumbs
 * Implements pixel-precise styling aligned to the latest screenshot while preserving
 * semantics and accessibility (nav/ol/li and aria-current on the last item).
 *
 * Visual specifics applied:
 * - Card: white surface, 16px radius, 1px border rgba(17,24,39,0.08), soft shadow 0 6px 20px rgba(0,0,0,0.08)
 * - Padding: vertical 10px, horizontal 16px (py-2.5 px-4)
 * - Separators: chevron size 16px, stroke 2px, color slate-400 at 86% opacity, horizontal spacing 8px (mx-2)
 * - Link items (non-current): 13–14px, 500, letter-spacing ~0.2px; slate-700 default to slate-900 on hover; underline on hover
 * - Current item: bold 700 inside a white chip with 1px border rgba(17,24,39,0.10), subtle shadow, pill padding px-10px (~px-2.5)/py-8px (~py-2)
 *   plus a 6px gradient accent dot at the leading edge
 * - Focus: visible ring without layout shift: 2px ring with 2px offset in an indigo/cyan hue
 */
export default function Breadcrumbs() {
  // Example path; in an app this would reflect router state
  const crumbs = ["Home", "Components", "Forms", "Wizard"];
  const last = crumbs.length - 1;

  // Accent gradient for the current item dot (matches app’s unified gradient)
  const ACCENT_GRADIENT =
    "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)";

  // Container/card style exactness
  const cardStyle = {
    background: "#FFFFFF",
    borderRadius: 16,
    border: "1px solid rgba(17,24,39,0.08)",
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
  };

  // Current item chip style
  const currentChipStyle = {
    background: "#FFFFFF",
    border: "1px solid rgba(17,24,39,0.10)",
    boxShadow: "0 1px 2px rgba(16,24,40,0.05)",
  };

  // Chevron separator: parent sets color via currentColor
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

  // PUBLIC_INTERFACE
  // Render a single crumb; keeps focus-ring and hover states aligned to spec
  function Crumb({ label, isLast }) {
    const type = "text-[13px] sm:text-[14px] tracking-[0.0125em]";
    const linkBase =
      "px-[2px] py-[2px] rounded-[10px] font-medium text-slate-700 transition-colors";
    const linkHover = "hover:text-slate-900 hover:underline underline-offset-2 decoration-slate-400/60";
    const focusVisible =
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500/60";

    if (!isLast) {
      return (
        <a href="#" className={[type, linkBase, linkHover, focusVisible].join(" ")}>
          {label}
        </a>
      );
    }

    return (
      <span
        aria-current="page"
        title={label}
        className={[
          "inline-flex items-center gap-2",
          "font-bold text-slate-900",
          "rounded-full",
          "px-[10px] py-[8px]",
          type,
        ].join(" ")}
        style={currentChipStyle}
      >
        <span
          aria-hidden="true"
          className="inline-block h-[6px] w-[6px] rounded-full"
          style={{ background: ACCENT_GRADIENT }}
        />
        <span>{label}</span>
      </span>
    );
  }

  return (
    <nav aria-label="Breadcrumb">
      <div className="shadow-soft" style={cardStyle}>
        <ol className="flex flex-wrap items-center py-2.5 px-4">
          {crumbs.map((label, i) => {
            const isLast = i === last;
            return (
              <li key={`${label}-${i}`} className="flex items-center">
                <Crumb label={label} isLast={isLast} />
                {i < last && (
                  <span
                    className="mx-2 select-none inline-flex items-center justify-center"
                    aria-hidden="true"
                    style={{ color: "rgba(148,163,184,0.86)" }}
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
