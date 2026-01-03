import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/Main.Layout";
import { useAuthCookies } from "../hooks/useToken";
import Home from "../pages/Home";
import AdminDashboard from "../pages/Admin";
import StudentDashboard from "../pages/Student";
import CourseDashboard from "../pages/Course";
import TopicDashboard from "../pages/Topic";
import ExamDashboard from "../pages/Exam";
import MyProfile from "../pages/MyProfile";
import SurveyDashboard from "../pages/Survey";
import CourseDetail from "../pages/Course/DetailCourse.tsx";
import DetailStudent from "../pages/Student/DetailStudent";
import DetailSurvey from "../pages/Survey/DetailSurvey";
import ExamDetail from "../pages/Exam/DetailExam";
import DetailTopic from "../pages/Topic/DetailTopic";
import LessonPage from "../pages/Lessons";
import QuestionManagerIndex from "../pages/Questions";
import SurveyQuestionBank from "../components/Survey/QuestionBank";

const MainRoutes: React.FC = () => {
  const { getRefreshToken: authenticate } = useAuthCookies();
  const auth = authenticate();
  if (!auth) {
    return <Navigate to="/auth/login" replace />;
  }
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lessons" element={<LessonPage />} />
        <Route path="/questions" element={<QuestionManagerIndex />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/:id" element={<DetailStudent />} />
        <Route path="/course" element={<CourseDashboard />} />
        <Route path="/course/:slug" element={<CourseDetail />} />
        <Route path="/exam" element={<ExamDashboard />} />
        <Route path="/exam/:id" element={<ExamDetail />} />
        <Route path="/survey" element={<SurveyDashboard />} />
        <Route path="/survey/:slug" element={<DetailSurvey />} />
        <Route path="/survey_question" element={<SurveyQuestionBank />} />
        <Route path="/topic" element={<TopicDashboard />} />
        <Route path="/topic/:slug" element={<DetailTopic />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/*" element={<Navigate to="/" replace />} />{" "}
      </Routes>
    </MainLayout>
  );
};

export default MainRoutes;
