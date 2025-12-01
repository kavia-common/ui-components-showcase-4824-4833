import React from "react";

/**
 * PUBLIC_INTERFACE
 * BentoGrid
 * Responsive 12/8/6/1 column bento grid aligned to the Ocean Professional theme.
 * This update aligns all tile headers to assets/bento_grid_header_design_notes.md
 * (height 48px, padding 12/16, icon/title layout, typography, corner radii,
 * hover/focus states), keeping the previously requested full-width header gradient
 * treatment. Body content and tile spans remain unchanged.
 */
export default function BentoGrid() {
  /**
   * Tile map unchanged; layout/spans and bodies must remain intact.
   */
  const tiles = [
    // Row A
    { key: "hero", title: "Dixon’s Value Proposition (EVP)", variant: "gradient-hero", spans: "col-span-12 xl:col-span-8", minH: "min-h-[170px]" },
    { key: "meetings", title: "Meetings", variant: "plain", spans: "col-span-12 xl:col-span-4", minH: "min-h-[170px]" },

    // Row B
    { key: "ann", title: "All Announcements", variant: "plain", spans: "col-span-12 xl:col-span-6", minH: "min-h-[150px]" },
    { key: "ceo", title: "Insights from CEO", variant: "plain", spans: "col-span-12 sm:col-span-6 xl:col-span-3", minH: "min-h-[180px]" },
    { key: "ld", title: "L&D Insights", variant: "gradient-ld", spans: "col-span-12 sm:col-span-6 xl:col-span-3", minH: "min-h-[180px]" },

    // Row C
    { key: "tools", title: "Toolshelf", variant: "plain", spans: "col-span-12 sm:col-span-6 xl:col-span-3", minH: "min-h-[160px]" },
    { key: "division", title: "Division", variant: "plain", spans: "col-span-12 sm:col-span-6 xl:col-span-3", minH: "min-h-[160px]" },
    { key: "latest", title: "Latest Update", variant: "tinted-blue", spans: "col-span-12 sm:col-span-6 xl:col-span-3", minH: "min-h-[160px]" },
    { key: "csr", title: "CSR@TDI", variant: "plain", spans: "col-span-12 sm:col-span-6 xl:col-span-3", minH: "min-h-[160px]" },
  ];

  // Shared, theme-aligned styles
  const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#A855F7]/40";
  const cardBase =
    `rounded-2xl shadow-soft transition-all duration-200 ease-out hover:shadow-xl hover:-translate-y-0.5 ${focusRing}`;
  const cardPlain = `bg-surface ${cardBase}`;
  const cardTinted = `${cardBase} bg-blue-50`; // tinted body

  // Header gradient: keep previously requested full-width gradient; add radial glint per notes.
  const baseHeaderGradient = "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)";
  const headerGradientWithGlint =
    `radial-gradient(120% 140% at 0% 0%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 45%), ${baseHeaderGradient}`;

  // PUBLIC_INTERFACE
  // Header icon glyph - simple 3-dot menu style fallback glyph
  const HeaderIcon = ({ ariaHidden = true }) => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden={ariaHidden}
      xmlns="http://www.w3.org/2000/svg"
      className="pointer-events-none"
    >
      <circle cx="5" cy="12" r="2" fill="currentColor" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <circle cx="19" cy="12" r="2" fill="currentColor" />
    </svg>
  );

  // PUBLIC_INTERFACE
  // Header chip used optionally on some tiles; auto-hides on very narrow widths
  const HeaderChip = ({ children }) => (
    <span
      className="ml-auto hidden xs:inline-flex items-center h-5 px-2 rounded-full text-[12px] font-semibold text-white border border-white/30"
      style={{
        background: "rgba(255,255,255,0.24)",
        backdropFilter: "saturate(140%) blur(4px)",
      }}
    >
      {children}
    </span>
  );

  // PUBLIC_INTERFACE
  // Unified header bar implementing assets/bento_grid_header_design_notes.md
  const HeaderBar = ({ id, title, right = null, className = "", showChip = false }) => (
    <div
      className={["overflow-hidden", className].join(" ")}
      style={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
    >
      <div
        className="w-full"
        style={{
          background: headerGradientWithGlint,
        }}
      >
        <div
          className={[
            // 48px header height target using padding and min-h
            "min-h-[48px]",
            "flex items-center gap-2 md:gap-2.5",
            // Responsive padding per notes (default 16px; compact to 12px on very narrow)
            "px-4 py-3",
            "text-white",
          ].join(" ")}
        >
          {/* Icon container 24x24 circle with translucent white bg */}
          <span
            className="inline-flex items-center justify-center rounded-full"
            style={{
              width: 24,
              height: 24,
              background: "rgba(255,255,255,0.22)",
              color: "#ffffff",
              flex: "0 0 auto",
            }}
            aria-hidden="true"
          >
            <HeaderIcon />
          </span>

          {/* Title: bold 14px/20px, truncates to one line */}
          <h3
            id={id}
            className="font-bold text-[14px] leading-5 whitespace-nowrap overflow-hidden text-ellipsis"
          >
            {title}
          </h3>

          {/* Optional small chip next to title for some tiles */}
          {showChip && <HeaderChip>Featured</HeaderChip>}

          {/* Right actions (e.g., small button) align to far right */}
          <div className="ml-auto flex items-center">{right}</div>
        </div>
      </div>
    </div>
  );

  const pillLinkBase =
    "inline-flex items-center h-8 px-3 rounded-full text-[12px] font-medium transition focus-ring";
  const pillOnGradientHeader =
    "bg-white/15 text-white hover:bg-white hover:text-[var(--color-text)]";

  // PUBLIC_INTERFACE
  // Render a tile by variant (only headers updated; bodies unchanged)
  const Tile = ({ t }) => {
    if (t.variant === "gradient-hero") {
      return (
        <section
          role="region"
          aria-labelledby={`tile-${t.key}-title`}
          className={`${t.spans} text-white ${cardBase} p-6 relative overflow-hidden`}
          style={{
            background:
              "var(--tile-hero-gradient, linear-gradient(135deg, #6D28D9 0%, #7C3AED 50%, #9333EA 100%))",
          }}
        >
          <HeaderBar
            id={`tile-${t.key}-title`}
            title={t.title}
            right={<button className={`${pillLinkBase} ${pillOnGradientHeader}`}>Know More</button>}
            className="mb-3"
            showChip
          />

          <div className="mt-3 text-sm text-white/90 max-w-[48ch]">
            Rewards, Recognition, Be Squad, Engagement Platform, Employee Wellness, You Matter
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {["Rewards", "Recognition", "Be Squad", "Engagement", "Wellness", "You Matter"].map((c) => (
              <span key={c} className="rounded-full bg-white/15 px-3 py-1 text-[12px] font-medium backdrop-blur-sm">
                {c}
              </span>
            ))}
          </div>

          {/* Decorative right bubbles aligned with theme */}
          <div className="pointer-events-none absolute right-4 top-4 hidden md:flex gap-2 opacity-25">
            <span className="h-6 w-6 rounded-full bg-white/60" />
            <span className="h-6 w-6 rounded-full bg-secondary/80" />
            <span className="h-6 w-6 rounded-full bg-blue-300/80" />
          </div>
        </section>
      );
    }

    if (t.variant === "gradient-ld") {
      return (
        <section
          role="region"
          aria-labelledby={`tile-${t.key}-title`}
          className={`${t.spans} text-white ${cardBase} p-4 relative overflow-hidden`}
          style={{
            background:
              "var(--tile-ld-gradient, linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%))",
          }}
        >
          <HeaderBar
            id={`tile-${t.key}-title`}
            title={t.title}
            right={<button className={`${pillLinkBase} ${pillOnGradientHeader}`}>Know More</button>}
            className="mb-2"
          />
          <p className="mt-2 text-sm text-white/90">Upskill with curated learning content and programs.</p>
          <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-white/15" aria-hidden="true" />
        </section>
      );
    }

    if (t.variant === "tinted-blue") {
      return (
        <section role="region" aria-labelledby={`tile-${t.key}-title`} className={`${t.spans} ${cardTinted} p-4`}>
          <HeaderBar
            id={`tile-${t.key}-title`}
            title={t.title}
            right={
              <a href="#" className={`${pillLinkBase} ${pillOnGradientHeader}`} aria-label="View All latest updates">
                View All
              </a>
            }
            className="mb-3"
          />
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

    // Plain card variants
    if (t.key === "meetings") {
      return (
        <section role="region" aria-labelledby={`tile-${t.key}-title`} className={`${t.spans} ${cardPlain} p-5 ${t.minH}`}>
          <HeaderBar
            id={`tile-${t.key}-title`}
            title={t.title}
            right={
              <a href="#" className={`${pillLinkBase} ${pillOnGradientHeader}`} aria-label="See more meetings">
                More
              </a>
            }
            className="mb-4"
          />
          <div className="grid grid-cols-10 gap-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-10 rounded-lg bg-blue-100" aria-hidden="true" />
            ))}
          </div>
        </section>
      );
    }

    if (t.key === "ann") {
      return (
        <section
          role="region"
          aria-labelledby={`tile-${t.key}-title`}
          className={`${t.spans} ${cardPlain} p-4`}
        >
          <HeaderBar
            id={`tile-${t.key}-title`}
            title={t.title}
            right={
              <a
                href="#"
                className={`${pillLinkBase} ${pillOnGradientHeader}`}
                aria-label="Know more announcements"
              >
                Know More
              </a>
            }
            className="mb-2"
          />
          {/* Body updated: remove one sub-card on the right and rebalance layout */}
          <div className="grid grid-cols-12 gap-2">
            {/* Left: main banner keeps proportion on all breakpoints */}
            <div
              className="col-span-12 sm:col-span-8 rounded-lg overflow-hidden bg-gray-100 aspect-[16/9] sm:aspect-[16/8] md:aspect-[16/8]"
              aria-hidden="true"
            />
            {/* Right: only two stacked thumbnails, responsive with no gaps */}
            <div className="col-span-12 sm:col-span-4 grid grid-rows-2 gap-1.5">
              <div
                className="rounded-lg overflow-hidden bg-gray-100 aspect-[16/10]"
                aria-hidden="true"
              />
              <div
                className="rounded-lg overflow-hidden bg-gray-100 aspect-[16/10]"
                aria-hidden="true"
              />
            </div>
          </div>
          <p className="mt-1 text-[13px] md:text-sm text-slate-600 line-clamp-1">
            Highlights from across the organization this week.
          </p>
        </section>
      );
    }

    if (t.key === "ceo") {
      return (
        <section role="region" aria-labelledby={`tile-${t.key}-title`} className={`${t.spans} ${cardPlain} p-4 ${t.minH}`}>
          <HeaderBar
            id={`tile-${t.key}-title`}
            title={t.title}
            right={null}
            className="mb-3"
          />
          <div className="flex items-start gap-3">
            <img
              alt=""
              src="https://dummyimage.com/56x56/e5e7eb/111827&text=CEO"
              className="h-14 w-14 rounded-full object-cover"
            />
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
          <HeaderBar
            id={`tile-${t.key}-title`}
            title={t.title}
            right={
              <a href="#" className={`${pillLinkBase} ${pillOnGradientHeader}`} aria-label="Manage tools">
                Manage
              </a>
            }
            className="mb-3"
          />
          <div className="min-h-[90px] rounded-lg border border-gray-200" aria-hidden="true" />
        </section>
      );
    }

    if (t.key === "division") {
      return (
        <section role="region" aria-labelledby={`tile-${t.key}-title`} className={`${t.spans} ${cardPlain} p-4 ${t.minH}`}>
          <HeaderBar id={`tile-${t.key}-title`} title={t.title} right={null} className="mb-3" />
          <div className="space-y-2">
            {["Division 2025 Edition 1", "Division 2025 Edition 2", "Division 2025 Edition 3"].map((label) => (
              <button
                key={label}
                className="w-full h-10 rounded-full text-primary bg-blue-50 hover:bg-primary hover:text-white transition focus-ring"
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
          <HeaderBar id={`tile-${t.key}-title`} title={t.title} right={null} className="mb-3" />
          <div className="grid grid-cols-2 gap-3 items-center justify-items-center">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 w-20 bg-gray-100 rounded-md" aria-hidden="true" />
            ))}
          </div>
        </section>
      );
    }

    // Fallback plain
    return (
      <section role="region" aria-labelledby={`tile-${t.key}-title`} className={`${t.spans} ${cardPlain} p-4 ${t.minH || ""}`}>
        <HeaderBar id={`tile-${t.key}-title`} title={t.title} right={null} className="mb-2" />
        <p className="mt-2 text-sm text-slate-600">Content</p>
      </section>
    );
  };

  return (
    <section aria-label="Bento Grid Dashboard" className="w-full">
      <div
        className={[
          "grid",
          // 12-col desktop, 8-col large tablet, 6-col tablet, 1-col mobile
          "grid-cols-1",
          "md:grid-cols-6",
          "lg:grid-cols-8",
          "xl:grid-cols-12",
          // Gaps per notes
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
