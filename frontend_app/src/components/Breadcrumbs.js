import React from "react";

/**
 * PUBLIC_INTERFACE
 * Breadcrumbs
 * Ocean Professional-styled breadcrumb navigation. Applies white surface over light canvas,
 * 1px subtle border, soft shadow, rounded-xl radius, and balanced padding (px-4 py-2.5).
 * Links use primary (#2563EB) with hover underline and accessible focus ring. Current item is
 * non-link, neutral/darker text with semibold weight. Separators are subtle slate chevrons.
 */
export default function Breadcrumbs() {
  // Example path; in a real app this would be derived from the router.
  const crumbs = ["Home", "Components", "Forms", "Wizard"];
  const last = crumbs.length - 1;

  // Chevron separator: inherits color from parent
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
  // Renders a single crumb with keyboard-accessible focus ring for links.
  function Crumb({ label, isLast }) {
    const baseType = "text-[13px] sm:text-[14px] tracking-[0.01em]";

    // Link styling per theme: primary color with hover underline, accessible focus ring
    const linkClasses = [
      baseType,
      "font-medium",
      // Darker-than-primary default link color (roughly Tailwind blue-700 / #1E40AF)
      "text-[#1E40AF]",
      "hover:underline underline-offset-2 decoration-blue-400/70",
      "px-0.5 py-0.5 rounded-md",
      // Keep focus-visible ring aligned to primary for accessibility consistency
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-white",
      "transition-colors",
    ].join(" ");

    // Current item: non-link, neutral/darker text with semibold weight
    const currentClasses = [
      "inline-flex items-center",
      "text-slate-800",
      "font-semibold",
      baseType,
    ].join(" ");

    if (!isLast) {
      return (
        <a href="#" className={linkClasses}>
          {label}
        </a>
      );
    }

    return (
      <span aria-current="page" className={currentClasses}>
        {label}
      </span>
    );
  }

  return (
    <nav aria-label="Breadcrumb">
      {/* White surface card with subtle border and soft shadow over light canvas */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-soft">
        <ol className="flex flex-wrap items-center px-4 py-2.5">
          {crumbs.map((label, i) => {
            const isLast = i === last;
            return (
              <li key={`${label}-${i}`} className="flex items-center">
                <Crumb label={label} isLast={isLast} />
                {i < last && (
                  <span
                    className="mx-2 select-none inline-flex items-center justify-center text-slate-400/70"
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
