import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Course {
  id: number;
  name: string;
  students: number;
  percentage: number;
}

interface CourseDistributionProps {
  courses: Course[];
}

const CourseDistribution: React.FC<CourseDistributionProps> = ({ courses }) => {
  // Chuẩn bị dữ liệu cho biểu đồ
  const data = {
    labels: courses.map((course) => course.name),
    datasets: [
      {
        label: "Số học viên",
        data: courses.map((course) => course.students),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Phân Bổ Học Viên Theo Khóa Học</h2>
      <div className="flex items-center">
        {/* Hiển thị Pie Chart */}
        <div className="w-1/2">
          <Pie data={data} />
        </div>

        {/* Bảng dữ liệu */}
        <table className="w-1/2 ml-8 text-left">
          <thead>
            <tr>
              <th className="py-2 border-b-2">Khóa học</th>
              <th className="py-2 border-b-2">Số học viên</th>
              <th className="py-2 border-b-2">Phần trăm</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="border-b">
                <td className="py-2">{course.name}</td>
                <td className="py-2">{course.students}</td>
                <td className="py-2">{course.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseDistribution;
