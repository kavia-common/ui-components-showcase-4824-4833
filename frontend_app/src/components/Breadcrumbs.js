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

  // Chevron separator tuned to screenshot (precise: 14x14-16x16 area, 2px stroke, neutral color)
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
  // A gradient underline bar that appears on hover/focus of a link without causing layout shift.
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
          height: 3.5, // slightly thicker as per latest screenshot
          transform: "translateY(5px)", // emulate underline offset precisely
          backgroundImage:
            "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
          opacity: 0,
          transition: "opacity 140ms ease",
          borderRadius: 2,
        }}
      />
    );
  }

  // PUBLIC_INTERFACE
  // Single crumb renderer: links have darker color + thick gradient underline; current item has gradient-filled text.
  function Crumb({ label, isLast }) {
    // Base typography adjusted to match screenshot (compact, uppercase labels)
    const baseType =
      "text-[13px] sm:text-[14px] leading-[1.3] tracking-[0.02em]";

    const linkRef = useRef(null);

    const linkClasses = [
      baseType,
      "font-semibold",
      "relative",
      "px-0.5 py-[3px] rounded-[8px]",
      // darker link color than before for stricter fidelity
      "text-[#18307A]",
      // visible focus ring with offset matching white pill container
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-white",
      "transition-colors",
    ].join(" ");

    const linkStyle = {
      textDecorationLine: "none",
      textDecorationThickness: "4px",
      textDecorationColor: "transparent",
    };

    const currentClasses = [
      "inline-flex items-center",
      "font-extrabold",
      baseType,
    ].join(" ");

    const currentStyle = {
      color: "#1840a0", // fallback color if gradient text not supported
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
      {/* Pill/card container with exact border, radius, shadow, and padding per screenshot */}
      <div
        className={[
          "bg-white",
          "rounded-full",
          "border border-gray-200",
          "shadow-[0_8px_22px_rgba(0,0,0,0.08),_0_1px_2px_rgba(0,0,0,0.04)]",
          "inline-block",
        ].join(" ")}
        style={{
          padding: "9px 16px", // precise internal density observed
        }}
      >
        <ol className="flex items-center">
          {crumbs.map((label, i) => {
            const isLast = i === last;
            return (
              <li key={`${label}-${i}`} className="flex items-center">
                <Crumb label={label} isLast={isLast} />
                {i < last && (
                  <span
                    className="select-none inline-flex items-center justify-center text-slate-400"
                    aria-hidden="true"
                    style={{
                      marginLeft: 12, // exact chevron spacing
                      marginRight: 12,
                      color: "rgba(100,116,139,0.9)", // slightly darker neutral
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
