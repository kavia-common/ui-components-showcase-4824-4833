import React from "react";

/**
 * PUBLIC_INTERFACE
 * Breadcrumbs
 * Ocean Professional-styled breadcrumb navigation. Applies white surface over light canvas,
 * 1px subtle border, soft shadow, rounded-xl radius, and balanced padding (px-4 py-2.5).
 * Links use darker blue text with gradient underline on hover/active and accessible focus ring.
 * Current item is non-link with gradient-filled text and semibold weight. Separators are subtle slate chevrons.
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

    // Gradient to use for underline and active text
    const gradient = "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)";

    // Link styling:
    // - Keep darker text color (#1E40AF)
    // - Provide gradient underline with slightly thicker decoration
    // - Maintain underline-offset for readability
    // - Use pseudo-element fallback to avoid layout shift on browsers lacking text-decoration support nuances
    const linkClasses = [
      baseType,
      "font-medium",
      "relative", // enable pseudo-element underline
      "px-0.5 py-0.5 rounded-md",
      "text-[#1E40AF]",
      "underline-offset-2", // keep readable offset
      // Focus-visible ring aligned to primary for accessibility
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-white",
      "transition-colors",
      // Prevent layout shift by not toggling border/padding on hover
    ].join(" ");

    // Inline style attempts to use modern text-decoration properties where supported.
    const linkStyle = {
      // Try using decoration thickness and color; actual gradient underline is handled by ::after
      textDecorationColor: "transparent",
      textDecorationThickness: "2px", // slightly thicker than default
      // Keep no underline by default; we simulate on hover/focus/active with ::after
      textDecorationLine: "none",
    };

    // Current item: non-link with gradient text fill; provide solid color fallback for older browsers.
    // Preserve font weight and spacing, do not alter layout/padding/separators/focus ring.
    const currentClasses = [
      "inline-flex items-center",
      "font-semibold",
      baseType,
    ].join(" ");

    const currentStyle = {
      color: "#1840a0", // fallback solid color for contrast
      backgroundImage: gradient,
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    };

    if (!isLast) {
      return (
        <a
          href="#"
          className={linkClasses}
          style={linkStyle}
          // CSS-in-JS handlers to toggle the pseudo-element via dataset attr (no layout shift)
          onMouseEnter={(e) => (e.currentTarget.dataset.underline = "on")}
          onMouseLeave={(e) => (e.currentTarget.dataset.underline = "off")}
          onFocus={(e) => (e.currentTarget.dataset.underline = "on")}
          onBlur={(e) => (e.currentTarget.dataset.underline = "off")}
          data-underline="off"
        >
          {label}
          {/* Gradient underline pseudo-element via inline style object on a span wrapper */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-0 right-0"
            style={{
              bottom: 0,
              height: 2, // slightly thicker underline
              transform: "translateY(3px)", // emulate underline-offset-2 while avoiding layout shift
              backgroundImage: gradient,
              backgroundRepeat: "no-repeat",
              backgroundSize: "100% 100%",
              opacity: 0,
              transition: "opacity 120ms ease",
            }}
            // React can't style :hover/:focus of parent directly; use MutationObserver-like via data attribute:
            ref={(node) => {
              if (!node) return;
              const parent = node.parentElement;
              // observer to toggle opacity based on dataset
              const update = () => {
                node.style.opacity = parent?.dataset.underline === "on" ? "1" : "0";
              };
              update();
              const mo = new MutationObserver(update);
              mo.observe(parent, { attributes: true, attributeFilter: ["data-underline"] });
              // cleanup
              node.__mo = mo;
            }}
            onAnimationEnd={() => {}}
          />
        </a>
      );
    }

    return (
      <span aria-current="page" className={currentClasses} style={currentStyle}>
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
