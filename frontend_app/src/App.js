import React, { useMemo, useState } from "react";
import "./index.css";

import Hero from "./components/Hero";
import Accordion from "./components/Accordion";
import BentoGrid from "./components/BentoGrid";
import Breadcrumbs from "./components/Breadcrumbs";
import Carousel from "./components/Carousel";
import ChatbotStub from "./components/ChatbotStub";
import FormWizard from "./components/FormWizard";
import Testimonial from "./components/Testimonial";
import ToastDemo from "./components/ToastDemo";
import { ToastProvider } from "./components/ToastProvider";

// PUBLIC_INTERFACE
function App() {
  /**
   * App shell with top navbar and gradient backgrounds.
   * - Page background: linear-gradient(87deg, #95bff0 20%, #ac7de9 80%)
   * - Header/Footer: linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)
   * Tabs in header switch between component demos.
   */
  const [active, setActive] = useState("hero");

  // Only component demo items are kept for the navbar as per requirements
  const items = useMemo(
    () => [
      { key: "hero", label: "Hero" },
      { key: "accordion", label: "Accordion" },
      { key: "bento", label: "Bento Grid" },
      { key: "breadcrumbs", label: "Breadcrumbs" },
      { key: "carousel", label: "Carousel" },
      { key: "chatbot", label: "Chatbot (UI)" },
      { key: "wizard", label: "Form Wizard" },
      { key: "testimonial", label: "Testimonial" },
      { key: "toast", label: "Toast" },
    ],
    []
  );

  return (
    <ToastProvider>
      {/* Page background gradient */}
      <div
        className="min-h-screen flex flex-col"
        style={{
          background: "linear-gradient(87deg, #95bff0 20%, #ac7de9 80%)",
        }}
      >
        {/* Header with navbar and header gradient */}
        <header
          className="shadow-soft"
          style={{
            background:
              "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)",
          }}
        >
          <div className="mx-auto max-w-[88rem] px-4 py-4">
            {/* Single-row navbar: brand left, items right; wraps on narrow screens */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              {/* Brand / App name - left aligned */}
              <div className="flex items-center gap-3 min-w-[12rem]">
                <div
                  className="h-9 w-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold"
                  aria-hidden="true"
                >
                  UI
                </div>
                <div className="text-white">
                  <h1 className="text-xl font-semibold" style={{ textTransform: "capitalize" }}>
                    Components Showcase
                  </h1>
                </div>
              </div>

              {/* Component nav items - right aligned */}
              <nav
                className="flex-1 overflow-x-auto"
                aria-label="Component navigation"
              >
                <ul className="flex items-center justify-end gap-2">
                  {items.map((it) => {
                    const isActive = active === it.key;
                    return (
                      <li key={it.key}>
                        <button
                          onClick={() => setActive(it.key)}
                          className={`px-3 sm:px-4 py-2 rounded-full text-sm transition-colors backdrop-blur
                            ${
                              isActive
                                ? "bg-white text-[var(--color-text)] shadow"
                                : "text-white/90 hover:bg-white/10"
                            }`}
                          aria-current={isActive ? "page" : undefined}
                        >
                          {it.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </div>
        </header>

        {/* Main container */}
        <main className="mx-auto max-w-7xl w-full flex-1 px-4 py-6 space-y-6">
          {active === "hero" && <Hero />}
          {active === "accordion" && <Accordion />}
          {active === "bento" && <BentoGrid />}
          {active === "breadcrumbs" && <Breadcrumbs />}
          {active === "carousel" && <Carousel />}
          {active === "chatbot" && <ChatbotStub />}
          {active === "wizard" && <FormWizard />}
          {active === "testimonial" && <Testimonial />}
          {active === "toast" && <ToastDemo />}

          {/* Footer with gradient and polished layout */}
          <footer
            className="mt-6 rounded-2xl shadow-soft text-white"
            style={{
              background:
                "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)",
            }}
          >
            {/* subtle top separation using semi-transparent border and shadow inset */}
            <div className="rounded-2xl border-t border-white/10">
              <div className="mx-auto max-w-[88rem] px-4 py-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* Left: App name + short tagline */}
                  <div className="min-w-0">
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
                          Ocean Professional UI demos in React + Tailwind
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right: compact links to component demos (same as navbar) */}
                  <nav aria-label="Component quick links" className="sm:text-right">
                    <ul className="flex flex-wrap items-center justify-start sm:justify-end gap-2">
                      {items.map((it) => {
                        const isActive = active === it.key;
                        return (
                          <li key={`footer-${it.key}`}>
                            <button
                              onClick={() => setActive(it.key)}
                              className={`px-3 py-1.5 rounded-full text-xs transition-colors backdrop-blur focus-ring
                                ${
                                  isActive
                                    ? "bg-white text-[var(--color-text)] shadow"
                                    : "text-white/90 hover:bg-white/10"
                                }`}
                              aria-current={isActive ? "page" : undefined}
                            >
                              {it.label}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>
                </div>

                {/* Bottom row: small print and current year */}
                <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[11px] text-white/85">
                    © {new Date().getFullYear()} Components Showcase. Built with React & Tailwind.
                  </p>
                  <div className="h-px w-full sm:w-0 bg-white/10 sm:bg-transparent"></div>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </ToastProvider>
  );
}

export default App;
