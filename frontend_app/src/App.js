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

  const backendURL = process.env.REACT_APP_BACKEND_URL || "";
  const apiBase = process.env.REACT_APP_API_BASE || "";
  const mode = process.env.REACT_APP_NODE_ENV || "development";

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
          <div className="mx-auto max-w-7xl px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold">
                  UI
                </div>
                <div className="text-white">
                  <h1 className="text-xl font-semibold">Components Showcase</h1>
                  <p className="text-xs opacity-80">Top Navbar · Gradient Shell</p>
                </div>
              </div>

              {/* Environment details */}
              <div className="hidden md:flex items-center gap-4 text-sm text-white/90">
                {backendURL && (
                  <span>
                    Backend: <code className="text-white">{backendURL}</code>
                  </span>
                )}
                {apiBase && (
                  <span>
                    API: <code className="text-white">{apiBase}</code>
                  </span>
                )}
                <span className="hidden sm:inline">
                  Mode: <span className="font-medium">{mode}</span>
                </span>
              </div>
            </div>

            {/* Top navbar tabs */}
            <nav className="mt-4 overflow-x-auto">
              <ul className="flex items-center gap-2">
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

          {/* Footer with gradient */}
          <footer
            className="rounded-2xl px-4 py-4 text-center text-xs text-white/90 shadow-soft"
            style={{
              background:
                "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)",
            }}
          >
            Built with React + Tailwind. Top Navbar layout with custom gradients.
          </footer>
        </main>
      </div>
    </ToastProvider>
  );
}

export default App;
