import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getUser, logoutUser } from "../../api/userApi";
import { createTask, getAllTask, getTask, deleteTask, editTask } from "../../api/taskApi";
import TaskForm from "../../components/Form/TaskForm/TaskForm";
import TaskTable from "../../components/table/TaskTable";

export type StatusType = "pending" | "in_progress" | "completed";

// Interface สำหรับ Task
interface Task {
  id: string;
  title: string;
  description: string;
  status: StatusType;
}

export default function Tasks() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false); // สำหรับเปิด/ปิดฟอร์มเพิ่ม Task
  const [user, setUser] = useState<{ id: string; email: string } | null>(null); // ข้อมูลผู้ใช้
  const [tasks, setTasks] = useState<Task[]>([]); // รายการ Task ทั้งหมด
  // ดึงข้อมูลผู้ใช้จาก API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser();
        setUser(userData); // เก็บข้อมูลผู้ใช้ใน state
      } catch (error) {
        console.log("User authentication error:", error);
        navigate('/');
      }
    };
    fetchUser();
  }, []);

  // ดึงข้อมูล Task ทั้งหมด
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksData = await getAllTask(); // เรียก API
        setTasks(tasksData); // เก็บข้อมูล Task ที่ดึงมาใน state
      } catch (error) {
        console.error("Error fetching tasks:", error); 
      }
    };
    fetchTasks();
  }, []);

  // ใช้ Formik สำหรับการค้นหา Task
  const formik = useFormik({
    initialValues: { searchId: "" },
    validationSchema: Yup.object({
      searchId: Yup.string().required("Task ID is required"),
    }),
    onSubmit: async (values) => {
      try {
        const task = await getTask(values.searchId);
        setTasks(task ? [task] : []);
      } catch (error) {
        console.error("Task not found:", error);
        setTasks([]);
      }
    },
  });

  // ฟังก์ชันสำหรับการเพิ่ม Task
  const handleAddTask = async (title: string, description: string, status: StatusType) => {
    if (!user?.id) {
      navigate('/');
      return;
    }
    try {
      const newTask = await createTask(title, description, status, user.id);
      setTasks([...tasks, newTask]); // เพิ่ม Task ใหม่ใน tasks
      setIsOpen(false); // ปิดฟอร์ม
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // ฟังก์ชันลบ Task ตาม ID
  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id); // ลบ Task จากฐานข้อมูล
      setTasks(tasks.filter(task => task.id !== id)); // ลบ Task ออกจาก state
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // ฟังก์ชันสำหรับการแก้ไขและบันทึก Task
  const handleEditSave = async (id: string, title: string, description: string, status: StatusType) => {
    console.log("Editing Task:", { id, title, description, status });
    try {
      // เรียกฟังก์ชัน editTask เพื่อบันทึกข้อมูลลงในฐานข้อมูล
      const newUpdatedTask = await editTask(id, title, description, status);
      console.log("Updated Task:", newUpdatedTask);
  
      // อัปเดตข้อมูลใน state tasks
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, title, description, status } : task
        )
      );
      setIsOpen(false); // ปิดฟอร์มหลังบันทึก
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  // ฟังก์ชันสำหรับการ logout
  const handleLogout = async () => {
    try {
      const data = await logoutUser();  // เรียกใช้งาน logoutUser
      console.log(data.message); 
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">

      {/* ข้อมูลผู้ใช้และปุ่ม Logout */}
      <div className="flex flex-col md:flex-row gap-3 md:gap-10 mb-5">
        {user ? (
          <>
            <h1 className="text-sm md:text-base">ID: {user?.id}</h1>
            <h1 className="text-sm md:text-base">Email: {user?.email}</h1>
          </>
        ) : (
          <p>Loading user data...</p>
        )}
        <button className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-md ml-auto" onClick={handleLogout}>Log Out</button>
      </div>

      {/* ค้นหา Task และปุ่ม Add Task */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <form onSubmit={formik.handleSubmit} className="flex flex-grow gap-4">
          <input
              type="text"
              placeholder="Search by ID"
              className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-md w-full"
              {...formik.getFieldProps("searchId")}
          />
          {formik.touched.searchId && formik.errors.searchId && (
            <label className="text-red-500">{formik.errors.searchId}</label>
          )}
          <button type="submit" className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-md">Search</button>
        </form>
        <div>
          <button className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md" onClick={() => setIsOpen(true)}>
            Add Task
          </button>
        </div>
      </div>

      {/* แสดงตาราง Task */}
      <TaskTable tasks={tasks} onDelete={handleDeleteTask} onEditSave={handleEditSave} />

      {/* ฟอร์มสำหรับการเพิ่ม Task */}
      {isOpen && (
        <TaskForm onSave={handleAddTask} onCancel={() => setIsOpen(false)} />
      )}
    </div>
  );
}
