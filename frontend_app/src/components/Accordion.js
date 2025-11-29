import React, { useId, useMemo, useState, useCallback } from "react";

/**
 * PUBLIC_INTERFACE
 * Accordion
 * Ocean Professional-styled FAQ accordion with accessible semantics,
 * smooth motion, chevron chip, and responsive spacing/typography.
 *
 * - Layout: centered container, card-like items with 12px radius and subtle borders.
 * - Typography: 16px/semibold title, 14–15px body; strong/default text tokens via Tailwind.
 * - Icon: Chevron-right in a 28px circular chip; rotates 90° when expanded.
 * - Motion: max-height and opacity transitions on panel; 160–260ms ease timings.
 * - Accessibility: button headers with aria-expanded + aria-controls; panels role="region".
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

  // Tailwind-mapped tokens aligned to Ocean Professional notes
  const borderSubtle = "border-sky-200"; // --border-subtle
  const borderStrong = "border-sky-300"; // --border-strong (hover/active feedback)
  const textStrong = "text-slate-900"; // --text-strong
  const textDefault = "text-slate-700"; // --text-default
  const iconMuted = "text-slate-400"; // --icon-muted

  // Keep focus-visible accessibility, but make it minimal/soft using primary color with low opacity
  const focusRing =
    "focus-visible:ring-blue-500/30 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

  return (
    <section
      id="accordion"
      aria-label="Frequently Asked Questions"
      className="mx-auto w-full max-w-3xl md:max-w-4xl lg:max-w-5xl"
    >
      {/* Reduce vertical gaps between items (desktop tighter) */}
      <div className="grid gap-3 md:gap-2.5 lg:gap-2">
        {items.map((it, idx) => {
          const isOpen = open === idx;
          const headerId = `${baseId}-acc-header-${idx}`;
          const panelId = `${baseId}-acc-panel-${idx}`;

          return (
            <div
              key={headerId}
              className={[
                "bg-white rounded-[12px] border",
                borderSubtle,
                // Remove hover shadow; rely on a faint ring on hover via header
                "transition-shadow duration-150 ease-out",
                "shadow-none",
              ].join(" ")}
            >
              <button
                id={headerId}
                type="button"
                aria-controls={panelId}
                aria-expanded={isOpen}
                onClick={() => toggle(idx)}
                className={[
                  // Clickable header area
                  "group w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5",
                  "sm:px-4 sm:py-2.5 md:px-4 md:py-2.5 lg:px-4 lg:py-2",
                  textStrong,
                  "font-semibold text-[16px] leading-[1.35]",
                  "rounded-[12px]",
                  // Softer transitions
                  "transition-colors duration-150 ease-out",
                  // Lower background tint for hover/focus-visible (barely-there)
                  "hover:bg-slate-50/25 focus-visible:bg-slate-50/25",
                  // Minimal focus ring
                  "focus:outline-none",
                  focusRing,
                ].join(" ")}
              >
                <span className="flex-1 text-left">{it.q}</span>

                {/* Chevron chip (behavior unchanged; feedback softened) */}
                <span
                  aria-hidden="true"
                  className={[
                    "inline-grid place-items-center",
                    "h-7 w-7 rounded-full bg-white",
                    "border",
                    isOpen ? borderStrong : borderSubtle,
                    // Faster, softer transitions
                    "transition-all duration-150 ease-out",
                    isOpen ? "rotate-90" : "rotate-0",
                    // icon color muted; darken slightly on group hover/focus
                    isOpen ? "text-slate-600" : iconMuted,
                    "group-hover:text-slate-600 group-focus-visible:text-slate-600",
                    // very subtle border emphasis on hover/focus
                    "group-hover:border-sky-300 group-focus-visible:border-sky-300",
                    // dial down chip bg tint further (or effectively none)
                    "group-hover:bg-slate-50/20 group-focus-visible:bg-slate-50/20",
                    // add a faint outline/ring on group-hover via ring classes (using primary color very lightly)
                    "group-hover:ring-1 group-hover:ring-blue-500/15 group-focus-visible:ring-1 group-focus-visible:ring-blue-500/20",
                  ].join(" ")}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="transition-transform duration-150 ease-out"
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

              {/* Panel: animate max-height and opacity (keep smoothness, slightly quicker ease-out) */}
              <div
                id={panelId}
                role="region"
                aria-labelledby={headerId}
                className={[
                  // Slightly reduced horizontal padding and vertical rhythm
                  "px-3.5 sm:px-4 md:px-4",
                  "transition-all duration-300 ease-out",
                  isOpen ? "max-h-[600px] opacity-100 py-2.5 md:py-2" : "max-h-0 opacity-0 py-0",
                  "overflow-hidden",
                  textDefault,
                  "text-[15px] leading-[1.5]",
                ].join(" ")}
              >
                {/* Reduce inner spacing within content */}
                <div className="pb-0.5">{it.a}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
