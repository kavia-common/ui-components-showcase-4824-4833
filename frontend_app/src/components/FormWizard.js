import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * FormWizard
 * Four-step wizard with free navigation (Next/Back and clickable stepper),
 * live validation with touched/dirty tracking, and acknowledgement screen.
 *
 * Validation behavior:
 * - Show error messages only after a field is interacted with (touched or dirty).
 * - Errors disappear immediately when the value becomes valid (including cross-field dependencies).
 * - Next/Back always navigate; Submit is disabled until all required fields are valid.
 * - Acknowledgement screen remains after successful submit.
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

  // Track touched/dirty per field to control when to show errors
  const [touched, setTouched] = useState({});
  const [dirty, setDirty] = useState({});

  // Errors keyed by field name; recomputed live and merged into this state for inline display
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
  // Step validation: returns errors for a target step (pure, no side effects).
  const getStepErrors = useCallback(
    (targetStep, values = data) => {
      const e = {};
      if (targetStep === 1) {
        if (!values.username.trim()) e.username = "Username is required";
        if (values.password.length < 8)
          e.password = "Password must be at least 8 characters";
        if (values.confirm !== values.password)
          e.confirm = "Passwords do not match";
      } else if (targetStep === 2) {
        if (!values.firstName.trim()) e.firstName = "First name is required";
        if (!values.lastName.trim()) e.lastName = "Last name is required";
        if (!isValidEmail(values.email)) e.email = "Enter a valid email address";
      } else if (targetStep === 3) {
        if (!values.topic) e.topic = "Please select a topic";
        if (!["daily", "weekly", "monthly"].includes(values.delivery)) {
          e.delivery = "Select a delivery frequency";
        }
      } else if (targetStep === 4) {
        if (!values.consent)
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

  // Keep errors state synchronized to the latest values so messages clear immediately after validity.
  useEffect(() => {
    const e1 = getStepErrors(1, data);
    const e2 = getStepErrors(2, data);
    const e3 = getStepErrors(3, data);
    const e4 = getStepErrors(4, data);
    const merged = { ...e1, ...e2, ...e3, ...e4 };
    setErrors(merged);
  }, [data, getStepErrors]);

  // Helpers for progress visuals
  const computeS1 = useCallback(
    () => Object.keys(getStepErrors(1)).length === 0,
    [getStepErrors]
  );
  const computeS2 = useCallback(
    () => Object.keys(getStepErrors(2)).length === 0,
    [getStepErrors]
  );
  const computeS3 = useCallback(
    () => Object.keys(getStepErrors(3)).length === 0,
    [getStepErrors]
  );

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

  // Set field touched state
  const markTouched = useCallback((field) => {
    setTouched((prev) => (prev[field] ? prev : { ...prev, [field]: true }));
  }, []);

  // Update dirty state (field considered dirty after first change)
  const markDirty = useCallback((field) => {
    setDirty((prev) => (prev[field] ? prev : { ...prev, [field]: true }));
  }, []);

  // PUBLIC_INTERFACE
  // Live onChange handler with validation updates and dirty tracking
  const onChange = useCallback(
    (field) => (e) => {
      const value =
        e?.target?.type === "checkbox" ? e.target.checked : e?.target?.value ?? e;
      markTyping();
      markDirty(field);
      setData((prev) => {
        const next = { ...prev, [field]: value };
        return next;
      });
    },
    [markDirty, markTyping]
  );

  const onFocus = useCallback(
    (field) => (e) => {
      lastFocusedFieldRef.current = field;
      if (!lastFocusReasonRef.current)
        lastFocusReasonRef.current = "programmatic";
      isTypingRef.current = true;
      if (inputRefs.current[field] == null) {
        inputRefs.current[field] = e?.currentTarget ?? null;
      }
      // Mark touched on focus so first interaction allows error visibility
      markTouched(field);
    },
    [markTouched]
  );

  const onBlurField = useCallback(
    (stepForField) => (e) => {
      if (typingStopTimerRef.current) clearTimeout(typingStopTimerRef.current);
      isTypingRef.current = false;
      const related = e?.relatedTarget;
      const active = document.activeElement;
      const isLegit =
        (related && related instanceof HTMLElement) ||
        (active &&
          active !== document.body &&
          active !== null &&
          active !== undefined);
      if (!isLegit) {
        lastFocusReasonRef.current = "unexpected-blur";
      }
      // On blur, we already keep errors synced via useEffect([data]).
      // This handler remains to set focus reason and permit step-scoped recompute if needed later.
    },
    []
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

  // PUBLIC_INTERFACE
  // Accessible required label helper: appends * and adds aria-required + title on the associated control.
  const RequiredMark = ({ children }) => (
    <span>
      <span>{children}</span>
      <span
        aria-hidden="true"
        className="text-red-600 ml-0.5"
        title="Required"
      >
        *
      </span>
    </span>
  );

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
                onClick={(e) => {
                  if (e && e.preventDefault) e.preventDefault();
                  setStep(s.key);
                }}
                className={`flex-1 min-w-0 rounded-lg px-3 py-2 text-left transition-colors border ${
                  isActive
                    ? "bg-white border-blue-500 shadow"
                    : "bg-white/70 border-gray-200 hover:bg-white"
                } focus-ring`}
                aria-current={isActive ? "step" : undefined}
                aria-label={s.label}
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
  }, [
    headerGradient,
    percentComplete,
    step,
    step1Valid,
    step2Valid,
    step3Valid,
    steps,
  ]);

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
      !active ||
      active === document.body ||
      (active && !(active instanceof HTMLElement));

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
            <svg
              viewBox="0 0 24 24"
              width="28"
              height="28"
              fill="none"
              aria-hidden="true"
            >
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

  // Helper to decide if an error should be visible (only after interaction)
  const shouldShowError = useCallback(
    (field) => !!errors[field] && (touched[field] || dirty[field]),
    [dirty, errors, touched]
  );

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
                      <RequiredMark>Username</RequiredMark>
                    </label>
                    <div className="mt-1 rounded-lg gradient-accent">
                      <input
                        id="fw-username"
                        ref={setInputRef("username")}
                        className="gradient-accent-inner w-full rounded-lg border border-gray-200 px-3 py-2 focus-ring"
                        value={data.username}
                        onFocus={onFocus("username")}
                        onChange={onChange("username")}
                        onBlur={(e) => {
                          onBlurField(1)(e);
                          markTouched("username");
                        }}
                        autoComplete="username"
                        aria-required="true"
                        title="Required"
                      />
                    </div>
                    {shouldShowError("username") && (
                      <p className="text-xs text-red-600 mt-1">{errors.username}</p>
                    )}
                  </div>

                  <div>
                    <label
                      className="text-sm font-medium"
                      style={{ textTransform: "uppercase" }}
                      htmlFor="fw-password"
                    >
                      <RequiredMark>Password</RequiredMark>
                    </label>
                    <div className="mt-1 rounded-lg gradient-accent">
                      <input
                        id="fw-password"
                        ref={setInputRef("password")}
                        className="gradient-accent-inner w-full rounded-lg border border-gray-200 px-3 py-2 focus-ring"
                        value={data.password}
                        onFocus={onFocus("password")}
                        onChange={onChange("password")}
                        onBlur={(e) => {
                          onBlurField(1)(e);
                          markTouched("password");
                        }}
                        type="password"
                        autoComplete="new-password"
                        aria-required="true"
                        title="Required"
                      />
                    </div>
                    {shouldShowError("password") && (
                      <p className="text-xs text-red-600 mt-1">{errors.password}</p>
                    )}
                  </div>

                  <div>
                    <label
                      className="text-sm font-medium"
                      style={{ textTransform: "uppercase" }}
                      htmlFor="fw-confirm"
                    >
                      <RequiredMark>Confirm Password</RequiredMark>
                    </label>
                    <div className="mt-1 rounded-lg gradient-accent">
                      <input
                        id="fw-confirm"
                        ref={setInputRef("confirm")}
                        className="gradient-accent-inner w-full rounded-lg border border-gray-200 px-3 py-2 focus-ring"
                        value={data.confirm}
                        onFocus={onFocus("confirm")}
                        onChange={onChange("confirm")}
                        onBlur={(e) => {
                          onBlurField(1)(e);
                          markTouched("confirm");
                        }}
                        type="password"
                        autoComplete="new-password"
                        aria-required="true"
                        title="Required"
                      />
                    </div>
                    {shouldShowError("confirm") && (
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
                        <RequiredMark>First Name</RequiredMark>
                      </label>
                      <div className="mt-1 rounded-lg gradient-accent">
                        <input
                          id="fw-first"
                          ref={setInputRef("firstName")}
                          className="gradient-accent-inner w-full rounded-lg border border-gray-200 px-3 py-2 focus-ring"
                          value={data.firstName}
                          onFocus={onFocus("firstName")}
                          onChange={onChange("firstName")}
                          onBlur={(e) => {
                            onBlurField(2)(e);
                            markTouched("firstName");
                          }}
                          autoComplete="given-name"
                          aria-required="true"
                          title="Required"
                        />
                      </div>
                      {shouldShowError("firstName") && (
                        <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label
                        className="text-sm font-medium"
                        style={{ textTransform: "uppercase" }}
                        htmlFor="fw-last"
                      >
                        <RequiredMark>Last Name</RequiredMark>
                      </label>
                      <div className="mt-1 rounded-lg gradient-accent">
                        <input
                          id="fw-last"
                          ref={setInputRef("lastName")}
                          className="gradient-accent-inner w-full rounded-lg border border-gray-200 px-3 py-2 focus-ring"
                          value={data.lastName}
                          onFocus={onFocus("lastName")}
                          onChange={onChange("lastName")}
                          onBlur={(e) => {
                            onBlurField(2)(e);
                            markTouched("lastName");
                          }}
                          autoComplete="family-name"
                          aria-required="true"
                          title="Required"
                        />
                      </div>
                      {shouldShowError("lastName") && (
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
                      <RequiredMark>Email</RequiredMark>
                    </label>
                    <div className="mt-1 rounded-lg gradient-accent">
                      <input
                        id="fw-email"
                        ref={setInputRef("email")}
                        className="gradient-accent-inner w-full rounded-lg border border-gray-200 px-3 py-2 focus-ring"
                        value={data.email}
                        onFocus={onFocus("email")}
                        onChange={onChange("email")}
                        onBlur={(e) => {
                          onBlurField(2)(e);
                          markTouched("email");
                        }}
                        type="email"
                        autoComplete="email"
                        aria-required="true"
                        title="Required"
                      />
                    </div>
                    {shouldShowError("email") && (
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
                      <RequiredMark>Topic</RequiredMark>
                    </label>
                    <div className="mt-1 rounded-lg gradient-accent">
                      <select
                        id="fw-topic"
                        ref={setInputRef("topic")}
                        className="gradient-accent-inner w-full rounded-lg border border-gray-200 px-3 py-2 focus-ring bg-white"
                        value={data.topic}
                        onFocus={onFocus("topic")}
                        onChange={onChange("topic")}
                        onBlur={(e) => {
                          onBlurField(3)(e);
                          markTouched("topic");
                        }}
                        aria-required="true"
                        title="Required"
                      >
                        <option value="">Select a topic</option>
                        <option value="design">Design</option>
                        <option value="engineering">Engineering</option>
                        <option value="product">Product</option>
                        <option value="marketing">Marketing</option>
                      </select>
                    </div>
                    {shouldShowError("topic") && (
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
                            onChange={(e) => {
                              onChange("delivery")(e);
                              markTouched("delivery");
                            }}
                            onBlur={(e) => {
                              onBlurField(3)(e);
                              markTouched("delivery");
                            }}
                            className="accent-blue-600"
                            ref={i === 0 ? setInputRef("delivery") : undefined}
                            aria-required="true"
                            title="Required"
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
                    {shouldShowError("delivery") && (
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
                        onBlur={(e) => {
                          onBlurField(3)(e);
                          markTouched("interest");
                        }}
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
                        <strong>Password:</strong>{" "}
                        {data.password ? "••••••••" : "—"}
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
                      <span style={{ textTransform: "uppercase" }}>
                        Preferences
                      </span>
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
                        onChange={(e) => {
                          onChange("consent")(e);
                          markTouched("consent");
                        }}
                        onBlur={(e) => {
                          onBlurField(4)(e);
                          markTouched("consent");
                        }}
                        aria-describedby="fw-consent-help"
                      />
                      <span
                        className="text-sm"
                        style={{ textTransform: "uppercase" }}
                      >
                        I consent to submit this information
                      </span>
                    </label>
                    <p
                      id="fw-consent-help"
                      className="text-xs text-gray-600 mt-1"
                    >
                      Submit is enabled when all steps are valid and consent is
                      checked.
                    </p>
                    {shouldShowError("consent") && (
                      <p className="text-xs text-red-600 mt-1">
                        {errors.consent}
                      </p>
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
                    onClick={(e) => {
                      if (e && e.preventDefault) e.preventDefault();
                      setStep((s) => Math.max(1, s - 1));
                    }}
                    aria-label="Back"
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
                      onClick={(e) => {
                        // Prevent any default form actions if embedded elsewhere
                        if (e && e.preventDefault) e.preventDefault();
                        saveFromEdit();
                      }}
                    >
                      <span style={{ textTransform: "uppercase" }}>Save</span>
                    </button>
                    <button
                      type="button"
                      className="rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50 focus-ring"
                      onClick={(e) => {
                        if (e && e.preventDefault) e.preventDefault();
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
                    onClick={(e) => {
                      // Ensure no implicit submit occurs on Enter keypresses in inputs
                      if (e && e.preventDefault) e.preventDefault();
                      setStep((s) => Math.min(4, s + 1));
                    }}
                    style={{ background: headerGradient }}
                    aria-label="Next"
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
                      } else {
                        // Mark all fields touched to reveal any remaining invalids at submit time
                        setTouched((prev) => ({
                          ...prev,
                          username: true,
                          password: true,
                          confirm: true,
                          firstName: true,
                          lastName: true,
                          email: true,
                          topic: true,
                          delivery: true,
                          consent: true,
                        }));
                      }
                    }}
                    disabled={!isFormValid}
                    style={{ background: headerGradient }}
                    aria-label="Submit"
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
