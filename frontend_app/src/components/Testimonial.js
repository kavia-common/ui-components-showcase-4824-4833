import React from "react";

/**
 * PUBLIC_INTERFACE
 * Testimonial
 * Grid of customer testimonials.
 */
export default function Testimonial() {
  const items = [
    { name: "Alex M.", role: "Product Lead", quote: "Clean and professional UI with delightful details." },
    { name: "Jamie L.", role: "Engineer", quote: "Tailwind makes iteration fast; these components are a great start." },
    { name: "Priya K.", role: "Designer", quote: "Ocean palette feels modern and trustworthy." },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((t, i) => (
        <div key={i} className="surface p-5">
          <p className="text-gray-700">“{t.quote}”</p>
          <div className="mt-4">
            <p className="font-semibold">{t.name}</p>
            <p className="text-sm text-gray-500">{t.role}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
