import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import '@testing-library/jest-dom';
import SignIn from "./SignIn";
import * as userApi from '../../api/userApi';
import { BrowserRouter } from 'react-router-dom';

// Mock ฟังก์ชัน loginUser 
// vi.fn() เป็นฟังก์ชันที่สร้างขึ้นมาเพื่อใช้ในกรณีการทดสอบ
vi.mock("../../api/userApi", () => ({
  loginUser: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,  
  };
});

describe("SignIn Page", () => {
    it("should render SignIn form with required elements", () => {
      render(<SignIn />);
  
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const signInButton = screen.getByRole("button", { name: /sign in/i });
      const signUpText = screen.getByText(/Don't have an account?/i);
      const signUpButton = screen.getByRole("button", { name: /sign up/i });

      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      expect(signInButton).toBeInTheDocument();
      expect(signUpText).toBeInTheDocument();
      expect(signUpButton).toBeInTheDocument();
    });

    it('should call handleLogin with correct values when form is submitted', async () => {
      const mockLoginUser = vi.spyOn(userApi, 'loginUser').mockResolvedValueOnce({});

      render(
        <BrowserRouter>
          <SignIn />
        </BrowserRouter>
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const signInButton = screen.getByRole("button", { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: "test4@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "123456" } });

      fireEvent.click(signInButton);
  
      await waitFor(() => {
        expect(mockLoginUser).toHaveBeenCalledWith("test4@example.com", "123456");
        expect(mockNavigate).toHaveBeenCalledWith('/tasks');
      });
    });

    it('should display alert message if This account is not available.', async () => {
      const mockLoginUser = vi.spyOn(userApi, 'loginUser').mockRejectedValueOnce(new Error('This account is not available.'));
      const mockAlert = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
      render(<SignIn />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    
      // ตรวจสอบว่า alert ถูกเรียกขึ้นมาด้วยข้อความที่ถูกต้อง
      await waitFor(() => {
        expect(mockLoginUser).toHaveBeenCalledWith("test@example.com", "password123");
        expect(mockAlert).toHaveBeenCalledWith("This account is not available.");
      });
      mockAlert.mockRestore();
    });

    it('should navigate to signup page when click sign up', async () => {
      render(
        <BrowserRouter>
          <SignIn />
        </BrowserRouter>
      );

      const signInButton = screen.getByRole("button", { name: /sign up/i });
      fireEvent.click(signInButton);
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/signup');
      });
    });
  });
