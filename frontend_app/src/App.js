import React, { useMemo, useState, useCallback, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
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
import ChatbotFloating from "./components/ChatbotFloating";

// PUBLIC_INTERFACE
function App() {
  /**
   * App shell with top navbar and gradient backgrounds.
   * - Page background: linear-gradient(87deg, #95bff0 20%, #ac7de9 80%)
   * - Header/Footer: linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)
   * Tabs in header switch between component demos.
   * "More" menu renders as a body-level overlay via portal to avoid clipping by the navbar.
   */
  const [active, setActive] = useState("hero");

  // Track "More" dropdown open state and anchor/refs for a11y keyboard navigation
  const [moreOpen, setMoreOpen] = useState(false);
  const moreBtnRef = useRef(null);
  const menuRef = useRef(null);

  // Track overlay position (computed from trigger button's bounding rect)
  const [menuPos, setMenuPos] = useState({
    top: 0,
    left: 0,
    width: 0,
    alignRight: true,
  });

  const computeMenuPosition = useCallback(() => {
    const btn = moreBtnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const vw = window.innerWidth || document.documentElement.clientWidth;

    // Responsive max width similar to Tailwind max-w classes
    // sm: full-bleed with margins; md+: clamp to sensible width (max-w-xl/2xl feel)
    const maxWidth = vw >= 1280 ? 672 /* ~max-w-2xl */ :
                     vw >= 1024 ? 560 /* ~max-w-xl */ :
                     vw >= 768  ? 480 /* ~max-w-md/lg */ : vw - 16;

    const baseWidth = Math.max(260, Math.min(360, rect.width * 1.5));
    const width = Math.min(baseWidth, maxWidth);

    // Center under trigger; clamp to viewport with small gutters
    let left = rect.left + rect.width / 2 - width / 2;
    const gutter = 8;
    left = Math.max(gutter, Math.min(left, vw - width - gutter));
    const top = rect.bottom + 8;

    setMenuPos({
      top,
      left,
      width,
      alignRight: false,
    });
  }, []);

  // Top-level primary items and "more" groups
  const primaryItems = useMemo(
    () => [
      { key: "hero", label: "Hero" },
      { key: "accordion", label: "Accordion" },
      { key: "bento", label: "Bento" },
      { key: "breadcrumbs", label: "Breadcrumbs" },
    ],
    []
  );

  // Items that go inside More dropdown
  const moreItems = useMemo(
    () => [
      { key: "carousel", label: "Carousel" },
      { key: "chatbot", label: "Chatbot (UI)" },
      { key: "wizard", label: "Form Wizard" },
      { key: "testimonial", label: "Testimonial" },
      { key: "toast", label: "Toast" },
    ],
    []
  );

  // Close the dropdown on escape or click outside; keep keyboard accessible
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMoreOpen(false);
        // Return focus to the More button for accessibility
        moreBtnRef.current?.focus();
      }
    };
    const onClickOutside = (e) => {
      if (!menuRef.current) return;
      if (
        moreOpen &&
        !menuRef.current.contains(e.target) &&
        !moreBtnRef.current?.contains(e.target)
      ) {
        setMoreOpen(false);
      }
    };
    const onScrollOrResize = () => {
      if (moreOpen) computeMenuPosition();
    };

    window.addEventListener("keydown", onKey, true);
    window.addEventListener("mousedown", onClickOutside, true);
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize, true);

    // When opening, compute initial position
    if (moreOpen) {
      computeMenuPosition();
      // next frame ensures layout stabilized
      requestAnimationFrame(computeMenuPosition);
    }

    return () => {
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("mousedown", onClickOutside, true);
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize, true);
    };
  }, [moreOpen, computeMenuPosition]);

  // A11y: keyboard navigation for menu items (Up/Down/Enter)
  const onMenuKeyDown = useCallback((e) => {
    const items = menuRef.current?.querySelectorAll('[role="menuitem"]');
    if (!items || items.length === 0) return;
    const currentIndex = Array.from(items).findIndex((el) => el === document.activeElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = items[(currentIndex + 1 + items.length) % items.length];
      next?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = items[(currentIndex - 1 + items.length) % items.length];
      prev?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      items[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      items[items.length - 1]?.focus();
    }
  }, []);

  const selectAndClose = useCallback((key) => {
    setActive(key);
    setMoreOpen(false);
  }, []);

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
          <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4">
            {/* Single-row navbar: brand left, items right; wraps on narrow screens */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              {/* Brand / App name - left aligned with side spacing */}
              <div className="flex items-center gap-3 min-w-[12rem] pr-2 md:pr-3">
                <div
                  className="h-9 w-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold"
                  aria-hidden="true"
                >
                  UI
                </div>
                <div className="text-white">
                  <h1
                    className="text-xl font-semibold tracking-wide"
                    style={{ textTransform: "uppercase" }}
                  >
                    Components Showcase
                  </h1>
                </div>
              </div>

              {/* Component nav items - right aligned with horizontal padding to avoid edge-to-edge */}
              <nav
                className="flex-1 overflow-x-auto pl-1 md:pl-2"
                aria-label="Component navigation"
              >
                <ul className="flex items-center justify-end gap-2 md:gap-2.5 lg:gap-3">
                  {primaryItems.map((it) => {
                    const isActive = active === it.key;
                    return (
                      <li key={it.key}>
                        <button
                          onClick={() => setActive(it.key)}
                          className={`px-3 sm:px-4 md:px-5 py-2 rounded-full text-sm transition-all backdrop-blur focus-ring
                            ${
                              isActive
                                ? "bg-white text-[var(--color-text)] shadow"
                                : "text-white/90 hover:bg-white/10"
                            }`}
                          aria-current={isActive ? "page" : undefined}
                        >
                          <span style={{ textTransform: "uppercase" }}>{it.label}</span>
                        </button>
                      </li>
                    );
                  })}

                  {/* More dropdown */}
                  <li
                    className="relative"
                    onMouseEnter={() => {
                      // Hover opens (desktop)
                      setMoreOpen(true);
                      computeMenuPosition();
                    }}
                    onMouseLeave={(e) => {
                      // Close when pointer leaves trigger+menu region
                      setMoreOpen(false);
                    }}
                  >
                    <button
                      ref={moreBtnRef}
                      aria-haspopup="true"
                      aria-expanded={moreOpen}
                      aria-controls="more-menu"
                      onClick={() => {
                        // Mobile/touch toggle behavior
                        setMoreOpen((v) => {
                          const next = !v;
                          if (next) {
                            setTimeout(() => computeMenuPosition(), 0);
                          }
                          return next;
                        });
                      }}
                      onFocus={() => {
                        // Focus opens; keeps keyboard accessibility
                        setMoreOpen(true);
                        computeMenuPosition();
                      }}
                      onBlur={(e) => {
                        // If focus leaves both trigger and menu, close
                        const related = e.relatedTarget;
                        const insideTrigger = moreBtnRef.current?.contains(related);
                        const insideMenu = menuRef.current?.contains(related);
                        if (!insideTrigger && !insideMenu) setMoreOpen(false);
                      }}
                      onKeyDown={(e) => {
                        // Open with Enter/Space/ArrowDown and focus first item
                        const openKeys = ["Enter", " ", "ArrowDown"];
                        if (openKeys.includes(e.key) && !moreOpen) {
                          e.preventDefault();
                          setMoreOpen(true);
                          setTimeout(() => {
                            computeMenuPosition();
                            const first = document.querySelector(
                              '#more-menu [role="menuitem"]'
                            );
                            first?.focus();
                          }, 0);
                        } else if (e.key === "Escape") {
                          // ESC closes and return focus to trigger
                          e.stopPropagation();
                          setMoreOpen(false);
                          requestAnimationFrame(() => moreBtnRef.current?.focus());
                        }
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 sm:px-4 md:px-5 py-2 rounded-full text-sm transition-all backdrop-blur focus-ring ${
                        moreOpen ? "bg-white text-[var(--color-text)] shadow" : "text-white/90 hover:bg-white/10"
                      }`}
                    >
                      <span style={{ textTransform: "uppercase" }}>More</span>
                      {/* Down-arrow icon */}
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        className={`transition-transform duration-150 ease-out ${
                          moreOpen ? "rotate-180" : "rotate-0"
                        }`}
                      >
                        <path
                          d="M6 9l6 6 6-6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="sr-only">, additional components</span>
                    </button>

                    {/* Dropdown overlay via portal */}
                    {moreOpen &&
                      ReactDOM.createPortal(
                        <div
                          aria-hidden="false"
                          style={{
                            position: "fixed",
                            inset: 0,
                            zIndex: 1000, // above navbar and content
                          }}
                          // Outside click closes
                          onMouseDown={(e) => {
                            const inMenu = menuRef.current?.contains(e.target);
                            const inButton = moreBtnRef.current?.contains(e.target);
                            if (!inMenu && !inButton) {
                              setMoreOpen(false);
                            }
                          }}
                        >
                          {/* Click-catcher backdrop for outside clicks (invisible) */}
                          <div
                            style={{
                              position: "fixed",
                              inset: 0,
                              background: "transparent",
                            }}
                          />
                          {/* The actual menu panel positioned under trigger */}
                          <div
                            ref={menuRef}
                            id="more-menu"
                            role="menu"
                            aria-label="More components"
                            onKeyDown={(e) => {
                              if (e.key === "Escape") {
                                e.stopPropagation();
                                setMoreOpen(false);
                                requestAnimationFrame(() =>
                                  moreBtnRef.current?.focus()
                                );
                              } else {
                                onMenuKeyDown(e);
                              }
                            }}
                            tabIndex={-1}
                            className="rounded-xl border border-white/20 shadow-lg focus:outline-none"
                            style={{
                              position: "fixed",
                              top: `${menuPos.top}px`,
                              left: `${menuPos.left}px`,
                              width: `${menuPos.width}px`,
                              maxWidth: "90vw",
                              // Semi-transparent gradient background for readability; preserve specified gradient
                              background:
                                "linear-gradient(45deg, rgba(175,36,151,0.92) 10%, rgba(144,45,154,0.90) 20%, rgba(24,64,160,0.90) 100%)",
                              backdropFilter: "saturate(130%) blur(6px)",
                              zIndex: 1001,
                            }}
                            onFocusOut={(e) => {
                              // Close when focus leaves trigger+menu region
                              const related = e.relatedTarget;
                              const inTrigger = moreBtnRef.current?.contains(related);
                              const inMenu = menuRef.current?.contains(related);
                              if (!inTrigger && !inMenu) setMoreOpen(false);
                            }}
                            onMouseLeave={() => {
                              // Pointer moving out of menu (and li wrapper's onMouseLeave handles region exit)
                              // Ensure it closes in case pointer leaves from panel side.
                              setMoreOpen(false);
                            }}
                          >
                            <ul className="py-2 px-1 sm:px-2">
                              {moreItems.map((it) => {
                                const isActive = active === it.key;
                                return (
                                  <li key={`more-${it.key}`}>
                                    <button
                                      role="menuitem"
                                      onClick={() => selectAndClose(it.key)}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                          e.preventDefault();
                                          selectAndClose(it.key);
                                        }
                                      }}
                                      onBlur={(e) => {
                                        // If focus leaves menu entirely, close
                                        const related = e.relatedTarget;
                                        const inMenu =
                                          menuRef.current?.contains(related);
                                        const inTrigger =
                                          moreBtnRef.current?.contains(related);
                                        if (!inMenu && !inTrigger) {
                                          setMoreOpen(false);
                                        }
                                      }}
                                      className={`w-full text-left px-3 py-2 text-sm rounded-lg mx-2 my-1 transition-transform focus-ring ${
                                        isActive
                                          ? "bg-white text-[var(--color-text)] shadow"
                                          : "text-white/95 hover:bg-white/10"
                                      }`}
                                      style={{
                                        // Subtle hover effects: scale and shadow
                                        transition:
                                          "transform 150ms ease, box-shadow 150ms ease, background 150ms ease",
                                      }}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "scale(1.02)";
                                        e.currentTarget.style.boxShadow =
                                          "0 8px 16px rgba(0,0,0,0.18)";
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "scale(1)";
                                        e.currentTarget.style.boxShadow = "none";
                                      }}
                                    >
                                      <span style={{ textTransform: "uppercase" }}>
                                        {it.label}
                                      </span>
                                    </button>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </div>,
                        document.body
                      )}
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </header>

        {/* Main container */}
        <main className="container mx-auto max-w-7xl w-full flex-1 px-4 md:px-6 lg:px-8 py-6 space-y-6">
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
                      {[...primaryItems, ...moreItems].map((it) => {
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
                              <span style={{ textTransform: "uppercase" }}>{it.label}</span>
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
        {/* Floating chatbot launcher and panel (global overlay) */}
        <ChatbotFloating />
      </div>
    </ToastProvider>
  );
}

export default App;
