import React, { useState, useEffect } from "react";

interface CourseNavbarProps {
  onTabSelect: (tab: string) => void;
}

const TopicNavbar: React.FC<CourseNavbarProps> = ({ onTabSelect }) => {
  const [topicActiveTab, setActiveTab] = useState<string>("course");

  useEffect(() => {
    // Đọc giá trị topicActiveTab từ localStorage nếu có
    const savedTab = localStorage.getItem("topicActiveTab") || "courses";
    setActiveTab(savedTab);
    onTabSelect(savedTab); // Gọi onTabSelect với tab từ localStorage
  }, [onTabSelect]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    onTabSelect(tab);
    // Lưu tab hiện tại vào localStorage
    localStorage.setItem("topicActiveTab", tab);
  };

  return (
    <div className="border-b border-gray-200 bg-white px-6 rounded-t-xl sm:rounded-none">
      <nav className="-mb-px flex space-x-8">
        <button
          onClick={() => handleTabClick("courses")}
          className={`
            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200
            ${topicActiveTab === "courses"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }
          `}
        >
          Khóa học
        </button>

        <button
          onClick={() => handleTabClick("exams")}
          className={`
            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200
            ${topicActiveTab === "exams"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }
          `}
        >
          Bài kiểm tra
        </button>
      </nav>
    </div>
  );
};

export default TopicNavbar;