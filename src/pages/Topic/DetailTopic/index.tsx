import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Topic } from "../../../interfaces/Topic.interface";
import axiosInstance from "../../../configs/axiosConfigs";
import LoadingSpinner from "../../../components/Loading";
import TopicInfo from "../../../components/Topic/TopicInfo";
import TopicNavbar from "../../../components/Topic/TopicNavbar";
import CourseTopic from "../../../components/Topic/CoursePart";
import ExamTopic from "../../../components/Topic/ExamPart";

export default function Page() {
  // --- LOGIC GỐC (GIỮ NGUYÊN 100%) ---
  const { slug } = useParams<{ slug: string }>();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("courses");

  useEffect(() => {
    const defaultTab = localStorage.getItem("topicActiveTab") || "courses";

    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/topic/${slug}`);
        setTopic(response.data.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    setActiveTab(defaultTab);
    fetchCourse();
  }, [slug]);

  const handleTabSelect = (tab: string) => {
    setActiveTab(tab);
    localStorage.setItem("topicActiveTab", tab);
  };

  // --- GIAO DIỆN STYLE MỚI ---
  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Chi Tiết Chủ Đề
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Xem thông tin chi tiết, danh sách khóa học và bài thi thuộc chủ đề này.
          </p>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex justify-center items-center h-80 bg-white rounded-xl shadow-sm border border-gray-200">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <div className="text-red-600 font-medium flex flex-col items-center">
              <svg className="w-10 h-10 mb-2 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              {error}
            </div>
          </div>
        ) : topic ? (
          <div className="space-y-6">

            {/* 1. Topic Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <TopicInfo topic={topic} />
            </div>

            {/* 2. Navigation & Main Content */}
            <div className="flex flex-col gap-4">
              {/* Navbar container */}
              <div>
                <TopicNavbar onTabSelect={handleTabSelect} />
              </div>

              {/* Dynamic Content Area */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[400px]">
                {activeTab === "courses" && (
                  <CourseTopic id={topic.id} />
                )}
                {activeTab === "exams" && (
                  <ExamTopic id={topic.id} />
                )}
              </div>
            </div>

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-gray-200 border-dashed">
            <p className="text-gray-500 font-medium">Chủ đề không tồn tại hoặc đã bị xóa!</p>
          </div>
        )}
      </div>
    </div>
  );
}