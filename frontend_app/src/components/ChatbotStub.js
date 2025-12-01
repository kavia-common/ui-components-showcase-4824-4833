import React, { useEffect, useRef, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * ChatbotStub
 * Simple chat UI with mocked assistant replies. If REACT_APP_WS_URL exists, it's displayed but not required.
 */
export default function ChatbotStub() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your UI demo assistant. Ask me about the components." }
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef(null);

  const wsUrl = process.env.REACT_APP_WS_URL || "ws://example-ws-url.disabled";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Mock assistant reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "This is a mocked reply. No backend required." }
      ]);
    }, 600);
  };

  return (
    <div className="surface p-4 flex flex-col h-96">
      <div className="text-xs text-gray-500 mb-2">WebSocket (optional): <code className="text-gray-700">{wsUrl}</code></div>
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.map((m, i) => (
          <div key={i} className={`max-w-[80%] rounded-xl px-3 py-2 ${m.role === "assistant" ? "bg-blue-50" : "bg-gray-100 ml-auto"}`}>
            <p className="text-sm">{m.content}</p>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <form onSubmit={send} className="mt-3 flex gap-2">
        <input
          className="flex-1 rounded-lg border border-gray-200 px-3 py-2 focus-ring"
          placeholder="Type your message..."
          aria-label="Chat message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="rounded-lg bg-primary text-white px-4 py-2 hover:opacity-95 focus-ring" type="submit">
          <span style={{ textTransform: "uppercase" }}>Send</span>
        </button>
      </form>
    </div>
  );
}
