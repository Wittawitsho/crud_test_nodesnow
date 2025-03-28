import { FC } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { StatusType } from '../../../pages/Tasks/Tasks';

// ประกาศ Interface สำหรับ Props ที่จะถูกส่งเข้ามาใน TaskForm
interface TaskFormProps {
  onSave: (title: string, description: string, status: StatusType) => void;
  onCancel: () => void;
}

// สร้าง component TaskForm
const TaskForm: FC<TaskFormProps> = ({ onSave, onCancel }) => {
  // สร้าง validation schema ด้วย Yup
  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    status: Yup.string().oneOf(["pending", "in_progress", "completed"]).required("Status is required"),
  });

  // ใช้ useFormik hook เพื่อจัดการฟอร์ม
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      status: "pending",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      onSave(values.title, values.description, values.status as StatusType);
      setSubmitting(false); // ปิดสถานะการส่งข้อมูล
    },
  });

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg w-96">
        <h2 className="text-xl mb-4 text-white">Add New Task</h2>
        <form onSubmit={formik.handleSubmit}>
          {/* ช่อง title */}
          <label htmlFor="title" className="block mb-2 text-gray-300">Title</label>
          <input
            id="title"
            type="text"
            name="title"
            className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
            placeholder="Enter your title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.title && formik.errors.title && (
            <label className="text-red-500 text-sm mb-3">{formik.errors.title}</label>
          )}

          {/* ช่อง description */}
          <label htmlFor="description" className="block mb-2 text-gray-300">Description</label>
          <textarea
            id="description"
            name="description"
            className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
            placeholder="Enter your description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.description && formik.errors.description && (
            <label className="text-red-500 text-sm mb-3">{formik.errors.description}</label>
          )}

          {/* ช่อง status */}
          <label htmlFor="status" className="block mb-2 text-gray-300">Status</label>
          <select
            id="status"
            name="status"
            className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
            value={formik.values.status}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          {formik.touched.status && formik.errors.status && (
            <label className="text-red-500 text-sm">{formik.errors.status}</label>
          )}

          {/* ปุ่ม */}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onCancel} className="bg-gray-600 px-4 py-2 rounded text-white">Cancel</button>
            <button type="submit" disabled={formik.isSubmitting} className="bg-blue-600 px-4 py-2 rounded text-white">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
