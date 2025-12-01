import React, { useMemo, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * ContactSection
 * Contact form with name, email, and message fields, live validation, and acknowledgement.
 */
export default function ContactSection() {
  const gradient = useMemo(
    () => "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)",
    []
  );

  const [data, setData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const errors = {};
  if (!data.name.trim()) errors.name = "Name is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = "Valid email required";
  if (data.message.trim().length < 5)
    errors.message = "Message should be at least 5 characters";

  const isValid = Object.keys(errors).length === 0;

  const onChange = (field) => (e) =>
    setData((prev) => ({ ...prev, [field]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    if (isValid) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setData({ name: "", email: "", message: "" });
        setTouched({});
      }, 1200);
    }
  };

  const show = (field) => touched[field] && errors[field];

  return (
    <section aria-label="Contact" className="w-full">
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">
          <span style={{ textTransform: "uppercase" }}>Contact Us</span>
        </h2>
        <p className="text-sm text-slate-600">
          Send us a message and we’ll get back to you shortly.
        </p>
      </header>

      <form className="surface p-5 space-y-3" onSubmit={onSubmit} noValidate>
        <div>
          <label
            htmlFor="contact-name"
            className="text-sm font-medium"
            style={{ textTransform: "uppercase" }}
          >
            Name
          </label>
          <div className="mt-1 rounded-lg gradient-accent">
            <input
              id="contact-name"
              className="gradient-accent-inner w-full rounded-lg border border-gray-200 px-3 py-2 focus-ring"
              value={data.name}
              onChange={onChange("name")}
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              autoComplete="name"
              aria-label="Your full name"
            />
          </div>
          {show("name") && (
            <p className="mt-1 text-xs text-red-600" role="alert">{errors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="contact-email"
            className="text-sm font-medium"
            style={{ textTransform: "uppercase" }}
          >
            Email
          </label>
          <div className="mt-1 rounded-lg gradient-accent">
            <input
              id="contact-email"
              type="email"
              className="gradient-accent-inner w-full rounded-lg border border-gray-200 px-3 py-2 focus-ring"
              value={data.email}
              onChange={onChange("email")}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              autoComplete="email"
              aria-label="Your email address"
            />
          </div>
          {show("email") && (
            <p className="mt-1 text-xs text-red-600" role="alert">{errors.email}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="contact-message"
            className="text-sm font-medium"
            style={{ textTransform: "uppercase" }}
          >
            Message
          </label>
          <div className="mt-1 rounded-lg gradient-accent">
            <textarea
              id="contact-message"
              className="gradient-accent-inner w-full rounded-lg border border-gray-200 px-3 py-2 focus-ring"
              rows={4}
              value={data.message}
              onChange={onChange("message")}
              onBlur={() => setTouched((t) => ({ ...t, message: true }))}
              aria-label="Your message"
            />
          </div>
          {show("message") && (
            <p className="mt-1 text-xs text-red-600" role="alert">{errors.message}</p>
          )}
        </div>

        <div className="pt-1">
          <button
            type="submit"
            className="rounded-lg text-white px-4 py-2 font-semibold hover:opacity-95 focus-ring"
            style={{ background: gradient }}
            aria-label="Send message"
          >
            <span style={{ textTransform: "uppercase" }}>Send</span>
          </button>
          {submitted && (
            <span className="ml-3 text-sm text-green-700" role="status" aria-live="polite">
              Thanks! We’ve received your message.
            </span>
          )}
        </div>
      </form>
    </section>
  );
}
