import React, { useState, useEffect } from "react";

interface CourseNavbarProps {
  onTabSelect: (tab: string) => void;
}

const ExamNavbar: React.FC<CourseNavbarProps> = ({ onTabSelect }) => {
  const [examActiveTab, setActiveTab] = useState<string>("questions");

  useEffect(() => {
    // Đọc giá trị examActiveTab từ localStorage nếu có
    const savedTab = localStorage.getItem("examActiveTab") || "questions";
    setActiveTab(savedTab);
    onTabSelect(savedTab); // Gọi onTabSelect với tab từ localStorage
  }, [onTabSelect]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    onTabSelect(tab);
    // Lưu tab hiện tại vào localStorage
    localStorage.setItem("examActiveTab", tab);
  };

  // Helper tạo class CSS cho gọn code
  const getTabClass = (tabName: string) => {
    const isActive = examActiveTab === tabName;
    return `
      cursor-pointer 
      px-5 py-3 
      text-sm font-medium 
      transition-all duration-200 
      relative whitespace-nowrap
      ${isActive
        ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
        : "text-gray-500 hover:text-gray-800 hover:bg-gray-50 border-b-2 border-transparent"
      }
    `;
  };

  return (
    <nav className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <ul className="flex items-center overflow-x-auto">
        <li
          className={getTabClass("settings")}
          onClick={() => handleTabClick("settings")}
        >
          ⚙️ Cấu hình
        </li>
        <li
          className={getTabClass("questions")}
          onClick={() => handleTabClick("questions")}
        >
          ❓ Danh sách câu hỏi
        </li>
        <li
          className={getTabClass("manager")}
          onClick={() => handleTabClick("manager")}
        >
          👥 Danh sách học viên
        </li>
        <li
          className={getTabClass("students")}
          onClick={() => handleTabClick("students")}
        >
          📝 Danh sách bài làm
        </li>
        <li
          className={getTabClass("violations")}
          onClick={() => handleTabClick("violations")}
        >
          ⚠️ Thống kê vi phạm
        </li>
      </ul>
    </nav>
  );
};

export default ExamNavbar;