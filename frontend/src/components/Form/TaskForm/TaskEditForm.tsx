import { FC } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { StatusType } from "../../../pages/Tasks/Tasks";

// ประกาศ Props สำหรับ TaskEditForm
interface TaskEditFormProps {
  taskId: string;
  title: string;
  description: string;
  status: StatusType;
  onSave: (id: string, title: string, description: string, status: StatusType) => void;
  onCancel: () => void;
}

const TaskEditForm: FC<TaskEditFormProps> = ({ taskId, title, description, status, onSave, onCancel }) => {
  // Validation Schema ด้วย Yup
  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    status: Yup.string().oneOf(["pending", "in_progress", "completed"]).required("Status is required"),
  });

  // useFormik hook
  const formik = useFormik({
    initialValues: { title, description, status },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSave(taskId, values.title, values.description, values.status); // ส่งข้อมูลที่แก้ไขไปยัง onSave
      onCancel(); // ปิดฟอร์ม
    },
  });

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg w-96 ">
        <h2 className="text-xl mb-4 text-white ">Edit Task</h2>
        <form onSubmit={formik.handleSubmit}>
          {/* ช่อง title */}
            <label htmlFor="title" className="block mb-2 text-gray-300">Title</label>
            <input
              id="title"
              type="text"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
              placeholder="Title"
            />
            {formik.touched.title && formik.errors.title && (
              <label className="text-red-500 text-sm">{formik.errors.title}</label>
            )}
          

          {/* ช่อง description */}
            <label htmlFor="description" className="block mb-2 text-gray-300">Description</label>
            <textarea
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-2 mb-3 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Description"
            />
            {formik.touched.description && formik.errors.description && (
              <label className="text-red-500 text-sm">{formik.errors.description}</label>
            )}

          {/* ช่อง status */}
            <label htmlFor="status" className="block mb-2 text-gray-300">Status</label>
            <select
              id="status"
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-2 mb-3 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            {formik.touched.status && formik.errors.status && (
              <label className="text-red-500 text-sm">{formik.errors.status}</label>
            )}


          {/* ปุ่ม Cancel และ Save */}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onCancel} className="bg-gray-600 px-4 py-2 rounded text-white hover:bg-gray-700 transition">Cancel</button>
            <button type="submit" disabled={formik.isSubmitting} className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700 transition">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskEditForm;
