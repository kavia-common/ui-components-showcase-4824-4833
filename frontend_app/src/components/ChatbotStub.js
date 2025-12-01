import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";

/**
 * PUBLIC_INTERFACE
 * ChatbotStub
 * Simple chat UI with mocked assistant replies and suggested-question chips for core UI components.
 * - All data is local; no backend calls.
 * - Chips are keyboard accessible and styled to match the app's gradient theme.
 */
export default function ChatbotStub() {
  // Central gradient token to stay aligned with app theme
  const headerGradient = useMemo(
    () => "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)",
    []
  );

  // Suggested Q&A map (local mock knowledge base)
  const qaMap = useMemo(
    () => ({
      "What is the Hero section?":
        "The Hero is a compact, responsive header section with a gradient-accent headline and CTAs. It uses Ocean Professional tokens and tight vertical spacing.",
      "How does the Accordion work?":
        "Each item has an accessible button header and an animated panel. Chevron rotates, and the panel uses smooth max-height/opacity transitions.",
      "What is the Bento layout?":
        "A responsive grid (12/8/6/1) with unified gradient headers and lightly interactive sub-cards. Tiles adapt spans across breakpoints.",
      "How do breadcrumbs help navigation?":
        "Breadcrumbs show hierarchical location with gradient-highlighted current item and thicker gradient underline on hover for links.",
      "How does the carousel auto-rotate?":
        "A simple setInterval moves the slide index every 3s with a transform transition. Dots indicate active slide; buttons allow manual navigation.",
      "How do I use the form wizard?":
        "Navigate freely across steps. Validation errors appear after interaction. Submit is enabled when all steps are valid and consent is checked.",
      "How are toasts triggered?":
        "Use the useToast() hook’s notify(message, type) to show toasts. Types include info, success, and error.",
      "What’s included in testimonials?":
        "Compact cards with quotes and attribution, styled as surfaces with subtle shadows for a clean, readable layout.",
      "How to open the chatbot?":
        "Use the floating circular button at the bottom-right. It opens a panel with ESC/outside-click to close and proper focus management.",
    }),
    []
  );

  const suggestions = useMemo(() => Object.keys(qaMap), [qaMap]);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm your UI demo assistant. Ask me about the components, or pick a suggested question below.",
    },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef(null);

  const wsUrl = process.env.REACT_APP_WS_URL || "ws://example-ws-url.disabled";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // PUBLIC_INTERFACE
  // Insert a Q from suggestions and auto-reply with its predefined answer
  const askSuggested = useCallback(
    (question) => {
      const userMsg = { role: "user", content: question };
      const answer = qaMap[question] || "I don't have a mock answer for that yet.";
      setMessages((prev) => [...prev, userMsg]);
      // mock assistant delay
      setTimeout(() => {
        setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
      }, 300);
    },
    [qaMap]
  );

  const onKeyActivateChip = useCallback(
    (e, question) => {
      const keys = ["Enter", " "];
      if (keys.includes(e.key)) {
        e.preventDefault();
        askSuggested(question);
      }
    },
    [askSuggested]
  );

  const send = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input.trim() };
    const normalized = input.trim();
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // If typed message matches one of our known questions (case-insensitive), return the mapped answer.
    const matchedKey =
      suggestions.find(
        (q) => q.toLowerCase().trim() === normalized.toLowerCase()
      ) || null;

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: matchedKey
            ? qaMap[matchedKey]
            : "This is a mocked reply. Ask me about Hero, Accordion, Bento, Breadcrumbs, Carousel, Wizard, Toasts, Testimonials, or the Chatbot.",
        },
      ]);
    }, 400);
  };

  // Chip styles with gradient border and subtle translucent hover to match theme
  const chipStyle = {
    // Gradient border
    position: "relative",
  };
  const chipInnerStyle = {
    position: "relative",
    zIndex: 1,
    background: "#ffffff",
  };

  return (
    <div className="surface p-4 flex flex-col h-[min(28rem,70vh)]">
      <div className="text-xs text-gray-500 mb-2">
        WebSocket (optional):{" "}
        <code className="text-gray-700">{wsUrl}</code>
      </div>

      {/* Suggested questions row */}
      <div className="mb-3">
        <div className="text-[12px] font-semibold text-slate-700 mb-2">
          <span style={{ textTransform: "uppercase" }}>Suggested</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((q, idx) => (
            <span
              key={q}
              className="inline-flex rounded-full p-[1px]"
              style={{ background: headerGradient }}
            >
              <button
                type="button"
                role="button"
                aria-label={`Ask: ${q}`}
                title={q}
                className="inline-flex items-center max-w-full rounded-full px-3 py-1.5 text-xs font-semibold text-slate-800 border border-white/60 focus-ring"
                style={chipInnerStyle}
                onClick={() => askSuggested(q)}
                onKeyDown={(e) => onKeyActivateChip(e, q)}
              >
                <span className="line-clamp-1" style={{ textTransform: "uppercase" }}>
                  {q}
                </span>
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.map((m, i) => (
          <div
            key={`${m.role}-${i}`}
            className={`max-w-[85%] rounded-xl px-3 py-2 ${
              m.role === "assistant"
                ? "bg-blue-50"
                : "bg-gray-100 ml-auto"
            }`}
          >
            <p className="text-sm">{m.content}</p>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <form onSubmit={send} className="mt-3 flex gap-2">
        <input
          className="flex-1 rounded-lg border border-gray-200 px-3 py-2 focus-ring"
          placeholder="Type your message or click a suggestion..."
          aria-label="Chat message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="rounded-lg text-white px-4 py-2 hover:opacity-95 focus-ring"
          type="submit"
          style={{ background: headerGradient }}
          aria-label="Send message"
        >
          <span style={{ textTransform: "uppercase" }}>Send</span>
        </button>
      </form>
    </div>
  );
}
