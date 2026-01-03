import React from "react";

const TimeBar = ({ days }: any) => {
  const maxDays = 60; // Căn cứ vào thời gian lớn nhất có thể đạt được, ví dụ là 60 ngày
  const width = (days / maxDays) * 100;

  return (
    <div className="w-full bg-gray-200 rounded-md h-4">
      <div
        className="h-4 bg-blue-500 text-center text-xs text-white rounded-md"
        style={{ width: `${width}%` }}
      >
        {days} ngày
      </div>
    </div>
  );
};

const AverageCompletionTime = ({ courses }: any) => (
  <div className="p-6 bg-white shadow-md rounded-lg">
    <h2 className="text-xl font-bold mb-4">Thời Gian Hoàn Thành Trung Bình</h2>
    <table className="w-full text-left">
      <thead>
        <tr>
          <th className="py-2 border-b-2">Khóa học</th>
          <th className="py-2 border-b-2">Thời gian hoàn thành</th>
        </tr>
      </thead>
      <tbody>
        {courses.map((course: any) => (
          <tr key={course.id} className="border-b">
            <td className="py-2">{course.name}</td>
            <td className="py-2">
              <TimeBar days={course.averageCompletionDays} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default AverageCompletionTime;
