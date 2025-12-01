/**
 * PUBLIC_INTERFACE
 * FormWizard typing behavior tests
 * Ensures that controlled inputs accept continuous typing smoothly (no one-char-at-a-time truncation)
 * and that stepper/progress visuals do not block input.
 */
import { render, screen, fireEvent } from "@testing-library/react";
import FormWizard from "../FormWizard";

describe("FormWizard typing", () => {
  test("username field accepts full input without lag", () => {
    render(<FormWizard />);

    const username = screen.getByLabelText(/username/i);
    const value = "testuser123";
    for (const ch of value) {
      const current = (username as HTMLInputElement).value || "";
      fireEvent.change(username, { target: { value: current + ch } });
    }

    expect((username as HTMLInputElement).value).toBe(value);
  });

  test("first and last name fields accept full input when on step 2", () => {
    render(<FormWizard />);

    // Fill step 1 to proceed
    const username = screen.getByLabelText(/username/i);
    fireEvent.change(username, { target: { value: "johnny" } });

    const password = screen.getByLabelText(/^password$/i);
    fireEvent.change(password, { target: { value: "password123" } });

    const confirm = screen.getByLabelText(/confirm password/i);
    fireEvent.change(confirm, { target: { value: "password123" } });

    const nextBtn = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextBtn);

    const firstName = screen.getByLabelText(/first name/i);
    const lastName = screen.getByLabelText(/last name/i);

    const first = "Jane Continuous Typing";
    const last = "Doe Multi Word";
    for (const ch of first) {
      const cur = (firstName as HTMLInputElement).value || "";
      fireEvent.change(firstName, { target: { value: cur + ch } });
    }
    for (const ch of last) {
      const cur = (lastName as HTMLInputElement).value || "";
      fireEvent.change(lastName, { target: { value: cur + ch } });
    }

    expect((firstName as HTMLInputElement).value).toBe(first);
    expect((lastName as HTMLInputElement).value).toBe(last);
  });

  test("typing long sentences in Interest on step 3 works without truncation", () => {
    render(<FormWizard />);

    // Step 1
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "johnny" } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    // Step 2
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: "Jane" } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "jane.doe@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    // Step 3
    fireEvent.change(screen.getByLabelText(/topic/i), { target: { value: "engineering" } });

    const interest = screen.getByLabelText(/interest/i);
    const sentence = "I enjoy typing smoothly across components without lag or truncation.";
    for (const ch of sentence) {
      const cur = (interest as HTMLInputElement).value || "";
      fireEvent.change(interest, { target: { value: cur + ch } });
    }
    expect((interest as HTMLInputElement).value).toBe(sentence);
  });
});
