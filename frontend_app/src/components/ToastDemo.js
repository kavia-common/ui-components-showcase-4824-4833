import React, { useMemo } from "react";
import { useToast } from "./ToastProvider";

/**
 * PUBLIC_INTERFACE
 * ToastDemo
 * Buttons to trigger various toast notifications with durations.
 */
export default function ToastDemo() {
  const { notify } = useToast();
  const gradient = useMemo(
    () => "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)",
    []
  );
  return (
    <div className="surface p-4 flex flex-wrap gap-3">
      <button
        className="rounded-lg text-white px-4 py-2 hover:opacity-95 focus-ring"
        onClick={() => notify("Welcome! This is an info toast.", "info")}
        style={{ background: gradient }}
      >
        <span style={{ textTransform: "uppercase" }}>Info Toast</span>
      </button>
      <button
        className="rounded-lg bg-green-600 text-white px-4 py-2 hover:opacity-95 focus-ring"
        onClick={() => notify("Saved successfully.", "success", { duration: 2500 })}
      >
        <span style={{ textTransform: "uppercase" }}>Success Toast</span>
      </button>
      <button
        className="rounded-lg bg-red-600 text-white px-4 py-2 hover:opacity-95 focus-ring"
        onClick={() => notify("Something went wrong.", "error", { duration: 5000 })}
      >
        <span style={{ textTransform: "uppercase" }}>Error Toast</span>
      </button>
    </div>
  );
}
