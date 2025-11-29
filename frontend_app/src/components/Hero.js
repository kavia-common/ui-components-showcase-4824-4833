import React from "react";

/**
 * PUBLIC_INTERFACE
 * Hero
 * Compact, responsive hero that maintains the Ocean Professional theme while
 * reducing vertical height and ensuring proper text wrapping and alignment.
 *
 * - Uses min-h-[55vh] on desktop and auto/min content on small screens.
 * - Responsive typography with tighter leading and constrained max width.
 * - Flex centering for vertical alignment; adequate inner padding.
 */
export default function Hero() {
  const appUrl = process.env.REACT_APP_FRONTEND_URL || window.location.origin;

  // Ocean Professional-aligned tokens (colors preserved)
  const tokens = {
    bgCanvas: "#FFFFFF",
    washViolet: "rgba(139, 92, 246, 0.08)",
    washPink: "rgba(236, 72, 153, 0.06)",
    textPrimary: "#111827",
    textSecondary: "#4B5563",
    accentBorder: "rgba(124, 58, 237, 0.20)",
    btnShadow: "rgba(0,0,0,0.06)",
  };

  return (
    <section
      role="region"
      aria-label="Hero"
      className="
        relative overflow-hidden rounded-xl shadow-soft
        flex items-center
        min-h-[50vh] md:min-h-[55vh]
      "
      style={{
        // Decorative soft radial washes over white canvas.
        background: `
          radial-gradient(1200px 600px at 20% 30%, ${tokens.washViolet}, rgba(255,255,255,0) 60%),
          radial-gradient(1000px 500px at 80% 70%, ${tokens.washPink}, rgba(255,255,255,0) 60%),
          ${tokens.bgCanvas}
        `,
      }}
    >
      {/* Content container with compact padding to reduce hero height */}
      <div className="mx-auto w-full max-w-5xl px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-left">
          {/* Announcement pill */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-2.5 py-1.5"
            style={{
              background: "rgba(124, 58, 237, 0.08)",
              border: `1px solid ${tokens.accentBorder}`,
              color: tokens.textPrimary,
              fontSize: 14,
              fontWeight: 500,
              lineHeight: "20px",
            }}
          >
            <span>HERO SECTION</span>
          </div>

          {/* Headline with responsive sizes and tight leading to prevent overflow */}
          <h1
            id="hero-heading"
            className="mt-5 font-extrabold tracking-tight
                       text-3xl sm:text-4xl md:text-5xl
                       leading-snug md:leading-tight"
            style={{
              color: tokens.textPrimary,
              letterSpacing: "-0.02em",
            }}
          >
            UI Components
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                background:
                  "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Showcase
            </span>
          </h1>

          {/* Supporting text with constrained measure and improved wrapping */}
          <p
            className="mt-3 max-w-2xl text-base sm:text-lg leading-relaxed text-gray-600"
            style={{ color: tokens.textSecondary }}
          >
            Explore modern, accessible React components styled with the Crater Professional theme. Navigate demos like Accordion, Bento, Carousel, Outlook, Toast, and more.
          </p>

          {/* CTA row: compact spacing and wrap support */}
          <div className="mt-6 inline-flex flex-wrap items-center justify-start gap-4">
            <a
              href={appUrl}
              role="button"
              className="inline-flex h-11 items-center justify-center rounded-full px-4
                         text-sm font-semibold text-white shadow-sm
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-600/50"
              style={{
                background:
                  "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)",
                boxShadow: `0 1px 2px ${tokens.btnShadow}`,
                transition: "filter 150ms ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.06)")}
              onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
              onFocus={(e) => (e.currentTarget.style.filter = "brightness(1.06)")}
              onBlur={(e) => (e.currentTarget.style.filter = "brightness(1)")}
            >
              <span>Explore Demos</span>
            </a>

            {/* Secondary CTA with gradient border */}
            <span
              className="inline-flex rounded-full p-[1px]"
              style={{
                background:
                  "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)",
                boxShadow: "0 0 0 0 rgba(0,0,0,0)",
                transition: "filter 150ms ease, box-shadow 150ms ease",
              }}
            >
              <a
                href="#accordion"
                className="text-sm font-semibold rounded-full px-4 h-11 inline-flex items-center justify-center bg-white"
                style={{ color: tokens.textPrimary }}
                onMouseEnter={(e) => {
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.style.filter = "brightness(1.05)";
                    parent.style.boxShadow = "0 6px 16px rgba(24, 64, 160, 0.18)";
                  }
                }}
                onMouseLeave={(e) => {
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.style.filter = "brightness(1)";
                    parent.style.boxShadow = "0 0 0 0 rgba(0,0,0,0)";
                  }
                }}
                onFocus={(e) => {
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.style.filter = "brightness(1.05)";
                    parent.style.boxShadow = "0 6px 16px rgba(24, 64, 160, 0.18)";
                  }
                }}
                onBlur={(e) => {
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.style.filter = "brightness(1)";
                    parent.style.boxShadow = "0 0 0 0 rgba(0,0,0,0)";
                  }
                }}
              >
                Try Outlook
              </a>
            </span>
          </div>

          {/* Helper text */}
          <div className="mt-2.5 flex items-start gap-2 text-sm text-gray-500">
            <span
              aria-hidden="true"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 18,
                height: 18,
                borderRadius: "9999px",
                background: "rgba(156, 163, 175, 0.15)",
                color: "#6B7280",
                fontSize: 12,
                lineHeight: "18px",
                fontWeight: 600,
              }}
              title="Info"
            >
              i
            </span>
            <p className="text-gray-600">
              Use the top navigation above to browse individual demo pages.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
