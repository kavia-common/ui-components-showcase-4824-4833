import React from "react";

/**
 * PUBLIC_INTERFACE
 * Breadcrumbs
 * High-fidelity breadcrumb styled to match the reference image:
 * - Card/pill container with soft shadow and rounded outline
 * - Chevron separators (16px) with low-contrast gray
 * - Links: medium weight, neutral text; hover raises contrast + subtle underline
 * - Current item: bold with gradient-accent dot inside a faint tinted chip
 * - Spacing: compact 10px vertical, 14–16px horizontal paddings; item gap tuned
 * - Accessibility: nav with aria-label, visible focus ring, 4.5:1 contrast
 */
export default function Breadcrumbs() {
  const crumbs = ["Home", "Components", "Forms", "Wizard"];
  const lastIndex = crumbs.length - 1;

  // Shared gradient for accents
  const accentGradient = "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)";

  // Chevron icon component
  const Chevron = ({ ariaHidden = true }) => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden={ariaHidden}
      xmlns="http://www.w3.org/2000/svg"
      className="text-gray-300"
    >
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <nav aria-label="Breadcrumb">
      {/* Outer pill/card container to match screenshot */}
      <div
        className="rounded-full shadow-soft"
        style={{
          background: "#FFFFFF",
          border: "1px solid rgba(17,24,39,0.08)",
        }}
      >
        <ol
          className={[
            // Layout
            "flex flex-wrap items-center",
            // Spacing consistent with reference: 10px y, 12–16px x
            "px-3 sm:px-4 py-2.5",
            // Type scale
            "text-[13px] sm:text-[14px]",
          ].join(" ")}
        >
          {crumbs.map((c, idx) => {
            const isLast = idx === lastIndex;

            return (
              <li key={c} className="flex items-center">
                {/* Link vs current */}
                {!isLast ? (
                  <a
                    href="#"
                    className={[
                      "px-1 py-1 rounded-md",
                      "text-slate-700 hover:text-slate-900",
                      "font-medium",
                      "transition-colors",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500",
                    ].join(" ")}
                  >
                    {c}
                  </a>
                ) : (
                  <span
                    aria-current="page"
                    title={c}
                    className={[
                      "inline-flex items-center gap-1.5",
                      "rounded-full px-2.5 py-1.5",
                      "font-semibold",
                      "text-slate-900",
                    ].join(" ")}
                    style={{
                      background: "linear-gradient(0deg, rgba(24,64,160,0.06), rgba(24,64,160,0.06))",
                      border: "1px solid rgba(17,24,39,0.10)",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      className="inline-block h-1.5 w-1.5 rounded-full"
                      style={{ background: accentGradient }}
                    />
                    {c}
                  </span>
                )}

                {/* Separator chevron (not after last) */}
                {idx < lastIndex && (
                  <span
                    className="mx-1.5 sm:mx-2 select-none inline-flex items-center justify-center"
                    aria-hidden="true"
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
