import React, { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * FormWizard
 * Three step wizard with validation and summary.
 */
export default function FormWizard() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    name: "",
    email: "",
    plan: "basic",
    agree: false,
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (step === 1) {
      if (!data.name.trim()) e.name = "Name is required";
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) e.email = "Valid email is required";
    } else if (step === 2) {
      if (!["basic", "pro", "enterprise"].includes(data.plan)) e.plan = "Select a plan";
    } else if (step === 3) {
      if (!data.agree) e.agree = "You must accept terms";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validate()) setStep((s) => Math.min(3, s + 1));
  };
  const prev = () => setStep((s) => Math.max(1, s - 1));

  return (
    <div className="surface p-4">
      <div className="flex items-center gap-2 mb-4">
        {[1,2,3].map((s) => (
          <div key={s} className={`flex-1 h-2 rounded-full ${s <= step ? "bg-blue-600" : "bg-gray-200"}`} />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Name</label>
            <input
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus-ring"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
            />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus-ring"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              type="email"
            />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <label className="text-sm font-medium">Choose Plan</label>
          <div className="grid grid-cols-3 gap-3">
            {["basic","pro","enterprise"].map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => setData({ ...data, plan: p })}
                className={`rounded-lg border px-3 py-2 capitalize ${data.plan === p ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:bg-gray-50"}`}
              >
                {p}
              </button>
            ))}
          </div>
          {errors.plan && <p className="text-xs text-red-600">{errors.plan}</p>}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3">
          <div className="rounded-lg border border-gray-200 p-3">
            <p className="text-sm font-medium">Summary</p>
            <ul className="mt-2 text-sm text-gray-700">
              <li><strong>Name:</strong> {data.name}</li>
              <li><strong>Email:</strong> {data.email}</li>
              <li><strong>Plan:</strong> {data.plan}</li>
            </ul>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={data.agree} onChange={(e) => setData({ ...data, agree: e.target.checked })} />
            I agree to the terms.
          </label>
          {errors.agree && <p className="text-xs text-red-600">{errors.agree}</p>}
        </div>
      )}

      <div className="mt-4 flex justify-between">
        <button className="rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50 focus-ring" onClick={prev} disabled={step === 1}>Back</button>
        {step < 3 ? (
          <button className="rounded-lg bg-primary text-white px-4 py-2 hover:opacity-95 focus-ring" onClick={next}>Next</button>
        ) : (
          <button className="rounded-lg bg-secondary text-white px-4 py-2 hover:opacity-95 focus-ring" onClick={validate}>Submit</button>
        )}
      </div>
    </div>
  );
}
