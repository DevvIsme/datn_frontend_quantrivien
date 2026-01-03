import React from "react";

const ProgressBar = ({ percentage }: any) => (
  <div className="w-full bg-gray-200 rounded-md h-4">
    <div
      className="h-4 bg-green-500 text-center text-xs text-white rounded-md"
      style={{ width: `${percentage}%` }}
    >
      {percentage}%
    </div>
  </div>
);

const LearningProgress = ({ courses }: any) => (
  <div className="p-6 bg-white shadow-md rounded-lg">
    <h2 className="text-xl font-bold mb-4">Tiến Độ Học Tập</h2>
    <table className="w-full text-left">
      <thead>
        <tr>
          <th className="py-2 border-b-2">Khóa học</th>
          <th className="py-2 border-b-2">Tỷ lệ hoàn thành</th>
        </tr>
      </thead>
      <tbody>
        {courses.map((course: any) => (
          <tr key={course.id} className="border-b">
            <td className="py-2">{course.name}</td>
            <td className="py-2">
              <ProgressBar percentage={course.progress} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default LearningProgress;
