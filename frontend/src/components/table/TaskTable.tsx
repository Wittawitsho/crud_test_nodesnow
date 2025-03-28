import { useState } from "react";
import { StatusType } from "../../pages/Tasks/Tasks";
import TaskEditForm from "../Form/TaskForm/TaskEditForm";

interface Task {
  id: string;
  title: string;
  description: string;
  status: StatusType;
}

interface TaskTableProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  onEditSave: (id: string, title: string, description: string, status: StatusType) => void;
}

const TaskTable = ({ tasks, onDelete, onEditSave }: TaskTableProps) => {
  const [currentTask, setCurrentTask] = useState<Task | null>(null); // เก็บข้อมูลของ Task ที่ถูกเลือกแก้ไข
  const [isOpen, setIsOpen] = useState<boolean>(false); // ใช้สำหรับแสดง/ซ่อนฟอร์มแก้ไข

  // ฟังก์ชันเปิดฟอร์มแก้ไข
  const handleEdit = (task: Task) => {
    setCurrentTask(task);
    setIsOpen(true);
  };

  // ฟังก์ชันปิดฟอร์มแก้ไข
  const handleEditCancel = () => {
    setIsOpen(false);
    setCurrentTask(null);
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-x-auto">
      {isOpen && currentTask && (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex justify-center items-center z-50">
          <div>
            <TaskEditForm
              taskId={currentTask.id}
              title={currentTask.title}
              description={currentTask.description}
              status={currentTask.status}
              onSave={onEditSave}
              onCancel={handleEditCancel}
            />
          </div>
        </div>
      )}

      {/* ตารางแสดงรายการ Task */}
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="text-gray-400 bg-gray-700 border-b border-gray-600">
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">TITLE</th>
            <th className="px-4 py-2 text-left">DESCRIPTION</th>
            <th className="px-4 py-2 text-left">STATUS</th>
            <th className="px-4 py-2 text-left">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className="border-b border-gray-700 hover:bg-gray-700">
              <td className="px-4 py-2">{task.id}</td>
              <td className="px-4 py-2">{task.title}</td>
              <td className="px-4 py-2 max-w-xs overflow-hidden text-ellipsis">{task.description}</td>
              <td className="px-4 py-2">{task.status}</td>
              <td className="px-4 py-2 flex gap-2">
                {/* ปุ่มแก้ไข Task */}
                <button
                  className="bg-yellow-500 hover:bg-yellow-400 px-3 py-1 rounded-md text-white"
                  onClick={() => handleEdit(task)}
                >
                  Edit
                </button>

                {/* ปุ่มลบ Task */}
                <button
                  className="bg-red-500 hover:bg-red-400 px-3 py-1 rounded-md text-white"
                  onClick={() => onDelete(task.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
