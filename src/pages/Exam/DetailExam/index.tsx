import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Exam } from "../../../interfaces/Exam.interface";
import axiosInstance from "../../../configs/axiosConfigs";
import LoadingSpinner from "../../../components/Loading";
import ExamInfo from "../../../components/Exam/ExamInfo";
import ExamNavbar from "../../../components/Exam/ExamNavbar";
import QuestionList from "../../../components/Exam/ExamQuestion/QuestionList";
import AttendList from "../../../components/Exam/AttendList/AttendList";
import ExamStudentManager from "../../../components/Exam/ExamStudentManager";
import EditExamForm from "../../../components/Exam/EditExamForm";
import ViolationList from "../../../components/Exam/ViolationList";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("questions");

  const closeModal = () => {
  };

  const handleTabSelect = (tab: string) => {
    setActiveTab(tab);
    localStorage.setItem("examActiveTab", tab); // Lưu tab đang chọn vào localStorage
  };
  useEffect(() => {
    // Lấy tab mặc định từ localStorage nếu có, không thì mặc định là "lessons"
    const defaultTab = localStorage.getItem("examactiveTab") || "questions";

    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/exam/detail/${id}`);
        setExam(response.data.data);
      } catch (err: any) {
        setError(err.response.data.error);
      } finally {
        setLoading(false);
      }
    };

    // Set lại tab đang chọn từ localStorage
    setActiveTab(defaultTab);
    fetchCourse();
  }, [id]);

  return (
    // SỬA: Thêm nền xám, tăng padding, min-h-screen để full màn hình
    <div className="flex flex-1 flex-col p-6 bg-gray-50 min-h-screen font-sans">

      {/* Header trang trí lại chút cho đẹp */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Chi Tiết Bài Thi</h1>
        <p className="text-sm text-gray-500 mt-1">Quản lý nội dung và kết quả thi</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-lg">
          Error: {error}
        </div>
      ) : exam ? (
        <div className="space-y-6">
          {/* Component Info giữ nguyên */}
          <ExamInfo exam={exam} />

          {/* Khu vực Tab và Nội dung */}
          <div className="flex flex-col">
            {/* Navbar nằm trên */}
            <ExamNavbar onTabSelect={handleTabSelect} />

            {/* SỬA: Container nội dung bên dưới - Tạo khung trắng nối liền với Navbar */}
            <div className="bg-white border border-gray-200 border-t-0 rounded-b-xl shadow-sm min-h-[500px]">
              {/* Thêm padding cho nội dung bên trong (trừ tab settings vì form settings đã có padding riêng) */}
              <div className={activeTab === 'settings' ? '' : 'p-6'}>
                {activeTab === "questions" && id && <QuestionList id={id} />}
                {activeTab === "manager" && id && <ExamStudentManager id={exam.slug} />}
                {activeTab === "students" && id && <AttendList id={exam.slug} />}
                {activeTab === "settings" && id && <EditExamForm exam={exam} onClose={closeModal} onReload={closeModal} />}
                    {activeTab === "violations" && id && <ViolationList slug={exam.slug} />}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-gray-500 italic text-center mt-10">Bài thi không tồn tại!</div>
      )}
    </div>
  );
}