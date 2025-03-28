import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import SignUp from './SignUp';
import * as userApi from '../../api/userApi';

// Mock ฟังก์ชัน registerUser 
// vi.fn() เป็นฟังก์ชันที่สร้างขึ้นมาเพื่อใช้ในกรณีการทดสอบ
vi.mock('../../api/userApi', () => ({
  registerUser: vi.fn().mockResolvedValue({ success: true }), // จำลองการสมัครสำเร็จ
}));

// Mock useNavigate เพื่อใช้กับการเปลี่ยนเส้นทาง
// ใช้ vi.importActual เพื่อดึงตัวโมดูล react-router-dom จริงๆ ขึ้นมา
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate, // ใช้ mock function สำหรับ navigate
  };
});

describe('SignUp Page', () => {

  it('should be display SignUp Form elements', () => {
    render(<SignUp />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const buttonSignUp = screen.getByRole("button", { name: /sign up/i });
    const haveAccount = screen.getByText(/Already have an account?/i);
    const buttonSignIn = screen.getByRole("button", { name: /sign in/i });

    // ตรวจสอบว่าองค์ประกอบต่าง ๆ ปรากฏบนหน้า
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(buttonSignUp).toBeInTheDocument();
    expect(haveAccount).toBeInTheDocument();
    expect(buttonSignIn).toBeInTheDocument();
  });

  it('should call handleSignUp with correct values when form is submitted', async () => {
    // vi.spyOn มันจะทำให้ไม่ไปเรียก API จริง
    const mockRegisterUser = vi.spyOn(userApi, 'registerUser').mockResolvedValueOnce({});

    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    // กรอกข้อมูล
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // คลิกปุ่มสมัคร
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    // ตรวจสอบว่าถูกเรียกใช้งานด้วยค่าที่ถูกต้อง
    await waitFor(() => {
      expect(mockRegisterUser).toHaveBeenCalledWith("test@example.com", "password123");
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('should display alert message if the email is already in use', async () => {
    const mockRegisterUser = vi.spyOn(userApi, 'registerUser').mockRejectedValueOnce(new Error('This email is already available'));
    //mock ฟังก์ชัน alert ที่มาจาก window เพื่อป้องกันไม่ให้แสดงข้อความ alert จริงในระหว่างการทดสอบ
    const mockAlert = vi.spyOn(window, 'alert').mockImplementation(() => {});
  
    render(<SignUp />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const buttonSignUp = screen.getByRole("button", { name: /sign up/i });

    // กรอกข้อมูลและส่งฟอร์ม
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(buttonSignUp);
  
    await waitFor(() => {
      expect(mockRegisterUser).toHaveBeenCalledWith("test@example.com", "password123");
      expect(mockAlert).toHaveBeenCalledWith("This email is already available.");
    });
    mockAlert.mockRestore(); // คืนค่าเดิมให้ alert
  });

  it('should navigate to signin page when click sign up', async () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );
    
    const buttonSignIn = screen.getByRole("button", { name: /sign in/i });
    // คลิกปุ่ม Sign In
    fireEvent.click(buttonSignIn);
    
    // ตรวจสอบว่ามีการ navigate ไปยังหน้า Sign In
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});