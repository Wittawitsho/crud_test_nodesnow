import { loginUser } from "../../api/userApi";
import SignInForm from "../../components/Form/SignInForm/SignInForm";
import { useNavigate } from 'react-router-dom';

function SignIn() {
    // ใช้ useNavigate() เพื่อเปลี่ยนเส้นทางหลังจากสมัครสมาชิกสำเร็จ
    const navigate = useNavigate();

    // ฟังก์ชันจัดการการเข้าสู่ระบบ
    const handleLogin = async (email: string, password: string) => {
        try {
            // เรียกใช้ loginUser API และรอผลลัพธ์
            const data = await loginUser(email, password);
            console.log('Login successful:', data);
            
            // หากล็อกอินสำเร็จ เปลี่ยนเส้นทางไปยังหน้า "/tasks"
            navigate('/tasks');
        } catch (error) {
            // หากเกิดข้อผิดพลาด ให้แสดง error และแจ้งเตือนผู้ใช้
            console.error('Error during login:', error);
            alert("This account is not available.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-800 text-black flex items-center justify-center">
            <div className="min-h-96 max-w-md w-5/6 md:w-full px-8 py-6 bg-white rounded-xl shadow-xl">

                {/* หัวข้อหน้า Sign In */}
                <h1 className="text-4xl mb-4 text-center">Sign In</h1>

                {/* เรียกใช้ฟอร์มและส่ง handleLogin เป็น props */}
                <SignInForm onSubmit={handleLogin} />
                
                {/* ลิงก์สำหรับไปยังหน้าสมัครสมาชิก */}
                <p className="text-center mt-2">
                    Don't have an account?
                    <button className="text-amber-500 inline ml-2 font-bold" onClick={() => navigate('/signup')}>Sign Up</button>
                </p>
            </div>
        </div>
    );
}

export default SignIn;
