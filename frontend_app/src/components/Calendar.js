import React, { useEffect, useMemo, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * Calendar
 * Month-view calendar with navigation, today highlight, and selectable date; keyboard accessible.
 */
export default function Calendar() {
  const gradient = useMemo(
    () => "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)",
    []
  );

  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(null);

  const monthLabel = cursor.toLocaleString(undefined, { month: "long", year: "numeric" });

  const startDay = new Date(cursor.getFullYear(), cursor.getMonth(), 1).getDay(); // 0-6
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();

  const daysArray = useMemo(() => {
    const cells = [];
    for (let i = 0; i < startDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [startDay, daysInMonth]);

  const isToday = (d) =>
    d &&
    d === today.getDate() &&
    cursor.getMonth() === today.getMonth() &&
    cursor.getFullYear() === today.getFullYear();

  const onKeyDown = (e, index) => {
    const cols = 7;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = Math.min(daysArray.length - 1, index + 1);
      focusCell(next);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = Math.max(0, index - 1);
      focusCell(prev);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.min(daysArray.length - 1, index + cols);
      focusCell(next);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = Math.max(0, index - cols);
      focusCell(prev);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusCell(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusCell(daysArray.length - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (daysArray[index]) setSelected(daysArray[index]);
    }
  };

  const focusCell = (i) => {
    const el = document.getElementById(`cal-cell-${i}`);
    if (el) el.focus();
  };

  useEffect(() => {
    // refocus first valid cell on month change
    const firstIdx = daysArray.findIndex((d) => d);
    if (firstIdx >= 0) focusCell(firstIdx);
  }, [cursor, daysArray]);

  return (
    <section aria-label="Calendar" className="w-full">
      <header className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          <span style={{ textTransform: "uppercase" }}>{monthLabel}</span>
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-full h-9 w-9 grid place-items-center text-white focus-ring"
            style={{ background: gradient }}
            aria-label="Previous month"
            onClick={() =>
              setCursor((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))
            }
          >
            ‹
          </button>
          <button
            type="button"
            className="rounded-full h-9 w-9 grid place-items-center text-white focus-ring"
            style={{ background: gradient }}
            aria-label="Next month"
            onClick={() =>
              setCursor((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))
            }
          >
            ›
          </button>
        </div>
      </header>

      <div className="surface p-4">
        <div className="grid grid-cols-7 text-xs font-semibold text-slate-500 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="px-1 py-1 text-center">
              <span style={{ textTransform: "uppercase" }}>{d}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {daysArray.map((d, i) => {
            const isSel = d && selected === d;
            return (
              <button
                key={i}
                id={`cal-cell-${i}`}
                type="button"
                role="gridcell"
                aria-selected={isSel || undefined}
                className={`h-10 rounded-lg w-full text-sm focus-ring ${
                  d ? "bg-white border border-gray-200" : "bg-transparent"
                } ${isSel ? "ring-2 ring-indigo-400/60" : ""}`}
                onKeyDown={(e) => onKeyDown(e, i)}
                onClick={() => d && setSelected(d)}
                disabled={!d}
                title={d ? `Select ${d}` : "Empty"}
                aria-label={d ? `Day ${d}` : "Empty"}
                style={{
                  color: d ? "#111827" : "#9ca3af",
                  position: "relative",
                }}
              >
                {d}
                {isToday(d) && (
                  <span
                    aria-hidden="true"
                    className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full"
                    style={{ background: gradient }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
