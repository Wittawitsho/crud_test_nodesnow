import axios from 'axios';

export const registerUser = async (email: string, password: string) => {
    const response = await axios.post('http://localhost:3000/user/register', {
        email,
        password,
    });
    return response.data;
};

export const loginUser = async (email: string, password: string) => {
    const response = await axios.post('http://localhost:3000/auth/login', {
        email,
        password,
    });

    // เก็บ token ใน localStorage
    localStorage.setItem('access_token', response.data.accessToken);

    return response.data;
};

export const logoutUser = async () => {
    try {
      const response = await axios.post('http://localhost:3000/auth/logout');
      
      // ลบ token ใน localStorage
      localStorage.removeItem('access_token');
      return response.data;
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

export const getUser = async () => {
    const token = localStorage.getItem('access_token');  // ดึง token จาก localStorage
    if (!token) {
        throw new Error("No token found, please login again.");
    }

    const response = await axios.get('http://localhost:3000/user/profile', {
        headers: {
            Authorization: `Bearer ${token}`,  // ส่ง token ไปใน header
        },
    });
    return response.data;
};

