import React from "react";

/**
 * PUBLIC_INTERFACE
 * BentoGrid
 * Responsive 12/8/6/1 column bento grid with Ocean Professional styling.
 * Matches layout and behavior from assets/bento_grid_design_notes.md and style_guide.md:
 * - Cards use rounded corners, soft shadows, and pill CTAs.
 * - Desktop: 12 columns; Tablet: 8; Small tablet: 6; Mobile: 1.
 * - Uniform internal padding and typography.
 */
export default function BentoGrid() {
  /**
   * The tile map approximates the screenshot:
   * - A1 Hero (gradient), A2 Meetings
   * - B1 Announcements, B2 CEO, B3 L&D
   * - C1 Toolshelf, C2 Division, C3 Latest Update, C4 CSR
   * - Section label: Employee Connect
   * - E row: Clubs, Events, News
   * - Note: Removed Birthdays, Work Anniversaries, and Recognitions per request.
   */
  const tiles = [
    { key: "hero", title: "Dixon’s Value Proposition (EVP)", variant: "gradient-hero", spans: "col-span-12 lg:col-span-8", minH: "min-h-[170px]" },
    { key: "meetings", title: "Meetings", variant: "plain", spans: "col-span-12 lg:col-span-4", minH: "min-h-[170px]" },

    { key: "ann", title: "All Announcements", variant: "plain", spans: "col-span-12 lg:col-span-6", minH: "min-h-[180px]" },
    { key: "ceo", title: "Insights from CEO", variant: "plain", spans: "col-span-12 sm:col-span-6 lg:col-span-3", minH: "min-h-[180px]" },
    { key: "ld", title: "L&D Insights", variant: "gradient-ld", spans: "col-span-12 sm:col-span-6 lg:col-span-3", minH: "min-h-[180px]" },

    { key: "tools", title: "Toolshelf", variant: "plain", spans: "col-span-12 sm:col-span-6 lg:col-span-3", minH: "min-h-[160px]" },
    { key: "division", title: "Division", variant: "plain", spans: "col-span-12 sm:col-span-6 lg:col-span-3", minH: "min-h-[160px]" },
    { key: "latest", title: "Latest Update", variant: "tinted-blue", spans: "col-span-12 sm:col-span-6 lg:col-span-3", minH: "min-h-[160px]" },
    { key: "csr", title: "CSR@TDI", variant: "plain", spans: "col-span-12 sm:col-span-6 lg:col-span-3", minH: "min-h-[160px]" },

    { key: "section", title: "Employee Connect", variant: "label", spans: "col-span-12" },

    { key: "clubs", title: "Clubs", variant: "plain", spans: "col-span-12 md:col-span-6 lg:col-span-4", minH: "min-h-[170px]" },
    { key: "events", title: "Events", variant: "plain", spans: "col-span-12 md:col-span-6 lg:col-span-4", minH: "min-h-[170px]" },
    { key: "news", title: "News", variant: "plain", spans: "col-span-12 lg:col-span-4", minH: "min-h-[170px]" },
  ];

  // Shared styles
  const cardBase =
    "rounded-2xl shadow-soft transition-all duration-200 ease-out hover:shadow-xl hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50";
  const cardPlain = `bg-white ${cardBase}`;
  const cardTinted = `${cardBase} bg-[#EAF2FF]`;
  const headerClass = "flex items-center justify-between";
  const titleClass = "text-[16px] md:text-[17px] font-semibold text-slate-900";
  const pillLink =
    "inline-flex items-center h-8 px-3 rounded-full text-[12px] font-medium bg-[var(--chip-bg,#EEF3FF)] text-[var(--brand-primary-600,#7C3AED)] hover:bg-[var(--brand-primary-600,#7C3AED)] hover:text-white transition focus-ring";

  // PUBLIC_INTERFACE
  // Render a tile by variant
  const Tile = ({ t }) => {
    if (t.variant === "label") {
      return (
        <h2 className={`${t.spans} text-[20px] font-bold text-slate-900 mt-1`} role="heading" aria-level={2}>
          {t.title}
        </h2>
      );
    }

    if (t.variant === "gradient-hero") {
      return (
        <section
          role="region"
          aria-labelledby={`tile-${t.key}-title`}
          className={`${t.spans} text-white ${cardBase} p-6 relative overflow-hidden`}
          style={{ background: "var(--tile-hero-gradient, linear-gradient(135deg, #6D28D9 0%, #7C3AED 50%, #9333EA 100%))" }}
        >
          <div className={headerClass}>
            <h3 id={`tile-${t.key}-title`} className="text-[18px] font-semibold leading-6">
              {t.title}
            </h3>
            <button className="inline-flex items-center h-8 px-3 rounded-full text-sm font-medium bg-white/15 hover:bg-white hover:text-[var(--brand-primary,#6D28D9)] transition">
              Know More
            </button>
          </div>

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

          {/* Decorative right bubbles */}
          <div className="pointer-events-none absolute right-4 top-4 hidden md:flex gap-2 opacity-25">
            <span className="h-6 w-6 rounded-full bg-white/60" />
            <span className="h-6 w-6 rounded-full bg-yellow-300/80" />
            <span className="h-6 w-6 rounded-full bg-pink-300/80" />
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
          style={{ background: "var(--tile-ld-gradient, linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%))" }}
        >
          <div className={headerClass}>
            <h3 id={`tile-${t.key}-title`} className="text-[16px] font-semibold leading-6">
              {t.title}
            </h3>
            <button className="inline-flex items-center h-8 px-3 rounded-full text-sm font-medium bg-white/10 hover:bg-white hover:text-[var(--brand-primary,#6D28D9)] transition">
              Know More
            </button>
          </div>
          <p className="mt-2 text-sm text-white/90">Upskill with curated learning content and programs.</p>
          <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-white/15" aria-hidden="true" />
        </section>
      );
    }

    if (t.variant === "tinted-blue") {
      return (
        <section role="region" aria-labelledby={`tile-${t.key}-title`} className={`${t.spans} ${cardTinted} p-4`}>
          <div className={headerClass}>
            <h3 id={`tile-${t.key}-title`} className={titleClass}>
              {t.title}
            </h3>
            <a href="#" className={pillLink} aria-label="View All latest updates">
              View All
            </a>
          </div>
          <div className="mt-3 flex items-center gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-9 w-9 rounded-xl bg-white shadow-sm" aria-hidden="true" />
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
          <div className={headerClass}>
            <h3 id={`tile-${t.key}-title`} className={titleClass}>
              {t.title}
            </h3>
            <a href="#" className={pillLink} aria-label="See more meetings">
              More
            </a>
          </div>
          <div className="mt-4 grid grid-cols-10 gap-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-10 rounded-lg bg-indigo-100/80" aria-hidden="true" />
            ))}
          </div>
        </section>
      );
    }

    if (t.key === "ann") {
      return (
        <section role="region" aria-labelledby={`tile-${t.key}-title`} className={`${t.spans} ${cardPlain} p-4 ${t.minH}`}>
          <div className={headerClass}>
            <h3 id={`tile-${t.key}-title`} className={titleClass}>
              {t.title}
            </h3>
            <a href="#" className={pillLink} aria-label="Know more announcements">
              Know More
            </a>
          </div>
          <div className="mt-3 grid grid-cols-12 gap-3">
            <div className="col-span-8 rounded-lg overflow-hidden bg-slate-100 aspect-[16/9]" aria-hidden="true" />
            <div className="col-span-4 grid grid-rows-3 gap-2">
              <div className="rounded-lg overflow-hidden bg-slate-100 aspect-[16/9]" aria-hidden="true" />
              <div className="rounded-lg overflow-hidden bg-slate-100 aspect-[16/9]" aria-hidden="true" />
              <div className="rounded-lg overflow-hidden bg-slate-100 aspect-[16/9]" aria-hidden="true" />
            </div>
          </div>
          <p className="mt-2 text-sm text-slate-600">Highlights from across the organization this week.</p>
        </section>
      );
    }

    if (t.key === "ceo") {
      return (
        <section role="region" aria-labelledby={`tile-${t.key}-title`} className={`${t.spans} ${cardPlain} p-4 ${t.minH}`}>
          <div className="flex items-start gap-3">
            <img
              alt=""
              src="https://dummyimage.com/56x56/94a3b8/ffffff&text=CEO"
              className="h-14 w-14 rounded-full object-cover"
            />
            <div className="min-w-0">
              <h3 id={`tile-${t.key}-title`} className={titleClass}>
                {t.title}
              </h3>
              <p className="mt-1 text-sm text-slate-700 line-clamp-3">
                A short update from leadership on the current quarter and what to expect next.
              </p>
              <button className="mt-2 rounded-full bg-[var(--brand-primary-600,#7C3AED)] px-4 h-9 text-sm font-semibold text-white hover:brightness-110 focus-ring">
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
          <div className={headerClass}>
            <h3 id={`tile-${t.key}-title`} className={titleClass}>
              {t.title}
            </h3>
            <a href="#" className={pillLink} aria-label="Manage tools">
              Manage
            </a>
          </div>
          <div className="mt-3 min-h-[90px] rounded-lg border border-slate-200/60" aria-hidden="true" />
        </section>
      );
    }

    if (t.key === "division") {
      return (
        <section role="region" aria-labelledby={`tile-${t.key}-title`} className={`${t.spans} ${cardPlain} p-4 ${t.minH}`}>
          <h3 id={`tile-${t.key}-title`} className={titleClass}>
            {t.title}
          </h3>
          <div className="mt-3 space-y-2">
            {["Division 2025 Edition 1", "Division 2025 Edition 2", "Division 2025 Edition 3"].map((label) => (
              <button
                key={label}
                className="w-full h-10 rounded-full text-[var(--brand-primary-600,#7C3AED)] bg-[var(--info-50,#EEF2FF)] hover:bg-[var(--brand-primary-600,#7C3AED)] hover:text-white transition focus-ring"
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
          <h3 id={`tile-${t.key}-title`} className={titleClass}>
            {t.title}
          </h3>
          <div className="mt-3 grid grid-cols-2 gap-3 items-center justify-items-center">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 w-20 bg-slate-100 rounded-md" aria-hidden="true" />
            ))}
          </div>
        </section>
      );
    }

    if (t.key === "clubs") {
      return (
        <section role="region" aria-labelledby={`tile-${t.key}-title`} className={`${t.spans} ${cardPlain} p-4 ${t.minH}`}>
          <div className={headerClass}>
            <h3 id={`tile-${t.key}-title`} className={titleClass}>
              {t.title}
            </h3>
            <a href="#" className={pillLink} aria-label="View all clubs">
              View All
            </a>
          </div>
          <div className="mt-3 grid grid-cols-5 gap-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-[11px] text-slate-500">
                C{i + 1}
              </div>
            ))}
          </div>
        </section>
      );
    }

    if (t.key === "events") {
      return (
        <section role="region" aria-labelledby={`tile-${t.key}-title`} className={`${t.spans} ${cardPlain} p-4 ${t.minH}`}>
          <div className={headerClass}>
            <h3 id={`tile-${t.key}-title`} className={titleClass}>
              {t.title}
            </h3>
            <a href="#" className={pillLink} aria-label="Know more events">
              Know More
            </a>
          </div>
          <div className="mt-3 w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-800 flex items-end p-3">
            <div className="text-white text-sm">Townhall • Dec 12</div>
          </div>
        </section>
      );
    }

    if (t.key === "news") {
      return (
        <section role="region" aria-labelledby={`tile-${t.key}-title`} className={`${t.spans} ${cardPlain} p-4 ${t.minH}`}>
          <div className={headerClass}>
            <h3 id={`tile-${t.key}-title`} className={titleClass}>
              {t.title}
            </h3>
            <a href="#" className={pillLink} aria-label="View all news">
              View All
            </a>
          </div>
          <div className="mt-3 flex gap-3 overflow-x-auto snap-x snap-mandatory">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="min-w-[140px] snap-start rounded-lg bg-white shadow-sm overflow-hidden">
                <div className="h-20 bg-slate-200" />
                <div className="p-2 text-sm">Headline {i + 1}</div>
              </div>
            ))}
          </div>
        </section>
      );
    }

    // Fallback plain
    return (
      <section role="region" aria-labelledby={`tile-${t.key}-title`} className={`${t.spans} ${cardPlain} p-4 ${t.minH || ""}`}>
        <h3 id={`tile-${t.key}-title`} className={titleClass}>
          {t.title}
        </h3>
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
