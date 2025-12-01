import React, { useMemo } from "react";

/**
 * PUBLIC_INTERFACE
 * Pricing
 * Responsive pricing table with a featured plan, gradient-themed accents, and accessible markup.
 */
export default function Pricing() {
  const gradient = useMemo(
    () => "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)",
    []
  );

  const plans = [
    {
      name: "Starter",
      price: "$9",
      period: "/mo",
      features: ["1 project", "Community support", "Basic analytics"],
      cta: "Get Starter",
      featured: false,
    },
    {
      name: "Pro",
      price: "$29",
      period: "/mo",
      features: ["Unlimited projects", "Priority support", "Advanced analytics"],
      cta: "Go Pro",
      featured: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      features: ["SLA & SSO", "Dedicated success", "Custom integrations"],
      cta: "Contact Sales",
      featured: false,
    },
  ];

  return (
    <section aria-label="Pricing" className="w-full">
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">
          <span style={{ textTransform: "uppercase" }}>Pricing Plans</span>
        </h2>
        <p className="text-sm text-slate-600">
          Choose a plan that fits your needs. Upgrade or cancel anytime.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((p) => (
          <article
            key={p.name}
            className={`rounded-xl border border-gray-200 shadow-soft bg-white p-5 flex flex-col transition-transform duration-150 hover:-translate-y-0.5 ${
              p.featured ? "ring-2 ring-indigo-400/50" : ""
            }`}
            aria-label={`${p.name} plan`}
          >
            <div className="flex items-center justify-between">
              <h3
                className="text-base font-semibold text-slate-900"
                style={{ textTransform: "uppercase" }}
              >
                {p.name}
              </h3>
              {p.featured && (
                <span
                  className="text-xs text-white rounded-full px-2 py-0.5"
                  style={{ background: gradient }}
                >
                  Featured
                </span>
              )}
            </div>

            <div className="mt-3 flex items-end gap-1">
              <span
                className="text-3xl font-extrabold bg-clip-text text-transparent"
                style={{
                  background: gradient,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {p.price}
              </span>
              {p.period && <span className="text-slate-600">{p.period}</span>}
            </div>

            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="inline-flex h-5 w-5 items-center justify-center rounded-full"
                    style={{ background: "rgba(24,64,160,0.08)" }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      fill="none"
                      aria-hidden="true"
                    >
                      <defs>
                        <linearGradient
                          id={`grad-${p.name}`}
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="10%" stopColor="#af2497" />
                          <stop offset="20%" stopColor="#902d9a" />
                          <stop offset="100%" stopColor="#1840a0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M20 6L9 17l-5-5"
                        stroke={`url(#grad-${p.name})`}
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span style={{ textTransform: "uppercase" }}>{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5">
              <button
                type="button"
                className="w-full rounded-full text-white px-4 py-2 font-semibold focus-ring hover:opacity-95"
                style={{ background: gradient }}
                aria-label={p.cta}
              >
                <span style={{ textTransform: "uppercase" }}>{p.cta}</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
