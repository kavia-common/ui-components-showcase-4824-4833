import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * FormWizard
 * Four-step wizard with free navigation (Next/Back and clickable stepper),
 * deferred validation until submission, and acknowledgement screen.
 *
 * Updates per task:
 * 1) Next and Back always navigate between steps without blocking on validation.
 * 2) Progress step indicators are clickable to jump to any section.
 * 3) Validation is deferred to submission time; Submit is enabled only when all steps are valid and consent checked.
 * 4) Acknowledgement screen is preserved after successful submit.
 */
export default function FormWizard() {
  // Steps metadata (static; stable keys)
  const steps = useMemo(
    () => [
      { key: 1, label: "Account" },
      { key: 2, label: "Profile" },
      { key: 3, label: "Preferences" },
      { key: 4, label: "Review" },
    ],
    []
  );

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Master form data state (controlled raw values)
  const [data, setData] = useState({
    // Step 1 - Account
    username: "",
    password: "",
    confirm: "",
    // Step 2 - Profile
    firstName: "",
    lastName: "",
    email: "",
    // Step 3 - Preferences
    topic: "",
    delivery: "daily", // daily | weekly | monthly
    interest: "",
    // Consent for submission (review)
    consent: false,
  });

  // Errors keyed by field name (used for inline hints; not blocking navigation)
  const [errors, setErrors] = useState({});

  // Track active typing (for small UX niceties; no navigation blocking)
  const isTypingRef = useRef(false);
  const typingStopTimerRef = useRef(null);

  // Focus tracking + refs for focus-stability guard
  const lastFocusedFieldRef = useRef(null);
  // Track the last focus reason: 'mouse', 'keyboard', 'label', 'programmatic', 'unexpected-blur'
  const lastFocusReasonRef = useRef(null);
  const inputRefs = useRef({
    username: null,
    password: null,
    confirm: null,
    firstName: null,
    lastName: null,
    email: null,
    topic: null,
    delivery: null, // radio group first element will be stored
    interest: null,
    consent: null,
  });

  // When editing within Review, track which section is in edit mode (1,2,3) or null
  const [editingSection, setEditingSection] = useState(null);

  // Global keydown handler to prevent Enter in inputs from triggering implicit form submits
  useEffect(() => {
    const preventEnterSubmit = (e) => {
      const target = e.target;
      const tag = target?.tagName?.toLowerCase();
      const isTextInput =
        tag === "input" || tag === "textarea" || tag === "select";
      if (isTextInput && e.key === "Enter") {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", preventEnterSubmit, true);
    return () => window.removeEventListener("keydown", preventEnterSubmit, true);
  }, []);

  // Detect keyboard navigation (Tab/Shift+Tab) and mouse interactions to set focus reason.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Tab") {
        lastFocusReasonRef.current = "keyboard";
      }
    };
    const handleMouseDown = (e) => {
      const target = e.target;
      if (target && target.tagName === "LABEL") {
        lastFocusReasonRef.current = "label";
      } else {
        lastFocusReasonRef.current = "mouse";
      }
    };
    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("mousedown", handleMouseDown, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("mousedown", handleMouseDown, true);
    };
  }, []);

  // Utility: email regex
  const isValidEmail = useCallback(
    (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    []
  );

  // PUBLIC_INTERFACE
  // Step validation: returns errors for a target step. Does not block navigation.
  const getStepErrors = useCallback(
    (targetStep) => {
      const e = {};
      if (targetStep === 1) {
        if (!data.username.trim()) e.username = "Username is required";
        if (data.password.length < 8)
          e.password = "Password must be at least 8 characters";
        if (data.confirm !== data.password)
          e.confirm = "Passwords do not match";
      } else if (targetStep === 2) {
        if (!data.firstName.trim()) e.firstName = "First name is required";
        if (!data.lastName.trim()) e.lastName = "Last name is required";
        if (!isValidEmail(data.email)) e.email = "Enter a valid email address";
      } else if (targetStep === 3) {
        if (!data.topic) e.topic = "Please select a topic";
        if (!["daily", "weekly", "monthly"].includes(data.delivery)) {
          e.delivery = "Select a delivery frequency";
        }
      } else if (targetStep === 4) {
        if (!data.consent)
          e.consent = "You must provide consent before submitting";
      }
      return e;
    },
    [data, isValidEmail]
  );

  // PUBLIC_INTERFACE
  // Full form validity: all steps 1-3 valid and consent checked on step 4.
  const isFormValid = useMemo(() => {
    const s1 = getStepErrors(1);
    const s2 = getStepErrors(2);
    const s3 = getStepErrors(3);
    const s4 = getStepErrors(4);
    return (
      Object.keys(s1).length === 0 &&
      Object.keys(s2).length === 0 &&
      Object.keys(s3).length === 0 &&
      Object.keys(s4).length === 0
    );
  }, [getStepErrors]);

  // Helpers for visual progress only
  const computeS1 = useCallback(() => Object.keys(getStepErrors(1)).length === 0, [getStepErrors]);
  const computeS2 = useCallback(() => Object.keys(getStepErrors(2)).length === 0, [getStepErrors]);
  const computeS3 = useCallback(() => Object.keys(getStepErrors(3)).length === 0, [getStepErrors]);

  const step1Valid = computeS1();
  const step2Valid = computeS2();
  const step3Valid = computeS3();

  const percentComplete = useMemo(() => {
    const completed =
      (step1Valid ? 1 : 0) + (step2Valid ? 1 : 0) + (step3Valid ? 1 : 0);
    return Math.round((completed / 3) * 100);
  }, [step1Valid, step2Valid, step3Valid]);

  // Typing helpers
  const markTyping = useCallback(() => {
    isTypingRef.current = true;
    if (typingStopTimerRef.current) clearTimeout(typingStopTimerRef.current);
    typingStopTimerRef.current = setTimeout(() => {
      isTypingRef.current = false;
    }, 250);
  }, []);

  const onChange = useCallback(
    (field) => (e) => {
      const value =
        e?.target?.type === "checkbox" ? e.target.checked : e?.target?.value ?? e;
      markTyping();
      setData((prev) => ({ ...prev, [field]: value }));
    },
    [markTyping]
  );

  const onFocus = useCallback((field) => (e) => {
    lastFocusedFieldRef.current = field;
    if (!lastFocusReasonRef.current) lastFocusReasonRef.current = "programmatic";
    isTypingRef.current = true;
    if (inputRefs.current[field] == null) {
      inputRefs.current[field] = e?.currentTarget ?? null;
    }
  }, []);

  const onBlurField = useCallback(
    (stepForField) => (e) => {
      if (typingStopTimerRef.current) clearTimeout(typingStopTimerRef.current);
      isTypingRef.current = false;
      const related = e?.relatedTarget;
      const active = document.activeElement;
      const isLegit =
        (related && related instanceof HTMLElement) ||
        (active && active !== document.body && active !== null && active !== undefined);
      if (!isLegit) {
        lastFocusReasonRef.current = "unexpected-blur";
      }
      // Update error hints for the current step only (does not block navigation)
      const eMap = getStepErrors(stepForField);
      setErrors((prev) => ({ ...prev, ...eMap }));
    },
    [getStepErrors]
  );

  // Review edit actions
  const startEdit = useCallback((section) => {
    if (isTypingRef.current) return;
    setEditingSection(section);
    setStep(section);
  }, []);

  const saveFromEdit = useCallback(() => {
    if (isTypingRef.current) return;
    // On Save, just go back to Review; inline hints remain if any
    setEditingSection(null);
    setStep(4);
  }, []);

  // Shared UI tokens
  const headerGradient =
    "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)";

  // Stepper
  const Stepper = useCallback(() => {
    return (
      <div className="mb-5">
        <div className="flex items-center justify-between gap-2">
          {steps.map((s) => {
            const isActive = step === s.key;
            const isComplete =
              s.key < step ||
              (s.key === 1 && step1Valid) ||
              (s.key === 2 && step2Valid) ||
              (s.key === 3 && step3Valid);
            return (
              <button
                key={`stepper-${s.key}`}
                type="button"
                onClick={() => setStep(s.key)}
                className={`flex-1 min-w-0 rounded-lg px-3 py-2 text-left transition-colors border ${
                  isActive
                    ? "bg-white border-blue-500 shadow"
                    : "bg-white/70 border-gray-200 hover:bg-white"
                } focus-ring`}
                aria-current={isActive ? "step" : undefined}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-6 w-6 rounded-full grid place-items-center text-xs font-bold ${
                      isComplete
                        ? "bg-white"
                        : isActive
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                    aria-hidden="true"
                  >
                    {isComplete ? (
                      <span className="text-header-gradient">✓</span>
                    ) : (
                      s.key
                    )}
                  </span>
                  <span
                    className="text-sm font-semibold"
                    style={{ textTransform: "uppercase" }}
                  >
                    {s.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-3">
          <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${percentComplete}%`,
                background: headerGradient,
                transition: "width 220ms ease",
              }}
            />
          </div>
          <div className="mt-1.5 text-right text-xs text-gray-600">
            {percentComplete}% complete
          </div>
        </div>
      </div>
    );
  }, [headerGradient, percentComplete, step, step1Valid, step2Valid, step3Valid, steps]);

  // Input refs setter
  const setInputRef = useCallback((field) => (el) => {
    if (el) inputRefs.current[field] = el;
  }, []);

  // Focus-stability guard: Only auto-refocus on unexpected blur or when element was removed.
  useEffect(() => {
    const last = lastFocusedFieldRef.current;
    if (!last) return;
    const refEl = inputRefs.current[last];
    const active = document.activeElement;

    const refElRemoved = !refEl || !document.body.contains(refEl);

    const legitReasons = new Set(["mouse", "keyboard", "label"]);
    const reason = lastFocusReasonRef.current;

    const activeIsNullish =
      !active || active === document.body || (active && !(active instanceof HTMLElement));

    const shouldRestore =
      (reason === "unexpected-blur" && (activeIsNullish || refElRemoved)) ||
      (refElRemoved && activeIsNullish);

    if (shouldRestore && refEl) {
      try {
        refEl.focus({ preventScroll: true });
        if (typeof refEl.setSelectionRange === "function") {
          const val = refEl.value ?? "";
          refEl.setSelectionRange(val.length, val.length);
        }
      } catch {
        /* noop */
      }
      lastFocusReasonRef.current = null;
    } else if (legitReasons.has(reason)) {
      lastFocusReasonRef.current = null;
    }
  });

  const panelBase = "mt-4";
  const hiddenCls = "hidden";

  // Acknowledgement view after submission
  const Acknowledgement = () => {
    return (
      <div className="surface p-5 text-center">
        <div className="flex items-center justify-center">
          <span
            className="inline-flex items-center justify-center rounded-full h-14 w-14"
            style={{ background: "rgba(24,64,160,0.08)" }}
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="ack-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="10%" stopColor="#af2497" />
                  <stop offset="20%" stopColor="#902d9a" />
                  <stop offset="100%" stopColor="#1840a0" />
                </linearGradient>
              </defs>
              <path
                d="M20 6L9 17l-5-5"
                stroke="url(#ack-grad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
        <h3 className="mt-3 text-lg font-semibold text-slate-900">
          <span style={{ textTransform: "uppercase" }}>Submission received</span>
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Thank you. We have recorded your responses successfully.
        </p>
        <div className="mt-4">
          <button
            type="button"
            className="rounded-full px-5 h-10 text-sm font-semibold text-white focus-ring"
            style={{ background: headerGradient }}
            onClick={() => {
              setSubmitted(false);
              setStep(1);
              setEditingSection(null);
              setErrors({});
              // keep data for demo; could be reset if needed
            }}
          >
            <span style={{ textTransform: "uppercase" }}>Start Again</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <section
      className="mx-auto w-full max-w-lg md:max-w-xl px-4 md:px-6"
      role="region"
      aria-label="Form Wizard"
    >
      {/* Use div instead of form to avoid implicit submit behavior */}
      <div className="surface p-5 md:p-6" role="group" aria-label="Wizard container">
        {!submitted ? (
          <>
            <header className="mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                <span style={{ textTransform: "uppercase" }}>Form Wizard</span>
              </h2>
              <p className="text-sm text-slate-600">
                Navigate freely between steps. Submit becomes available when all required fields are valid and consent is checked.
              </p>
            </header>

            <Stepper />

            <div className={panelBase} aria-live="polite">
              {/* Step 1 */}
              <section
                id="step-panel-1"
                aria-labelledby="step-label-1"
                className={step === 1 ? "" : hiddenCls}
              >
                <section aria-label="Account details" className="space-y-3">
                  <div>
                    <label
                      className="text-sm font-medium"
                      style={{ textTransform: "uppercase" }}
                      htmlFor="fw-username"
                    >
                      Username
                    </label>
                    <div className="mt-1 rounded-lg gradient-accent">
                      <input
                        id="fw-username"
                        ref={setInputRef("username")}
                        className="gradient-accent-inner w-full rounded-lg border border-gray-200 px-3 py-2 focus-ring"
                        value={data.username}
                        onFocus={onFocus("username")}
                        onChange={onChange("username")}
                        onBlur={onBlurField(1)}
                        autoComplete="username"
                      />
                    </div>
                    {errors.username && (
                      <p className="text-xs text-red-600 mt-1">{errors.username}</p>
                    )}
                  </div>

                  <div>
                    <label
                      className="text-sm font-medium"
                      style={{ textTransform: "uppercase" }}
                      htmlFor="fw-password"
                    >
                      Password
                    </label>
                    <div className="mt-1 rounded-lg gradient-accent">
                      <input
                        id="fw-password"
                        ref={setInputRef("password")}
                        className="gradient-accent-inner w-full rounded-lg border border-gray-200 px-3 py-2 focus-ring"
                        value={data.password}
                        onFocus={onFocus("password")}
                        onChange={onChange("password")}
                        onBlur={onBlurField(1)}
                        type="password"
                        autoComplete="new-password"
                      />
                    </div>
                    {errors.password && (
                      <p className="text-xs text-red-600 mt-1">{errors.password}</p>
                    )}
                  </div>

                  <div>
                    <label
                      className="text-sm font-medium"
                      style={{ textTransform: "uppercase" }}
                      htmlFor="fw-confirm"
                    >
                      Confirm Password
                    </label>
                    <div className="mt-1 rounded-lg gradient-accent">
                      <input
                        id="fw-confirm"
                        ref={setInputRef("confirm")}
                        className="gradient-accent-inner w-full rounded-lg border border-gray-200 px-3 py-2 focus-ring"
                        value={data.confirm}
                        onFocus={onFocus("confirm")}
                        onChange={onChange("confirm")}
                        onBlur={onBlurField(1)}
                        type="password"
                        autoComplete="new-password"
                      />
                    </div>
                    {errors.confirm && (
                      <p className="text-xs text-red-600 mt-1">{errors.confirm}</p>
                    )}
                  </div>
                </section>
              </section>

              {/* Step 2 */}
              <section
                id="step-panel-2"
                aria-labelledby="step-label-2"
                className={step === 2 ? "" : hiddenCls}
              >
                <section aria-label="Profile details" className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label
                        className="text-sm font-medium"
                        style={{ textTransform: "uppercase" }}
                        htmlFor="fw-first"
                      >
                        First Name
                      </label>
                      <div className="mt-1 rounded-lg gradient-accent">
                        <input
                          id="fw-first"
                          ref={setInputRef("firstName")}
                          className="gradient-accent-inner w-full rounded-lg border border-gray-200 px-3 py-2 focus-ring"
                          value={data.firstName}
                          onFocus={onFocus("firstName")}
                          onChange={onChange("firstName")}
                          onBlur={onBlurField(2)}
                          autoComplete="given-name"
                        />
                      </div>
                      {errors.firstName && (
                        <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label
                        className="text-sm font-medium"
                        style={{ textTransform: "uppercase" }}
                        htmlFor="fw-last"
                      >
                        Last Name
                      </label>
                      <div className="mt-1 rounded-lg gradient-accent">
                        <input
                          id="fw-last"
                          ref={setInputRef("lastName")}
                          className="gradient-accent-inner w-full rounded-lg border border-gray-200 px-3 py-2 focus-ring"
                          value={data.lastName}
                          onFocus={onFocus("lastName")}
                          onChange={onChange("lastName")}
                          onBlur={onBlurField(2)}
                          autoComplete="family-name"
                        />
                      </div>
                      {errors.lastName && (
                        <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      className="text-sm font-medium"
                      style={{ textTransform: "uppercase" }}
                      htmlFor="fw-email"
                    >
                      Email
                    </label>
                    <div className="mt-1 rounded-lg gradient-accent">
                      <input
                        id="fw-email"
                        ref={setInputRef("email")}
                        className="gradient-accent-inner w-full rounded-lg border border-gray-200 px-3 py-2 focus-ring"
                        value={data.email}
                        onFocus={onFocus("email")}
                        onChange={onChange("email")}
                        onBlur={onBlurField(2)}
                        type="email"
                        autoComplete="email"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                    )}
                  </div>
                </section>
              </section>

              {/* Step 3 */}
              <section
                id="step-panel-3"
                aria-labelledby="step-label-3"
                className={step === 3 ? "" : hiddenCls}
              >
                <section aria-label="Preferences" className="space-y-4">
                  <div>
                    <label
                      className="text-sm font-medium"
                      style={{ textTransform: "uppercase" }}
                      htmlFor="fw-topic"
                    >
                      Topic
                    </label>
                    <div className="mt-1 rounded-lg gradient-accent">
                      <select
                        id="fw-topic"
                        ref={setInputRef("topic")}
                        className="gradient-accent-inner w-full rounded-lg border border-gray-200 px-3 py-2 focus-ring bg-white"
                        value={data.topic}
                        onFocus={onFocus("topic")}
                        onChange={onChange("topic")}
                        onBlur={onBlurField(3)}
                      >
                        <option value="">Select a topic</option>
                        <option value="design">Design</option>
                        <option value="engineering">Engineering</option>
                        <option value="product">Product</option>
                        <option value="marketing">Marketing</option>
                      </select>
                    </div>
                    {errors.topic && (
                      <p className="text-xs text-red-600 mt-1">{errors.topic}</p>
                    )}
                  </div>

                  <fieldset className="rounded-lg border border-gray-200 p-3">
                    <legend
                      className="px-1 text-sm font-semibold"
                      style={{ textTransform: "uppercase" }}
                    >
                      Delivery Frequency
                    </legend>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        { value: "daily", label: "Daily" },
                        { value: "weekly", label: "Weekly" },
                        { value: "monthly", label: "Monthly" },
                      ].map((opt, i) => (
                        <label
                          key={`delivery-${opt.value}`}
                          className={`flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer ${
                            data.delivery === opt.value
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="delivery"
                            value={opt.value}
                            checked={data.delivery === opt.value}
                            onFocus={onFocus("delivery")}
                            onChange={onChange("delivery")}
                            onBlur={onBlurField(3)}
                            className="accent-blue-600"
                            ref={i === 0 ? setInputRef("delivery") : undefined}
                          />
                          <span
                            className="text-sm font-medium"
                            style={{ textTransform: "uppercase" }}
                          >
                            {opt.label}
                          </span>
                        </label>
                      ))}
                    </div>
                    {errors.delivery && (
                      <p className="text-xs text-red-600 mt-2">{errors.delivery}</p>
                    )}
                  </fieldset>

                  <div>
                    <label
                      className="text-sm font-medium"
                      style={{ textTransform: "uppercase" }}
                      htmlFor="fw-interest"
                    >
                      Interest (optional)
                    </label>
                    <div className="mt-1 rounded-lg gradient-accent">
                      <input
                        id="fw-interest"
                        ref={setInputRef("interest")}
                        className="gradient-accent-inner w-full rounded-lg border border-gray-200 px-3 py-2 focus-ring"
                        value={data.interest}
                        onFocus={onFocus("interest")}
                        onChange={onChange("interest")}
                        onBlur={onBlurField(3)}
                        placeholder="Tell us more about your interests"
                      />
                    </div>
                  </div>
                </section>
              </section>

              {/* Step 4 */}
              <section
                id="step-panel-4"
                aria-labelledby="step-label-4"
                className={step === 4 ? "" : hiddenCls}
              >
                <section aria-label="Review" className="space-y-4">
                  <div className="rounded-lg border border-gray-200">
                    <div
                      className="px-3 py-2 rounded-t-lg text-white text-sm font-semibold"
                      style={{ background: headerGradient }}
                    >
                      <span style={{ textTransform: "uppercase" }}>Account</span>
                    </div>
                    <div className="p-3 text-sm text-gray-800">
                      <p>
                        <strong>Username:</strong> {data.username || "—"}
                      </p>
                      <p>
                        <strong>Password:</strong> {data.password ? "••••••••" : "—"}
                      </p>
                      <button
                        type="button"
                        className="mt-2 rounded-full px-4 h-9 text-sm font-semibold text-white focus-ring"
                        style={{ background: headerGradient }}
                        onClick={() => startEdit(1)}
                      >
                        Edit
                      </button>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200">
                    <div
                      className="px-3 py-2 rounded-t-lg text-white text-sm font-semibold"
                      style={{ background: headerGradient }}
                    >
                      <span style={{ textTransform: "uppercase" }}>Profile</span>
                    </div>
                    <div className="p-3 text-sm text-gray-800">
                      <p>
                        <strong>First Name:</strong> {data.firstName || "—"}
                      </p>
                      <p>
                        <strong>Last Name:</strong> {data.lastName || "—"}
                      </p>
                      <p>
                        <strong>Email:</strong> {data.email || "—"}
                      </p>
                      <button
                        type="button"
                        className="mt-2 rounded-full px-4 h-9 text-sm font-semibold text-white focus-ring"
                        style={{ background: headerGradient }}
                        onClick={() => startEdit(2)}
                      >
                        Edit
                      </button>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200">
                    <div
                      className="px-3 py-2 rounded-t-lg text-white text-sm font-semibold"
                      style={{ background: headerGradient }}
                    >
                      <span style={{ textTransform: "uppercase" }}>Preferences</span>
                    </div>
                    <div className="p-3 text-sm text-gray-800">
                      <p>
                        <strong>Topic:</strong> {data.topic || "—"}
                      </p>
                      <p>
                        <strong>Delivery:</strong> {data.delivery || "—"}
                      </p>
                      <p>
                        <strong>Interest:</strong> {data.interest || "—"}
                      </p>
                      <button
                        type="button"
                        className="mt-2 rounded-full px-4 h-9 text-sm font-semibold text-white focus-ring"
                        style={{ background: headerGradient }}
                        onClick={() => startEdit(3)}
                      >
                        Edit
                      </button>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 p-3">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        ref={setInputRef("consent")}
                        checked={data.consent}
                        onFocus={onFocus("consent")}
                        onChange={onChange("consent")}
                        onBlur={onBlurField(4)}
                        aria-describedby="fw-consent-help"
                      />
                      <span className="text-sm" style={{ textTransform: "uppercase" }}>
                        I consent to submit this information
                      </span>
                    </label>
                    <p id="fw-consent-help" className="text-xs text-gray-600 mt-1">
                      Submit is enabled when all steps are valid and consent is checked.
                    </p>
                    {errors.consent && (
                      <p className="text-xs text-red-600 mt-1">{errors.consent}</p>
                    )}
                  </div>
                </section>
              </section>
            </div>

            {/* Footer below panels */}
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-h-[40px]">
                {step > 1 && (
                  <button
                    type="button"
                    className="rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50 focus-ring"
                    onClick={() => setStep((s) => Math.max(1, s - 1))}
                  >
                    <span style={{ textTransform: "uppercase" }}>Back</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {editingSection ? (
                  <>
                    <button
                      type="button"
                      className="rounded-lg bg-secondary text-white px-4 py-2 hover:opacity-95 focus-ring"
                      onClick={saveFromEdit}
                    >
                      <span style={{ textTransform: "uppercase" }}>Save</span>
                    </button>
                    <button
                      type="button"
                      className="rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50 focus-ring"
                      onClick={() => {
                        setEditingSection(null);
                        setStep(4);
                      }}
                    >
                      <span style={{ textTransform: "uppercase" }}>Cancel</span>
                    </button>
                  </>
                ) : step < 4 ? (
                  <button
                    type="button"
                    className="rounded-lg text-white px-4 py-2 hover:opacity-95 focus-ring"
                    onClick={() => setStep((s) => Math.min(4, s + 1))}
                    style={{ background: headerGradient }}
                  >
                    <span style={{ textTransform: "uppercase" }}>Next</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="rounded-lg text-white px-4 py-2 hover:opacity-95 focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={(e) => {
                      if (e && e.preventDefault) e.preventDefault();
                      // On submit, run validation for all steps and consent
                      const e1 = getStepErrors(1);
                      const e2 = getStepErrors(2);
                      const e3 = getStepErrors(3);
                      const e4 = getStepErrors(4);
                      const merged = { ...e1, ...e2, ...e3, ...e4 };
                      setErrors(merged);
                      if (Object.keys(merged).length === 0) {
                        setSubmitted(true);
                      }
                    }}
                    disabled={!isFormValid}
                    style={{ background: headerGradient }}
                  >
                    <span style={{ textTransform: "uppercase" }}>Submit</span>
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <Acknowledgement />
        )}
      </div>
    </section>
  );
}
