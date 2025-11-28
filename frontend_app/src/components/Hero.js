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
          radial-gradient(1200px 600px at 20% 30%, ${tokens.washViolet}, rgba(255,255,255,0) 60%),
          radial-gradient(1000px 500px at 80% 70%, ${tokens.washPink}, rgba(255,255,255,0) 60%),
          ${tokens.bgCanvas}
        `,
      }}
    >
      {/* Container widths and vertical rhythm match screenshot proportions */}
      <div className="mx-auto max-w-[72rem] px-4 md:px-6 lg:px-8 py-14 md:py-20 lg:py-24 text-center">
        {/* Announcement pill */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-2.5 py-1.5 text-sm font-medium"
          style={{
            background: "rgba(124, 58, 237, 0.08)",
            border: `1px solid ${tokens.accentBorder}`,
            color: tokens.textPrimary,
            lineHeight: "20px",
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

        {/* Headline */}
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
          Data to enrich your
          <br />
          online business
        </h1>

        {/* Supporting paragraph */}
        <p
          className="mx-auto mt-5 max-w-3xl"
          style={{
            color: tokens.textSecondary,
            fontSize: "18px",
            lineHeight: "28px",
          }}
        >
          Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem
          cupidatat commodo. Et sunt eu ut non esse fugiat veniam occaecat.
        </p>

        {/* CTA row */}
        <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-6">
          <a
            href={appUrl}
            role="button"
            className="inline-flex h-11 items-center justify-center rounded-full px-4 text-sm font-semibold text-white shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-600/50"
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
            className="text-sm font-semibold hover:underline"
            style={{ color: tokens.textPrimary, lineHeight: "20px" }}
          >
            Learn more →
          </a>
        </div>
      </div>
    </section>
  );
}
