import React, { useMemo } from "react";

/**
 * PUBLIC_INTERFACE
 * TeamSection
 * Grid of team member cards with avatar, role, and social links; themed with app gradient.
 */
export default function TeamSection() {
  const gradient = useMemo(
    () => "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)",
    []
  );

  const team = [
    { name: "Alex Morgan", role: "Product Lead" },
    { name: "Jamie Lee", role: "Frontend Engineer" },
    { name: "Priya Kumar", role: "Designer" },
    { name: "Sam Chen", role: "Full‑stack Engineer" },
    { name: "Rita Patel", role: "QA Engineer" },
    { name: "Chris Young", role: "DevRel" },
  ];

  return (
    <section aria-label="Team" className="w-full">
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">
          <span style={{ textTransform: "uppercase" }}>Meet the Team</span>
        </h2>
        <p className="text-sm text-slate-600">
          The crew that builds and maintains these components.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {team.map((m) => (
          <article
            key={m.name}
            className="surface p-5 transition-transform duration-150 hover:-translate-y-0.5"
            aria-label={`${m.name}, ${m.role}`}
          >
            <div className="flex items-center gap-3">
              <img
                alt=""
                src={`https://dummyimage.com/64x64/e5e7eb/111827&text=${encodeURIComponent(
                  m.name.split(" ").map((x) => x[0]).join("")
                )}`}
                className="h-14 w-14 rounded-full object-cover"
              />
              <div>
                <h3 className="text-[15px] font-semibold text-slate-900" style={{ textTransform: "uppercase" }}>
                  {m.name}
                </h3>
                <p className="text-sm text-slate-600">{m.role}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              {[
                { label: "Twitter", href: "#" },
                { label: "LinkedIn", href: "#" },
                { label: "GitHub", href: "#" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="rounded-full px-3 py-1 text-xs font-semibold text-white focus-ring"
                  style={{ background: gradient }}
                >
                  <span style={{ textTransform: "uppercase" }}>{s.label}</span>
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
