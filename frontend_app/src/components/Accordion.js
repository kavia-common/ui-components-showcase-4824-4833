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
 * - Add subtle gradient left border (2.5px) on header using blue (#2563EB) → amber (#F59E0B).
 * - The gradient stripe extends through the entire item only when open for visual continuity.
 * - Preserve rounded corners and avoid overflow/clipping.
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
  const borderStrong = "border-slate-300"; // aligns with --border-strong
  const textStrong = "text-slate-900"; // --text-strong
  const textDefault = "text-slate-700"; // --text-default
  const iconDefault = "text-slate-500"; // --chevron
  const iconActive = "text-indigo-600"; // --chevron-active

  // Focus-visible ring tuned to design notes (indigo-400-ish)
  const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400/60";

  // Gradient stripe style updated per request to match header/footer gradient
  // This stripe applies to the left border of the question/header, and when open it
  // extends through the entire item for continuity.
  const gradientStyle = {
    background:
      "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)",
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

          return (
            <div
              key={headerId}
              className={[
                "group/item bg-white rounded-[12px] border",
                borderDefault,
                "transform transition-transform duration-200 ease-out",
                "hover:scale-[1.015] focus-within:scale-[1.015]",
                "shadow-none",
                "relative overflow-hidden", // ensure gradient stripe respects rounding; no clipping of content
              ].join(" ")}
            >
              {/* Gradient stripe — header-only by default; extends full item when open */}
              <div
                aria-hidden="true"
                className={[
                  "absolute left-0 top-0 w-[3px] rounded-l-[12px]",
                  isOpen ? "h-full" : "h-[48px] sm:h-[48px] md:h-[48px]",
                  // ensure the header-only stripe aligns with header height (≈48px)
                ].join(" ")}
                style={gradientStyle}
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
                  // add small left padding to create separation from gradient stripe
                  // Typography 16px/24px semibold; keep left-aligned
                  textStrong,
                  "font-semibold text-[16px] leading-6",
                  // Header-specific radius to 8px while the item keeps 12px overall
                  "rounded-[8px]",
                  // Subtle header hover bg and border shift while preserving item-level scale as primary hover affordance
                  "transition-colors duration-150 ease-out",
                  focusRing,
                ].join(" ")}
              >
                {/* Question text stays left, no color change on hover */}
                <span className="flex-1 text-left">{it.q}</span>

                {/* Chevron container: 28px circle, 16px icon; right-aligned */}
                <span
                  aria-hidden="true"
                  className={[
                    "inline-flex items-center justify-center",
                    "h-[28px] w-[28px] rounded-full",
                    "bg-transparent border",
                    isOpen ? "bg-indigo-50" : "",
                    isOpen ? "border-indigo-600" : borderDefault,
                    "transition-colors duration-150 ease-out",
                    "group/item:hover:bg-indigo-50/60 group/item:hover:border-slate-300",
                    "shadow-none",
                    isOpen ? iconActive : iconDefault,
                  ].join(" ")}
                >
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
                  >
                    <path
                      d="M9 18l6-6-6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>

              {/* Panel: keep existing smooth transition and readable body typescale */}
              <div
                id={panelId}
                role="region"
                aria-labelledby={headerId}
                className={[
                  "px-4",
                  "transition-all duration-300 ease-out",
                  isOpen
                    ? [
                        "max-h-[600px] opacity-100 py-3",
                        // Keep subtle content background; the gradient stripe is separate on the left
                        "bg-blue-50",
                        // subtle top divider
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
