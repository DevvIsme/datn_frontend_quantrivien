import { useEffect, useState } from "react";

export default function StudentNavbar({
  onTabSelect,
}: {
  onTabSelect: (tab: string) => void;
}) {
  const [studentActiveTab, setStudentActiveTab] = useState<string>("courses");

  useEffect(() => {
    const savedTab = localStorage.getItem("studentActiveTab") || "courses";
    setStudentActiveTab(savedTab);
    onTabSelect(savedTab);
  }, [onTabSelect]);

  const handleTabClick = (tab: string) => {
    setStudentActiveTab(tab);
    onTabSelect(tab);
    localStorage.setItem("studentActiveTab", tab);
  };

  return (
    <nav className="">
      <ul className="flex space-x-8 px-2">
        <TabItem
          label="Khóa học đang tham gia"
          isActive={studentActiveTab === "courses"}
          onClick={() => handleTabClick("courses")}
        />

        <TabItem
          label="Bài thi đã làm"
          isActive={studentActiveTab === "exams"}
          onClick={() => handleTabClick("exams")}
        />
      </ul>
    </nav>
  );
}

// Component Tab Item để code gọn và dễ quản lý style chung
const TabItem = ({ label, isActive, onClick }: { label: string, isActive: boolean, onClick: () => void }) => {
  return (
    <li
      onClick={onClick}
      className={`
        cursor-pointer py-4 px-1 border-b-2 transition-all duration-200 text-sm font-medium select-none
        ${isActive
          ? "border-blue-600 text-blue-600"
          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
        }
      `}
    >
      {label}
    </li>
  );
};