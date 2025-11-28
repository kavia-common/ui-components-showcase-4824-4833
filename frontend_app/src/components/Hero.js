import React from "react";

/**
 * PUBLIC_INTERFACE
 * Hero
 * Centered-stack hero matching the provided screenshot’s structure and layout,
 * while preserving current color palette and gradient washes.
 *
 * Requirements:
 * - All hero content sits inside a centered container (box) with a constrained max-width.
 * - Focus on alignment, spacing, and decorative gradient washes.
 * - Do not change text content.
 * - Keep standalone Testimonial feature untouched (separate component).
 */
export default function Hero() {
  const appUrl = process.env.REACT_APP_FRONTEND_URL || window.location.origin;

  // Color tokens (aligned with Ocean Professional style, without altering global palette)
  const tokens = {
    bgCanvas: "#FFFFFF",
    washViolet: "rgba(139, 92, 246, 0.08)",
    washPink: "rgba(236, 72, 153, 0.06)",

    textPrimary: "#111827", // neutral-900
    textSecondary: "#4B5563", // neutral-600

    // Header gradient colors (reference from App header)
    // Header gradient: linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)
    headerStart: "#af2497",
    headerMid: "#902d9a",
    headerEnd: "#1840a0",

    // Keep existing accent tokens for other uses
    accent: "#7C3AED", // violet-600
    accentHover: "#6D28D9", // violet-700
    accentBorder: "rgba(124, 58, 237, 0.20)",

    btnShadow: "rgba(0,0,0,0.06)",
  };

  return (
    <section
      role="region"
      aria-label="Hero"
      className="relative overflow-hidden rounded-2xl shadow-soft"
      // Decorative background as soft radial washes over white canvas.
      style={{
        background: `
          radial-gradient(1200px 600px at 20% 30%, ${tokens.washViolet}, rgba(255,255,255,0) 60%),
          radial-gradient(1000px 500px at 80% 70%, ${tokens.washPink}, rgba(255,255,255,0) 60%),
          ${tokens.bgCanvas}
        `,
      }}
    >
      {/* Centered container (box) with constrained max-width and responsive paddings */}
      <div className="mx-auto max-w-[32rem] px-1.5 md:px-2.5 lg:px-[12px] py-6 md:py-8 lg:py-10">
        {/* Left-aligned layout per request while maintaining existing structure */}
        <div className="text-left">
          {/* Announcement pill */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-2.5 py-1.5"
            style={{
              background: "rgba(124, 58, 237, 0.08)",
              border: `1px solid ${tokens.accentBorder}`,
              color: tokens.textPrimary,
              fontSize: "14px",
              fontWeight: 500,
              lineHeight: "20px",
            }}
          >
            <span>HERO SECTION</span>
          </div>

          {/* Headline (two lines, second line accent via inline span color only; sizes unchanged) */}
          <h1
            id="hero-heading"
            className="mt-6 font-extrabold tracking-tight"
            style={{
              color: tokens.textPrimary,
              letterSpacing: "-0.02em",
              lineHeight: 1.08,
              fontSize: "clamp(36px, 5.2vw, 56px)",
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

          {/* Supporting paragraph with constrained measure; content replaced exactly */}
          <p
            className="mx-auto mt-4 max-w-3xl md:mx-0"
            style={{
              color: tokens.textSecondary,
              fontSize: "18px",
              lineHeight: "28px",
            }}
          >
            Explore modern, accessible React components styled with the Crater Professional theme. Navigate demos like Accordion, Bento, Carousel, Outlook, Toast, and more.
          </p>

          {/* CTA row with updated labels */}
          <div className="mt-8 inline-flex flex-wrap items-center justify-start gap-6">
            <a
              href={appUrl}
              role="button"
              className="inline-flex h-11 items-center justify-center rounded-full px-4 text-sm font-semibold shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-600/50"
              style={{
                // Apply the specified gradient to the button background
                background:
                  "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)",
                boxShadow: `0 1px 2px ${tokens.btnShadow}`,
                transition: "filter 150ms ease",
                color: "#ffffff",
              }}
              onMouseEnter={(e) => {
                // Subtle brightness increase on hover
                e.currentTarget.style.filter = "brightness(1.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = "brightness(1)";
              }}
              onFocus={(e) => {
                e.currentTarget.style.filter = "brightness(1.06)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.filter = "brightness(1)";
              }}
            >
              <span
                // Remove gradient text styling to avoid conflict; keep readable white text
                className=""
                style={{
                  color: "#ffffff",
                }}
              >
                Explore Demos
              </span>
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
                className="text-sm font-semibold rounded-full px-4 h-11 inline-flex items-center justify-center"
                style={{
                  color: tokens.textPrimary,
                  backgroundColor: "#ffffff",
                }}
                onMouseEnter={(e) => {
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.style.filter = "brightness(1.05)";
                    parent.style.boxShadow =
                      "0 6px 16px rgba(24, 64, 160, 0.18)";
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
                    parent.style.boxShadow =
                      "0 6px 16px rgba(24, 64, 160, 0.18)";
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

          {/* Helper / supporting hint below CTAs */}
          <div className="mt-3 flex items-start gap-2 text-sm text-gray-500">
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
