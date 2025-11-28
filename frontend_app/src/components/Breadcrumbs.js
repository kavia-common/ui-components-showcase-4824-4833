import React from "react";

/**
 * PUBLIC_INTERFACE
 * Breadcrumbs
 * Simple breadcrumb trail with separators.
 */
export default function Breadcrumbs() {
  const crumbs = ["Home", "Components", "Forms", "Wizard"];
  return (
    <nav className="surface px-4 py-3" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 text-sm text-gray-600">
        {crumbs.map((c, idx) => (
          <li key={c} className="flex items-center">
            <a href="#" className={`hover:text-blue-600 ${idx === crumbs.length - 1 ? "text-gray-900 font-medium" : ""}`}>
              {c}
            </a>
            {idx < crumbs.length - 1 && <span className="mx-2 text-gray-300">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
