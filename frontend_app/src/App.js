import React, { useMemo, useState, useCallback, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import "./index.css";

import Hero from "./components/Hero";
import Accordion from "./components/Accordion";
import BentoGrid from "./components/BentoGrid";
import Breadcrumbs from "./components/Breadcrumbs";
import Carousel from "./components/Carousel";

import FormWizard from "./components/FormWizard";
import Testimonial from "./components/Testimonial";
import ToastDemo from "./components/ToastDemo";
import { ToastProvider } from "./components/ToastProvider";
import ChatbotFloating from "./components/ChatbotFloating";
import Pricing from "./components/Pricing";
import NewsletterSection from "./components/NewsletterSection";
import ContactSection from "./components/ContactSection";
import TeamSection from "./components/TeamSection";
import LogoClouds from "./components/LogoClouds";
import Calendar from "./components/Calendar";
import DataTable from "./components/DataTable";
import Footer from "./components/Footer";

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
  // Floating chatbot visibility state lifted to App so a page/section can open it
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const openChat = useCallback(() => setChatbotOpen(true), []);
  const closeChat = useCallback(() => setChatbotOpen(false), []);

  // Track dropdown open states and anchor/refs for a11y keyboard navigation
  const [list1Open, setList1Open] = useState(false);
  const [list2Open, setList2Open] = useState(false);
  const moreOpen = list1Open || list2Open; // legacy aggregate for effects
  const list1BtnRef = useRef(null);
  const list2BtnRef = useRef(null);
  const menu1Ref = useRef(null);
  const menu2Ref = useRef(null);

  // Track overlay position (computed from trigger button's bounding rect)
  const [menu1Pos, setMenu1Pos] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const [menu2Pos, setMenu2Pos] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const computeMenuPosition = useCallback((which = "list1") => {
    const btn = which === "list2" ? list2BtnRef.current : list1BtnRef.current;
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

    const pos = { top, left, width };
    if (which === "list2") {
      setMenu2Pos(pos);
    } else {
      setMenu1Pos(pos);
    }
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

  // Items that go inside dropdowns
  const list1Items = useMemo(
    () => [
      { key: "carousel", label: "Carousel" },
      { key: "wizard", label: "Form Wizard" },
      { key: "testimonial", label: "Testimonial" },
      { key: "toast", label: "Toast" },
      { key: "pricing", label: "Pricing" },
      { key: "contact", label: "Contact" },
      { key: "calendar", label: "Calendar" },
      { key: "datatable", label: "Data Table" },
      { key: "chatbot", label: "Chatbot" },
    ],
    []
  );

  const list2Items = useMemo(
    () => [
      { key: "newsletter", label: "Newsletter" },
      { key: "team", label: "Team" },
      { key: "logos", label: "Logo Clouds" },
    ],
    []
  );

  // Close the dropdown on escape or click outside; keep keyboard accessible
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setList1Open(false);
        setList2Open(false);
        // Return focus to whichever button was last focused
        if (document.activeElement === document.body || document.activeElement == null) {
          list1BtnRef.current?.focus();
        }
      }
    };
    const onClickOutside = (e) => {
      const inMenu1 = menu1Ref.current?.contains(e.target);
      const inMenu2 = menu2Ref.current?.contains(e.target);
      const inBtn1 = list1BtnRef.current?.contains(e.target);
      const inBtn2 = list2BtnRef.current?.contains(e.target);
      if (!(inMenu1 || inMenu2 || inBtn1 || inBtn2)) {
        setList1Open(false);
        setList2Open(false);
      }
    };
    const onScrollOrResize = () => {
      if (list1Open) computeMenuPosition("list1");
      if (list2Open) computeMenuPosition("list2");
    };

    window.addEventListener("keydown", onKey, true);
    window.addEventListener("mousedown", onClickOutside, true);
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize, true);

    if (list1Open) {
      computeMenuPosition("list1");
      requestAnimationFrame(() => computeMenuPosition("list1"));
    }
    if (list2Open) {
      computeMenuPosition("list2");
      requestAnimationFrame(() => computeMenuPosition("list2"));
    }

    return () => {
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("mousedown", onClickOutside, true);
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize, true);
    };
  }, [list1Open, list2Open, computeMenuPosition]);

  // A11y: keyboard navigation for menu items (Up/Down/Enter)
  const onMenuKeyDown = useCallback((e, which = "list1") => {
    const menuEl = which === "list2" ? menu2Ref.current : menu1Ref.current;
    const items = menuEl?.querySelectorAll('[role="menuitem"]');
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
    setList1Open(false);
    setList2Open(false);
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

                  {/* List 1 dropdown (renamed from More) */}
                  <li
                    className="relative"
                    onMouseEnter={() => {
                      setList1Open(true);
                      computeMenuPosition("list1");
                    }}
                    onMouseLeave={() => setList1Open(false)}
                  >
                    <button
                      ref={list1BtnRef}
                      aria-haspopup="true"
                      aria-expanded={list1Open}
                      aria-controls="list1-menu"
                      onClick={() => {
                        setList1Open((v) => {
                          const next = !v;
                          if (next) setTimeout(() => computeMenuPosition("list1"), 0);
                          return next;
                        });
                        setList2Open(false);
                      }}
                      onFocus={() => {
                        setList1Open(true);
                        computeMenuPosition("list1");
                      }}
                      onBlur={(e) => {
                        const related = e.relatedTarget;
                        const inTrigger = list1BtnRef.current?.contains(related);
                        const inMenu = menu1Ref.current?.contains(related);
                        if (!inTrigger && !inMenu) setList1Open(false);
                      }}
                      onKeyDown={(e) => {
                        const openKeys = ["Enter", " ", "ArrowDown"];
                        if (openKeys.includes(e.key) && !list1Open) {
                          e.preventDefault();
                          setList1Open(true);
                          setTimeout(() => {
                            computeMenuPosition("list1");
                            const first = document.querySelector('#list1-menu [role="menuitem"]');
                            first?.focus();
                          }, 0);
                        } else if (e.key === "Escape") {
                          e.stopPropagation();
                          setList1Open(false);
                          requestAnimationFrame(() => list1BtnRef.current?.focus());
                        }
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 sm:px-4 md:px-5 py-2 rounded-full text-sm transition-all backdrop-blur focus-ring ${
                        list1Open ? "bg-white text-[var(--color-text)] shadow" : "text-white/90 hover:bg-white/10"
                      }`}
                    >
                      <span style={{ textTransform: "uppercase" }}>List 1</span>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        className={`transition-transform duration-150 ease-out ${
                          list1Open ? "rotate-180" : "rotate-0"
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

                    {list1Open &&
                      ReactDOM.createPortal(
                        <div
                          aria-hidden="false"
                          style={{ position: "fixed", inset: 0, zIndex: 1000 }}
                          onMouseDown={(e) => {
                            const inMenu = menu1Ref.current?.contains(e.target);
                            const inButton = list1BtnRef.current?.contains(e.target);
                            if (!inMenu && !inButton) setList1Open(false);
                          }}
                        >
                          <div style={{ position: "fixed", inset: 0, background: "transparent" }} />
                          <div
                            ref={menu1Ref}
                            id="list1-menu"
                            role="menu"
                            aria-label="List 1 components"
                            onKeyDown={(e) => {
                              if (e.key === "Escape") {
                                e.stopPropagation();
                                setList1Open(false);
                                requestAnimationFrame(() => list1BtnRef.current?.focus());
                              } else {
                                onMenuKeyDown(e, "list1");
                              }
                            }}
                            tabIndex={-1}
                            className="rounded-xl border border-white/20 shadow-lg focus:outline-none"
                            style={{
                              position: "fixed",
                              top: `${menu1Pos.top}px`,
                              left: `${menu1Pos.left}px`,
                              width: `${menu1Pos.width}px`,
                              maxWidth: "90vw",
                              background:
                                "linear-gradient(45deg, rgba(175,36,151,0.92) 10%, rgba(144,45,154,0.90) 20%, rgba(24,64,160,0.90) 100%)",
                              backdropFilter: "saturate(130%) blur(6px)",
                              zIndex: 1001,
                            }}
                            onFocusOut={(e) => {
                              const related = e.relatedTarget;
                              const inTrigger = list1BtnRef.current?.contains(related);
                              const inMenu = menu1Ref.current?.contains(related);
                              if (!inTrigger && !inMenu) setList1Open(false);
                            }}
                            onMouseLeave={() => setList1Open(false)}
                          >
                            <ul className="py-2 px-1 sm:px-2">
                              {list1Items.map((it) => {
                                const isActive = active === it.key;
                                return (
                                  <li key={`list1-${it.key}`}>
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
                                        const related = e.relatedTarget;
                                        const inMenu = menu1Ref.current?.contains(related);
                                        const inTrigger = list1BtnRef.current?.contains(related);
                                        if (!inMenu && !inTrigger) setList1Open(false);
                                      }}
                                      className={`w-full text-left px-3 py-2 text-sm rounded-lg mx-2 my-1 transition-transform focus-ring ${
                                        isActive ? "bg-white text-[var(--color-text)] shadow" : "text-white/95 hover:bg-white/10"
                                      }`}
                                      style={{
                                        transition: "transform 150ms ease, box-shadow 150ms ease, background 150ms ease",
                                      }}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "scale(1.02)";
                                        e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.18)";
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "scale(1)";
                                        e.currentTarget.style.boxShadow = "none";
                                      }}
                                    >
                                      <span style={{ textTransform: "uppercase" }}>{it.label}</span>
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

                  {/* List 2 dropdown */}
                  <li
                    className="relative"
                    onMouseEnter={() => {
                      setList2Open(true);
                      computeMenuPosition("list2");
                    }}
                    onMouseLeave={() => setList2Open(false)}
                  >
                    <button
                      ref={list2BtnRef}
                      aria-haspopup="true"
                      aria-expanded={list2Open}
                      aria-controls="list2-menu"
                      onClick={() => {
                        setList2Open((v) => {
                          const next = !v;
                          if (next) setTimeout(() => computeMenuPosition("list2"), 0);
                          return next;
                        });
                        setList1Open(false);
                      }}
                      onFocus={() => {
                        setList2Open(true);
                        computeMenuPosition("list2");
                      }}
                      onBlur={(e) => {
                        const related = e.relatedTarget;
                        const inTrigger = list2BtnRef.current?.contains(related);
                        const inMenu = menu2Ref.current?.contains(related);
                        if (!inTrigger && !inMenu) setList2Open(false);
                      }}
                      onKeyDown={(e) => {
                        const openKeys = ["Enter", " ", "ArrowDown"];
                        if (openKeys.includes(e.key) && !list2Open) {
                          e.preventDefault();
                          setList2Open(true);
                          setTimeout(() => {
                            computeMenuPosition("list2");
                            const first = document.querySelector('#list2-menu [role="menuitem"]');
                            first?.focus();
                          }, 0);
                        } else if (e.key === "Escape") {
                          e.stopPropagation();
                          setList2Open(false);
                          requestAnimationFrame(() => list2BtnRef.current?.focus());
                        }
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 sm:px-4 md:px-5 py-2 rounded-full text-sm transition-all backdrop-blur focus-ring ${
                        list2Open ? "bg-white text-[var(--color-text)] shadow" : "text-white/90 hover:bg-white/10"
                      }`}
                    >
                      <span style={{ textTransform: "uppercase" }}>List 2</span>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        className={`transition-transform duration-150 ease-out ${
                          list2Open ? "rotate-180" : "rotate-0"
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

                    {list2Open &&
                      ReactDOM.createPortal(
                        <div
                          aria-hidden="false"
                          style={{ position: "fixed", inset: 0, zIndex: 1000 }}
                          onMouseDown={(e) => {
                            const inMenu = menu2Ref.current?.contains(e.target);
                            const inButton = list2BtnRef.current?.contains(e.target);
                            if (!inMenu && !inButton) setList2Open(false);
                          }}
                        >
                          <div style={{ position: "fixed", inset: 0, background: "transparent" }} />
                          <div
                            ref={menu2Ref}
                            id="list2-menu"
                            role="menu"
                            aria-label="List 2 components"
                            onKeyDown={(e) => {
                              if (e.key === "Escape") {
                                e.stopPropagation();
                                setList2Open(false);
                                requestAnimationFrame(() => list2BtnRef.current?.focus());
                              } else {
                                onMenuKeyDown(e, "list2");
                              }
                            }}
                            tabIndex={-1}
                            className="rounded-xl border border-white/20 shadow-lg focus:outline-none"
                            style={{
                              position: "fixed",
                              top: `${menu2Pos.top}px`,
                              left: `${menu2Pos.left}px`,
                              width: `${menu2Pos.width}px`,
                              maxWidth: "90vw",
                              background:
                                "linear-gradient(45deg, rgba(175,36,151,0.92) 10%, rgba(144,45,154,0.90) 20%, rgba(24,64,160,0.90) 100%)",
                              backdropFilter: "saturate(130%) blur(6px)",
                              zIndex: 1001,
                            }}
                            onFocusOut={(e) => {
                              const related = e.relatedTarget;
                              const inTrigger = list2BtnRef.current?.contains(related);
                              const inMenu = menu2Ref.current?.contains(related);
                              if (!inTrigger && !inMenu) setList2Open(false);
                            }}
                            onMouseLeave={() => setList2Open(false)}
                          >
                            <ul className="py-2 px-1 sm:px-2">
                              {list2Items.map((it) => {
                                const isActive = active === it.key;
                                return (
                                  <li key={`list2-${it.key}`}>
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
                                        const related = e.relatedTarget;
                                        const inMenu = menu2Ref.current?.contains(related);
                                        const inTrigger = list2BtnRef.current?.contains(related);
                                        if (!inMenu && !inTrigger) setList2Open(false);
                                      }}
                                      className={`w-full text-left px-3 py-2 text-sm rounded-lg mx-2 my-1 transition-transform focus-ring ${
                                        isActive ? "bg-white text-[var(--color-text)] shadow" : "text-white/95 hover:bg-white/10"
                                      }`}
                                      style={{
                                        transition: "transform 150ms ease, box-shadow 150ms ease, background 150ms ease",
                                      }}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "scale(1.02)";
                                        e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.18)";
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "scale(1)";
                                        e.currentTarget.style.boxShadow = "none";
                                      }}
                                    >
                                      <span style={{ textTransform: "uppercase" }}>{it.label}</span>
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
          {active === "wizard" && <FormWizard />}
          {active === "testimonial" && <Testimonial />}
          {active === "toast" && <ToastDemo />}
          {active === "pricing" && <Pricing />}
          {active === "newsletter" && <NewsletterSection />}
          {active === "contact" && <ContactSection />}
          {active === "team" && <TeamSection />}
          {active === "logos" && <LogoClouds />}
          {active === "calendar" && <Calendar />}
          {active === "datatable" && <DataTable />}

          {active === "chatbot" && (
            <section aria-label="Chatbot" className="surface p-5">
              <header className="mb-2">
                <h2 className="text-lg font-semibold text-slate-900">
                  <span style={{ textTransform: "uppercase" }}>Chatbot</span>
                </h2>
                <p className="text-sm text-slate-600">
                  This is the Chatbot component page. Use the floating circular launcher at the bottom-right to open the chat. You can also open it from here.
                </p>
              </header>
              <div className="mt-3">
                <button
                  type="button"
                  className="rounded-lg text-white px-4 py-2 hover:opacity-95 focus-ring"
                  style={{ background: "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)" }}
                  onClick={openChat}
                  aria-label="Open Chatbot"
                >
                  <span style={{ textTransform: "uppercase" }}>Open Chatbot</span>
                </button>
              </div>
            </section>
          )}

          {/* Footer with Quick Links and Contact */}
          <Footer
            onNavigate={(key) => setActive(key)}
            links={[
              { key: "hero", label: "Home" },
              { key: "accordion", label: "Accordion" },
              { key: "bento", label: "Bento" },
              { key: "breadcrumbs", label: "Breadcrumbs" },
              { key: "pricing", label: "Pricing" },
              { key: "newsletter", label: "Newsletter" },
              { key: "contact", label: "Contact" },
              { key: "team", label: "Team" },
              { key: "datatable", label: "Data Table" },
              { key: "calendar", label: "Calendar" },
            ]}
          />
        </main>
        {/* Floating chatbot launcher and panel (global overlay) */}
        <ChatbotFloating open={chatbotOpen} onRequestClose={closeChat} onRequestOpen={openChat} />
      </div>
    </ToastProvider>
  );
}

export default App;
