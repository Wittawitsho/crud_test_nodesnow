import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

// กำหนดประเภทของ props สำหรับ SignInForm
interface SignInFormProps {
  onSubmit: (email: string, password: string) => void;
}

const SignInForm: React.FC<SignInFormProps> = ({ onSubmit }) => {
  // ใช้ Yup ในการกำหนด validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format") // ตรวจสอบรูปแบบอีเมลให้ถูกต้อง
      .required("Email is required"), // บังคับให้กรอกอีเมล
    password: Yup.string()
      .min(6, "Password must be at least 6 characters") // รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร
      .required("Password is required"), // บังคับให้กรอกรหัสผ่าน
  });

  // ใช้ useFormik เพื่อจัดการค่าฟอร์มและการตรวจสอบข้อมูล
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      onSubmit(values.email, values.password); // เรียกฟังก์ชัน onSubmit พร้อมส่งค่า email และ password
      setSubmitting(false); // ปิดสถานะกำลังส่งข้อมูล
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col text-black">
      {/* ช่องอีเมล */}
      <label htmlFor="email" className="text-xl text-gray-500">Email</label>
      <input
        id="email"
        type="email"
        name="email"
        className="border rounded-lg px-3 py-2 mt-2 mb-1 text-sm w-full"
        placeholder="Enter your email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.email && formik.errors.email && (
        <label className="text-red-500 text-sm mb-3">{formik.errors.email}</label>
      )}

      {/* ช่องรหัสผ่าน */}
      <label htmlFor="password" className="text-xl text-gray-500">Password</label>
      <input
        id="password"
        type="password"
        name="password"
        className="border rounded-lg px-3 py-2 mt-2 mb-1 text-sm w-full"
        placeholder="••••••••"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.password && formik.errors.password && (
        <label className="text-red-500 text-sm mb-3">{formik.errors.password}</label>
      )}

      {/* ปุ่ม Sign In */}
      <button
        type="submit"
        className="bg-amber-300 hover:bg-amber-400 py-2 rounded-lg mt-5"
        disabled={formik.isSubmitting}
      >
        {formik.isSubmitting ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
};

export default SignInForm;
