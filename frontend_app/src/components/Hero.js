import React from "react";

/**
 * PUBLIC_INTERFACE
 * Hero
 * Centered, typographic hero section matching provided design notes.
 * Only contains announcement pill, heading, paragraph, and CTA row.
 * Aligns with Ocean Professional theme and remains responsive.
 */
export default function Hero() {
  const appUrl = process.env.REACT_APP_FRONTEND_URL || window.location.origin;

  // Design token mapping from notes, used inline to avoid global theme changes
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
        // Background wash per design notes; keep page/header gradients from App.js unchanged
        background: `
          radial-gradient(1200px 600px at 20% 30%, ${tokens.washViolet}, rgba(255,255,255,0) 60%),
          radial-gradient(1000px 500px at 80% 70%, ${tokens.washPink}, rgba(255,255,255,0) 60%),
          ${tokens.bgCanvas}
        `,
      }}
    >
      {/* Slightly reduced container max-width and vertical padding */}
      <div className="mx-auto max-w-[68rem] px-4 md:px-6 lg:px-8 py-12 md:py-18 lg:py-20 text-center">
        {/* Announcement pill - keep scale but it's already compact */}
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

        {/* Heading - reduce size by one step and tighten line-height */}
        <h1
          id="hero-heading"
          className="mt-5 font-extrabold tracking-tight text-neutral-900"
          style={{
            color: tokens.textPrimary,
            letterSpacing: "-0.02em",
            lineHeight: 1.06,
            // previously clamp(36px, 5.2vw, 56px) -> reduce upper clamp and vw slightly
            fontSize: "clamp(32px, 4.6vw, 48px)",
          }}
        >
          Data to enrich your
          <br />
          online business
        </h1>

        {/* Supporting paragraph - slightly smaller and tighter, smaller max width */}
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

        {/* CTA row - reduce vertical spacing and gap slightly */}
        <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-5">
          <a
            href={appUrl}
            role="button"
            className="inline-flex h-10 items-center justify-center rounded-full px-4 text-[13px] font-semibold text-white shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-600/50"
            style={{
              background: tokens.accent,
              boxShadow: `0 1px 2px ${tokens.btnShadow}`,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = tokens.accentHover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = tokens.accent)}
          >
            Get started
          </a>

          <a
            href="#accordion"
            className="text-[13px] font-semibold hover:underline"
            style={{ color: tokens.textPrimary, lineHeight: "20px" }}
          >
            Learn more →
          </a>
        </div>
      </div>
    </section>
  );
}
