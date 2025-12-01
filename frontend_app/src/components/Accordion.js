import React, { useId, useMemo, useState, useCallback } from "react";

/**
 * PUBLIC_INTERFACE
 * Accordion
 * Ocean Professional-styled FAQ accordion with accessible semantics,
 * smooth motion, chevron chip, and responsive spacing/typography.
 *
 * Updated header/question styling per assets/accordion_header_design_notes.md:
 * - Typography: 16px, weight 600, line-height 24px, left-aligned
 * - Spacing: 12px y / 16px x padding, 12px gap to chevron
 * - Chevron: 28px circular hit area, 16px glyph, right-aligned, rotates 90° when expanded
 * - Borders/dividers: 1px item border; header hover shifts only border color and soft background
 * - Interaction: item-level hover remains scale-only; no color change beyond allowed subtle header bg
 * - Accessibility: visible focus ring on header, retains aria attributes
 *
 * Enhancement:
 * - Add animated gradient left border (≈3px) that smoothly extends from header into the full item when open,
 *   and retracts on collapse using height/opacity/clip-path transitions for performance.
 * - Preserve rounded corners and avoid overflow/clipping.
 *
 * Additional update:
 * - Chevron/arrow icon uses a gradient stroke to match the header gradient and keeps the 28px chip with a gradient ring.
 */
export default function Accordion() {
  // Expanded FAQ list based on design notes (assets/accordion_design_notes.md)
  const items = useMemo(
    () => [
      {
        q: "What is the Ocean theme?",
        a: "A modern aesthetic using blue and violet accents, subtle shadows, and smooth transitions across surfaces and controls.",
      },
      {
        q: "Is the accordion accessible?",
        a: "Yes. It uses semantic buttons, ARIA attributes, and visible focus rings for keyboard users. Enter/Space toggles each panel.",
      },
      {
        q: "Can I customize styles?",
        a: "Absolutely. Override CSS variables or Tailwind classes for colors, radius, borders, and spacing to fit your brand.",
      },
      {
        q: "How do I add more items?",
        a: "Provide a title and content per item in the items array and ensure unique ids for aria-controls/labelledby.",
      },
      {
        q: "What animations are used?",
        a: "Chevron rotation and panel height/opacity transitions with eased timing for smooth expand/collapse.",
      },
      {
        q: "Does it support nested content?",
        a: (
          <div className="space-y-1.5">
            <p>Yes. Panels can include lists, links, and images; maintain internal padding of 12–16px.</p>
            <ul className="list-disc pl-5 text-[15px] text-gray-700 space-y-0.5">
              <li>Lists and inline links</li>
              <li>Images and media with responsive classes</li>
              <li>Code snippets or inline badges</li>
            </ul>
          </div>
        ),
      },
      {
        q: "Is server-side rendering supported?",
        a: "Yes; all markup is SSR-friendly with progressive enhancement for transitions.",
      },
      {
        q: "Is Tailwind used here?",
        a: "Yes, Tailwind CSS powers layout and styling to align with the Ocean Professional design system.",
      },
    ],
    []
  );

  const [open, setOpen] = useState(0);
  const baseId = useId();

  const toggle = useCallback((idx) => {
    setOpen((current) => (current === idx ? -1 : idx));
  }, []);

  // Ocean Professional-aligned tokens
  const borderDefault = "border-gray-200"; // aligns with --border-default
  const textStrong = "text-slate-900"; // --text-strong
  const textDefault = "text-slate-700"; // --text-default

  // Focus-visible ring tuned to design notes (indigo-400-ish)
  const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400/60";

  // Gradient style reused for stripe and icon ring
  const gradientCSS =
    "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)";

  // Gradient stripe: animated using height + opacity + clipPath for smoothness.
  // When closed: height = header height (~48px), slight opacity; clip-path trims to header area.
  // When open: height = full, opacity = 1, clip-path reveals full column.
  const gradientStripeBase = {
    background: gradientCSS,
    willChange: "height, opacity, clip-path, transform",
    // Speed up only the gradient stripe animation while keeping smooth ease-out timing
    transition:
      "height 180ms ease-out, opacity 170ms ease-out, clip-path 190ms ease-out",
  };

  // PUBLIC_INTERFACE
  // Small helper returning gradient ring style for the icon wrapper.
  const gradientRingStyle = {
    background: gradientCSS,
    padding: "1px",
    borderRadius: "9999px",
  };

  return (
    <section
      id="accordion"
      aria-label="Frequently Asked Questions"
      className="mx-auto w-full max-w-3xl md:max-w-4xl lg:max-w-5xl"
    >
      {/* Maintain item-level hover scale only, as requested */}
      <div className="grid gap-3 md:gap-3 lg:gap-3">
        {items.map((it, idx) => {
          const isOpen = open === idx;
          const headerId = `${baseId}-acc-header-${idx}`;
          const panelId = `${baseId}-acc-panel-${idx}`;
          const gradId = `${baseId}-chev-grad-${idx}`;

          // Header visual height target when collapsed, used for stripe baseline height.
          const headerHeight = 48;

          return (
            <div
              key={headerId}
              className={[
                "group/item bg-white rounded-[12px] border",
                borderDefault,
                "transform transition-transform duration-200 ease-out",
                "hover:scale-[1.015] focus-within:scale-[1.015]",
                "shadow-none",
                "relative overflow-hidden", // preserve rounded corners and avoid bleed
              ].join(" ")}
            >
              {/* Animated gradient stripe at the left edge */}
              <div
                aria-hidden="true"
                className="absolute left-0 top-0 w-[3px] rounded-l-[12px] pointer-events-none"
                style={{
                  ...gradientStripeBase,
                  // Height animates from header's height to full item height
                  height: isOpen ? "100%" : `${headerHeight}px`,
                  // Subtle opacity when closed to avoid a harsh cutoff
                  opacity: isOpen ? 1 : 0.9,
                  // Clip-path reveals only the header area when closed; full column when open
                  clipPath: isOpen
                    ? "inset(0% 0% 0% 0% round 12px)"
                    : "inset(0% 0% calc(100% - 48px) 0% round 12px)",
                }}
              />

              <button
                id={headerId}
                type="button"
                aria-controls={panelId}
                aria-expanded={isOpen}
                onClick={() => toggle(idx)}
                // Header/question row per header spec
                className={[
                  "w-full flex items-center justify-between gap-3",
                  // padding 12px y / 16px x
                  "pl-4 pr-4 py-3",
                  // Typography 16px/24px semibold; keep left-aligned
                  textStrong,
                  "font-semibold text-[16px] leading-6",
                  // Header-specific radius to 8px while the item keeps 12px overall
                  "rounded-[8px]",
                  // Subtle header hover bg while preserving item-level scale as primary hover
                  "transition-colors duration-150 ease-out",
                  focusRing,
                ].join(" ")}
              >
                {/* Question text stays left, no color change on hover */}
                <span className="flex-1 text-left" style={{ textTransform: "uppercase" }}>{it.q}</span>

                {/* Chevron container: gradient ring + neutral interior, 28px chip, 16px icon */}
                <span
                  aria-hidden="true"
                  style={gradientRingStyle}
                  className={[
                    "inline-flex items-center justify-center",
                    "h-[28px] w-[28px] rounded-full",
                    "transition-transform duration-200 ease-out",
                    // scale-only hover feedback (kept subtle)
                    "group-hover/item:scale-[1.03]",
                  ].join(" ")}
                >
                  {/* Inner chip keeps neutral background and existing hover/active backgrounds */}
                  <span
                    className={[
                      "inline-flex items-center justify-center",
                      "h-full w-full rounded-full",
                      "bg-white",
                      isOpen ? "bg-indigo-50" : "bg-white",
                      "transition-colors duration-150 ease-out",
                    ].join(" ")}
                  >
                    {/* SVG chevron with gradient stroke to match header gradient */}
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={[
                        "chevronIcon transition-transform duration-200 ease-out",
                        isOpen ? "rotate-90" : "rotate-0",
                      ].join(" ")}
                      role="img"
                      aria-label={isOpen ? "Collapse" : "Expand"}
                    >
                      <defs>
                        <linearGradient
                          id={gradId}
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="10%" stopColor="#af2497" />
                          <stop offset="20%" stopColor="#902d9a" />
                          <stop offset="100%" stopColor="#1840a0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M9 18l6-6-6-6"
                        stroke={`url(#${gradId})`}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </span>
              </button>

              {/* Panel: smooth transition preserved; spacing/typography unchanged */}
              <div
                id={panelId}
                role="region"
                aria-labelledby={headerId}
                className={[
                  "px-4",
                  // prefer transition-all for max-height/opacity/padding
                  "transition-all duration-300 ease-out",
                  isOpen
                    ? [
                        "max-h-[600px] opacity-100 py-3",
                        "bg-blue-50",
                        "border-t border-slate-200",
                      ].join(" ")
                    : "max-h-0 opacity-0 py-0",
                  "overflow-hidden",
                  textDefault,
                  "text-[15px] leading-[1.55]",
                ].join(" ")}
              >
                <div className="pb-0.5 text-slate-800">{it.a}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
