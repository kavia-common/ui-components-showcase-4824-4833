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
      <div className="mx-auto max-w-[36rem] px-2 md:px-3 lg:px-[14px] py-8 md:py-12 lg:py-14">
        <div className="text-center">
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

          {/* Supporting paragraph with constrained measure */}
          <p
            className="mx-auto mt-4 max-w-3xl"
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
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = tokens.accentHover)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = tokens.accent)
              }
            >
              Get started
            </a>

            <a
              href="#accordion"
              className="text-sm font-semibold hover:underline"
              style={{ color: tokens.textPrimary }}
            >
              Learn more →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
