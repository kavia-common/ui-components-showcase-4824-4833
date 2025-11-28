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
 * Scaled-down variant:
 * - Slightly smaller container max-width
 * - Heading/subheading font sizes reduced one step
 * - Tighter line-heights
 * - Reduced vertical spacing and CTA sizing
 */
export default function Hero() {
  const appUrl = process.env.REACT_APP_FRONTEND_URL || window.location.origin;

  // Structure tokens (color-agnostic geometry) paired with current palette
  const tokens = {
    // Background wash (keeps our palette, only structural gradient wash)
    bgCanvas: "#FFFFFF",
    washViolet: "rgba(139, 92, 246, 0.08)",
    washPink: "rgba(236, 72, 153, 0.06)",

    // Typography colors (existing theme neutrals)
    textPrimary: "#111827",
    textSecondary: "#4B5563",

    // Accent for CTAs and link hover (violet range; keep current scheme)
    accent: "#7C3AED",
    accentHover: "#6D28D9",
    accentBorder: "rgba(124, 58, 237, 0.20)",

    // Button elevation
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
      {/* Container widths and vertical rhythm - scaled down */}
      <div className="mx-auto max-w-[64rem] px-4 md:px-5 lg:px-6 py-12 md:py-16 lg:py-20 text-center">
        {/* Announcement pill - unchanged colors, slightly smaller type/spacing */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs sm:text-[13px] font-medium"
          style={{
            background: "rgba(124, 58, 237, 0.08)",
            border: `1px solid ${tokens.accentBorder}`,
            color: tokens.textPrimary,
            lineHeight: "18px",
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

        {/* Headline - one step smaller with tighter leading */}
        <h1
          id="hero-heading"
          className="mt-5 font-extrabold tracking-tight"
          style={{
            color: tokens.textPrimary,
            letterSpacing: "-0.02em",
            lineHeight: 1.06,
            // previously clamp(36px, 5.2vw, 56px) → reduce top size by one step
            fontSize: "clamp(32px, 4.6vw, 48px)",
          }}
        >
          Data to enrich your
          <br />
          online business
        </h1>

        {/* Supporting paragraph - slightly smaller and tighter */}
        <p
          className="mx-auto mt-4 max-w-2xl"
          style={{
            color: tokens.textSecondary,
            fontSize: "16px",
            lineHeight: "26px",
          }}
        >
          Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem
          cupidatat commodo. Et sunt eu ut non esse fugiat veniam occaecat.
        </p>

        {/* CTA row - reduced spacing and button size */}
        <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-4 sm:gap-5">
          <a
            href={appUrl}
            role="button"
            className="inline-flex h-10 items-center justify-center rounded-full px-3.5 text-[13px] font-semibold text-white shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-600/50"
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
            className="text-[13px] font-semibold hover:underline"
            style={{ color: tokens.textPrimary, lineHeight: "18px" }}
          >
            Learn more →
          </a>
        </div>
      </div>
    </section>
  );
}
