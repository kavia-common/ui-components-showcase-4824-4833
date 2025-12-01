import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * FormWizard
 * Four-step wizard with validation, clickable progress stepper,
 * review with per-section edit/save, and consent-gated submission.
 *
 * Hard stabilization patch:
 * - No dynamic keys on inputs/ancestors; constant ids.
 * - Render ALL step panels persistently and toggle visibility via CSS (hidden) to avoid unmounts.
 * - Stepper isolated with React.memo-equivalent via useCallback + stable deps; moved outside panels subtree.
 * - Controlled inputs bound to raw state; onChange uses functional setState with no transforms.
 * - Handlers memoized with useCallback; no state updates during render.
 * - Validations only onBlur/Next/Save/Submit or trailing debounce after typing stops.
 * - Focus-stability guard (updated): remember lastFocusedField and refocus ONLY when focus unexpectedly vanishes
 *   (active element becomes null) or the previous focused element is removed. Legitimate user-initiated changes
 *   via mouse, Tab/Shift+Tab, or label clicks must not be intercepted.
 * - Keeps Ocean Professional styling and gating rules intact.
 *
 * Manual verification quick path:
 * - Step 1: type in Username → Tab to Password → Tab to Confirm. Focus must not jump back unexpectedly.
 * - Navigate to Step 2: click First/Last/Email fields by mouse; focus should follow normally.
 * - Step 3: click delivery labels or Tab among inputs; focus moves as expected.
 * - Stepper: clickable when not typing; while typing, clicks are ignored without preventDefault.
 * - Review: per-section Edit navigates to step and fields accept focus; validations still onBlur/debounced.
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

  // Errors keyed by field name
  const [errors, setErrors] = useState({});

  // Track active typing state to freeze validation/progress recompute and disable stepper clicks
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

  // Detect keyboard navigation (Tab/Shift+Tab) and mouse interactions to set focus reason.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Tab") {
        lastFocusReasonRef.current = "keyboard";
      }
    };
    const handleMouseDown = (e) => {
      // If clicking a label associated with an input, it will cause programmatic focus on the input; treat as 'label'
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
  const isValidEmail = useCallback((value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), []);

  // PUBLIC_INTERFACE
  // Step validation: runs only when explicitly invoked (onBlur/Next/Save/Submit)
  const validateStep = useCallback(
    (targetStep = step, persistErrors = true) => {
      const e = {};
      if (targetStep === 1) {
        if (!data.username.trim()) e.username = "Username is required";
        if (data.password.length < 8) e.password = "Password must be at least 8 characters";
        if (data.confirm !== data.password) e.confirm = "Passwords do not match";
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
        if (!data.consent) e.consent = "You must provide consent before submitting";
      }
      if (persistErrors) setErrors(e);
      return Object.keys(e).length === 0;
    },
    [data, step, isValidEmail]
  );

  /**
   * Validity snapshot
   * While typing, we serve the last cached snapshot to prevent any recompute during keystrokes.
   */
  const lastValidityRef = useRef({ s1: false, s2: false, s3: false });

  const computeS1 = useCallback(() => {
    const u = data.username;
    const p = data.password;
    const c = data.confirm;
    if (!u || !u.trim()) return false;
    if (!p || p.length < 8) return false;
    if (c !== p) return false;
    return true;
  }, [data.username, data.password, data.confirm]);

  const computeS2 = useCallback(() => {
    const f = data.firstName;
    const l = data.lastName;
    const e = data.email;
    if (!f || !f.trim()) return false;
    if (!l || !l.trim()) return false;
    if (!e) return false;
    return isValidEmail(e);
  }, [data.firstName, data.lastName, data.email, isValidEmail]);

  const computeS3 = useCallback(() => {
    const t = data.topic;
    const d = data.delivery;
    if (!t) return false;
    if (!["daily", "weekly", "monthly"].includes(d)) return false;
    return true;
  }, [data.topic, data.delivery]);

  // Recompute only when not typing; otherwise, serve last snapshot
  const step1Valid = useMemo(() => {
    if (isTypingRef.current) return lastValidityRef.current.s1;
    const v = computeS1();
    lastValidityRef.current.s1 = v;
    return v;
  }, [computeS1, data.username, data.password, data.confirm]);

  const step2Valid = useMemo(() => {
    if (isTypingRef.current) return lastValidityRef.current.s2;
    const v = computeS2();
    lastValidityRef.current.s2 = v;
    return v;
  }, [computeS2, data.firstName, data.lastName, data.email]);

  const step3Valid = useMemo(() => {
    if (isTypingRef.current) return lastValidityRef.current.s3;
    const v = computeS3();
    lastValidityRef.current.s3 = v;
    return v;
  }, [computeS3, data.topic, data.delivery]);

  // Progress percentage from cached validity only
  const percentComplete = useMemo(() => {
    const completed = (step1Valid ? 1 : 0) + (step2Valid ? 1 : 0) + (step3Valid ? 1 : 0);
    return Math.round((completed / 3) * 100);
  }, [step1Valid, step2Valid, step3Valid]);

  // Debounced validation: run only after 300ms of no typing and when no input is focused.
  const pendingFieldRef = useRef(null);
  useEffect(() => {
    if (!pendingFieldRef.current) return;
    if (isTypingRef.current) return;
    const t = setTimeout(() => {
      if (!isTypingRef.current) {
        const target = step;
        validateStep(target, true);
        pendingFieldRef.current = null;
      }
    }, 300);
    return () => clearTimeout(t);
  }, [data, step, validateStep]);

  // Step navigation: backward free; forward requires prior steps valid
  const goToStep = useCallback(
    (target) => {
      if (isTypingRef.current) return; // guard against focus stealing
      if (target < step) {
        setStep(target);
        setEditingSection(null);
        setErrors({});
        return;
      }
      for (let i = 1; i < target; i++) {
        const ok = validateStep(i, true);
        if (!ok) {
          setStep(i);
          return;
        }
      }
      setStep(target);
      setEditingSection(null);
      setErrors({});
    },
    [step, validateStep]
  );

  const next = useCallback(() => {
    if (isTypingRef.current) return;
    if (validateStep(step, true)) setStep((s) => Math.min(4, s + 1));
  }, [step, validateStep]);

  const prev = useCallback(() => {
    if (isTypingRef.current) return;
    setStep((s) => Math.max(1, s - 1));
  }, []);

  // Helpers for field changes (functional updates, raw values)
  const markTyping = useCallback(() => {
    isTypingRef.current = true;
    if (typingStopTimerRef.current) clearTimeout(typingStopTimerRef.current);
    typingStopTimerRef.current = setTimeout(() => {
      isTypingRef.current = false;
    }, 300);
  }, []);

  const onChange = useCallback(
    (field) => (e) => {
      const value = e?.target?.type === "checkbox" ? e.target.checked : e?.target?.value ?? e;
      markTyping();
      setData((prev) => ({ ...prev, [field]: value }));
      pendingFieldRef.current = field; // schedule validation after typing settles
    },
    [markTyping]
  );

  const onFocus = useCallback((field) => (e) => {
    lastFocusedFieldRef.current = field;
    // If reason not set by key/mouse handlers (rare), assume programmatic
    if (!lastFocusReasonRef.current) lastFocusReasonRef.current = "programmatic";
    isTypingRef.current = true; // freeze visuals immediately on focus
    // record ref if not present (esp. radio group/checkbox)
    if (inputRefs.current[field] == null) {
      inputRefs.current[field] = e?.currentTarget ?? null;
    }
  }, []);

  const onBlurField = useCallback(
    (stepForField) => (e) => {
      if (typingStopTimerRef.current) clearTimeout(typingStopTimerRef.current);
      isTypingRef.current = false; // allow recompute
      // Determine if blur was unexpected: activeElement is null/body or was removed
      // We mark reason as 'unexpected-blur' to allow the guard to potentially restore focus.
      // If immediately after this blur a focus event occurs (mouse/tab/label), global listeners will set a legit reason.
      const related = e?.relatedTarget;
      const active = document.activeElement;
      // If focus is going to another valid element (relatedTarget) or activeElement is a focusable input,
      // we consider it legitimate and do not mark unexpected.
      const isLegit =
        (related && (related instanceof HTMLElement)) ||
        (active && active !== document.body && active !== null && active !== undefined);
      if (!isLegit) {
        lastFocusReasonRef.current = "unexpected-blur";
      }
      validateStep(stepForField, true); // validate on blur
    },
    [validateStep]
  );

  // Review edit actions
  const startEdit = useCallback(
    (section) => {
      if (isTypingRef.current) return;
      setEditingSection(section);
      setErrors({});
      setStep(section);
    },
    []
  );

  const saveFromEdit = useCallback(() => {
    if (isTypingRef.current) return;
    const ok = validateStep(step, true);
    if (!ok) return;
    setEditingSection(null);
    setStep(4);
    setErrors({});
  }, [step, validateStep]);

  // Shared UI tokens
  const headerGradient =
    "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)";

  // Stepper isolated (does not live under step content subtree)
  const Stepper = useCallback(() => (
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
              onClick={() => goToStep(s.key)}
              className={`flex-1 min-w-0 rounded-lg px-3 py-2 text-left transition-colors border ${
                isActive ? "bg-white border-blue-500 shadow" : "bg-white/70 border-gray-200 hover:bg-white"
              } focus-ring`}
              aria-current={isActive ? "step" : undefined}
              aria-disabled={isTypingRef.current ? "true" : "false"}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`h-6 w-6 rounded-full grid place-items-center text-xs font-bold ${
                    isComplete ? "bg-green-500 text-white" : isActive ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                  }`}
                  aria-hidden="true"
                >
                  {isComplete ? "✓" : s.key}
                </span>
                <span className="text-sm font-semibold" style={{ textTransform: "uppercase" }}>
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
        <div className="mt-1.5 text-right text-xs text-gray-600">{percentComplete}% complete</div>
      </div>
    </div>
  ), [goToStep, headerGradient, percentComplete, step, step1Valid, step2Valid, step3Valid, steps]);

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

    // Determine if the previously focused element still exists
    const refElRemoved = !refEl || !document.body.contains(refEl);

    // If user initiated a legitimate focus change by mouse/tab/label or programmatic due to label click,
    // do not override their action.
    const legitReasons = new Set(["mouse", "keyboard", "label"]);
    const reason = lastFocusReasonRef.current;

    const activeIsNullish =
      !active || active === document.body || (active && !(active instanceof HTMLElement));

    const shouldRestore =
      (reason === "unexpected-blur" && (activeIsNullish || refElRemoved)) || // unexpected blur or nothing focused
      (refElRemoved && activeIsNullish); // element removed and nothing else focused

    if (shouldRestore && refEl) {
      // restore focus quietly
      try {
        refEl.focus({ preventScroll: true });
        if (typeof refEl.setSelectionRange === "function") {
          const val = refEl.value ?? "";
          refEl.setSelectionRange(val.length, val.length);
        }
      } catch {
        /* noop */
      }
      // Reset reason after auto-focus to avoid loops
      lastFocusReasonRef.current = null;
    } else if (legitReasons.has(reason)) {
      // On legit reasons, clear so future checks don't misinterpret
      lastFocusReasonRef.current = null;
    }
  });

  // PUBLIC_INTERFACE
  // Only enable Next if current step valid (uses cached snapshot; no recompute while typing)
  const canProceed = useCallback(() => {
    if (step === 1) return step1Valid;
    if (step === 2) return step2Valid;
    if (step === 3) return step3Valid;
    return true;
  }, [step, step1Valid, step2Valid, step3Valid]);

  // Console-based typing harness (disabled by default)
  useEffect(() => {
    const ENABLE_HARNESS = false;
    if (!ENABLE_HARNESS) return;
    const simulateTyping = async () => {
      const wait = (ms) => new Promise((r) => setTimeout(r, ms));
      const type = async (field, text) => {
        for (const ch of text) {
          setData((prev) => ({ ...prev, [field]: (prev[field] || "") + ch }));
          await wait(20);
        }
      };
      await type("username", "test user full sentence");
      await type("password", "password1234");
      await type("confirm", "password1234");
      setStep(2);
      await wait(50);
      await type("firstName", "Jane Continuous");
      await type("lastName", "Doe Typing");
      await type("email", "jane.doe@example.com");
      setStep(3);
      await wait(50);
      setData((prev) => ({ ...prev, topic: "engineering" }));
      await type("interest", "I love building smooth UIs without lag.");
      setStep(4);
    };
    simulateTyping();
  }, []);

  // Shared classes for panel visibility: render all, toggle hidden via CSS
  const panelBase = "mt-4";
  const hiddenCls = "hidden";

  return (
    <section className="surface p-4 md:p-5" role="region" aria-label="Form Wizard">
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">
          <span style={{ textTransform: "uppercase" }}>Form Wizard</span>
        </h2>
        <p className="text-sm text-slate-600">
          Complete the steps below. You can click the step labels to jump back and edit.
        </p>
      </header>

      {/* Stepper kept outside of step content subtree */}
      <Stepper />

      {/* Persistently mounted panels to prevent remounts or focus loss */}
      <div className={panelBase} aria-live="polite">
        <section
          id="step-panel-1"
          aria-labelledby="step-label-1"
          className={step === 1 ? "" : hiddenCls}
        >
          {/* Step 1 */}
          <section aria-label="Account details" className="space-y-3">
            <div>
              <label className="text-sm font-medium" style={{ textTransform: "uppercase" }} htmlFor="fw-username">
                Username
              </label>
              <input
                id="fw-username"
                ref={setInputRef("username")}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus-ring"
                value={data.username}
                onFocus={onFocus("username")}
                onChange={onChange("username")}
                onBlur={onBlurField(1)}
                autoComplete="username"
              />
              {errors.username && <p className="text-xs text-red-600 mt-1">{errors.username}</p>}
            </div>

            <div>
              <label className="text-sm font-medium" style={{ textTransform: "uppercase" }} htmlFor="fw-password">
                Password
              </label>
              <input
                id="fw-password"
                ref={setInputRef("password")}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus-ring"
                value={data.password}
                onFocus={onFocus("password")}
                onChange={onChange("password")}
                onBlur={onBlurField(1)}
                type="password"
                autoComplete="new-password"
              />
              {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="text-sm font-medium" style={{ textTransform: "uppercase" }} htmlFor="fw-confirm">
                Confirm Password
              </label>
              <input
                id="fw-confirm"
                ref={setInputRef("confirm")}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus-ring"
                value={data.confirm}
                onFocus={onFocus("confirm")}
                onChange={onChange("confirm")}
                onBlur={onBlurField(1)}
                type="password"
                autoComplete="new-password"
              />
              {errors.confirm && <p className="text-xs text-red-600 mt-1">{errors.confirm}</p>}
            </div>
          </section>
        </section>

        <section
          id="step-panel-2"
          aria-labelledby="step-label-2"
          className={step === 2 ? "" : hiddenCls}
        >
          {/* Step 2 */}
          <section aria-label="Profile details" className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium" style={{ textTransform: "uppercase" }} htmlFor="fw-first">
                  First Name
                </label>
                <input
                  id="fw-first"
                  ref={setInputRef("firstName")}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus-ring"
                  value={data.firstName}
                  onFocus={onFocus("firstName")}
                  onChange={onChange("firstName")}
                  onBlur={onBlurField(2)}
                  autoComplete="given-name"
                />
                {errors.firstName && <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="text-sm font-medium" style={{ textTransform: "uppercase" }} htmlFor="fw-last">
                  Last Name
                </label>
                <input
                  id="fw-last"
                  ref={setInputRef("lastName")}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus-ring"
                  value={data.lastName}
                  onFocus={onFocus("lastName")}
                  onChange={onChange("lastName")}
                  onBlur={onBlurField(2)}
                  autoComplete="family-name"
                />
                {errors.lastName && <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium" style={{ textTransform: "uppercase" }} htmlFor="fw-email">
                Email
              </label>
              <input
                id="fw-email"
                ref={setInputRef("email")}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus-ring"
                value={data.email}
                onFocus={onFocus("email")}
                onChange={onChange("email")}
                onBlur={onBlurField(2)}
                type="email"
                autoComplete="email"
              />
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
            </div>
          </section>
        </section>

        <section
          id="step-panel-3"
          aria-labelledby="step-label-3"
          className={step === 3 ? "" : hiddenCls}
        >
          {/* Step 3 */}
          <section aria-label="Preferences" className="space-y-4">
            <div>
              <label className="text-sm font-medium" style={{ textTransform: "uppercase" }} htmlFor="fw-topic">
                Topic
              </label>
              <select
                id="fw-topic"
                ref={setInputRef("topic")}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus-ring bg-white"
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
              {errors.topic && <p className="text-xs text-red-600 mt-1">{errors.topic}</p>}
            </div>

            <fieldset className="rounded-lg border border-gray-200 p-3">
              <legend className="px-1 text-sm font-semibold" style={{ textTransform: "uppercase" }}>
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
                      data.delivery === opt.value ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:bg-gray-50"
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
                    <span className="text-sm font-medium" style={{ textTransform: "uppercase" }}>
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
              {errors.delivery && <p className="text-xs text-red-600 mt-2">{errors.delivery}</p>}
            </fieldset>

            <div>
              <label className="text-sm font-medium" style={{ textTransform: "uppercase" }} htmlFor="fw-interest">
                Interest (optional)
              </label>
              <input
                id="fw-interest"
                ref={setInputRef("interest")}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus-ring"
                value={data.interest}
                onFocus={onFocus("interest")}
                onChange={onChange("interest")}
                onBlur={onBlurField(3)}
                placeholder="Tell us more about your interests"
              />
            </div>
          </section>
        </section>

        <section
          id="step-panel-4"
          aria-labelledby="step-label-4"
          className={step === 4 ? "" : hiddenCls}
        >
          {/* Review */}
          <section aria-label="Review" className="space-y-4">
            <div className="rounded-lg border border-gray-200">
              <div className="px-3 py-2 rounded-t-lg text-white text-sm font-semibold" style={{ background: headerGradient }}>
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
              <div className="px-3 py-2 rounded-t-lg text-white text-sm font-semibold" style={{ background: headerGradient }}>
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
              <div className="px-3 py-2 rounded-t-lg text-white text-sm font-semibold" style={{ background: headerGradient }}>
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
              </label>
              <div className="mt-1">
                <span className="text-sm" style={{ textTransform: "uppercase" }}>
                  I consent to submit this information
                </span>
              </div>
              <p id="fw-consent-help" className="text-xs text-gray-600 mt-1">
                Submitting is enabled only when consent is checked.
              </p>
              {errors.consent && <p className="text-xs text-red-600 mt-1">{errors.consent}</p>}
            </div>
          </section>
        </section>
      </div>

      {/* Footer below panels */}
      <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          className="rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50 focus-ring"
          onClick={prev}
          disabled={step === 1}
        >
          <span style={{ textTransform: "uppercase" }}>Back</span>
        </button>

        <div className="flex items-center gap-2">
          {editingSection ? (
            <>
              <button className="rounded-lg bg-secondary text-white px-4 py-2 hover:opacity-95 focus-ring" onClick={saveFromEdit}>
                <span style={{ textTransform: "uppercase" }}>Save</span>
              </button>
              <button
                className="rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50 focus-ring"
                onClick={() => {
                  setEditingSection(null);
                  setStep(4);
                  setErrors({});
                }}
              >
                <span style={{ textTransform: "uppercase" }}>Cancel</span>
              </button>
            </>
          ) : step < 4 ? (
            <button
              className="rounded-lg bg-primary text-white px-4 py-2 hover:opacity-95 focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={next}
              disabled={!canProceed()}
            >
              <span style={{ textTransform: "uppercase" }}>Next</span>
            </button>
          ) : (
            <button
              className="rounded-lg bg-green-600 text-white px-4 py-2 hover:opacity-95 focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => {
                if (validateStep(4, true)) {
                  alert("Submitted! Thank you.");
                }
              }}
              disabled={!data.consent}
            >
              <span style={{ textTransform: "uppercase" }}>Submit</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
