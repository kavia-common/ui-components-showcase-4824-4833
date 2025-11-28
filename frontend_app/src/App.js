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
  const [active, setActive] = useState("hero");

  const backendURL = process.env.REACT_APP_BACKEND_URL || "";
  const apiBase = process.env.REACT_APP_API_BASE || "";
  const mode = process.env.REACT_APP_NODE_ENV || "development";

  const items = useMemo(() => ([
    { key: "hero", label: "Hero" },
    { key: "accordion", label: "Accordion" },
    { key: "bento", label: "Bento Grid" },
    { key: "breadcrumbs", label: "Breadcrumbs" },
    { key: "carousel", label: "Carousel" },
    { key: "chatbot", label: "Chatbot (UI)" },
    { key: "wizard", label: "Form Wizard" },
    { key: "testimonial", label: "Testimonial" },
    { key: "toast", label: "Toast" },
  ]), []);

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col">
        {/* Top Navbar */}
        <header className="ocean-gradient shadow-soft">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">UI</div>
                <div>
                  <h1 className="text-xl font-semibold text-[var(--color-text)]">Components Showcase</h1>
                  <p className="text-xs text-gray-600">Ocean Professional theme</p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-4 text-sm text-gray-600">
                {backendURL && <span>Backend: <code className="text-gray-800">{backendURL}</code></span>}
                {apiBase && <span>API: <code className="text-gray-800">{apiBase}</code></span>}
                <span className="hidden sm:inline">Mode: <span className="font-medium">{mode}</span></span>
              </div>
            </div>
          </div>
        </header>

        {/* Body */}
        <div className="mx-auto max-w-7xl w-full flex-1 px-4 py-6 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="surface h-max md:sticky md:top-4">
            <nav className="p-3">
              <p className="text-xs uppercase tracking-wide text-gray-500 px-2">Components</p>
              <ul className="mt-2 space-y-1">
                {items.map((it) => (
                  <li key={it.key}>
                    <button
                      className={`w-full text-left rounded-lg px-3 py-2 transition hover:bg-blue-50 ${
                        active === it.key ? "bg-blue-100 text-blue-800" : "text-gray-800"
                      }`}
                      onClick={() => setActive(it.key)}
                    >
                      {it.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main content */}
          <main className="space-y-6">
            {active === "hero" && <Hero />}
            {active === "accordion" && <Accordion />}
            {active === "bento" && <BentoGrid />}
            {active === "breadcrumbs" && <Breadcrumbs />}
            {active === "carousel" && <Carousel />}
            {active === "chatbot" && <ChatbotStub />}
            {active === "wizard" && <FormWizard />}
            {active === "testimonial" && <Testimonial />}
            {active === "toast" && <ToastDemo />}

            {/* Footer helper */}
            <footer className="text-xs text-center text-gray-500 pt-6">
              Built with React + Tailwind. Theme: Ocean Professional.
            </footer>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}

export default App;
