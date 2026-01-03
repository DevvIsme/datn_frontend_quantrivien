import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Student } from "../../../interfaces/Student.interface";
import StudentInfo from "../../../components/Student/StudentInfo";
import axiosInstance from "../../../configs/axiosConfigs";
import LoadingSpinner from "../../../components/Loading";
import StudentNavbar from "../../../components/Student/StudentNavbar";
import CourseStudent from "../../../components/Student/CoursePart";
import ExamStudent from "../../../components/Student/ExamPart";

const DetailStudent: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Lấy id từ URL
  const [student, setStudent] = useState<Student | null>(null); // State lưu thông tin sinh viên
  const [loading, setLoading] = useState<boolean>(true); // State loading
  const [activeTab, setActiveTab] = useState<string>("questions");
  const [error, setError] = useState<string | null>(null); // State error

  const handleTabSelect = (tab: string) => {
    setActiveTab(tab);
    localStorage.setItem("studentActiveTab", tab); // Lưu tab đang chọn vào localStorage
  };

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/student/detail/${id}`);
        setStudent(response.data.data); // Lưu dữ liệu sinh viên
      } catch (err) {
        setError((err as Error).message); // Cập nhật lỗi nếu có
      } finally {
        setLoading(false); // Tắt loading khi fetch hoàn thành
      }
    };

    fetchStudent();
  }, [id]);

  // 1. Màn hình Loading
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  // 2. Màn hình Lỗi
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 text-red-500 font-medium">
        Đã xảy ra lỗi: {error}
      </div>
    );
  }

  // 3. Màn hình không tìm thấy
  if (!student) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 text-gray-500">
        Không tìm thấy thông tin sinh viên.
      </div>
    );
  }

  // 4. Màn hình chính (Dashboard Style)
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Tiêu đề trang */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Hồ sơ học viên</h1>
          <p className="text-sm text-gray-500 mt-1">
            Xem chi tiết thông tin và kết quả học tập
          </p>
        </div>

        {/* Khối 1: Thông tin cá nhân (Student Info) */}
        {/* Tạo khung trắng, bo góc, đổ bóng */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <StudentInfo student={student} />
        </div>

        {/* Khối 2: Tabs chức năng (Navbar + Nội dung) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[500px] flex flex-col">
          {/* Thanh Navbar nằm trên cùng của khung */}
          <div className="border-b border-gray-200 bg-gray-50/50 px-4 pt-2">
            <StudentNavbar onTabSelect={handleTabSelect} />
          </div>

          {/* Phần nội dung thay đổi theo Tab */}
          <div className="p-6 flex-1">
            {activeTab === "courses" && id && (
              <div className="animate-fade-in">
                <CourseStudent id={id} />
              </div>
            )}

            {activeTab === "exams" && id && (
              <div className="animate-fade-in">
                <ExamStudent id={id} />
              </div>
            )}

            {/* Nếu activeTab là 'questions' hoặc các tab khác chưa có component */}
            {activeTab !== "courses" && activeTab !== "exams" && (
              <div className="text-center text-gray-400 mt-10 italic">
                Nội dung cho tab "{activeTab}" đang được cập nhật...
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DetailStudent;
