import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Course } from "../../../interfaces/Course.interface";
import axiosInstance from "../../../configs/axiosConfigs";
import LoadingSpinner from "../../../components/Loading";
import CourseInfo from "../../../components/Course/CourseInfo";
import CourseNavbar from "../../../components/Course/Navbar";
import LessonList from "../../../components/Lesson/LessonList";
import ExamList from "../../../components/Exam/ExamList";
import DocumentList from "../../../components/Document/DocumentList";
import StudentList from "../../../components/Student/CourseP/StudentList";
import EditCourseForm from "../../../components/Course/EditCourseForm";

const CourseDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("lessons");

  useEffect(() => {
    // Lấy tab mặc định từ localStorage nếu có, không thì mặc định là "lessons"
    const defaultTab = localStorage.getItem("activeTab") || "lessons";

    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/course/${slug}`);
        setCourse(response.data.data.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    // Set lại tab đang chọn từ localStorage
    setActiveTab(defaultTab);
    fetchCourse();
  }, [slug]);

  // Hàm chuyển đổi tab và lưu vào localStorage
  const handleTabSelect = (tab: string) => {
    setActiveTab(tab);
    localStorage.setItem("activeTab", tab); // Lưu tab đang chọn vào localStorage
  };

  return (
    <div className="flex flex-1 flex-col p-4">
      <h1 className="text-2xl font-bold mb-4">Chi Tiết Khóa Học</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : course ? (
        <div className="relative">
          <CourseInfo course={course} />
          <CourseNavbar  onTabSelect={handleTabSelect} />

          <div className="mt-6">
            {activeTab === "lessons" && <LessonList course={course} />}
                {activeTab === "settings" && <EditCourseForm id={course.id} slug={course.slug} onClose={function (): void {
                } } onReload={function (): void {
                } }  />}
            {activeTab === "exams" && <ExamList course={course} />}
            {activeTab === "docs" && <DocumentList course={course} />}
            {activeTab === "students" && <StudentList course={course} />}
          </div>
        </div>
      ) : (
        <div>Khóa học không tồn tại!</div>
      )}
    </div>
  );
};

export default CourseDetail;
