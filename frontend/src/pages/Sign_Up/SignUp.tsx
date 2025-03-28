import SignUpForm from '../../components/Form/SignUpForm/SignUpForm';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../api/userApi';

function SignUp() {
    // ใช้ useNavigate() เพื่อเปลี่ยนเส้นทางหลังจากสมัครสมาชิกสำเร็จ
    const navigate = useNavigate();
    // ฟังก์ชัน handleSignUp สำหรับจัดการการสมัครสมาชิก
    const handleSignUp = async (email: string, password: string) => {
        try {
            // เรียก API เพื่อลงทะเบียนผู้ใช้ใหม่
            const data = await registerUser(email, password);
            console.log('Register successful:', data);
            // หากสำเร็จ ให้เปลี่ยนเส้นทางไปยังหน้าหลัก
            navigate('/');
        } catch (error) {
            // แสดงข้อผิดพลาดเมื่อสมัครสมาชิกไม่สำเร็จ
            console.error('Error Register:', error);
            alert("This email is already available.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-800 flex items-center justify-center text-black">
            <div className="min-h-96 max-w-md w-5/6 md:w-full px-8 py-6 bg-white rounded-xl shadow-xl">
                {/* หัวข้อหน้า Sign Up */}
                <h1 className="text-4xl mb-4 text-center">Sign Up</h1>
                
                {/* เรียกใช้ฟอร์มและส่ง handleSignUp เป็น props */}
                <SignUpForm onSubmit={handleSignUp} />
                
                {/* ปุ่มสำหรับไปยังหน้า Sign In หากมีบัญชีอยู่แล้ว */}
                <p className="text-center mt-2">
                    Already have an account?
                    <button 
                        className="text-amber-500 inline ml-2 font-bold" 
                        onClick={() => navigate('/')}
                    >
                        Sign In
                    </button>
                </p>
            </div>
        </div>
    );
}

export default SignUp;