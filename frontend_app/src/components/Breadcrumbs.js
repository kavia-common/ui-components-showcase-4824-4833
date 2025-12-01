import React from "react";

/**
 * PUBLIC_INTERFACE
 * Breadcrumbs
 * Ocean Professional-styled breadcrumb trail on neutral surface
 * - Background/surface: #ffffff on canvas #f9fafb (handled by .surface)
 * - Links: primary color #2563EB with hover underline and subtle tint
 * - Separators: low-contrast gray
 * - Current page: optional small gradient chip for emphasis
 * - Accessibility: visible keyboard focus ring, 4.5:1 contrast for text, aria-label
 */
export default function Breadcrumbs() {
  const crumbs = ["Home", "Components", "Forms", "Wizard"];
  const lastIndex = crumbs.length - 1;

  return (
    <nav className="surface px-4 py-3" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[13px] sm:text-sm">
        {crumbs.map((c, idx) => {
          const isLast = idx === lastIndex;

          return (
            <li key={c} className="flex items-center min-h-[32px]">
              {/* Link or current indicator */}
              {!isLast ? (
                <a
                  href="#"
                  className={[
                    "text-[var(--color-text)]/80",
                    "hover:text-[var(--color-primary)] hover:underline underline-offset-2",
                    "focus-ring rounded-sm px-0.5",
                    "transition-colors duration-150",
                  ].join(" ")}
                >
                  {c}
                </a>
              ) : (
                // Current page "chip" with very subtle gradient accent border
                <span
                  aria-current="page"
                  className="inline-flex items-center gap-1.5 rounded-full text-[13px] sm:text-sm font-semibold px-2 py-1"
                  style={{
                    background:
                      "linear-gradient(0deg, rgba(37,99,235,0.06), rgba(37,99,235,0.06))",
                    color: "var(--color-text)",
                    border: "1px solid rgba(17,24,39,0.08)",
                  }}
                  title={c}
                >
                  <span
                    aria-hidden="true"
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{
                      background:
                        "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)",
                    }}
                  />
                  {c}
                </span>
              )}

              {/* Separator */}
              {idx < lastIndex && (
                <span
                  className="mx-2 text-gray-300 select-none"
                  aria-hidden="true"
                >
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
