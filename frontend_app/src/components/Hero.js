import React from "react";

/**
 * PUBLIC_INTERFACE
 * Hero
 * Centered-stack hero matching the latest screenshot structure:
 * - Announcement pill
 * - Two-line headline
 * - Supporting paragraph
 * - CTA row (primary button + secondary link)
 * Uses existing Ocean Professional palette and keeps app-level gradients intact.
 *
 * Further scaled-down variant:
 * - Decrease container max-width again
 * - Step down heading/subheading font sizes another notch
 * - Tighten line-heights
 * - Reduce vertical spacing and CTA/button paddings
 * - Keep responsiveness and color palette/gradients
 */
export default function Hero() {
  const appUrl = process.env.REACT_APP_FRONTEND_URL || window.location.origin;

  // Structure tokens (color-agnostic geometry) paired with current palette
  const tokens = {
    bgCanvas: "#FFFFFF",
    washViolet: "rgba(139, 92, 246, 0.08)",
    washPink: "rgba(236, 72, 153, 0.06)",

    textPrimary: "#111827",
    textSecondary: "#4B5563",

    accent: "#7C3AED",
    accentHover: "#6D28D9",
    accentBorder: "rgba(124, 58, 237, 0.20)",

    btnShadow: "rgba(0,0,0,0.06)",
  };

  return (
    <section
      role="region"
      aria-label="Hero"
      className="relative overflow-hidden rounded-2xl shadow-soft"
      style={{
        background: `
          radial-gradient(1000px 520px at 20% 30%, ${tokens.washViolet}, rgba(255,255,255,0) 60%),
          radial-gradient(860px 440px at 80% 70%, ${tokens.washPink}, rgba(255,255,255,0) 60%),
          ${tokens.bgCanvas}
        `,
      }}
    >
      {/* Container widths and vertical rhythm - scaled down more */}
      <div className="mx-auto max-w-[48rem] px-3 md:px-4 lg:px-5 py-8 md:py-10 lg:py-12 text-center">
        {/* Announcement pill - slightly smaller type/spacing */}
        <div
          className="inline-flex items-center gap-1.5 rounded-full px-2 py-[6px] text-[12px] sm:text-[12.5px] font-medium"
          style={{
            background: "rgba(124, 58, 237, 0.08)",
            border: `1px solid ${tokens.accentBorder}`,
            color: tokens.textPrimary,
            lineHeight: "17px",
          }}
        >
          <span>Announcing our next round of funding.</span>
          <a
            href="#"
            className="hover:underline"
            style={{ color: tokens.accent, fontWeight: 600 }}
          >
            Read more →
          </a>
        </div>

        {/* Headline - another step smaller with tighter leading */}
        <h1
          id="hero-heading"
          className="mt-4.5 font-extrabold tracking-tight"
          style={{
            color: tokens.textPrimary,
            letterSpacing: "-0.02em",
            lineHeight: 1.04,
            // previously clamp(32px, 4.6vw, 48px) → reduce top size again
            fontSize: "clamp(28px, 4.1vw, 44px)",
          }}
        >
          Data to enrich your
          <br />
          online business
        </h1>

        {/* Supporting paragraph - smaller and tighter */}
        <p
          className="mx-auto mt-3 max-w-xl"
          style={{
            color: tokens.textSecondary,
            fontSize: "15px",
            lineHeight: "24px",
          }}
        >
          Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem
          cupidatat commodo. Et sunt eu ut non esse fugiat veniam occaecat.
        </p>

        {/* CTA row - reduced spacing and button size */}
        <div className="mt-4 inline-flex flex-wrap items-center justify-center gap-3 sm:gap-3.5">
          <a
            href={appUrl}
            role="button"
            className="inline-flex h-9 items-center justify-center rounded-full px-3 text-[12.5px] font-semibold text-white shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-600/50"
            style={{
              background: tokens.accent,
              boxShadow: `0 1px 2px ${tokens.btnShadow}`,
              transition: "background-color 150ms ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = tokens.accentHover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = tokens.accent)}
          >
            Get started
          </a>

          <a
            href="#accordion"
            className="text-[12.5px] font-semibold hover:underline"
            style={{ color: tokens.textPrimary, lineHeight: "17px" }}
          >
            Learn more →
          </a>
        </div>
      </div>
    </section>
  );
}
