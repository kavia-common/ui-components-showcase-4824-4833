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
    // Type a full value character by character
    const value = "testuser123";
    for (const ch of value) {
      fireEvent.change(username, { target: { value: (username as HTMLInputElement).value + ch } });
    }

    expect((username as HTMLInputElement).value).toBe(value);
  });

  test("first and last name fields accept full input when on step 2", () => {
    render(<FormWizard />);

    // Fill step 1 quickly to proceed
    const username = screen.getByLabelText(/username/i);
    fireEvent.change(username, { target: { value: "abc" } });

    const password = screen.getByLabelText(/password$/i);
    fireEvent.change(password, { target: { value: "password123" } });

    const confirm = screen.getByLabelText(/confirm password/i);
    fireEvent.change(confirm, { target: { value: "password123" } });

    // Click Next
    const nextBtn = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextBtn);

    const firstName = screen.getByLabelText(/first name/i);
    const lastName = screen.getByLabelText(/last name/i);

    fireEvent.change(firstName, { target: { value: "Jane" } });
    fireEvent.change(lastName, { target: { value: "Doe" } });

    expect((firstName as HTMLInputElement).value).toBe("Jane");
    expect((lastName as HTMLInputElement).value).toBe("Doe");
  });
});
