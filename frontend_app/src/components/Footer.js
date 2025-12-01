import React from "react";

/**
 * PUBLIC_INTERFACE
 * Footer
 * Themed footer with Quick Links and Contact sections, responsive layout.
 */
export default function Footer({ onNavigate, links = [] }) {
  return (
    <footer
      className="mt-6 rounded-2xl shadow-soft text-white"
      style={{
        background:
          "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)",
      }}
    >
      <div className="rounded-2xl border-t border-white/10">
        <div className="mx-auto max-w-[88rem] px-4 py-6">
          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <div className="flex items-center gap-3">
                <div
                  className="h-9 w-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold"
                  aria-hidden="true"
                >
                  UI
                </div>
                <div className="text-white">
                  <p className="text-base font-semibold leading-tight">
                    Components Showcase
                  </p>
                  <p className="text-xs text-white/85 leading-snug">
                    Modern React + Tailwind demos
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs text-white/85">
                © {new Date().getFullYear()} Components Showcase.
              </p>
            </div>

            <nav aria-label="Quick Links">
              <h3
                className="text-sm font-semibold mb-2"
                style={{ textTransform: "uppercase" }}
              >
                Quick Links
              </h3>
              <ul className="grid grid-cols-2 gap-2 text-sm">
                {links.map((l) => (
                  <li key={`footer-link-${l.key}`}>
                    <button
                      type="button"
                      onClick={() => onNavigate?.(l.key)}
                      className="text-left text-white/90 hover:text-white focus-ring rounded"
                      aria-label={`Go to ${l.label}`}
                    >
                      <span style={{ textTransform: "uppercase" }}>
                        {l.label}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h3
                className="text-sm font-semibold mb-2"
                style={{ textTransform: "uppercase" }}
              >
                Contact
              </h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <a
                    className="hover:underline focus-ring rounded"
                    href="mailto:hello@example.com"
                  >
                    hello@example.com
                  </a>
                </li>
                <li>123 Ocean Ave, Web City</li>
                <li className="flex items-center gap-2">
                  <a className="hover:underline focus-ring rounded" href="#">
                    Twitter
                  </a>
                  <a className="hover:underline focus-ring rounded" href="#">
                    LinkedIn
                  </a>
                  <a className="hover:underline focus-ring rounded" href="#">
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-5 border-t border-white/10 pt-3 text-xs text-white/85">
            Built with React & Tailwind.
          </div>
        </div>
      </div>
    </footer>
  );
}
