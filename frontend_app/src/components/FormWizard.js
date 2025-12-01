import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * FormWizard
 * Four-step wizard with validation, clickable progress stepper,
 * review with per-section edit/save, and consent-gated submission.
 *
 * Stabilization updates:
 * - Freeze validation, progress, and stepper interactions while the user is typing (isTyping flag via focus/blur and debounced timer).
 * - Do not perform heavy validations during render; validate only onBlur or after a 250ms debounce when typing stops.
 * - All inputs are fully controlled with raw state; onChange uses functional updates and does not trim/format values.
 * - Remove any value text-transform from inputs (labels may keep uppercase).
 * - Prevent stepper clicks while isTyping is true.
 */
export default function FormWizard() {
  // Steps metadata
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

  // Track focused field to better manage onBlur validations
  const focusedFieldRef = useRef(null);

  // When editing within Review, track which section is in edit mode (1,2,3) or null
  const [editingSection, setEditingSection] = useState(null);

  // Utility: email regex
  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  // Validate current step (or a specific step for Review edit flow)
  // PUBLIC_INTERFACE
  const validateStep = (targetStep = step, persistErrors = true) => {
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
  };

  /**
   * Lightweight per-step validity used only for visuals and Next gating.
   * IMPORTANT: While isTyping is true, freeze derived validity (return previous snapshot)
   * to prevent progress/stepper thrash during keystrokes.
   */
  const lastValidityRef = useRef({ s1: false, s2: false, s3: false });
  const computeS1 = () => {
    const u = data.username;
    const p = data.password;
    const c = data.confirm;
    if (!u || !u.trim()) return false;
    if (!p || p.length < 8) return false;
    if (c !== p) return false;
    return true;
  };
  const computeS2 = () => {
    const f = data.firstName;
    const l = data.lastName;
    const e = data.email;
    if (!f || !f.trim()) return false;
    if (!l || !l.trim()) return false;
    if (!e) return false;
    return isValidEmail(e);
  };
  const computeS3 = () => {
    const t = data.topic;
    const d = data.delivery;
    if (!t) return false;
    if (!["daily", "weekly", "monthly"].includes(d)) return false;
    return true;
  };

  // Recompute only when not typing; otherwise, serve last snapshot
  const step1Valid = useMemo(() => {
    if (isTypingRef.current) return lastValidityRef.current.s1;
    const v = computeS1();
    lastValidityRef.current.s1 = v;
    return v;
  }, [data.username, data.password, data.confirm]);
  const step2Valid = useMemo(() => {
    if (isTypingRef.current) return lastValidityRef.current.s2;
    const v = computeS2();
    lastValidityRef.current.s2 = v;
    return v;
  }, [data.firstName, data.lastName, data.email]);
  const step3Valid = useMemo(() => {
    if (isTypingRef.current) return lastValidityRef.current.s3;
    const v = computeS3();
    lastValidityRef.current.s3 = v;
    return v;
  }, [data.topic, data.delivery]);

  const percentComplete = useMemo(() => {
    const completed = (step1Valid ? 1 : 0) + (step2Valid ? 1 : 0) + (step3Valid ? 1 : 0);
    return Math.round((completed / 3) * 100);
  }, [step1Valid, step2Valid, step3Valid]);

  // Debounced validation: run only after 250ms of no typing and when no input is focused.
  const pendingFieldRef = useRef(null);
  useEffect(() => {
    if (!pendingFieldRef.current) return;
    // If still typing, do nothing yet.
    if (isTypingRef.current) return;
    const t = setTimeout(() => {
      if (!isTypingRef.current) {
        const target = step;
        validateStep(target, true);
        pendingFieldRef.current = null;
      }
    }, 250);
    return () => clearTimeout(t);
  }, [data, step]);

  // Step navigation: only allow jumping backwards freely; jumping forward requires prior steps valid
  const goToStep = (target) => {
    // If user is actively typing, ignore clicks to avoid focus stealing
    if (isTypingRef.current) return;
    if (target < step) {
      setStep(target);
      setEditingSection(null);
      setErrors({});
      return;
    }
    // For forward jumps, ensure all steps before target are valid
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
  };

  const next = () => {
    if (isTypingRef.current) return; // Do not proceed while typing
    if (validateStep(step, true)) setStep((s) => Math.min(4, s + 1));
  };
  const prev = () => {
    if (isTypingRef.current) return;
    setStep((s) => Math.max(1, s - 1));
  };

  // Helpers for field changes (functional updates, raw values)
  const markTyping = () => {
    isTypingRef.current = true;
    if (typingStopTimerRef.current) clearTimeout(typingStopTimerRef.current);
    typingStopTimerRef.current = setTimeout(() => {
      isTypingRef.current = false;
    }, 250);
  };

  const onChange = (field) => (e) => {
    const value =
      e?.target?.type === "checkbox" ? e.target.checked : e?.target?.value ?? e;
    markTyping();
    setData((d) => ({ ...d, [field]: value }));
    // schedule validation after typing settles
    pendingFieldRef.current = field;
  };

  const onFocus = (field) => () => {
    focusedFieldRef.current = field;
    isTypingRef.current = true; // freeze visuals immediately on focus
  };

  const onBlurField = (stepForField) => () => {
    focusedFieldRef.current = null;
    // mark typing stop now
    if (typingStopTimerRef.current) clearTimeout(typingStopTimerRef.current);
    isTypingRef.current = false;
    // validate on blur
    validateStep(stepForField, true);
  };

  // Review edit actions
  const startEdit = (section) => {
    if (isTypingRef.current) return;
    setEditingSection(section);
    setErrors({});
    setStep(section); // navigate to section step for editing
  };
  const saveFromEdit = () => {
    if (isTypingRef.current) return;
    // Validate the section
    const ok = validateStep(step, true);
    if (!ok) return;
    setEditingSection(null);
    setStep(4); // return to review
    setErrors({});
  };

  // Shared UI tokens
  const headerGradient =
    "linear-gradient(45deg, #af2497 10%, #902d9a 20%, #1840a0 100%)";

  const Stepper = () => (
    <div className="mb-5">
      {/* Top labeled stepper with clickable steps and percent indicator */}
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
              key={s.key}
              type="button"
              onMouseDown={(e) => {
                if (isTypingRef.current) e.preventDefault();
              }}
              onClick={() => goToStep(s.key)}
              className={`flex-1 min-w-0 rounded-lg px-3 py-2 text-left transition-colors border
                ${isActive ? "bg-white border-blue-500 shadow" : "bg-white/70 border-gray-200 hover:bg-white"}
              focus-ring`}
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

      {/* Progress bar */}
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

  // Step sections (inputs: controlled raw, no value transforms; validation only onBlur/debounced)
  const Step1 = () => (
    <section aria-label="Account details" className="space-y-3">
      <div>
        <label className="text-sm font-medium" style={{ textTransform: "uppercase" }} htmlFor="fw-username">
          Username
        </label>
        <input
          id="fw-username"
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
  );

  const Step2 = () => (
    <section aria-label="Profile details" className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium" style={{ textTransform: "uppercase" }} htmlFor="fw-first">
            First Name
          </label>
          <input
            id="fw-first"
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
  );

  const Step3 = () => (
    <section aria-label="Preferences" className="space-y-4">
      <div>
        <label className="text-sm font-medium" style={{ textTransform: "uppercase" }} htmlFor="fw-topic">
          Topic
        </label>
        <select
          id="fw-topic"
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
          ].map((opt) => (
            <label
              key={opt.value}
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
          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus-ring"
          value={data.interest}
          onFocus={onFocus("interest")}
          onChange={onChange("interest")}
          onBlur={onBlurField(3)}
          placeholder="Tell us more about your interests"
        />
      </div>
    </section>
  );

  const Review = () => (
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
            checked={data.consent}
            onFocus={onFocus("consent")}
            onChange={onChange("consent")}
            onBlur={onBlurField(4)}
            aria-describedby="fw-consent-help"
          />
          <span style={{ textTransform: "uppercase" }}>I consent to submit this information</span>
        </label>
        <p id="fw-consent-help" className="text-xs text-gray-600 mt-1">
          Submitting is enabled only when consent is checked.
        </p>
        {errors.consent && <p className="text-xs text-red-600 mt-1">{errors.consent}</p>}
      </div>
    </section>
  );

  // Footer controls
  const Footer = () => (
    <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
      <button
        className="rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50 focus-ring"
        onClick={prev}
        disabled={step === 1}
      >
        <span style={{ textTransform: "uppercase" }}>Back</span>
      </button>

      <div className="flex items-center gap-2">
        {/* If user is editing a section from Review, show Save and Cancel */}
        {editingSection ? (
          <>
            <button
              className="rounded-lg bg-secondary text-white px-4 py-2 hover:opacity-95 focus-ring"
              onClick={saveFromEdit}
            >
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
                // In this showcase, we just alert. In real app, submit to backend here.
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
  );

  // Only enable Next if current step valid
  // PUBLIC_INTERFACE
  function canProceed() {
    // While typing, use the last stable snapshot to avoid thrash.
    if (step === 1) return step1Valid;
    if (step === 2) return step2Valid;
    if (step === 3) return step3Valid;
    return true;
  }

  return (
    <section className="surface p-4 md:p-5" role="region" aria-label="Form Wizard">
      {/* Header */}
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">
          <span style={{ textTransform: "uppercase" }}>Form Wizard</span>
        </h2>
        <p className="text-sm text-slate-600">
          Complete the steps below. You can click the step labels to jump back and edit.
        </p>
      </header>

      {/* Stepper */}
      <Stepper />

      {/* Body */}
      <div className="mt-4">
        {step === 1 && <Step1 />}
        {step === 2 && <Step2 />}
        {step === 3 && <Step3 />}
        {step === 4 && <Review />}
      </div>

      {/* Footer controls */}
      <Footer />
    </section>
  );
}
