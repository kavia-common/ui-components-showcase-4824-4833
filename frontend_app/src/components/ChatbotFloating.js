import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import ChatbotStub from "./ChatbotStub";

/**
 * PUBLIC_INTERFACE
 * ChatbotFloating
 * Floating chatbot launcher (bottom-right) that toggles an accessible, responsive panel.
 * - Launcher: circular gradient button with aria-pressed and tooltip label
 * - Panel: fixed, responsive drawer/panel with focus trap and ESC/outside-click closing
 * - Accessibility: aria roles/labels, focus restoration to launcher on close
 * - Theming: matches app gradient/header styling and Tailwind tokens
 */
export default function ChatbotFloating({ open: controlledOpen, onRequestOpen, onRequestClose } = {}) {
  // Support both controlled and uncontrolled usage
  const isControlled = typeof controlledOpen === "boolean";
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = (next) => {
    if (isControlled) {
      if (next && onRequestOpen) onRequestOpen();
      if (!next && onRequestClose) onRequestClose();
    } else {
      setUncontrolledOpen(next);
    }
  };

  const launcherRef = useRef(null);
  const panelRef = useRef(null);
  const firstFocusableRef = useRef(null);
  const lastFocusableRef = useRef(null);

  // PUBLIC_INTERFACE
  // Toggle chatbot open/close; when closing, restore focus to launcher
  const toggle = useCallback(() => {
    const next = !open;
    setOpen(next);
    if (!next) {
      requestAnimationFrame(() => launcherRef.current?.focus());
    }
  }, [open]);

  // Close on ESC, outside click
  useEffect(() => {
    if (!open) return;

    // Lock background scroll while open
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    try {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } catch {
      /* noop */
    }

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        requestAnimationFrame(() => launcherRef.current?.focus());
      } else if (e.key === "Tab") {
        // Focus trap: cycle focus inside panel
        const focusables = panelRef.current?.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables || focusables.length === 0) return;
        const list = Array.from(focusables);
        const first = list[0];
        const last = list[list.length - 1];

        firstFocusableRef.current = first;
        lastFocusableRef.current = last;

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    const onMouseDown = (e) => {
      const inPanel = panelRef.current?.contains(e.target);
      const inLauncher = launcherRef.current?.contains(e.target);
      if (!inPanel && !inLauncher) {
        setOpen(false);
        requestAnimationFrame(() => launcherRef.current?.focus());
      }
    };

    window.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("mousedown", onMouseDown, true);
    return () => {
      // restore scroll
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      window.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("mousedown", onMouseDown, true);
    };
  }, [open]);

  // When opening, move focus to the panel heading for context
  useEffect(() => {
    if (open) {
      const heading = panelRef.current?.querySelector("#chatbot-panel-title");
      if (heading && heading.focus) {
        heading.focus();
      } else {
        const first = panelRef.current?.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (first && first.focus) first.focus();
      }
    }
  }, [open]);

  const gradient = useMemo(
    () => "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)",
    []
  );

  const Panel = () => (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="chatbot-panel-title"
      aria-describedby="chatbot-panel-desc"
      ref={panelRef}
      className="fixed z-[1000] rounded-none sm:rounded-2xl shadow-soft border border-white/30 overflow-hidden
                 inset-0 sm:inset-auto sm:right-4 sm:bottom-24 sm:w-[min(92vw,420px)] sm:max-h-[80vh]"
      style={{
        // On small screens, full-bleed subtle scrim background behind the panel content; on sm+ keep translucent card
        background:
          window.innerWidth < 640
            ? "#ffffff"
            : "linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.92) 100%)",
        backdropFilter: window.innerWidth < 640 ? "none" : "saturate(140%) blur(6px)",
      }}
    >
      {/* Panel header with gradient bar */}
      <div
        className="px-4 py-3 text-white flex items-center justify-between"
        style={{ background: gradient }}
      >
        <h2
          id="chatbot-panel-title"
          className="text-sm font-semibold outline-none focus:ring-2 focus:ring-white/70 rounded"
          tabIndex={-1}
          style={{ textTransform: "uppercase" }}
        >
          Chatbot
        </h2>
        <button
          onClick={() => {
            setOpen(false);
            requestAnimationFrame(() => launcherRef.current?.focus());
          }}
          className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-white/15 hover:bg-white/25 focus-ring"
          aria-label="Close chatbot"
          title="Close"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Content area: reuse ChatbotStub for demo */}
      <div className="h-[calc(100vh-48px-48px)] sm:h-auto sm:max-h-[70vh] overflow-auto">
        <ChatbotStub />
      </div>
    </div>
  );

  return (
    <>
      {/* Launcher button fixed bottom-right */}
      <button
        ref={launcherRef}
        type="button"
        onClick={toggle}
        aria-pressed={open}
        aria-haspopup="dialog"
        aria-controls="chatbot-floating-panel"
        title="Open Chatbot"
        className="fixed z-[999] right-4 bottom-4 sm:bottom-6 h-14 w-14 rounded-full focus-ring text-white shadow-soft"
        style={{
          background: gradient,
          boxShadow: "0 10px 24px rgba(18,22,61,0.22)",
        }}
      >
        <span className="sr-only">Open Chatbot</span>
        {/* Chat icon */}
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="mx-auto"
        >
          <path
            d="M7 8h10M7 12h7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M5 16v3.5a.5.5 0 0 0 .84.36L9 16h7a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v8z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Portal for panel and invisible click-catcher backdrop */}
      {open &&
        ReactDOM.createPortal(
          <>
            {/* Backdrop (transparent on desktop, dim on small screens) and outside click handler */}
            <div
              aria-hidden="true"
              onMouseDown={(e) => {
                const inPanel = panelRef.current?.contains(e.target);
                const inLauncher = launcherRef.current?.contains(e.target);
                if (!inPanel && !inLauncher) {
                  setOpen(false);
                  requestAnimationFrame(() => launcherRef.current?.focus());
                }
              }}
              className="fixed inset-0 z-[998] sm:bg-transparent bg-black/30"
            />
            <div id="chatbot-floating-panel" className="z-[1000]">
              <Panel />
            </div>
          </>,
          document.body
        )}
    </>
  );
}
