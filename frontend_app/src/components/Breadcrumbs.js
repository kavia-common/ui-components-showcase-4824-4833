import React, { useEffect, useRef } from "react";

/**
 * PUBLIC_INTERFACE
 * Breadcrumbs
 * Pixel-accurate breadcrumb navigation matching the latest reference image:
 * - Container: pill/card with precise radius, border, shadow, and padding
 * - Separator: chevron with exact size, thickness, color, spacing
 * - Labels: ALL CAPS; links vs current item typography (size/weight/letter-spacing)
 * - Links: darker color, thicker gradient underline on hover/focus; accessible focus-visible ring
 * - Current item: gradient-filled text (45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)
 * - Preserve routing semantics and aria-current on last item
 */
export default function Breadcrumbs() {
  // Example path; replace with router-derived values in real app.
  const crumbs = ["Home", "Components", "Forms", "Wizard"];
  const last = crumbs.length - 1;

  // Chevron separator tuned to screenshot (16px viewport, 2px stroke)
  const Chevron = ({ ariaHidden = true }) => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden={ariaHidden}
      xmlns="http://www.w3.org/2000/svg"
      className="pointer-events-none"
    >
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  // PUBLIC_INTERFACE
  // A gradient underline controller that toggles with data-underline state on the parent link.
  function GradientUnderline({ parentRef }) {
    const spanRef = useRef(null);
    useEffect(() => {
      const parent = parentRef?.current;
      const node = spanRef.current;
      if (!parent || !node) return;
      const update = () => {
        node.style.opacity = parent.dataset.underline === "on" ? "1" : "0";
      };
      update();
      const mo = new MutationObserver(update);
      mo.observe(parent, { attributes: true, attributeFilter: ["data-underline"] });
      return () => mo.disconnect();
    }, [parentRef]);
    return (
      <span
        ref={spanRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 right-0"
        style={{
          bottom: 0,
          height: 3, // thicker underline for stronger visual weight
          transform: "translateY(4px)", // emulate larger underline-offset while avoiding layout shift
          backgroundImage:
            "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
          opacity: 0,
          transition: "opacity 140ms ease",
        }}
      />
    );
  }

  // PUBLIC_INTERFACE
  // Renders a single crumb with accessible focus ring on links and gradient text on current item.
  function Crumb({ label, isLast }) {
    // Typography tokens per screenshot
    const baseType =
      "text-[13px] sm:text-[14px] leading-[1.35] tracking-[0.02em]"; // tighter leading, slight letter-spacing

    // Link ref to control the gradient underline element
    const linkRef = useRef(null);

    const linkClasses = [
      baseType,
      "font-semibold", // slightly bolder for links in screenshot
      "relative",
      "px-0.5 py-[3px] rounded-[8px]", // pill-y focus target inside row
      "text-[#1E3A8A]", // darker blue (a bit darker than #1E40AF visually)
      // Accessible focus-visible ring with white offset on card surface
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-white",
      "transition-colors",
    ].join(" ");

    const linkStyle = {
      textDecorationLine: "none",
      textDecorationThickness: "3px",
      textDecorationColor: "transparent",
    };

    const currentClasses = [
      "inline-flex items-center",
      "font-extrabold", // current item appears the strongest
      baseType,
    ].join(" ");

    const currentStyle = {
      color: "#1840a0", // fallback
      backgroundImage:
        "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    };

    if (!isLast) {
      return (
        <a
          href="#"
          className={linkClasses}
          style={linkStyle}
          ref={linkRef}
          data-underline="off"
          onMouseEnter={(e) => (e.currentTarget.dataset.underline = "on")}
          onMouseLeave={(e) => (e.currentTarget.dataset.underline = "off")}
          onFocus={(e) => (e.currentTarget.dataset.underline = "on")}
          onBlur={(e) => (e.currentTarget.dataset.underline = "off")}
        >
          <span style={{ textTransform: "uppercase" }}>{label}</span>
          <GradientUnderline parentRef={linkRef} />
        </a>
      );
    }

    return (
      <span aria-current="page" className={currentClasses} style={currentStyle}>
        <span style={{ textTransform: "uppercase" }}>{label}</span>
      </span>
    );
  }

  return (
    <nav aria-label="Breadcrumb">
      {/* Card/pill container: match screenshot’s shape, border, shadow, padding */}
      <div
        className={[
          "bg-white",
          "rounded-full", // pill container per screenshot
          "border border-gray-200",
          "shadow-[0_6px_20px_rgba(0,0,0,0.08)]", // soft but present
          "inline-block", // hug content width
        ].join(" ")}
        style={{
          // Slight internal vertical density; screenshot shows compact pill
          padding: "10px 14px", // ≈ px-3.5 py-2.5 but exact in px
        }}
      >
        <ol className="flex items-center">
          {crumbs.map((label, i) => {
            const isLast = i === last;
            return (
              <li
                key={`${label}-${i}`}
                className="flex items-center"
                style={{
                  // Tighten horizontal rhythm to match screenshot
                  // Space is applied via separator wrapper; links have small internal padding already
                }}
              >
                <Crumb label={label} isLast={isLast} />
                {i < last && (
                  <span
                    className="select-none inline-flex items-center justify-center text-slate-400/80"
                    aria-hidden="true"
                    style={{
                      marginLeft: 10,
                      marginRight: 10, // precise chevron spacing
                    }}
                  >
                    <Chevron />
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
