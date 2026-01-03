import { useParams } from "react-router-dom";
import LoadingSpinner from "../../../components/Loading";
import { Survey, SurveyQuestion } from "../../../interfaces/Survey.interface";
import { useEffect, useState } from "react";
import SurveyInfo from "../../../components/Survey/SurveyInfo";
import axiosInstance from "../../../configs/axiosConfigs";
import SurveyNavbar from "../../../components/Survey/SurveyNavbar";
import QuestionList from "../../../components/Survey/QuestionList";
import { StudentListPaticipate } from "../../../components/Survey/StudentList";
import ManageSurveyQuestions from "../../../components/Survey/ManageSurveyQuestions";
import EditSurveyForm from "../../../components/Survey/EditSurveyForm";

export default function DetailPage() {
  // --- LOGIC GIỮ NGUYÊN 100% ---
  const { slug } = useParams<{ slug: string }>();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("questions");

  const fetchSurveyData = async () => {
    try {
      const response = await axiosInstance.get(`/survey/${slug}`);
      setSurvey(response.data.data.survey);
      setQuestions(response.data.data.questions);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const defaultTab = localStorage.getItem("surveyActiveTab") || "questions";
    setActiveTab(defaultTab);
    setLoading(true);
    fetchSurveyData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const handleTabSelect = (tab: string) => {
    setActiveTab(tab);
    localStorage.setItem("surveyActiveTab", tab);
  };

  // --- GIAO DIỆN STYLE LẠI (FULL WIDTH) ---
  return (
    // Xóa max-w-7xl mx-auto, dùng flex col và p-6 để full màn hình
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Chi Tiết Bài Khảo Sát
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Xem thông tin chi tiết, quản lý câu hỏi và theo dõi kết quả khảo sát.
        </p>
      </div>

      {/* Content Section */}
      {loading ? (
        <div className="flex flex-col justify-center items-center h-80 bg-white rounded-xl shadow-sm border border-gray-200">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <span className="text-red-600 font-medium">Đã xảy ra lỗi: {error}</span>
        </div>
      ) : survey ? (
        <div className="flex flex-col gap-6 w-full">

          {/* Top Info Card - Full Width */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden w-full">
            <SurveyInfo survey={survey} />
          </div>

          {/* Navigation & Content Area */}
          <div className="flex flex-col gap-4 w-full">
            {/* Navbar */}
            <div className="w-full">
              <SurveyNavbar onTabSelect={handleTabSelect} />
            </div>

            {/* Dynamic Tab Content - Full Width */}
            <div className="w-full transition-all duration-300">
              {activeTab === "settings" && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 w-full">
                  <EditSurveyForm survey={survey} />
                </div>
              )}

              {activeTab === "questions" && (
                <QuestionList surveyId={survey.id} />
              )}

              {activeTab === "manage" && (
                <ManageSurveyQuestions
                  surveyId={survey.id}
                  currentQuestions={questions}
                  onReload={fetchSurveyData}
                />
              )}

              {activeTab === "students" && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden w-full">
                  <StudentListPaticipate slug={survey.slug} />
                </div>
              )}
            </div>
          </div>

        </div>
      ) : (
        <div className="flex items-center justify-center h-64 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">Không tìm thấy thông tin bài khảo sát!</p>
        </div>
      )}
    </div>
  );
}