import React, { useState, useEffect } from "react";

interface CourseNavbarProps {
  onTabSelect: (tab: string) => void;
}

const CourseNavbar: React.FC<CourseNavbarProps> = ({ onTabSelect }) => {
  const [activeTab, setActiveTab] = useState<string>("lessons");

  useEffect(() => {
    // Đọc giá trị activeTab từ localStorage nếu có
    const savedTab = localStorage.getItem("activeTab") || "lessons";
    setActiveTab(savedTab);
    onTabSelect(savedTab); // Gọi onTabSelect với tab từ localStorage
  }, [onTabSelect]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    onTabSelect(tab);
    // Lưu tab hiện tại vào localStorage
    localStorage.setItem("activeTab", tab);
  };

  // Helper để tạo class cho tab item
  const getTabClass = (tabName: string) => {
    const isActive = activeTab === tabName;
    return `
      cursor-pointer 
      px-5 py-3 
      text-sm font-medium 
      transition-all duration-200 
      relative
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
          className={getTabClass("lessons")}
          onClick={() => handleTabClick("lessons")}
        >
          📚 Bài học
        </li>
        {/* <li
          className={getTabClass("exams")}
          onClick={() => handleTabClick("exams")}
        >
          📝 Bài thi
        </li> */}
        {/* <li
          className={getTabClass("docs")}
          onClick={() => handleTabClick("docs")}
        >
          📂 Tài liệu
        </li> */}
        <li
          className={getTabClass("students")}
          onClick={() => handleTabClick("students")}
        >
          👥 Học viên tham gia
        </li>
      </ul>
    </nav>
  );
};

export default CourseNavbar;