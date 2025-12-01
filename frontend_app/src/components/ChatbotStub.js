import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";

/**
 * PUBLIC_INTERFACE
 * ChatbotStub
 * Simple chat UI that accepts only user-typed input and shows generic mocked assistant replies.
 * - All data is local; no backend calls.
 * - Suggested-question chips and predefined mock Q&A triggers have been removed.
 */
export default function ChatbotStub() {
  // Central gradient token to stay aligned with app theme
  const headerGradient = useMemo(
    () => "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)",
    []
  );

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm your UI demo assistant. Type your question below and press Enter or click Send.",
    },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef(null);

  const wsUrl = process.env.REACT_APP_WS_URL || "ws://example-ws-url.disabled";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // PUBLIC_INTERFACE
  // Send a user message and append a generic mocked assistant reply.
  const send = useCallback(
    (e) => {
      e?.preventDefault?.();
      if (!input.trim()) return;
      const userMsg = { role: "user", content: input.trim() };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");

      // Generic mocked reply without predefined Q&A logic
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "This is a mocked reply. Ask me about the components in this demo or any UI details you see.",
          },
        ]);
      }, 400);
    },
    [input]
  );

  return (
    <div className="surface p-4 flex flex-col h-[min(28rem,70vh)]">
      <div className="text-xs text-gray-500 mb-2">
        WebSocket (optional):{" "}
        <code className="text-gray-700">{wsUrl}</code>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1" aria-live="polite">
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
      <div className="mt-3 flex gap-2">
        <input
          className="flex-1 rounded-lg border border-gray-200 px-3 py-2 focus-ring"
          placeholder="Type your message..."
          aria-label="Chat message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send({ preventDefault: () => {} });
            }
          }}
        />
        <button
          className="rounded-lg text-white px-4 py-2 hover:opacity-95 focus-ring"
          type="button"
          onClick={(e) => send({ preventDefault: () => {} })}
          style={{ background: headerGradient }}
          aria-label="Send message"
        >
          <span style={{ textTransform: "uppercase" }}>Send</span>
        </button>
      </div>
    </div>
  );
}
