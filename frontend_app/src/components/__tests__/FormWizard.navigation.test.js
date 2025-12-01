 /** 
  * PUBLIC_INTERFACE
  * FormWizard navigation and submission enablement tests
  * Verifies:
  * - Next/Back always navigate without blocking
  * - Step indicators are clickable to jump
  * - Submit enabled only when all steps valid and consent checked
  * - Acknowledgement screen appears after submit
  */
 import { render, screen, fireEvent } from "@testing-library/react";
 import FormWizard from "../FormWizard";
 
 test("Next/Back navigate freely and stepper allows jumping", () => {
   render(<FormWizard />);
   // Initially on step 1
   expect(screen.getByLabelText(/account details/i)).toBeInTheDocument();
 
   // Click Next even if invalid -> should move to step 2 (free navigation)
   fireEvent.click(screen.getByRole("button", { name: /next/i }));
   // Since free navigation, we expect step 2 panel to be present
   expect(screen.getByLabelText(/profile details/i)).toBeInTheDocument();
 
   // Back goes to step 1
   fireEvent.click(screen.getByRole("button", { name: /back/i }));
   expect(screen.getByLabelText(/account details/i)).toBeInTheDocument();
 
   // Click stepper "Preferences" (step 3)
   const preferencesStep = screen.getByRole("button", { name: /preferences/i });
   fireEvent.click(preferencesStep);
   expect(screen.getByLabelText(/preferences/i)).toBeInTheDocument();
 });
 
 test("Submit is enabled only when all steps valid and consent checked", () => {
   render(<FormWizard />);
 
   // Jump to Review directly: Submit should be disabled
   fireEvent.click(screen.getByRole("button", { name: /review/i }));
   const submitBtn = screen.getByRole("button", { name: /submit/i });
   expect(submitBtn).toBeDisabled();
 
   // Fill step 1
   fireEvent.click(screen.getByRole("button", { name: /account/i }));
   fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "johnny" } });
   fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: "password123" } });
   fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "password123" } });
 
   // Fill step 2
   fireEvent.click(screen.getByRole("button", { name: /profile/i }));
   fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: "Jane" } });
   fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: "Doe" } });
   fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "jane.doe@example.com" } });
 
   // Fill step 3
   fireEvent.click(screen.getByRole("button", { name: /preferences/i }));
   fireEvent.change(screen.getByLabelText(/topic/i), { target: { value: "engineering" } });
   fireEvent.click(screen.getByLabelText(/daily/i));
 
   // Go to review
   fireEvent.click(screen.getByRole("button", { name: /review/i }));
   const submitBtn2 = screen.getByRole("button", { name: /submit/i });
   // Still disabled because consent not checked
   expect(submitBtn2).toBeDisabled();
 
   // Check consent -> should enable
   fireEvent.click(screen.getByLabelText(/i consent to submit/i));
   expect(screen.getByRole("button", { name: /submit/i })).toBeEnabled();
 
   // Submit -> acknowledgement visible
   fireEvent.click(screen.getByRole("button", { name: /submit/i }));
   expect(screen.getByText(/submission received/i)).toBeInTheDocument();
 });
