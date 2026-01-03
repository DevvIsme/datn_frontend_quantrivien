import React from "react";

const RegistrationTimeline = ({ registrations }:any) => (
  <div className="p-6 bg-white shadow-md rounded-lg">
    <h2 className="text-xl font-bold mb-4">
      Số Lượng Học Viên Đăng Ký Theo Thời Gian
    </h2>
    <div className="w-full h-48 bg-gray-100 rounded-md flex items-end space-x-4 p-4">
      {registrations.map((data:any, index:number) => (
        <div key={index} className="flex flex-col items-center">
          {/* Hiển thị số lượng học viên ngay trên cột */}
          <span className="text-sm font-semibold mb-1 text-blue-700">
            {data.count}
          </span>
          <div
            className="w-8 bg-blue-500 rounded-t-md"
            style={{ height: `${data.count * 2}px` }}
          />
          <span className="mt-2 text-sm">{data.time}</span>
        </div>
      ))}
    </div>
  </div>
);

export default RegistrationTimeline;
