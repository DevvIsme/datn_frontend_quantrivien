import React, { useState, useEffect } from "react";

interface CourseNavbarProps {
  onTabSelect: (tab: string) => void;
}

const SurveyNavbar: React.FC<CourseNavbarProps> = ({ onTabSelect }) => {
  const [surveyActiveTab, setActiveTab] = useState<string>("questions");

  useEffect(() => {
    // Đọc giá trị surveyActiveTab từ localStorage nếu có
    const savedTab = localStorage.getItem("surveyActiveTab") || "questions";
    setActiveTab(savedTab);
    onTabSelect(savedTab); // Gọi onTabSelect với tab từ localStorage
  }, [onTabSelect]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    onTabSelect(tab);
    // Lưu tab hiện tại vào localStorage
    localStorage.setItem("surveyActiveTab", tab);
  };

  return (
    <nav className="my-4">
      <ul className="flex space-x-6 border-b-2 border-gray-300 pb-2">
        <li
          className={`cursor-pointer pb-2 transition-all ${surveyActiveTab === "settings"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500 hover:text-blue-500"
            }`}
          onClick={() => handleTabClick("settings")}
        >
          Cấu hình
        </li>
        <li
          className={`cursor-pointer pb-2 transition-all ${
            surveyActiveTab === "questions"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500 hover:text-blue-500"
          }`}
          onClick={() => handleTabClick("questions")}
        >
          Thống kê câu hỏi
        </li>
        <li
          className={`cursor-pointer pb-2 transition-all ${surveyActiveTab === "manage" // Key là 'manage'
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500 hover:text-blue-500"
            }`}
          onClick={() => handleTabClick("manage")}
        >
          Quản lý câu hỏi
        </li>
        <li
          className={`cursor-pointer pb-2 transition-all ${
            surveyActiveTab === "students"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500 hover:text-blue-500"
          }`}
          onClick={() => handleTabClick("students")}
        >
          Học viên đã thực hiện
        </li>
      </ul>
    </nav>
  );
};

export default SurveyNavbar;
