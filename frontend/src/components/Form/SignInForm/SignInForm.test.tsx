import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import '@testing-library/jest-dom';
import SignInForm from "./SignInForm";

describe("SignInForm", () => {

  it("should renders input fields and submit button", () => {
    render(<SignInForm onSubmit={vi.fn()} />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const button = screen.getByRole("button", { name: /sign in/i });

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it("should display validation errors for empty fields", async () => {
    render(<SignInForm onSubmit={vi.fn()} />);

    const button = screen.getByRole("button", { name: /sign in/i });

    fireEvent.click(button);

    const emailError = await screen.findByText(/Email is required/i);
    const passwordError = await screen.findByText(/Password is required/i);

    expect(emailError).toBeInTheDocument();
    expect(passwordError).toBeInTheDocument();
  });

  it("should display error when entering an invalid email", async () => {
    render(<SignInForm onSubmit={vi.fn()} />);

    const emailInput = screen.getByLabelText(/email/i);

    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.blur(emailInput); 

    const emailErrorFormat = await screen.findByText(/Invalid email format/i);

    expect(emailErrorFormat).toBeInTheDocument();
  });
  
  it("should display error when entering a short password", async () => {
    render(<SignInForm onSubmit={vi.fn()} />);
    const passwordInput = screen.getByLabelText(/password/i);
    
    fireEvent.change(passwordInput, { target: { value: "123" } });
    fireEvent.blur(passwordInput);

    const passwordErrorMin = await screen.findByText(/Password must be at least 6 characters/i);
    
    expect(passwordErrorMin).toBeInTheDocument();
  });
  
  it("should not call onSubmit if form is invalid", async () => {
    const handleLogin = vi.fn();
    render(<SignInForm onSubmit={handleLogin} />);
  
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
  
    await waitFor(() => {
      expect(handleLogin).not.toHaveBeenCalled();
    });
  });
   
  it("should remove error messages when valid input is provided", async () => {
    render(<SignInForm onSubmit={vi.fn()} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const button = screen.getByRole("button", { name: /sign in/i });
    
    fireEvent.click(button);

    const emailError = await screen.findByText(/Email is required/i);
    const passwordError = await screen.findByText(/Password is required/i);
   
    expect(emailError).toBeInTheDocument();
    expect(passwordError).toBeInTheDocument();
   
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
  
    await waitFor(() => {
      expect(emailError).not.toBeInTheDocument();
      expect(passwordError).not.toBeInTheDocument();
    });
  });

  
  it("should submit form with valid input", async () => {
    const handleLogin = vi.fn();
    render(<SignInForm onSubmit={handleLogin} />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const button = screen.getByRole("button", { name: /sign in/i });
    
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(handleLogin).toHaveBeenCalledWith("test@example.com", "password123");
      expect(handleLogin).toHaveBeenCalledTimes(1);
    });
  });
});