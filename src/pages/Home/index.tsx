import React, { useEffect, useState } from "react";
import axiosInstance from "../../configs/axiosConfigs";

import LearningProgress from "../../components/Dashboard/ProgressBar";
import CourseDistribution from "../../components/Dashboard/CourseDistribution";
import RegistrationTimeline from "../../components/Dashboard/RegistrationTimeline";
import SummaryCards from "../../components/Dashboard/SummaryCards";

const Home: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // State lưu trữ bộ lọc thời gian, mặc định là 'all'
  const [timeRange, setTimeRange] = useState<string>('all');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true); // Set loading lại mỗi khi đổi filter để tạo hiệu ứng
      try {
        // Truyền tham số range vào API
        const response = await axiosInstance.get(`/dashboard/stats`, {
          params: { range: timeRange }
        });

        const result = response.data.data;
        if (result.success) {
          setDashboardData(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [timeRange]); // Dependency là timeRange: Chạy lại khi filter thay đổi

  // UI Loading...
  if (loading && !dashboardData) {
    return <div className="p-10 text-center">Đang tải dữ liệu...</div>;
  }
  // Nếu đã có data cũ nhưng đang load data mới, ta vẫn hiển thị data cũ (hoặc làm mờ đi)

  return (
    <div className="flex-1 flex-col p-6 bg-gray-50 min-h-screen">

      {/* HEADER: Tiêu đề + Bộ lọc */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Quản Trị</h1>

        {/* Dropdown Filter */}
        <div className="mt-4 md:mt-0 flex items-center bg-white rounded-lg shadow-sm p-1 border border-gray-200">
          <span className="px-3 text-sm text-gray-500">Thời gian:</span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-transparent font-medium text-gray-700 text-sm py-1 pr-8 pl-2 focus:outline-none cursor-pointer"
          >
            <option value="all">Tất cả</option>
            <option value="7d">7 ngày qua</option>
            <option value="30d">Tháng này (30 ngày)</option>
            <option value="1y">Năm nay</option>
          </select>
        </div>
      </div>

      {/* Nếu lỗi tải hoặc chưa có data */}
      {!dashboardData ? (
        <div className="text-red-500 text-center">Không có dữ liệu.</div>
      ) : (
        <>
          {/* 1. Phần Thẻ Tóm Tắt */}
          <div className="mb-8">
            <SummaryCards summary={dashboardData.summary} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 2. Biểu đồ Timeline */}
            <div className="md:col-span-2">
              {/* Truyền title động để biết đang xem dữ liệu gì */}
              <h3 className="text-lg font-semibold mb-2 text-gray-600 ml-1">
                Biểu đồ đăng ký ({timeRange === '7d' ? 'Theo ngày' : 'Theo tháng'})
              </h3>
              <RegistrationTimeline registrations={dashboardData.timeline} />
            </div>

            {/* 3. Phân bổ khóa học */}
            <CourseDistribution courses={dashboardData.distribution} />

            {/* 4. Cột bên phải: Tiến độ & Doanh thu */}
            <div className="flex flex-col gap-8">
              <LearningProgress courses={dashboardData.progress} />

              <div className="p-6 bg-white shadow-md rounded-lg">
                <h2 className="text-xl font-bold mb-4">
                  Top Doanh Thu {timeRange === 'all' ? '' : '(Lọc theo ngày)'}
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr>
                        <th className="py-2 border-b-2">Khóa học</th>
                        <th className="py-2 border-b-2 text-right">Doanh thu</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.revenue?.map((course: any, index: number) => (
                        <tr key={index} className="border-b last:border-0 hover:bg-gray-50">
                          <td className="py-3 text-gray-700">{course.name}</td>
                          <td className="py-3 text-right font-bold text-green-600">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.total)}
                          </td>
                        </tr>
                      ))}
                      {(!dashboardData.revenue || dashboardData.revenue.length === 0) && (
                        <tr>
                          <td colSpan={2} className="py-4 text-center text-gray-400 italic">
                            Không có phát sinh doanh thu trong khoảng thời gian này.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;