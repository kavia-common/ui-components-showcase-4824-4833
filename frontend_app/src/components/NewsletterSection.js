import React, { useMemo, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * NewsletterSection
 * Email signup form with live validation, non-blocking behavior, and success acknowledgement.
 */
export default function NewsletterSection() {
  const gradient = useMemo(
    () => "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)",
    []
  );
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const onSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (isValid) {
      setSubmitted(true);
      setTimeout(() => {
        setEmail("");
        setTouched(false);
      }, 1000);
    }
  };

  return (
    <section aria-label="Newsletter" className="w-full">
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">
          <span style={{ textTransform: "uppercase" }}>Newsletter</span>
        </h2>
        <p className="text-sm text-slate-600">
          Subscribe to get the latest updates on components and patterns.
        </p>
      </header>

      <form
        className="surface p-5"
        onSubmit={onSubmit}
        noValidate
        aria-describedby="newsletter-help"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 gradient-accent rounded-lg">
            <input
              className="gradient-accent-inner w-full rounded-lg border border-gray-200 px-3 py-2 focus-ring"
              type="email"
              aria-label="Email address"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched(true)}
            />
          </div>
          <button
            type="submit"
            className="rounded-lg text-white px-4 py-2 font-semibold hover:opacity-95 focus-ring"
            style={{ background: gradient }}
            aria-label="Subscribe to newsletter"
          >
            <span style={{ textTransform: "uppercase" }}>Subscribe</span>
          </button>
        </div>
        <p id="newsletter-help" className="mt-2 text-xs text-slate-600">
          We respect your privacy. Unsubscribe at any time.
        </p>

        {touched && !isValid && (
          <p className="mt-2 text-xs text-red-600">Enter a valid email address.</p>
        )}
        {submitted && isValid && (
          <p className="mt-2 text-xs text-green-700">Thanks! You’re subscribed.</p>
        )}
      </form>
    </section>
  );
}
