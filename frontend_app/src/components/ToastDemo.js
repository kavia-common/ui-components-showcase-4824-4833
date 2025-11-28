import React from "react";
import { useToast } from "./ToastProvider";

/**
 * PUBLIC_INTERFACE
 * ToastDemo
 * Buttons to trigger various toast notifications.
 */
export default function ToastDemo() {
  const { notify } = useToast();
  return (
    <div className="surface p-4 flex flex-wrap gap-3">
      <button className="rounded-lg bg-primary text-white px-4 py-2 hover:opacity-95 focus-ring" onClick={() => notify("Welcome! This is an info toast.", "info")}>
        Info Toast
      </button>
      <button className="rounded-lg bg-green-600 text-white px-4 py-2 hover:opacity-95 focus-ring" onClick={() => notify("Saved successfully.", "success")}>
        Success Toast
      </button>
      <button className="rounded-lg bg-red-600 text-white px-4 py-2 hover:opacity-95 focus-ring" onClick={() => notify("Something went wrong.", "error")}>
        Error Toast
      </button>
    </div>
  );
}
