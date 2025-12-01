import React from "react";

/**
 * PUBLIC_INTERFACE
 * BentoGrid
 * Responsive 12/8/6/1 column bento grid aligned to the Ocean Professional theme.
 * All tile headers now reuse the exact same unified Header component/style
 * as the first grid’s header: same gradient, min-height/padding, icon/title alignment,
 * typography, radius, and focus/hover states. Bodies and spans unchanged.
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
  const cardTinted = `${cardBase} bg-blue-50`;

  // Unified header gradient with glossy radial glint (exact per requirement)
  const headerGradient =
    "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)";
  const headerGradientWithGlint =
    `radial-gradient(120% 140% at 0% 0%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 45%), ${headerGradient}`;

  // PUBLIC_INTERFACE
  // Small header glyph (consistent across all headers)
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
  /**
   * Header
   * Centralized unified header: identical gradient, fixed min-height and padding, icon/title alignment,
   * typography, radius, and interaction states. No per-tile overrides or conditional styles.
   */
  const Header = ({ id, title, right = null, className = "" }) => (
    <div className={["overflow-hidden", className].join(" ")} style={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
      <div className="w-full" style={{ background: headerGradientWithGlint }}>
        <div
          className={[
            "min-h-[48px]",
            "flex items-center gap-2 md:gap-2.5",
            "px-4 py-3",
            "text-white",
          ].join(" ")}
        >
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

          <h3
            id={id}
            className="font-bold text-[14px] leading-5 whitespace-nowrap overflow-hidden text-ellipsis"
          >
            {title}
          </h3>

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
  // Render a tile by variant (headers unified; bodies unchanged, no header overrides)
  const Tile = ({ t }) => {
    if (t.variant === "gradient-hero") {
      return (
        <section
          role="region"
          aria-labelledby={`tile-${t.key}-title`}
          className={`${t.spans} ${cardPlain} p-0 relative overflow-hidden`}
        >
          <Header
            id={`tile-${t.key}-title`}
            title={t.title}
            right={<button className={`${pillLinkBase} ${pillOnGradientHeader}`}>Know More</button>}
          />
          <div className="px-6 pt-3 pb-6">
            <div className="mt-1 text-sm text-slate-700 max-w-[48ch]">
              Rewards, Recognition, Be Squad, Engagement Platform, Employee Wellness, You Matter
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Rewards", "Recognition", "Be Squad", "Engagement", "Wellness", "You Matter"].map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-slate-100 px-3 py-1 text-[12px] font-medium text-slate-700"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div className="pointer-events-none absolute right-4 top-4 hidden md:flex gap-2 opacity-25">
            <span className="h-6 w-6 rounded-full bg-slate-300/70" />
            <span className="h-6 w-6 rounded-full bg-secondary/80" />
            <span className="h-6 w-6 rounded-full bg-slate-300/80" />
          </div>
        </section>
      );
    }

    if (t.variant === "gradient-ld") {
      return (
        <section
          role="region"
          aria-labelledby={`tile-${t.key}-title`}
          className={`${t.spans} ${cardPlain} p-0 relative overflow-hidden`}
        >
          {/* Use the same unified Header component exactly like the first grid header */}
          <Header
            id={`tile-${t.key}-title`}
            title={t.title}
            right={<button className={`${pillLinkBase} ${pillOnGradientHeader}`}>Know More</button>}
          />
          {/* Body content remains unchanged; no header overrides or duplicate containers */}
          <div className="px-4 pt-2 pb-4">
            <p className="mt-1 text-sm text-slate-700">
              Upskill with curated learning content and programs.
            </p>
          </div>
          {/* Decorative element retained as body content; does not wrap/override header */}
          <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-slate-200" aria-hidden="true" />
        </section>
      );
    }

    if (t.variant === "tinted-blue") {
      return (
        <section role="region" aria-labelledby={`tile-${t.key}-title`} className={`${t.spans} ${cardBase} bg-gray-50 p-4`}>
          <Header
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

    // Plain variants
    if (t.key === "meetings") {
      return (
        <section role="region" aria-labelledby={`tile-${t.key}-title`} className={`${t.spans} ${cardPlain} p-5 ${t.minH}`}>
          <Header
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
              <div key={i} className="h-10 rounded-lg bg-gray-100" aria-hidden="true" />
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
          className={`${t.spans} ${cardPlain} p-3 sm:p-3.5`}
        >
          <Header
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
            className="mb-1.5"
          />
          <div className="grid grid-cols-12 gap-1.5 sm:gap-2">
            <div
              className="col-span-12 sm:col-span-8 rounded-lg overflow-hidden bg-gray-100"
              style={{
                aspectRatio: "16 / 9",
                maxHeight: "120px",
                minHeight: "84px",
              }}
              aria-hidden="true"
            />
            <div className="col-span-12 sm:col-span-4 grid grid-rows-1">
              <div
                className="rounded-lg overflow-hidden bg-gray-100"
                style={{
                  aspectRatio: "16 / 10",
                  maxHeight: "120px",
                  minHeight: "70px",
                }}
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
          <Header id={`tile-${t.key}-title`} title={t.title} className="mb-3" />
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
          <Header
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
          <Header id={`tile-${t.key}-title`} title={t.title} className="mb-3" />
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
          <Header id={`tile-${t.key}-title`} title={t.title} className="mb-3" />
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
        <Header id={`tile-${t.key}-title`} title={t.title} className="mb-2" />
        <p className="mt-2 text-sm text-slate-600">Content</p>
      </section>
    );
  };

  return (
    <section aria-label="Bento Grid Dashboard" className="w-full">
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
