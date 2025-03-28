import axios from 'axios';
import { StatusType } from '../pages/Tasks/Tasks'; 

export const createTask = async (title: string, description: string, status: StatusType, userId: string) => {
    const token = localStorage.getItem('access_token');  // ดึง token จาก localStorage
    if (!token) {
        throw new Error("No token found, please login again.");
    }

    const response = await axios.post(
        'http://localhost:3000/tasks', 
        { title, description, status, userId }, // ส่งข้อมูล
        { headers: { Authorization: `Bearer ${token}` } } // แยก headers ออกมา
    );

    return response.data;
};

export const getAllTask = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
        console.error("No token found in localStorage");
        throw new Error("No token found, please login again.");
    }

    try {
        const response = await axios.get('http://localhost:3000/tasks', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("Tasks fetched from API:", response.data); 
        return response.data;
    } catch (error) {
        console.error("Error fetching tasks:");
        throw error;
    }
};

export const getTask = async (id: string) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
        console.error("No token found in localStorage");
        throw new Error("No token found, please login again.");
    }

    try {
        const response = await axios.get(`http://localhost:3000/tasks/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("Task fetched from API:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching task:", error);
        throw error;
    }
};

export const deleteTask = async (id: string) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
        console.error("No token found in localStorage");
        throw new Error("No token found, please login again.");
    }

    try {
        const response = await axios.delete(`http://localhost:3000/tasks/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("Task fetched from API:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching task:", error);
        throw error;
    }
};

export const editTask = async (id: string, title: string, description: string, status: string) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error("No token found in localStorage");
      throw new Error("No token found, please login again.");
    }
  
    try {
      const response = await axios.patch(
        `http://localhost:3000/tasks/${id}`, 
        { title, description, status },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
      console.log("Task updated in DB:", response.data);
      return response.data; 
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
};
  