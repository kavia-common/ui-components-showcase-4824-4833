import React from "react";

/**
 * PUBLIC_INTERFACE
 * BentoGrid
 * Responsive 12/8/6/1 column bento grid aligned to the Ocean Professional theme.
 * All tile headers reuse a single shared Header per assets/bento_grid_header_specs.md.
 */
export default function BentoGrid() {
  /**
   * Updated tile map:
   * - Removed the first grid/tile ("hero": Dixon’s Value Proposition (EVP))
   * - Removed the L&D tile ("ld")
   * Remaining tiles keep their body content and responsive spans.
   */
  const tiles = [
    { key: "meetings", title: "Meetings", variant: "plain", spans: "col-span-12 xl:col-span-4", minH: "min-h-[170px]" },

    { key: "ann", title: "All Announcements", variant: "plain", spans: "col-span-12 xl:col-span-6", minH: "min-h-[150px]" },
    { key: "ceo", title: "Insights from CEO", variant: "plain", spans: "col-span-12 sm:col-span-6 xl:col-span-3", minH: "min-h-[180px]" },

    { key: "tools", title: "Toolshelf", variant: "plain", spans: "col-span-12 sm:col-span-6 xl:col-span-3", minH: "min-h-[160px]" },
    { key: "division", title: "Division", variant: "plain", spans: "col-span-12 sm:col-span-6 xl:col-span-3", minH: "min-h-[160px]" },
    { key: "latest", title: "Latest Update", variant: "tinted-blue", spans: "col-span-12 sm:col-span-6 xl:col-span-3", minH: "min-h-[160px]" },
    { key: "csr", title: "CSR@TDI", variant: "plain", spans: "col-span-12 sm:col-span-6 xl:col-span-3", minH: "min-h-[160px]" },
  ];

  // Shared styles
  const focusRingCard = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6B8CFF]/40";
  const cardBase = `rounded-2xl shadow-soft transition-all duration-200 ease-out hover:shadow-xl hover:-translate-y-0.5 ${focusRingCard}`;
  const cardPlain = `bg-surface ${cardBase}`;
  const cardTinted = `${cardBase} bg-blue-50`;

  // Unified header gradient per requirement
  const UNIFIED_HEADER_GRADIENT = "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)";

  // PUBLIC_INTERFACE
  // Header icon glyph (white dots, 16px) — white for contrast
  const HeaderIcon = ({ ariaHidden = true }) => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden={ariaHidden}
      className="pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  );

  // PUBLIC_INTERFACE
  /**
   * Header (Unified)
   * - Uses ONLY the specified gradient: linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)
   * - Compact height (~48px), 16px radius (top corners)
   * - Left: 24px circular chip with white glyph + title (semibold white 14–16px)
   * - Right: capsule button (28px) darker indigo with inner highlight
   * - Accessibility: white text/icons for contrast
   * - No per-tile overrides allowed
   */
  const Header = ({ id, title, actionLabel = "More", onAction, className = "", hideAction = false }) => {
    // Capsule button styling kept; header background forced to unified gradient
    const actionBase = {
      background: `linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.00) 100%), #2A4BA8`,
      boxShadow: "0 1px 2px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(255,255,255,0.10)",
      color: "#FFFFFF",
    };

    return (
      <div
        role="group"
        aria-label="Tile header"
        className={["overflow-hidden", className].join(" ")}
        style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
      >
        <div
          className="w-full"
          style={{
            background: UNIFIED_HEADER_GRADIENT,
            boxShadow: "0 2px 6px rgba(18, 22, 61, 0.18), inset 0 0 0 1px rgba(255,255,255,0.06)",
            transition: "filter 150ms ease, box-shadow 150ms ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = "saturate(1.05) brightness(1.03)";
            e.currentTarget.style.boxShadow =
              "0 3px 8px rgba(18, 22, 61, 0.22), inset 0 0 0 1px rgba(255,255,255,0.07)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = "none";
            e.currentTarget.style.boxShadow =
              "0 2px 6px rgba(18, 22, 61, 0.18), inset 0 0 0 1px rgba(255,255,255,0.06)";
          }}
        >
          <div
            className={[
              "min-h-[48px]",
              "flex items-center justify-between",
              "px-4 py-[10px]",
              "text-white",
            ].join(" ")}
          >
            {/* Left group: icon chip + title */}
            <div className="inline-flex items-center gap-2 min-w-0">
              <span
                aria-hidden="true"
                className="grid place-items-center rounded-full bg-white/20"
                style={{
                  width: 24,
                  height: 24,
                  color: "#FFFFFF",
                  flex: "0 0 auto",
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.25)",
                  backdropFilter: "saturate(140%) blur(2px)",
                }}
              >
                <HeaderIcon />
              </span>
              <h3
                id={id}
                className="font-semibold text-[15px] leading-5 tracking-[0.01em] whitespace-nowrap overflow-hidden text-ellipsis"
                style={{ color: "#FFFFFF" }}
                title={title}
              >
                {title}
              </h3>
            </div>

            {/* Right capsule action */}
            {!hideAction && (
              <button
                type="button"
                onClick={onAction}
                className="inline-flex items-center justify-center rounded-full"
                style={{
                  ...actionBase,
                  height: 28,
                  padding: "0 12px",
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.00) 100%), #3458C6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.00) 100%), #2A4BA8";
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = "translateY(1px)";
                  e.currentTarget.style.background =
                    "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.00) 100%), #24428F";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.background =
                    "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.00) 100%), #3458C6";
                }}
                onFocus={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 1px 2px rgba(0,0,0,0.25), 0 0 0 2px rgba(255,255,255,0.35), 0 0 0 4px rgba(58, 110, 255, 0.55)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 1px 2px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(255,255,255,0.10)";
                }}
                aria-label={actionLabel}
              >
                {actionLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // PUBLIC_INTERFACE
  // Helper to render tiles; body contents unchanged
  const Tile = ({ t }) => {
    // Remove per-tile header overrides; all use unified Header above

    if (t.variant === "tinted-blue") {
      return (
        <section role="region" aria-labelledby={`tile-${t.key}-title`} className={`${t.spans} ${cardTinted} p-4`}>
          <Header id={`tile-${t.key}-title`} title={t.title} actionLabel="View All" className="mb-3" />
          <div className="mt-3 flex items-center gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-9 w-9 rounded-xl bg-surface shadow-sm" aria-hidden="true" />
            ))}
          </div>
          <ul className="mt-3 list-disc list-inside text-sm text-slate-700 space-y-1.5">
            <li>New release notes available</li>
            <li>Security bulletin: best practices</li>
            <li>App performance improvements</li>
          </ul>
        </section>
      );
    }

    if (t.key === "meetings") {
      return (
        <section role="region" aria-labelledby={`tile-${t.key}-title`} className={`${t.spans} ${cardPlain} p-5 ${t.minH}`}>
          <Header id={`tile-${t.key}-title`} title={t.title} actionLabel="More" className="mb-4" />
          <div className="grid grid-cols-10 gap-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-10 rounded-lg bg-gray-100" aria-hidden="true" />
            ))}
          </div>
        </section>
      );
    }

    if (t.key === "ann") {
      return (
        <section role="region" aria-labelledby={`tile-${t.key}-title`} className={`${t.spans} ${cardPlain} p-3 sm:p-3.5`}>
          <Header id={`tile-${t.key}-title`} title={t.title} actionLabel="Know More" className="mb-1.5" />
          <div className="grid grid-cols-12 gap-1.5 sm:gap-2">
            <div
              className="col-span-12 sm:col-span-8 rounded-lg overflow-hidden bg-gray-100"
              style={{ aspectRatio: "16 / 9", maxHeight: "120px", minHeight: "84px" }}
              aria-hidden="true"
            />
            <div className="col-span-12 sm:col-span-4 grid grid-rows-1">
              <div
                className="rounded-lg overflow-hidden bg-gray-100"
                style={{ aspectRatio: "16 / 10", maxHeight: "120px", minHeight: "70px" }}
                aria-hidden="true"
              />
            </div>
          </div>
          <p className="mt-0.5 text-[12px] sm:text-[13px] text-slate-600 line-clamp-1">
            Highlights from across the organization this week.
          </p>
        </section>
      );
    }

    if (t.key === "ceo") {
      return (
        <section role="region" aria-labelledby={`tile-${t.key}-title`} className={`${t.spans} ${cardPlain} p-4 ${t.minH}`}>
          <Header id={`tile-${t.key}-title`} title={t.title} className="mb-3" hideAction />
          <div className="flex items-start gap-3">
            <img alt="" src="https://dummyimage.com/56x56/e5e7eb/111827&text=CEO" className="h-14 w-14 rounded-full object-cover" />
            <div className="min-w-0">
              <h4 className="text-[15px] font-semibold text-slate-900">Quarterly update</h4>
              <p className="mt-1 text-sm text-slate-700 line-clamp-3">
                A short update from leadership on the current quarter and what to expect next.
              </p>
              <button className="mt-2 rounded-full bg-primary px-4 h-9 text-sm font-semibold text-white hover:brightness-110 focus-ring">
                Read
              </button>
            </div>
          </div>
        </section>
      );
    }

    if (t.key === "tools") {
      return (
        <section role="region" aria-labelledby={`tile-${t.key}-title`} className={`${t.spans} ${cardPlain} p-4 ${t.minH}`}>
          <Header id={`tile-${t.key}-title`} title={t.title} actionLabel="Manage" className="mb-3" />
          <div className="min-h-[90px] rounded-lg border border-gray-200" aria-hidden="true" />
        </section>
      );
    }

    if (t.key === "division") {
      return (
        <section role="region" aria-labelledby={`tile-${t.key}-title`} className={`${t.spans} ${cardPlain} p-4 ${t.minH}`}>
          <Header id={`tile-${t.key}-title`} title={t.title} className="mb-3" hideAction />
          <div className="space-y-2">
            {["Division 2025 Edition 1", "Division 2025 Edition 2", "Division 2025 Edition 3"].map((label) => (
              <button
                key={label}
                className="w-full h-10 rounded-full text-primary bg-gray-50 hover:bg-primary hover:text-white transition focus-ring"
              >
                {label}
              </button>
            ))}
          </div>
        </section>
      );
    }

    if (t.key === "csr") {
      return (
        <section role="region" aria-labelledby={`tile-${t.key}-title`} className={`${t.spans} ${cardPlain} p-4 ${t.minH}`}>
          <Header id={`tile-${t.key}-title`} title={t.title} className="mb-3" hideAction />
          <div className="grid grid-cols-2 gap-3 items-center justify-items-center">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 w-20 bg-gray-100 rounded-md" aria-hidden="true" />
            ))}
          </div>
        </section>
      );
    }

    // Default
    return (
      <section role="region" aria-labelledby={`tile-${t.key}-title`} className={`${t.spans} ${cardPlain} p-4 ${t.minH || ""}`}>
        <Header id={`tile-${t.key}-title`} title={t.title} className="mb-2" />
        <p className="mt-2 text-sm text-slate-600">Content</p>
      </section>
    );
  };

  return (
    <section aria-label="Bento Grid Dashboard" className="w-full">
      {/* Grid reflows without gaps; remaining tiles fill rows based on spans */}
      <div
        className={[
          "grid",
          "grid-cols-1",
          "md:grid-cols-6",
          "lg:grid-cols-8",
          "xl:grid-cols-12",
          "gap-3 md:gap-4",
        ].join(" ")}
      >
        {tiles.map((t) => (
          <Tile key={t.key} t={t} />
        ))}
      </div>
    </section>
  );
}
